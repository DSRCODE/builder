import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import { Globe, Bell, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext";
import LanguageDropdown from "../LanguageDropdown";
import { useEffect, useState } from "react";
import {
  getSelectedSiteId,
  setSelectedSiteId as saveSelectedSiteId,
} from "@/utils/siteUtils";
import api from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Site {
  id: number;
  site_name: string;
  address: string;
  business: {
    id: number;
    name: string;
  };
}

export function AdminLayout() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(true);

  // Site selection state
  //  const collapsed = state === "collapsed";
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  // Load selected site from session storage on component mount
  useEffect(() => {
    const savedSiteId = getSelectedSiteId();
    setSelectedSiteId(savedSiteId);
  }, []);

  // Fetch sites from API
  const fetchSites = async () => {
    setLoading(true);
    try {
      const { data } = await api("/construction-sites");

      setSites(data.data);
    } catch (error) {
      console.error("Error fetching sites:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load sites on component mount
  useEffect(() => {
    fetchSites();
  }, []);

  // Handle site selection
  const handleSiteChange = (siteId: string) => {
    setSelectedSiteId(siteId);
    saveSelectedSiteId(siteId);

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(
      new CustomEvent("siteChanged", {
        detail: { siteId },
      })
    );
  };

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

            <div className="flex items-center justify-end gap-4">
              {/* Site Selection Dropdown */}
              <div className="flex flex-col">
                {/* <label className="text-xs text-muted-foreground mb-1">
                  Select Site
                </label> */}
                <Select
                  value={selectedSiteId}
                  onValueChange={handleSiteChange}
                  disabled={loading}
                >
                  <SelectTrigger className="w-40 bg-background/10 border border-muted-foreground/20 text-muted-foreground hover:bg-background/20">
                    <SelectValue placeholder="Select a site..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sites</SelectItem>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{site.site_name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language Switcher */}
              <LanguageDropdown isScrolled={isScrolled} />

              {/* Notification Icon */}
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>

              {/* User Initial Avatar */}
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
