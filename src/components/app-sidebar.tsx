import { useState } from "react";
import {
    AudioWaveform,
    Notebook,
    SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarRail,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Getting Started",
            url: "#",
            icon: AudioWaveform,
            isActive: true,
            items: [
                {
                    title: "About AXNA",
                    url: "#",
                },
                {
                    title: "How to use AXNA",
                    url: "#",
                },
            ],
        },
        {
            title: "AXNA",
            url: "",
            icon: Notebook,
            isActive: true,
            items: [
                {
                    title: "Spaces",
                    url: "#",
                },

            ],
        },
        {
            title: "Others",
            url: "#",
            icon: SquareTerminal,
            isActive: false,
            items: [
                {
                    title: "Profile",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [sidebarclouser, setSidebarclouser] = useState(false);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center justify-between" style={{ flexDirection: sidebarclouser ? "column" : "row" }}>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5" >
                            <Link to="/">
                                <span className="text-base font-bold">AXNA</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarTrigger
                            onClick={() => setSidebarclouser(!sidebarclouser)}
                            className="cursor-pointer border mt-1"
                        />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
