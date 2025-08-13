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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import { useDashboard } from "@/hooks/useDashboard";

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
  const { user, planCheck } = useAuth();
  const [isScrolled, setIsScrolled] = useState(true);
  const { toast } = useToast();

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

  const {
    data: dashboardResponse,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useDashboard();

  // Fetch sites from API
  const fetchSites = async () => {
    setLoading(true);
    try {
      const { data } = await api("/construction-sites");

      setSites(data.data);
      refetch();
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
  const handleSiteChange = async (siteId: string) => {
    setSelectedSiteId(siteId);
    saveSelectedSiteId(siteId);

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(
      new CustomEvent("siteChanged", {
        detail: { siteId },
      })
    );
    if (siteId === "all") {
      const siteId = "0";
      await postSites(siteId);
    } else {
      await postSites(siteId);
    }
  };

  const postSites = async (siteId: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("site_id", siteId);

      const { data } = await api.post("/site-change", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data?.success) {
        toast({
          title: "Success",
          description: `${data?.message || "Site set successfully."}`,
        });
      }

      // Refresh site list after change
      await fetchSites();
    } catch (error) {
      console.error("Error posting site:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-2 sm:px-4">
            {/* Left side */}
            <div className="flex items-center gap-2">
              <SidebarTrigger />

              {/* Company Name */}
              <div className="flex flex-col leading-tight max-w-[90px] sm:max-w-[150px]">
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  Company
                </span>
                <span
                  className="text-xs sm:text-sm font-medium truncate"
                  title={user?.business_name || "No Company found"}
                >
                  {user?.business_name || "No Company found"}
                </span>
              </div>
              {/* Subscription Expiry */}
              {user?.user_role !== "super_admin" &&
                typeof planCheck?.days_remaining === "number" && (
                  <span
                    className={`mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      planCheck.days_remaining <= 0
                        ? "bg-red-100 text-red-700"
                        : planCheck.days_remaining <= 3
                        ? "bg-red-100 text-red-700"
                        : planCheck.days_remaining <= 7
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {planCheck.days_remaining <= 0
                      ? "Subscription expired"
                      : `Subscription expires in ${planCheck.days_remaining} days`}
                  </span>
                )}
            </div>

            {/* Right side */}
            <div className="flex items-center justify-end gap-2 sm:gap-4">
              {/* Site Selection Dropdown (always visible) */}
              <Select
                value={selectedSiteId}
                onValueChange={handleSiteChange}
                disabled={loading}
              >
                <SelectTrigger className="w-28 sm:w-40 bg-background/10 border border-muted-foreground/20 text-muted-foreground hover:bg-background/20 text-xs sm:text-sm">
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

              {/* Language Switcher */}
              <LanguageDropdown isScrolled={isScrolled} />

              {/* Notification Icon */}
              <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
                <Bell className="h-4 w-4" />
              </Button>

              {/* User Avatar */}
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">
                  {user.name.charAt(0)}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
