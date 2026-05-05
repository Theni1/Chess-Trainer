import { signInWithPopup } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { auth, googleAuth } from "../../config/firebase"
import { useAuth } from "./AuthProvider"

export default function Login() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function googleSignUp() {
    try {
      await signInWithPopup(auth, googleAuth)
      navigate("/")
    } catch (error) {
      console.log("Error")
    }
  }

  return (
    <div className="chess-bg min-h-screen flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center text-center max-w-xl">

        <h1 className="fade-up font-black leading-none tracking-tighter mb-5"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)', color: 'var(--text)' }}>
          Chess<br />Trainer
        </h1>

        {!user ? (
          <button
            onClick={googleSignUp}
            className="fade-up-2 flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-white/10 active:scale-95"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        ) : (
          <div className="fade-up-2 flex flex-col items-center gap-4">
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/puzzles")}
                className="px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-150 hover:bg-white/10"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}
              >
                Puzzles
              </button>
              <button
                onClick={() => navigate("/bot")}
                className="px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-150 hover:bg-white/10"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}
              >
                Play Me!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
