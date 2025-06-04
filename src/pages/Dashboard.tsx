import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    useEffect(() => {
        const authUser = localStorage.getItem('user');
        if (!authUser) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <Outlet />
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}
