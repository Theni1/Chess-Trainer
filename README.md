## Overview
Chess Trainer is a full-stack chess platform with two core features: tactical puzzles and an AI bot trained on real human games. Users authenticate with Google, solve puzzles to sharpen tactical vision, and play against a behavioral cloning model that mimics a specific player's style.

## Features

- **Puzzles** — 1,000+ tactical puzzles fetched from Firestore with correct/incorrect visual feedback and progress tracking
- **AI Bot** — play against a CNN trained on 2,600+ personal Chess.com games, served via a FastAPI backend
- **Auth & Progress** — Google OAuth login, real-time puzzle completion tracking via Firestore

## Technologies

**Frontend**
- React + Vite, React Router
- Tailwind CSS v4
- react-chessboard, chess.js
- Firebase Authentication + Firestore

**ML Pipeline**
- Python, PyTorch (CNN), scikit-learn
- python-chess, NumPy, Jupyter

**Backend**
- FastAPI, Uvicorn

## How to run locally

### React app

Clone the repository and install dependencies:
```bash
git clone https://github.com/Theni1/Chess-Trainer.git
cd Chess-Trainer
npm install
```

Create a `.env.local` file with your Firebase credentials:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Start the dev server:
```bash
npm run dev
```

### AI Bot (FastAPI server)

Install Python dependencies:
```bash
cd ml
pip install -r requirements.txt
```

Add your trained model weights to `ml/src/model.pth`, then start the server:
```bash
cd ml/api
uvicorn main:app --reload
```

The bot will be available at `http://127.0.0.1:8000`. The React app must also be running for the `/bot` route to work.

## ML Pipeline

The bot is a convolutional neural network trained to predict chess moves from board positions:

1. 2,600+ personal Chess.com games exported as PGN and parsed with `python-chess`
2. Each board position encoded as an **8×8×12 bitboard tensor** (one layer per piece type)
3. Each move encoded as an index (0–4095) using `from_square * 64 + to_square`
4. CNN trained with PyTorch — 3 conv layers + 2 fully connected layers + dropout
5. Train/val/test split via scikit-learn, overfitting monitored each epoch

See `ml/notebooks/01_explore_and_train.ipynb` for the full walkthrough.
