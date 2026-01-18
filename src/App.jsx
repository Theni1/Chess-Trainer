import {Routes, Route} from "react-router-dom"
import Puzzle from "./pages/Puzzles.jsx"
import Navbar from "./components/Navbar.jsx"
import Login from "./auth/Login.jsx"
import "./global.css"

export default function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path = "/" element = {<Login/>}/>
      <Route path = "/puzzles" element = {<Puzzle/>}/>
    </Routes>
    </>
  )
}
