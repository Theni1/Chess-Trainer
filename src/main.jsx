import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import {AuthProvider} from "./auth/AuthProvider.jsx"
import App from './App.jsx'
import "./global.css"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App/>
    </AuthProvider>
  </BrowserRouter>
)
