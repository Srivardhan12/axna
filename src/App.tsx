import { Route, Routes } from "react-router-dom"
import LoginPage from "./auth/Login"
import SignupPage from "./auth/Signup"
import LandingPage from "./pages/LandingPage"


function App() {
  return (
    <div>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  )
}

export default App
