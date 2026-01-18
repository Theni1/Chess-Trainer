import {Routes, Route} from "react-router-dom"
import Puzzle from "./Puzzles.jsx"
import Navbar from "./components/Navbar.jsx"
import "./global.css"

export default function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path = "/puzzles" element = {<Puzzle/>}/>
    </Routes>
    </>
  )
}
