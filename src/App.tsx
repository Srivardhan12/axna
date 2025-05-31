import { Route, Routes } from "react-router-dom"
import LoginPage from "./auth/Login"
import SignupPage from "./auth/Signup"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/Dashboard"


function App() {
  return (
    <div>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
