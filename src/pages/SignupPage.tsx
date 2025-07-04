import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app, db } from "@/config"
import { doc, setDoc } from "firebase/firestore"
import { Eye, EyeClosed } from "lucide-react"

export function SignupForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [user, setUser] = useState({ id: "", username: "", email: "", password: "" })
    const [disableButton, setDisableButton] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const auth = getAuth(app);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setDisableButton(true)
        setErrorMessage("")
        console.log("User data not:", user)
        createUserWithEmailAndPassword(auth, user.email, user.password)
            .then(async (userCredential) => {
                const createdUser = userCredential.user;
                try {
                    await setDoc(doc(db, "users", createdUser.uid), {
                        name: user.username,
                        email: user.email,
                        id: createdUser.uid,
                        createdAt: new Date().toISOString().split("T")[0],
                        plan: "free",
                        spacesUsed: 0,
                    });
                    await updateProfile(createdUser, {
                        displayName: user.username,
                    });
                    setUser({ ...user, id: createdUser.uid })
                } catch {
                    setErrorMessage("Failed to create user profile")
                    setDisableButton(false)
                    return;
                }
                setDisableButton(false)
                navigate("/login")
            })
            .catch((error) => {
                console.error("Signup error:", error.code, error.message);
                switch (error.code) {
                    case "auth/email-already-in-use":
                        setErrorMessage("Email already in use.");
                        break;
                    case "auth/invalid-email":
                        setErrorMessage("Invalid email address.");
                        break;
                    case "auth/weak-password":
                        setErrorMessage("Password should be at least 6 characters.");
                        break;
                    default:
                        setErrorMessage("Signup failed. Please try again.");
                }
                setDisableButton(false);
            });
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome</CardTitle>
                    <CardDescription>
                        Sign up with your email and password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Username</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="username"
                                        required
                                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="axna@example.com"
                                        required
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                                            className="pr-10"
                                        />
                                        <span
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', padding: '0 10px' }}
                                        >
                                            {showPassword ? <EyeClosed /> : <Eye />}
                                        </span>
                                    </div>
                                    {errorMessage ? <span className="text-red-500 font-medium text-sm">{errorMessage}</span> : null}
                                </div>
                                <Button variant="outline" type="submit" className="w-full cursor-pointer" disabled={disableButton}>
                                    Sign up
                                    {disableButton ? <svg aria-hidden="true" role="status" className="inline w-4 h-4 ml-2 me-3 text-black animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                    </svg> : null}
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link to="/login" className="underline underline-offset-4">
                                    login
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card >
        </div >
    )
}
