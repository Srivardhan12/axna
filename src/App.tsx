import LoginPage from "./auth/Login"
import SignupPage from "./auth/Signup"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/Dashboard"
// import DashboardHome from "./pages/DashboardHome"
import Space from "./pages/Space"
import Generate from "./pages/Generate"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { PDFProvider } from "./context/pdfContextProvider"
import { ThemeProvider } from "./components/theme-provider"
import { UserProvider } from "./context/userContextProvider"
import Quiz from "./pages/Quiz"
import Flashcards from "./pages/Flashcards"
import Summary from "./pages/Summary"

function App() {
  return (
    <UserProvider>
      <PDFProvider>
        <BrowserRouter>
          <div>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={<Dashboard />} >
                  {/* <Route index element={<DashboardHome />} /> */}
                  <Route index element={<Space />} />
                  <Route path="generate" element={<Generate />} />
                  <Route path="quiz" element={<Quiz />} />
                  <Route path="flashcards" element={<Flashcards />} />
                  <Route path="summary" element={<Summary />} />
                </Route>
              </Routes>
            </ThemeProvider>
          </div>
        </BrowserRouter>
      </PDFProvider>
    </UserProvider>
  )
}

export default App
