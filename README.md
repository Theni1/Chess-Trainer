## Overview
Chess-Trainer is a full-stack web application designed to help users improve their chess skills through 1,000+ unique tactical puzzles. Users can log in with Google OAuth, solve puzzles, and track their number of puzzles completed.

## Technologies

- React + Vite
- Tailwind CSS
- react-chessboard  (Interactive chessboard UI)
- chess.js (Chess logic and move validation)
- Firebase Authentication
- Firebase Firestore

## How it works

1. Users authenticate using Google OAuth via Firebase.
2. A chess puzzle is fetched from Firestore and rendered on the chessboard.
3. Correct moves advance the puzzle and incorrect moves give visual feedback.
4. When a puzzle is completed, the user’s completed puzzle count is incremented and stored in Firestore.
5. User progress is displayed in the navbar/profile popup.

## How to run locally

Clone the repository and install the dependencies:
```
git clone https://github.com/Theni1/Chess-Trainer.git
cd Chess-Trainer
npm install
```
Create a local `.env.local` file with the following:
```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_api_key_here
VITE_FIREBASE_PROJECT_ID=your_api_key_here
VITE_FIREBASE_STORAGE_BUCKET=your_api_key_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_api_key_here
VITE_FIREBASE_APP_ID=your_api_key_here
```
Start the development server:
```
npm run dev
```




