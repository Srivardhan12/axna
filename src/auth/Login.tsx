import { LoginForm } from "@/pages/LoginPage"
import { Link } from "react-router-dom"
export default function LoginPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link to="/" className="flex items-center gap-2 self-center font-bold text-xl">
                    AXNA
                </Link>
                <LoginForm />
            </div>
        </div>
    )
}
