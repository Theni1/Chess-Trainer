import {Link} from "react-router-dom"
import {useAuth} from "../auth/AuthProvider"

export default function Navbar() {
    const {user} = useAuth()
    return (
        <nav className = "flex flex-row justify-between items-center gap-10 border py-5 pl-5">
            <Link to = "/">Home</Link>
        <div className = "flex gap-5 pr-5">
            {!user ? 
            <Link to = "/">Login</Link> : (
            <>
            <Link to = "/puzzles">Puzzles</Link>
            <Link to = "/profile"> Profile</Link>
            </>
            )
            }
        </div>
        </nav>
    )
}