import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom";

export default function Page() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center  w-full gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="relative flex items-center">
                <p className="cursor-pointer" onClick={() => setDark(!dark)} >{dark ? <Sun size={20} /> : <Moon size={20} />}</p>
              </div>
            </div>
          </header>
          <div className="px-5">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div >
  );
}
