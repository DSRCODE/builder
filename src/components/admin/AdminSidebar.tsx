import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Building2,
  Package,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Building,
  ChevronDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { getSelectedSiteId, setSelectedSiteId as saveSelectedSiteId } from "@/utils/siteUtils";
import api from "@/lib/api";

interface Site {
  id: number;
  site_name: string;
  address: string;
  business: {
    id: number;
    name: string;
  };
}

export function AdminSidebar() {
  const { t } = useTranslation();
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const { logout, user } = useAuth();

  // Site selection state
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
      const {data} = await api('/construction-sites');
     
        setSites(data.data);
      
    } catch (error) {
      console.error('Error fetching sites:', error);
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
    window.dispatchEvent(new CustomEvent('siteChanged', { 
      detail: { siteId } 
    }));
  };
  const menuItems = [
    {
      title: [t("admin_navigation.dashboard")],
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      title: [t("admin_navigation.sites")],
      url: "/sites",
      icon: Building2,
    },
    {
      title: [t("admin_navigation.materials")],
      url: "/materials",
      icon: Package,
    },
    { title: [t("admin_navigation.labour")], url: "/labour", icon: Users },
    {
      title: [t("admin_navigation.advances")],
      url: "/advances",
      icon: CreditCard,
    },
    {
      title: [t("admin_navigation.owner_details")],
      url: "/owner-details",
      icon: Users,
    },
    {
      title: [t("admin_navigation.expenses")],
      url: "/expenses",
      icon: Package,
    },
    // { title: "Pricing", url: "/pricing", icon: CreditCard },
    {
      title: [t("admin_navigation.reports")],
      url: "/reports",
      icon: BarChart3,
    },
    { title: "Admin", url: "/admin", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === "/admin";
    }

    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"}>
      <SidebarHeader className="p-4 bg-foreground">
        <div className="flex items-center gap-2">
          <img src="/logo.png" className="w-16" alt="" />
          {!collapsed && (
            <span className="font-bold text-lg text-white">D Buildz</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-foreground">
        <SidebarGroup>
          <SidebarGroupLabel className="text-secondary">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => {
                if (item.title === "Admin") {
                  if (user.user_role !== "admin") return null;
                }
                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/admin"}
                        className={`flex items-center gap-3 px-3 py-2 hover:bg-accent/90 rounded-md transition-colors ${
                          isActive(item.url)
                            ? "bg-accent text-primary-foreground font-medium"
                            : "hover:bg-accent/90 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-foreground">
        {/* Site Selection Dropdown */}
        {!collapsed && (
          <div className="mb-3">
            <label className="text-xs text-muted-foreground mb-2 block">
              Select Site
            </label>
            <Select
              value={selectedSiteId}
              onValueChange={handleSiteChange}
              disabled={loading}
            >
              <SelectTrigger className="w-full bg-background/10 border-muted-foreground/20 text-muted-foreground hover:bg-background/20">
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
        )}
        
        {/* Collapsed state site indicator */}
        {collapsed && (
          <div className="mb-3 flex justify-center">
            <div className="w-8 h-8 rounded bg-background/10 flex items-center justify-center">
              <Building className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && (
            <span className="ml-2">{t("admin_navigation.logout")}</span>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
