import {signInWithPopup} from "firebase/auth"
import { useNavigate } from "react-router-dom"
import {auth, googleAuth} from "../../config/firebase"
import {useAuth} from "./AuthProvider"

export default function Login () {
  const {user}  = useAuth()
  const navigate = useNavigate()
  async function googleSignUp () {
    try {
      await signInWithPopup(auth, googleAuth)
      navigate("/puzzles")
    }
    catch (error){
      console.log("Error")
    }
    }
    return (
        <>
        <div className = "flex flex-col justify-center items-center gap-20">
        <h1 className = "text-7xl font-bold mt-40">Chess Trainer</h1>
        {!user ?
        <button className = "py-3 px-6 text-lg rounded-lg cursor-pointer font-bold shadow-sm hover:scale-105 transition-transform duration-200 ease-out" onClick = {googleSignUp}>Login in with Google</button>:
        <button className = "py-3 px-6 text-lg rounded-lg cursor-pointer font-bold shadow-sm hover:scale-105 transition-transform duration-200 ease-out" onClick = { () => navigate("/puzzles")}>Play now</button>}
        </div>
        </>
    )
  }
