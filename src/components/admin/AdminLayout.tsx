import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import { Globe, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext";
import LanguageDropdown from "../LanguageDropdown";
import { useState } from "react";

export function AdminLayout() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(true);
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>

            <div className="flex items-center gap-2">
              {/* <Button variant="ghost" size="sm" className="text-sm">
                <Globe className="mr-2 h-4 w-4" />
                US English
              </Button> */}
              <LanguageDropdown isScrolled={isScrolled} />

              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">
                  {user.name.charAt(0)}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
