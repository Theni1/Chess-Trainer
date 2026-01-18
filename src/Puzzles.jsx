import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useEffect, useState, useCallback } from "react";

export default function Puzzles() {
  const [solution, setSolution] = useState(null);
  const [solutionMove, setSolutionMove] = useState(1);
  const [turn, setTurn] = useState(null);
  const [game, setGame] = useState(null);
  const [id, setId] = useState(null);
  const [retry, setRetry] = useState(false);

  const [errorSquare, setErrorSquare] = useState(null);
  const [correctSquare, setCorrectSquare] = useState(null);

  async function fetchPuzzle() {
    let puzzleId = id;
    if (retry === false) {
      puzzleId = (
        Math.floor(Math.random() * (12 - 1 + 1)) + 1
      ).toString();
      setId(puzzleId);
    }

    const docRef = doc(db, "puzzles", puzzleId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const solution = data.Solution.split(" ");
    const puzzleStart = new Chess(data.FEN);
    puzzleStart.move({
    from: solution[0].slice(0, 2),
    to: solution[0].slice(2, 4),
    });
    console.log(data)
    console.log(solution)
    console.log(puzzleStart)
    setCorrectSquare(null);
    setErrorSquare(null);
    setSolutionMove(1);
    setSolution(solution);
    setGame(puzzleStart);
    setTurn(puzzleStart.turn());
    setRetry(false);
  }

  useEffect(() => {
    fetchPuzzle();
  }, []);

  useEffect(() => {
    if (retry) {
      fetchPuzzle();
    }
  }, [retry]);

  function getGameStatus() {
    if (!game) return "Loading";
    if (game.isGameOver()) return "Puzzle Completed!";
    if (game.turn() !== turn) return "Puzzle Completed";
    if (game.inCheck()) return "Check!";
    return game.turn() === "w"
      ? "White to play"
      : "Black to play";
  }
  function flashError (square) {
    setErrorSquare(square)
    setTimeout( ()=> setErrorSquare(null), 400)
  }

  function flashCorrect (square) {
    setCorrectSquare(square)
    setTimeout( ()=> setCorrectSquare(null), 400)
  }

  const onDrop = useCallback(
  ({ sourceSquare, targetSquare }) => {
    if (!targetSquare) 
      return false;
    try {
      if (game.turn() !== turn) {
        return false;
      }
      const newGame = new Chess(game.fen());
      const move = newGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      if(
        move &&
        sourceSquare === solution[solutionMove].slice(0, 2) &&
        targetSquare === solution[solutionMove].slice(2, 4)
      ) 
      {
        flashCorrect(targetSquare)
        setGame(new Chess(newGame.fen()));

        newGame.move({
          from: solution[solutionMove + 1].slice(0, 2),
          to: solution[solutionMove + 1].slice(2, 4),
        });
        setGame(new Chess(newGame.fen()));
        setSolutionMove((prev) => prev + 2);
        return true;
      }
    } 
    catch {
      flashError(targetSquare)
      return false;
    }
    flashError(targetSquare)
    return false;
  },[game, solution, solutionMove, turn]);

  return (
    <>
    <h1 className="text-center text-3xl font-semibold tracking-tight mb-6 mt-6"> {getGameStatus()}</h1>
    <div className="flex items-center justify-center">
      {game ? (
          <div style={{ width: "500px", height: "500px" }}>
          <Chessboard
            options={{
              position: game.fen(),
              allowDragging: true,
              animationDurationInMs: 10,
              boardStyle: {
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.30)",
              },
              squareStyles: {
                ...(errorSquare && {
                  [errorSquare]: { backgroundColor: "rgba(255, 0, 0, 0.45)" , transition: "background-color 0.25s ease-in-out"}
                }),
                ...(correctSquare && {
                  [correctSquare]: { backgroundColor: "rgba(0, 255, 0, 0.45)", transition: "background-color 0.25s ease-in-out" },
                }),
              },
              onPieceDrop: onDrop,
            }}
          />
        </div>) : (
        <p className="py-16 px-6 text-center text-neutral-300">Loading…</p>
      )}
    </div>
    <div className = "flex justify-center gap-5 mt-6">
    <button className = "border rounded-lg px-1 py-2 cursor-pointer" onClick={fetchPuzzle}>Generate new puzzle</button>
    <button className = "border rounded-lg px-1 py-2 cursor-pointer" onClick={() => setRetry(true)}>Retry</button>
    </div>
  </>
  );
}