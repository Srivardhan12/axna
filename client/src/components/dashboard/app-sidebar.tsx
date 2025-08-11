import * as React from "react"
import {
    BookOpen,
    Bot,
    // Frame,
    // Map,
    // PieChart,
    SquareTerminal,
    House
} from "lucide-react"

import { NavMain } from "@/components/dashboard/nav-main"
// import { NavProjects } from "@/components/dashboard/nav-projects"
import { NavUser } from "@/components/dashboard/nav-user"
import { TeamSwitcher } from "@/components/dashboard/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux"


const data = {
    teams: [
        {
            name: "AXNA",
            logo: House,
            plan: "Dashboard",
        }
    ],
    navMain: [
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            isActive: true,
            items: [
                {
                    title: "Introduction",
                    url: "underdev",
                },
                {
                    title: "Get Started",
                    url: "underdev",
                },
                {
                    title: "Tutorials",
                    url: "underdev",
                }
            ],
        },
        {
            title: "AXNA",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "What is AXNA",
                    url: "underdev",
                },
                {
                    title: "How to use AXNA",
                    url: "underdev",
                }
            ],
        },
        {
            title: "Models",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Gemini 2.5 flash",
                    url: "underdev",
                },
                {
                    title: "OpenRouter",
                    url: "underdev",
                }
            ],
        }
    ],
    // projects: [
    //     {
    //         name: "Design Engineering",
    //         url: "#",
    //         icon: Frame,
    //     },
    //     {
    //         name: "Sales & Marketing",
    //         url: "#",
    //         icon: PieChart,
    //     },
    //     {
    //         name: "Travel",
    //         url: "#",
    //         icon: Map,
    //     },
    // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    // @ts-expect-error same error
    const user = useSelector((state) => state.user)

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavProjects projects={data.projects} /> */}
            </SidebarContent>
            <SidebarFooter>
                {user ? <NavUser user={user} /> : null}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
