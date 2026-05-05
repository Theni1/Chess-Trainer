import os
import chess
import torch
import torch.nn as nn
import numpy as np
import urllib.request
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://chess-trainer-app.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChessNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv_layers = nn.Sequential(
            nn.Conv2d(12, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.ReLU(),
        )
        self.fc_layers = nn.Sequential(
            nn.Flatten(),
            nn.Linear(256 * 8 * 8, 1024),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(1024, 4096),
        )

    def forward(self, x):
        x = self.conv_layers(x)
        x = self.fc_layers(x)
        return x


def fen_to_tensor(fen):
    board = chess.Board(fen)
    tensor = np.zeros((12, 8, 8), dtype=np.float32)
    piece_to_layer = {
        (chess.PAWN, chess.WHITE): 0,
        (chess.KNIGHT, chess.WHITE): 1,
        (chess.BISHOP, chess.WHITE): 2,
        (chess.ROOK, chess.WHITE): 3,
        (chess.QUEEN, chess.WHITE): 4,
        (chess.KING, chess.WHITE): 5,
        (chess.PAWN, chess.BLACK): 6,
        (chess.KNIGHT, chess.BLACK): 7,
        (chess.BISHOP, chess.BLACK): 8,
        (chess.ROOK, chess.BLACK): 9,
        (chess.QUEEN, chess.BLACK): 10,
        (chess.KING, chess.BLACK): 11,
    }
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece:
            layer = piece_to_layer[(piece.piece_type, piece.color)]
            row = square // 8
            col = square % 8
            tensor[layer][row][col] = 1.0
    return tensor


MODEL_PATH = "model.pth"
HF_URL = "https://huggingface.co/Thenuwara/chess-model/resolve/main/model.pth"
model = None


def get_model():
    global model
    if model is None:
        if not os.path.exists(MODEL_PATH):
            print("Downloading model from Hugging Face...")
            urllib.request.urlretrieve(HF_URL, MODEL_PATH)
            print("Download complete.")
        m = ChessNet()
        m.load_state_dict(torch.load(MODEL_PATH, map_location="cpu"))
        m.eval()
        model = m
    return model


class MoveRequest(BaseModel):
    fen: str


@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/move")
def get_move(request: MoveRequest):
    board = chess.Board(request.fen)
    tensor = fen_to_tensor(request.fen)
    input_tensor = torch.tensor(tensor).unsqueeze(0)

    with torch.no_grad():
        output = get_model()(input_tensor)

    move_indices = output[0].argsort(descending=True).tolist()

    for idx in move_indices:
        from_sq = idx // 64
        to_sq = idx % 64
        move = chess.Move(from_sq, to_sq)

        if board.piece_at(from_sq) and board.piece_at(from_sq).piece_type == chess.PAWN:
            if chess.square_rank(to_sq) in (0, 7):
                move = chess.Move(from_sq, to_sq, promotion=chess.QUEEN)

        if move in board.legal_moves:
            return {"move": move.uci()}

    return {"error": "no legal move found"}
