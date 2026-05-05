import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../config/firebase";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Puzzles() {
  const [hasIncremented, setHasIncremented] = useState(false);
  const { user } = useAuth();
  const [solution, setSolution] = useState(null);
  const [solutionMove, setSolutionMove] = useState(1);
  const [turn, setTurn] = useState(null);
  const [game, setGame] = useState(null);
  const [id, setId] = useState(null);
  const [retry, setRetry] = useState(false);
  const [errorSquare, setErrorSquare] = useState(null);
  const [correctSquare, setCorrectSquare] = useState(null);
  const navigate = useNavigate();

  async function puzzleCompleted() {
    await updateDoc(doc(db, "users", user.uid), {
      puzzles_completed: increment(1),
    });
  }

  async function fetchPuzzle() {
    let puzzleId = id;
    if (retry === false) {
      puzzleId = (Math.floor(Math.random() * (12 - 1 + 1)) + 1).toString();
      setId(puzzleId);
    }
    const docRef = doc(db, "puzzles", puzzleId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const solution = data.Solution.split(" ");
    const puzzleStart = new Chess(data.FEN);
    puzzleStart.move({ from: solution[0].slice(0, 2), to: solution[0].slice(2, 4) });
    setHasIncremented(false);
    setCorrectSquare(null);
    setErrorSquare(null);
    setSolutionMove(1);
    setSolution(solution);
    setGame(puzzleStart);
    setTurn(puzzleStart.turn());
    setRetry(false);
  }

  useEffect(() => {
    if (!user) navigate("/");
  }, [user]);

  useEffect(() => { fetchPuzzle(); }, []);
  useEffect(() => { if (retry) fetchPuzzle(); }, [retry]);

  useEffect(() => {
    if (!game) return;
    if (hasIncremented) return;
    const completed = game.isGameOver() || game.turn() !== turn;
    if (completed) {
      puzzleCompleted();
      setHasIncremented(true);
    }
  }, [game, turn, hasIncremented]);

  function getStatus() {
    if (!game) return "Loading...";
    if (game.isGameOver()) return "Puzzle Completed!";
    if (game.turn() !== turn) return "Puzzle Completed!";
    if (game.inCheck()) return "Check!";
    return game.turn() === "w" ? "White to play" : "Black to play";
  }

  function flashError(square) {
    setErrorSquare(square);
    setTimeout(() => setErrorSquare(null), 400);
  }

  function flashCorrect(square) {
    setCorrectSquare(square);
    setTimeout(() => setCorrectSquare(null), 400);
  }

  const onDrop = useCallback(
    ({ sourceSquare, targetSquare }) => {
      if (!targetSquare) return false;
      try {
        if (game.turn() !== turn) return false;
        const newGame = new Chess(game.fen());
        const move = newGame.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
        if (
          move &&
          sourceSquare === solution[solutionMove].slice(0, 2) &&
          targetSquare === solution[solutionMove].slice(2, 4)
        ) {
          flashCorrect(targetSquare);
          setGame(new Chess(newGame.fen()));
          newGame.move({
            from: solution[solutionMove + 1].slice(0, 2),
            to: solution[solutionMove + 1].slice(2, 4),
          });
          setGame(new Chess(newGame.fen()));
          setSolutionMove((prev) => prev + 2);
          return true;
        }
      } catch {
        flashError(targetSquare);
        return false;
      }
      flashError(targetSquare);
      return false;
    },
    [game, solution, solutionMove, turn]
  );

  return (
    <div className="chess-bg min-h-screen flex flex-col items-center justify-center px-6 py-8">
      <div className="flex flex-col items-center gap-5 w-full max-w-lg">

        {/* Status */}
        <span className="px-4 py-1.5 rounded-full text-sm font-medium"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}>
          {getStatus()}
        </span>

        {/* Board */}
        <div style={{ width: "100%", aspectRatio: "1" }}>
          {game ? (
            <Chessboard
              options={{
                position: game.fen(),
                allowDragging: true,
                animationDurationInMs: 200,
                boardStyle: {
                  borderRadius: "12px",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
                },
                squareStyles: {
                  ...(errorSquare && {
                    [errorSquare]: { backgroundColor: "rgba(255, 0, 0, 0.45)", transition: "background-color 0.25s ease-in-out" }
                  }),
                  ...(correctSquare && {
                    [correctSquare]: { backgroundColor: "rgba(0, 255, 0, 0.45)", transition: "background-color 0.25s ease-in-out" }
                  }),
                },
                onPieceDrop: onDrop,
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={fetchPuzzle}
            className="px-5 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-150 hover:bg-white/5"
            style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            New Puzzle
          </button>
          <button
            onClick={() => setRetry(true)}
            className="px-5 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-150 hover:bg-white/5"
            style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
