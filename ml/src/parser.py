import chess
import chess.pgn
import numpy as np


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
            tensor[layer][square // 8][square % 8] = 1.0
    return tensor


def move_to_index(move):
    return move.from_square * 64 + move.to_square


def index_to_move(index):
    return chess.Move(index // 64, index % 64)


def load_games(pgn_path, your_username, min_seconds=0):
    X, y = [], []
    game_count = 0
    skipped = 0

    with open(pgn_path) as pgn_file:
        while True:
            game = chess.pgn.read_game(pgn_file)
            if game is None:
                break

            headers = game.headers
            time_control = headers.get("TimeControl", "0")
            seconds = int(time_control.split("+")[0])
            if seconds < min_seconds:
                skipped += 1
                continue

            white = headers["White"]
            black = headers["Black"]
            if white == your_username:
                your_color = chess.WHITE
            elif black == your_username:
                your_color = chess.BLACK
            else:
                continue

            board = game.board()
            for move in game.mainline_moves():
                if board.turn == your_color:
                    X.append(fen_to_tensor(board.fen()))
                    y.append(move_to_index(move))
                board.push(move)

            game_count += 1

    print(f"Done. Games: {game_count}, Skipped: {skipped}")
    return np.array(X), np.array(y)
