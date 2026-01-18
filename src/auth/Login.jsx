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
        <h1 className = "text-3xl font-bold mt-30">Chess Puzzles</h1>
        {!user ?
        <button className = "border py-1 px-2 rounded-lg cursor-pointer" onClick = {googleSignUp}>Login in with Google</button>:
        <button className = "border py-1 px-2 rounded-lg cursor-pointer" onClick = { () => navigate("/puzzles")}>Play now</button>}
        </div>
        </>
    )
  }
