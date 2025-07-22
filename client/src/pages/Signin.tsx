import { SigninComponent } from "@/components/SigninComponent";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function Signin() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl">
                    <SigninComponent />
                </div>
            </div>
        </ThemeProvider>
    )
}
