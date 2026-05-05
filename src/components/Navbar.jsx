import { Link } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"
import { useState } from "react"
import { signOut } from "firebase/auth"
import { auth } from "../../config/firebase"

export default function Navbar() {
    async function logout() {
        await signOut(auth)
    }
    const [open, setOpen] = useState(false)
    const { user, userData } = useAuth()

    return (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
            <nav className="navbar-glass rounded-2xl flex items-center justify-between px-5 py-3 w-full max-w-3xl">
                <Link to="/" className="font-bold text-sm tracking-tight" style={{ color: 'var(--text)' }}>
                    Chess Trainer
                </Link>

                <div className="flex items-center gap-1">
                    {!user ? (
                        <Link to="/"
                            className="px-4 py-2 rounded-xl text-sm transition-colors duration-150 hover:bg-white/5"
                            style={{ color: 'var(--text-muted)' }}>
                            Login
                        </Link>
                    ) : (
                        <>
                            <Link to="/puzzles"
                                className="px-4 py-2 rounded-xl text-sm transition-colors duration-150 hover:bg-white/5"
                                style={{ color: 'var(--text-muted)' }}>
                                Puzzles
                            </Link>
                            <Link to="/bot"
                                className="px-4 py-2 rounded-xl text-sm transition-colors duration-150 hover:bg-white/5"
                                style={{ color: 'var(--text-muted)' }}>
                                Play Bot
                            </Link>

                            <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                                <button className="px-4 py-2 rounded-xl text-sm transition-colors duration-150 hover:bg-white/5 cursor-pointer"
                                    style={{ color: 'var(--text-muted)' }}>
                                    {user.displayName?.split(" ")[0]}
                                </button>

                                {open && (
                                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl p-4 z-50"
                                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
                                        <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{user.displayName}</p>
                                        <p className="text-xs mt-0.5 mb-3" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                                        <div className="h-px mb-3" style={{ background: 'var(--border)' }} />
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Puzzles solved</span>
                                            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{userData?.puzzles_completed ?? 0}</span>
                                        </div>
                                        <div className="h-px mb-3" style={{ background: 'var(--border)' }} />
                                        <button onClick={logout}
                                            className="w-full text-left text-sm px-1 py-1 rounded-lg transition-colors duration-150 hover:bg-white/5 cursor-pointer"
                                            style={{ color: 'var(--text-muted)' }}>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </nav>
        </div>
    )
}
