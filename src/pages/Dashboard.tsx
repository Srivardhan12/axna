import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { useUser } from "@/context/userContsxtProvider";

export default function Dashboard() {
    const { user } = useUser();
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">{user ? user.name : ""}</h2>
                        <p className="text-sm text-gray-500">{user ? user.email : ""}</p>
                        <p className="text-xs text-gray-400">Created at: {user ? user.createdAt : ""}</p>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}
