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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react"
import { app } from "@/config"
import { useUser } from "@/context/userContextProvider"
import { Eye, EyeClosed } from "lucide-react"
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config"

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {

    const [userLogin, setUserLogin] = useState({ id: "", username: "", email: "", password: "" })
    const [disableButton, setDisableButton] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const auth = getAuth(app);
    const navigate = useNavigate();
    const { login } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setDisableButton(true);
        setErrorMessage("");

        try {
            console.log("Trying login with", userLogin.email, userLogin.password);
            const userCredential = await signInWithEmailAndPassword(auth, userLogin.email, userLogin.password);
            const createdUser = userCredential.user;

            const userDocRef = doc(db, "users", createdUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            let userData = {
                uid: createdUser.uid,
                email: createdUser.email || "",
                name: createdUser.displayName || "",
                plan: "free" as "free" | "pro",
                spacesUsed: 0,
                createdAt: new Date().toISOString(),
            };

            if (userDocSnap.exists()) {
                const data = userDocSnap.data();
                userData = {
                    ...userData,
                    name: data.name || createdUser.displayName || "",
                    plan: data.plan === "pro" ? "pro" : "free",
                    spacesUsed: data.spacesUsed,
                    createdAt: data.createdAt,
                };
            }

            login(userData);
            navigate("/dashboard");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Login error:", error.code, error.message);
            switch (error.code) {
                case "auth/user-not-found":
                    setErrorMessage("User not found");
                    break;
                case "auth/wrong-password":
                    setErrorMessage("Wrong password");
                    break;
                case "auth/invalid-email":
                    setErrorMessage("Invalid email format");
                    break;
                case "auth/too-many-requests":
                    setErrorMessage("Too many failed attempts. Try again later.");
                    break;
                default:
                    setErrorMessage("Login failed. Please try again.");
            }
        } finally {
            setDisableButton(false);
        }
    };


    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login with your email and password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="axna@example.com"
                                        required
                                        onChange={(e) => { setUserLogin({ ...userLogin, email: e.target.value }); setErrorMessage(""); }}
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
                                            onChange={(e) => { setUserLogin({ ...userLogin, password: e.target.value }); setErrorMessage("") }}
                                            className="pr-10"
                                        />
                                        <span
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', padding: '0 10px' }}
                                        >
                                            {showPassword ? <EyeClosed /> : <Eye />}
                                        </span>
                                    </div>
                                </div>
                                {errorMessage ? <span className="text-red-500 font-medium text-sm">{errorMessage}</span> : null}
                                <Button variant="outline" type="submit" className="w-full cursor-pointer" disabled={disableButton}>
                                    Login
                                    {disableButton ? <svg aria-hidden="true" role="status" className="inline w-4 h-4 ml-2 me-3 text-black animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                    </svg> : null}
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link to="/signup" className="underline underline-offset-4">
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
