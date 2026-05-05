import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useState, useCallback } from "react";

export default function Bot() {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState("Your turn (White)");

  async function getBotMove(fen) {
    const res = await fetch("https://chess-trainer-production-b506.up.railway.app/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fen }),
    });
    const data = await res.json();
    return data.move;
  }

  const onDrop = useCallback(
    async ({ sourceSquare, targetSquare }) => {
      if (!targetSquare) return false;
      try {
        const newGame = new Chess(game.fen());
        const move = newGame.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
        if (!move) return false;

        setGame(new Chess(newGame.fen()));

        if (newGame.isGameOver()) {
          setStatus(getStatus(newGame));
          return true;
        }

        setStatus("Bot is thinking...");
        await new Promise(res => setTimeout(res, 600 + Math.random() * 1200));
        const botMove = await getBotMove(newGame.fen());
        newGame.move({ from: botMove.slice(0, 2), to: botMove.slice(2, 4), promotion: "q" });
        setGame(new Chess(newGame.fen()));

        setStatus(getStatus(newGame));
        return true;
      } catch {
        return false;
      }
    },
    [game]
  );

  function getStatus(g) {
    if (g.isCheckmate()) return g.turn() === "w" ? "Checkmate — Bot wins!" : "Checkmate — You win!";
    if (g.isStalemate()) return "Stalemate — Draw!";
    if (g.isDraw()) return "Draw!";
    if (g.inCheck()) return g.turn() === "w" ? "You are in check!" : "Bot is in check!";
    return g.turn() === "w" ? "Your turn (White)" : "Your turn (Black)";
  }

  function resetGame() {
    setGame(new Chess());
    setStatus("Your turn (White)");
  }

  return (
    <div className="chess-bg min-h-screen flex flex-col items-center justify-center px-6 py-8">
      <div className="flex flex-col items-center gap-5 w-full max-w-lg">

        {/* Status */}
        <p className="text-sm" style={{ color: 'var(--text)' }}>{status}</p>

        {/* Board */}
        <div style={{ width: "100%", aspectRatio: "1" }}>
          <Chessboard
            options={{
              position: game.fen(),
              allowDragging: true,
              boardStyle: {
                borderRadius: "12px",
                boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
              },
              onPieceDrop: onDrop,
            }}
          />
        </div>

        {/* New Game button */}
        <button
          onClick={resetGame}
          className="px-5 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-150 hover:bg-white/5"
          style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
        >
          New Game
        </button>
      </div>
    </div>
  );
}
