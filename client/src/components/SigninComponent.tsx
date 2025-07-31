import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { SIGNIN } from "@/redux/auth-actions"
import { useDispatch, useSelector } from "react-redux"

export type signin = {
  email: string,
  password: string
}

type state = {
  user: {
    isSignup: boolean
    response?: string
    error?: string
    message?: string
  }
}

export function SigninComponent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [user, setUser] = useState<signin>({ email: "", password: "" })
  const [error, setError] = useState({ isError: false, message: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const storedUser = useSelector((state: state) => state.user)

  useEffect(() => {
    if (!hasSubmitted) return

    if (storedUser?.response || storedUser?.error || storedUser?.message) {
      setIsLoading(false)

      let errMsg = ""
      if (typeof storedUser.response === "string") {
        errMsg = storedUser.response
      } else if (storedUser.error) {
        errMsg = storedUser.error
      } else {
        errMsg = "Login failed. Please try again."
      }

      setError({ isError: true, message: errMsg })
    }
  }, [storedUser, hasSubmitted])

  const handleSubmit = () => {
    setHasSubmitted(true)
    setError({ isError: false, message: "" })
    setIsLoading(true)

    // @ts-expect-error Redux dispatch typing issue
    dispatch(SIGNIN(user, navigate))
  }

  const handleInputChange = (field: keyof signin, value: string) => {
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
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your AXNA account
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="axna@example.com"
                  required
                  value={user.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  autoComplete="on"
                  required
                  value={user.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {hasSubmitted && error.isError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-700 text-sm">{error.message}</p>
                </div>
              )}

              <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline underline-offset-4 hover:text-primary">
                  Sign up
                </Link>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="https://images.quiz-maker.com/images/edd82578-223c-416c-f2e3-b2173acf6d00/public"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
