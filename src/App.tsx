import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./auth/Login"
import SignupPage from "./auth/Signup"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/Dashboard"
import { ThemeProvider } from "./components/theme-provider"
import { UserProvider } from "./context/userContsxtProvider"
import DashboardHome from "./pages/DashboardHome"
import Space from "./pages/Space"

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
              <Route path="/dashboard" element={<Dashboard />} >
                <Route index element={<DashboardHome />} />
                <Route path="space" element={<Space />} />
              </Route>
            </Routes>
          </ThemeProvider>
        </div>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
