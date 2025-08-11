import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import GenerateQuiz from "./pages/GenerateQuiz"
import Quiz from "./pages/Quiz"
import Results from "./pages/Results"
import InDelopment from "./pages/InDelopment"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} >
            <Route index element={<GenerateQuiz />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="results" element={<Results />} />
            <Route path="underdev" element={<InDelopment />} />
          </Route >
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
