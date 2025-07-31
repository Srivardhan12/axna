import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { SIGNUP } from "@/redux/auth-actions"

export type state = {
  user: {
    status?: number
    message?: string,
    isSignup: boolean,
    response?: string,
    error?: string
  },
}

export type signup = {
  username?: string,
  email?: string,
  password?: string
}

export function SignupComponent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const navigate = useNavigate()
  const storedUser = useSelector((state: state) => state.user)
  const dispatch = useDispatch()
  const [user, setUser] = useState<signup>({})

  const [error, setError] = useState({ isError: false, message: "" })

  useEffect(() => {
    if (!hasSubmitted) return

    if (storedUser && !storedUser.isSignup && storedUser.response) {
      setIsLoading(false)

      let errorMessage = ""
      if (typeof storedUser.response === 'string') {
        errorMessage = storedUser.response
      } else if (storedUser.error) {
        errorMessage = storedUser.error
      } else {
        errorMessage = "Signup failed. Please try again."
      }

      setError({
        isError: true,
        message: errorMessage
      })
    } else if (storedUser && storedUser.isSignup) {
      setIsLoading(false)
      setError({ isError: false, message: "" })
    }
  }, [storedUser, hasSubmitted])

  const handleSubmit = () => {
    setHasSubmitted(true)
    setError({ isError: false, message: "" })

    setIsLoading(true)
    // @ts-expect-error Redux dispatch typing issue
    dispatch(SIGNUP(user, navigate))
  }

  const handleInputChange = (field: keyof signup, value: string) => {
    setUser({ ...user, [field]: value })

    if (error.isError) {
      setError({ isError: false, message: "" })
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create Account</h1>
                <p className="text-muted-foreground text-balance">
                  Create your AXNA account
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  placeholder="axna"
                  value={user.username || ""}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  disabled={isLoading}
                  autoComplete="on"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="axna@example.com"
                  required
                  value={user.email || ""}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="********"
                  value={user.password || ""}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {hasSubmitted && error.isError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-700 text-sm">{error.message}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="https://images.quiz-maker.com/images/edd82578-223c-416c-f2e3-b2173acf6d00/public"
              alt="Signup illustration"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
