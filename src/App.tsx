import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./auth/Login"
import SignupPage from "./auth/Signup"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/Dashboard"
import { ThemeProvider } from "./components/theme-provider"
import { UserProvider } from "./context/userContsxtProvider"


function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </ThemeProvider>
        </div>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
