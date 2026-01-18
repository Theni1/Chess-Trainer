import {Link} from "react-router-dom"

export default function Navbar() {
    return (
        <nav className = "flex flex-row justify-center gap-10">
            <Link to = "/">Home</Link>
            <Link to = "/puzzles">Puzzles</Link>
        </nav>
    )
}