import {Link} from "react-router-dom"
import {useAuth} from "../auth/AuthProvider"
import {useState} from "react"
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";


export default function Navbar() {
    async function logout() {
        await signOut(auth);
    }
    const [open, setOpen] = useState(false);
    const {user, userData} = useAuth()
    return (
        <nav className = "flex flex-row justify-between items-center gap-10 py-5 pl-5 shadow-lg font-bold">
            <Link to = "/">Home</Link>
        <div className = "flex gap-5 pr-5">
            {!user ? 
            <Link to = "/">Login</Link> : 
            <>
            <Link to = "/puzzles">Puzzles</Link>
            <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} >
            <span className="cursor-pointer select-none">View Stats</span>
            {open ? (
                <div className="absolute right-0 top-full mt-2 w-56 bg-black text-white rounded-lg shadow-lg p-4 z-50">
                <p className="font-semibold">{user.displayName}</p>
                <p className="text-sm">{user.email}</p>
                <p className = "text-sm"> <span className = "text-blue-400">{userData.puzzles_completed }  </span> puzzles completed</p>
                </div>
            ): ""}
            </div>
            <button className = "cursor-pointer" onClick = {logout}>Logout</button> 
            </>
            }           
        </div>
        </nav>
    )
}