import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import { useDatabaseExport } from "@/hooks/useDatabaseExport";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Building2,
  Building,
  DollarSign,
  Package,
  Users,
  Settings,
  Key,
  Database,
  Plus,
  Wallet,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
  CreditCard,
  Layers,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { RazorpayManagement } from "@/components/admin/RazorpayManagement";
import { USER_ROLES, getRoleName, getRoleColor } from "@/utils/roleUtils";
import DeleteSiteDialog from "@/components/admin/DeleteSiteDialog";
import DeleteBusinessDialog from "@/components/admin/DeleteBusinessDialog";
import DeleteUserDialog from "@/components/admin/DeleteUserDialog";
import EditSite from "@/components/admin/admin-panel/EditSite";
import EditPricing from "@/components/admin/admin-panel/EditPricing";
import EditMaterialCategory from "@/components/admin/admin-panel/EditMaterialCategory";
import EditBusiness from "@/components/admin/admin-panel/EditBusiness";
import DataManagement from "@/components/admin/admin-panel/DataManagement";
import ChangePassword from "@/components/admin/admin-panel/ChangePassword";
import PricingManagement from "@/components/admin/admin-panel/PricingManagement";
import MaterialCategories from "@/components/admin/admin-panel/MaterialCategories";
import ManageSites from "@/components/admin/admin-panel/ManageSites";
import LaborWages from "@/components/admin/admin-panel/LaborWages";
import ManageBusinesses from "@/components/admin/admin-panel/ManageBusinesses";
import AddManageSite from "@/components/admin/admin-panel/AddManageSite";
import AddManageUser from "@/components/admin/admin-panel/AddManageUser";
import AddMaterialCategory from "@/components/admin/admin-panel/AddMaterialCategory";
import AddManageBusiness from "@/components/admin/admin-panel/AddManageBusiness";
import AddPricing from "@/components/admin/admin-panel/AddPricing";
import SiteLoading from "@/components/admin/admin-panel/SiteLoading";
import SitesError from "@/components/admin/admin-panel/SitesError";
import BusinessLoading from "@/components/admin/admin-panel/BusinessLoading";
import BusinessError from "@/components/admin/admin-panel/BusinessError";
import UserLoading from "@/components/admin/admin-panel/UserLoading";
import UserError from "@/components/admin/admin-panel/UserError";
import MaterialCategoryLoading from "@/components/admin/admin-panel/MaterialCategoryLoading";
import MaterialCategoryError from "@/components/admin/admin-panel/MaterialCategoryError";
import {
  useCreatePricingPlan,
  useDeletePricingPlan,
  usePricingPlans,
  useUpdatePricingPlan,
} from "@/hooks/usePricingPlan";
import { PricingPlanFormData } from "@/types/pricingPlan";
import ManageUsers from "@/components/admin/admin-panel/ManageUsers";
import EditUser from "@/components/admin/admin-panel/EditUser";
import {
  useUserPlanData,
  useUserSubscriptionFreePlanData,
} from "@/services/planmanagement";
import ManageUserPlan from "@/components/admin/admin-panel/ManageUserPlan";
import { useAuth } from "@/contexts/authContext";
import UserSubscriptionPlanList from "@/components/admin/admin-panel/UserSubscriptionPlanList";
import SubscriptionExpiredCard from "@/components/admin/admin-panel/SubscriptionExpiredCard";
import { useTranslation } from "react-i18next";

export interface ConstructionSite {
  id: number;
  business_id: number;
  user_id: number | null;
  site_name: string;
  address: string;
  currency: string;
  estimated_budget: string;
  location: string;
  progress: number;
  total_spent: string;
  site_image: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  business: {
    id: number;
    user_id: number;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  user: {
    id: number;
    user_role_id: number;
    added_by: number | null;
    user_role: string | null;
    first_name: string | null;
    last_name: string | null;
    name: string;
    email: string;
    business_name: string | null;
    phone_number_prefix: string | null;
    phone_number_country_code: string | null;
    phone_number: string;
    address: string | null;
    gender: string | null;
    is_active: number;
    is_deleted: number;
    image: string;
    social_type: string | null;
    social_id: string | null;
    forgot_password_validate_string: string | null;
    verification_code: string | null;
    verification_code_sent_time: string | null;
    is_verified: number;
    verified_by_admin: number;
    language: string | null;
    push_notification: number;
    documents_front: string | null;
    documents_back: string | null;
    created_at: string;
    updated_at: string;
  } | null;
}

export interface SitesResponse {
  success: boolean;
  message: string;
  data: ConstructionSite[];
}

interface SiteFormData {
  business_id: string;
  site_name: string;
  address: string;
  currency: string;
  estimated_budget: string;
  location: string;
  progress: string;
  total_spent: string;
}

interface ChangePasswordFormData {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

interface BusinessFormData {
  name: string;
}

interface LaborWage {
  id: number;
  mason_wage: string;
  helper_wage: string;
  lady_helper_wage: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

interface LaborWageResponse {
  success: boolean;
  data: LaborWage;
}

interface LaborWageFormData {
  helper_wage: string;
  mason_wage: string;
  lady_helper_wage: string;
  currency: string;
}

interface UserFormData {
  user_role: "admin" | "builder" | "supervisor" | "owner" | "viewer";
  name: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface PricingPlan {
  id: number;
  plan: string;
  monthly_price: number;
  yearly_price: number;
  users: number;
  sites: number;
  status: string;
}

interface PricingFormData {
  name: string;
  monthly_price: number;
  yearly_price: number;
  users_limit: number;
  sites_limit: number;
  description: string;
  status?: string;
}

interface MaterialCategoryFormData {
  name: string;
}
interface Member {
  id: number;
  user_role_id: number;
  added_by: number | null;
  user_role: string | null;
  first_name: string | null;
  last_name: string | null;
  name: string;
  email: string;
  business_name: string | null;
  phone_number_prefix: string | null;
  phone_number_country_code: string | null;
  phone_number: string;
  address: string | null;
  gender: string | null;
  is_active: number;
  is_deleted: number;
  image: string;
  social_type: string | null;
  social_id: string | null;
  forgot_password_validate_string: string | null;
  verification_code: string | null;
  verification_code_sent_time: string | null;
  is_verified: number;
  verified_by_admin: number;
  language: string | null;
  push_notification: number;
  documents_front: string | null;
  documents_back: string | null;
  created_at: string;
  updated_at: string;
}

interface MembersResponse {
  success: boolean;
  data: Member[];
}

export interface Business {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface BusinessesResponse {
  success: boolean;
  message: string;
  data: Business[];
}
export interface MaterialCategory {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface MaterialCategoriesResponse {
  success: boolean;
  message: string;
  data: MaterialCategory[];
}

// Mock data for different sections
const mockData = {
  "manage-sites": [
    {
      id: 1,
      name: "Lavanya - Sai Enclave",
      address: "Ballari India",
      budget: 8225000,
      status: "Active",
    },
    {
      id: 2,
      name: "Shivaji - Srirampur colony",
      address: "Bombay press road",
      budget: 700000,
      status: "Active",
    },
    {
      id: 3,
      name: "Anil Site",
      address: "Talur road",
      budget: 20000000,
      status: "Active",
    },
  ],
  "manage-businesses": [
    {
      id: 1,
      name: "ABC Construction Ltd",
      email: "contact@abc.com",
      phone: "+1-555-0123",
      status: "Active",
      projects: 12,
    },
    {
      id: 2,
      name: "BuildRight Corp",
      email: "info@buildright.com",
      phone: "+1-555-0456",
      status: "Active",
      projects: 8,
    },
    {
      id: 3,
      name: "MegaBuild Inc",
      email: "hello@megabuild.com",
      phone: "+1-555-0789",
      status: "Inactive",
      projects: 5,
    },
  ],
  "labor-wages": [
    {
      id: 1,
      role: "Mason",
      hourlyRate: 25,
      dailyRate: 200,
      experience: "Senior",
      status: "Active",
    },
    {
      id: 2,
      role: "Carpenter",
      hourlyRate: 22,
      dailyRate: 176,
      experience: "Mid-level",
      status: "Active",
    },
    {
      id: 3,
      role: "Helper",
      hourlyRate: 15,
      dailyRate: 120,
      experience: "Junior",
      status: "Active",
    },
  ],
  "material-categories": [
    {
      id: 1,
      category: "Cement",
      subcategories: 5,
      totalItems: 25,
      avgCost: 450,
      status: "Active",
    },
    {
      id: 2,
      category: "Steel",
      subcategories: 8,
      totalItems: 40,
      avgCost: 65000,
      status: "Active",
    },
    {
      id: 3,
      category: "Bricks",
      subcategories: 3,
      totalItems: 15,
      avgCost: 8,
      status: "Active",
    },
  ],
  "manage-users": [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2024-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Manager",
      status: "Active",
      lastLogin: "2024-01-14",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "User",
      status: "Inactive",
      lastLogin: "2024-01-10",
    },
  ],
  "pricing-management": [
    {
      id: 1,
      plan: "Starter",
      monthlyPrice: 49,
      yearlyPrice: 490,
      users: 5,
      sites: 3,
      status: "Active",
    },
    {
      id: 2,
      plan: "Professional",
      monthlyPrice: 149,
      yearlyPrice: 1490,
      users: 25,
      sites: 15,
      status: "Active",
    },
    {
      id: 3,
      plan: "Enterprise",
      monthlyPrice: 399,
      yearlyPrice: 3990,
      users: 100,
      sites: 50,
      status: "Active",
    },
  ],
};

export function AdminPanel() {
  return (
    <AdminRoute
      requiredRole={[
        USER_ROLES.ADMIN,
        USER_ROLES.SUPERADMIN,
      ]}
      fallbackTitle="Admin Panel Access Required"
      fallbackMessage="You don't have permission to access the admin panel. Only administrators can view this page."
    >
      <AdminContent />
    </AdminRoute>
  );
}

function AdminContent() {
  const { t } = useTranslation();
  const adminOptions = [
    {
      id: "manage-sites",
      title: `${t("admin.navitem.n1.title")}`,
      description: `${t("admin.navitem.n1.desc")}`,
      icon: Building2,
      color: "text-blue-600",
    },
    {
      id: "manage-businesses",
      title: `${t("admin.navitem.n2.title")}`,
      description: `${t("admin.navitem.n2.desc")}`,
      icon: Building,
      color: "text-green-600",
    },
    {
      id: "labor-wages",
      title: `${t("admin.navitem.n3.title")}`,
      description: `${t("admin.navitem.n3.desc")}`,
      icon: DollarSign,
      color: "text-yellow-600",
    },
    {
      id: "material-categories",
      title: `${t("admin.navitem.n4.title")}`,
      description: `${t("admin.navitem.n4.desc")}`,
      icon: Package,
      color: "text-purple-600",
    },
    {
      id: "manage-users",
      title: `${t("admin.navitem.n5.title")}`,
      description: `${t("admin.navitem.n5.desc")}`,
      icon: Users,
      color: "text-orange-600",
    },
    {
      id: "pricing-management",
      title: `${t("admin.navitem.n6.title")}`,
      description: `${t("admin.navitem.n6.desc")}`,
      icon: Wallet,
      color: "text-pink-600",
    },
    {
      id: "change-password",
      title: `${t("admin.navitem.n7.title")}`,
      description: `${t("admin.navitem.n7.desc")}`,
      icon: Key,
      color: "text-red-600",
    },
    {
      id: "data-management",
      title: `${t("admin.navitem.n8.title")}`,
      description: `${t("admin.navitem.n8.desc")}`,
      icon: Database,
      color: "text-indigo-600",
    },
    {
      id: "razorpay-management",
      title: `${t("admin.navitem.n9.title")}`,
      description: `${t("admin.navitem.n9.desc")}`,
      icon: CreditCard,
      color: "text-blue-600",
    },
    {
      id: "plan-management",
      title: `${t("admin.navitem.n10.title")}`,
      description: `${t("admin.navitem.n10.desc")}`,
      icon: Layers,
      color: "text-indigo-500",
    },
    {
      id: "userSubscriptionPlan-management",
      title: `${t("admin.navitem.n11.title")}`,
      description: `${t("admin.navitem.n11.desc")}`,
      icon: Layers,
      color: "text-indigo-500",
    },
  ];


  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const check = user?.active_subscription?.sites_limit;
  const checkUser = user?.active_subscription?.users_limit;
  // const planExpireCheck = planCheck?.days_remaining;

    const calculateDaysRemaining = (endDate: string) => {
      const today = new Date();
      const expiry = new Date(endDate);
      const diffTime = expiry.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert ms to days
    };

    const planExpireCheck = user?.active_subscription
      ? {
          days_remaining: calculateDaysRemaining(
            user.active_subscription.end_date
          ),
        }
      : null;

  // Tabs only visible to super_admin
  const superAdminOnlyTabs = [
    "razorpay-management",
    "pricing-management",
    "plan-management",
    "data-management",
  ];

  // Filter tabs based on role
  const visibleTabs =
    user?.user_role === "super_admin"
      ? adminOptions // super_admin sees everything
      : adminOptions.filter(
          (option) => !superAdminOnlyTabs.includes(option.id)
        );

  // Valid tab options (list of all possible)
  const validTabs = adminOptions.map((opt) => opt.id);

  // Valid tab options
  // const validTabs = [
  //   "manage-sites",
  //   "manage-businesses",
  //   "labor-wages",
  //   "material-categories",
  //   "manage-users",
  //   "pricing-management",
  //   "change-password",
  //   "data-management",
  //   "razorpay-management",
  //   "plan-management",
  //   "userSubscriptionPlan-management",
  // ];
  const { data, isLoading, isError } = usePricingPlans();
  const createPricingPlan = useCreatePricingPlan();
  const deletePricingPlan = useDeletePricingPlan();
  const updatePricingPlan = useUpdatePricingPlan();
  const { data: planData, isLoading: planLoading } = useUserPlanData();
  const { data: userSubPlanData, isLoading: userSubPlanLoading } =
    useUserSubscriptionFreePlanData();
  console.log(userSubPlanData);
  const tabFromUrl = searchParams.get("tab");
  const initialTab =
    tabFromUrl && validTabs.includes(tabFromUrl)
      ? tabFromUrl
      : visibleTabs.length > 0
      ? visibleTabs[0].id
      : "manage-sites";
  const [selectedOption, setSelectedOption] = useState(initialTab);
  const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);
  const [isEditSiteModalOpen, setIsEditSiteModalOpen] = useState(false);
  const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false);
  const [isEditBusinessModalOpen, setIsEditBusinessModalOpen] = useState(false);
  const [isAddMaterialCategoryModalOpen, setIsAddMaterialCategoryModalOpen] =
    useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isAddPricingModalOpen, setIsAddPricingModalOpen] = useState(false);
  const [isEditPricingModalOpen, setIsEditPricingModalOpen] = useState(false);
  const [editingMaterialCategory, setEditingMaterialCategory] =
    useState<MaterialCategory | null>(null);
  const [isEditMaterialCategoryModalOpen, setIsEditMaterialCategoryModalOpen] =
    useState(false);
  const [editingSite, setEditingSite] = useState<ConstructionSite | null>(null);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [editingUser, setEditingUser] = useState<Member | null>(null);
  const [editingPricing, setEditingPricing] = useState<PricingPlan | null>(
    null
  );
  const [siteFormData, setSiteFormData] = useState<SiteFormData>({
    business_id: "1", // Default business ID
    site_name: "",
    address: "",
    currency: "₹",
    estimated_budget: "",
    location: "",
    progress: "0",
    total_spent: "0",
  });
  const [passwordFormData, setPasswordFormData] =
    useState<ChangePasswordFormData>({
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
  const [businessFormData, setBusinessFormData] = useState<BusinessFormData>({
    name: "",
  });
  const [laborWageFormData, setLaborWageFormData] = useState<LaborWageFormData>(
    {
      helper_wage: "",
      mason_wage: "",
      lady_helper_wage: "",
      currency: "Indian_rupee",
    }
  );
  const [userFormData, setUserFormData] = useState<UserFormData>({
    user_role: "admin",
    name: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [pricingFormData, setPricingFormData] = useState({
    plan: "",
    monthlyPrice: "",
    yearlyPrice: "",
    users: "",
    sites: "",
    status: "Active",
  });
  const [materialCategoryFormData, setMaterialCategoryFormData] =
    useState<MaterialCategoryFormData>({
      name: "",
    });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Database export functionality
  const {
    mutate: exportDatabase,
    isPending: isExporting,
    error: exportError,
  } = useDatabaseExport();

  // Update selected option when URL changes
  useEffect(() => {
    // compute default tab based on what's visible to the current user
    const defaultTab = visibleTabs.length ? visibleTabs[0].id : "manage-sites";

    const tabFromUrl = searchParams.get("tab");

    // if URL tab is valid for this user, use it; otherwise use the defaultTab
    const resolvedTab =
      tabFromUrl && visibleTabs.some((t) => t.id === tabFromUrl)
        ? tabFromUrl
        : defaultTab;

    // set selected option
    setSelectedOption(resolvedTab);

    // if the URL had an invalid tab (or none), replace it with the resolvedTab
    if (tabFromUrl !== resolvedTab) {
      // replace: true avoids a history push when normalizing the URL
      setSearchParams({ tab: resolvedTab }, { replace: true });
    }
  }, [searchParams, setSearchParams, visibleTabs]);

  // Handle database export errors
  useEffect(() => {
    if (exportError) {
      toast({
        title: "Export Failed",
        description: exportError.message || "Failed to export database",
        variant: "destructive",
      });
    }
  }, [exportError, toast]);

  // Function to handle database export
  const handleDatabaseExport = () => {
    exportDatabase(undefined, {
      onSuccess: () => {
        toast({
          title: "Export Successful",
          description:
            "Database has been exported successfully and download started.",
          variant: "default",
        });
      },
    });
  };

  // Function to handle tab selection with URL update
  const handleTabSelect = (tabId: string) => {
    if (validTabs.includes(tabId)) {
      setSelectedOption(tabId);
      setSearchParams({ tab: tabId });
    }
  };

  // Fetch construction sites from API
  const {
    data: sitesData,
    isLoading: sitesLoading,
    error: sitesError,
  } = useQuery<SitesResponse>({
    queryKey: ["construction-sites"],
    queryFn: async () => {
      const response = await api.get("/construction-sites");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch businesses from API
  const {
    data: businessesData,
    isLoading: businessesLoading,
    error: businessesError,
  } = useQuery<BusinessesResponse>({
    queryKey: ["businesses"],
    queryFn: async () => {
      const response = await api.get("/businesses");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  // Fetch material categories from API
  const {
    data: materialCategoriesData,
    isLoading: materialCategoriesLoading,
    error: materialCategoriesError,
  } = useQuery<MaterialCategoriesResponse>({
    queryKey: ["material-categories"],
    queryFn: async () => {
      const response = await api.get("/material-categories");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  // Fetch labor wages from API
  const {
    data: laborWageData,
    isLoading: laborWageLoading,
    error: laborWageError,
  } = useQuery<LaborWageResponse>({
    queryKey: ["labor-wages"],
    queryFn: async () => {
      const response = await api.get("/labor-wages");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch members from API
  const {
    data: membersData,
    isLoading: membersLoading,
    error: membersError,
  } = useQuery<MembersResponse>({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await api.get("/member");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Add site mutation
  const addSiteMutation = useMutation({
    mutationFn: async (siteData: SiteFormData) => {
      const response = await api.post("/construction-sites", siteData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Construction site added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["construction-sites"] });
      setIsAddSiteModalOpen(false);
      resetSiteForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to add construction site",
        variant: "destructive",
      });
    },
  });

  // Edit site mutation
  const editSiteMutation = useMutation({
    mutationFn: async ({
      id,
      siteData,
    }: {
      id: number;
      siteData: SiteFormData;
    }) => {
      const response = await api.post(`/construction-sites/${id}`, siteData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Construction site updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["construction-sites"] });
      setIsEditSiteModalOpen(false);
      setEditingSite(null);
      resetSiteForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update construction site",
        variant: "destructive",
      });
    },
  });

  // Delete site mutation
  const deleteSiteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/construction-sites/delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Construction site deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["construction-sites"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete construction site",
        variant: "destructive",
      });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (passwordData: ChangePasswordFormData) => {
      const response = await api.post("/change-password", passwordData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      resetPasswordForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to change password",
        variant: "destructive",
      });
    },
  });

  // Add business mutation
  const addBusinessMutation = useMutation({
    mutationFn: async (businessData: BusinessFormData) => {
      const response = await api.post("/businesses", businessData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Business added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      setIsAddBusinessModalOpen(false);
      resetBusinessForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add business",
        variant: "destructive",
      });
    },
  });

  // Add material category mutation
  const addMaterialCategoryMutation = useMutation({
    mutationFn: async (categoryData: MaterialCategoryFormData) => {
      const response = await api.post("/material-categories", categoryData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Material category added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["material-categories"] });
      setIsAddMaterialCategoryModalOpen(false);
      resetMaterialCategoryForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to add material category",
        variant: "destructive",
      });
    },
  });

  const updateMaterialCategoryMutation = useMutation({
    mutationFn: async ({
      id,
      categoryData,
    }: {
      id: number;
      categoryData: MaterialCategoryFormData;
    }) => {
      const response = await api.post(
        `/material-categories/${id}`,
        categoryData
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Material category updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["material-categories"] });
      setIsEditMaterialCategoryModalOpen(false);
      setEditingMaterialCategory(null);
      resetMaterialCategoryForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update material category",
        variant: "destructive",
      });
    },
  });

  const deleteMaterialCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/material-categories/delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Material category deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["material-categories"] });
      setIsEditMaterialCategoryModalOpen(false);
      setEditingMaterialCategory(null);
      resetMaterialCategoryForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete material category",
        variant: "destructive",
      });
    },
  });

  // Update business mutation
  const updateBusinessMutation = useMutation({
    mutationFn: async ({
      id,
      businessData,
    }: {
      id: number;
      businessData: BusinessFormData;
    }) => {
      const response = await api.post(`/businesses/${id}`, businessData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Business updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      setIsEditBusinessModalOpen(false);
      setEditingBusiness(null);
      resetBusinessForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update business",
        variant: "destructive",
      });
    },
  });

  // Delete business mutation
  const deleteBusinessMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/businesses-delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Business deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete business",
        variant: "destructive",
      });
    },
  });

  // Save labor wages mutation
  const saveLaborWagesMutation = useMutation({
    mutationFn: async (wageData: LaborWageFormData) => {
      const response = await api.post("/labor-wages", wageData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Labor wages updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["labor-wages"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update labor wages",
        variant: "destructive",
      });
    },
  });

  // Add user mutation
  const addUserMutation = useMutation({
    mutationFn: async (userData: UserFormData) => {
      const response = await api.post("/member", userData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setIsAddUserModalOpen(false);
      resetUserForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add user",
        variant: "destructive",
      });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: number;
      userData: UserFormData;
    }) => {
      const response = await api.post(`/member/${id}`, userData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setIsEditUserModalOpen(false);
      setEditingUser(null);
      resetUserForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/member/delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const sites = sitesData?.data || [];
  const businesses = businessesData?.data || [];
  const materialCategories = materialCategoriesData?.data || [];
  const laborWage = laborWageData?.data;
  const members = membersData?.data || [];
  const plans = planData?.data || [];
  const userSubscriptionPlan = userSubPlanData?.data || [];
  console.log(userSubscriptionPlan);

  // Pricing plans state (dynamic with max 3 plans)
  const [pricingPlans, setPricingPlans] = useState([]);
  useEffect(() => {
    if (data?.data) {
      setPricingPlans(data.data);
    }
  }, [data]);

  // Populate labor wage form when data is loaded
  useEffect(() => {
    if (laborWage) {
      setLaborWageFormData({
        helper_wage: laborWage.helper_wage,
        mason_wage: laborWage.mason_wage,
        lady_helper_wage: laborWage.lady_helper_wage,
        currency: laborWage.currency,
      });
    }
  }, [laborWage]);

  const resetSiteForm = () => {
    setSiteFormData({
      business_id: "1",
      site_name: "",
      address: "",
      currency: "₹",
      estimated_budget: "",
      location: "",
      progress: "0",
      total_spent: "0",
    });
  };

  const resetPricingForm = () => {
    setPricingFormData({
      plan: "",
      monthlyPrice: "",
      yearlyPrice: "",
      users: "",
      sites: "",
      status: "Active",
    });
  };

  const openEditPricingModal = (pricing: any) => {
    setEditingPricing(pricing);
    setPricingFormData({
      plan: pricing.name || "", // plan name
      monthlyPrice: pricing.monthly_price || "",
      yearlyPrice: pricing.yearly_price || "",
      users: pricing.users_limit || 0,
      sites: pricing.sites_limit || 0,
      status: pricing.description || "", // or pricing.status if you have it separately
    });
    setIsEditPricingModalOpen(true);
  };

  const openEditMaterialCategoryModal = (category: MaterialCategory) => {
    setEditingMaterialCategory(category);
    setMaterialCategoryFormData({
      name: category.name,
    });
    setIsEditMaterialCategoryModalOpen(true);
  };

  const handlePricingInputChange = (
    field: keyof PricingFormData,
    value: string
  ) => {
    setPricingFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  // Pricing API
  const handleAddPricingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !pricingFormData.plan.trim() ||
      !pricingFormData.monthlyPrice ||
      !pricingFormData.yearlyPrice ||
      !pricingFormData.users ||
      !pricingFormData.sites
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Convert and validate numbers
    const monthlyPrice = parseFloat(pricingFormData.monthlyPrice);
    const yearlyPrice = parseFloat(pricingFormData.yearlyPrice);
    const users = parseInt(pricingFormData.users);
    const sites = parseInt(pricingFormData.sites);

    if (
      isNaN(monthlyPrice) ||
      monthlyPrice < 0 ||
      isNaN(yearlyPrice) ||
      yearlyPrice < 0 ||
      isNaN(users) ||
      users <= 0 ||
      isNaN(sites) ||
      sites <= 0
    ) {
      toast({
        title: "Validation Error",
        description: "All numeric values must be positive numbers",
        variant: "destructive",
      });
      return;
    }

    // Map to API type
    const apiPayload: PricingPlanFormData = {
      name: pricingFormData.plan,
      monthly_price: monthlyPrice,
      yearly_price: yearlyPrice,
      users_limit: users,
      sites_limit: sites,
      description: pricingFormData.status, // or another description field
    };

    // Call mutation
    createPricingPlan.mutate(apiPayload, {
      onSuccess: () => {
        setIsAddPricingModalOpen(false);
        resetPricingForm();
      },
    });
  };

  const handleEditPricingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingPricing) return;

    // Validation
    if (
      !pricingFormData.plan.trim() ||
      !pricingFormData.monthlyPrice ||
      !pricingFormData.yearlyPrice ||
      !pricingFormData.users ||
      !pricingFormData.sites
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Parse and validate numbers
    const monthlyPrice = parseFloat(pricingFormData.monthlyPrice);
    const yearlyPrice = parseFloat(pricingFormData.yearlyPrice);
    const users = parseInt(pricingFormData.users);
    const sites = parseInt(pricingFormData.sites);

    if (
      isNaN(monthlyPrice) ||
      monthlyPrice < 0 ||
      isNaN(yearlyPrice) ||
      yearlyPrice < 0 ||
      isNaN(users) ||
      users <= 0 ||
      isNaN(sites) ||
      sites <= 0
    ) {
      toast({
        title: "Validation Error",
        description: "All numeric values must be positive numbers",
        variant: "destructive",
      });
      return;
    }

    // Prepare API payload
    const apiPayload: PricingPlanFormData = {
      name: pricingFormData.plan.trim(),
      monthly_price: monthlyPrice,
      yearly_price: yearlyPrice,
      users_limit: users,
      sites_limit: sites,
      description: pricingFormData.status,
    };

    // Call mutation
    updatePricingPlan.mutate(
      { id: editingPricing.id, data: apiPayload },
      {
        onSuccess: () => {
          setIsEditPricingModalOpen(false);
          setEditingPricing(null);
          resetPricingForm();
        },
        // onError handled inside your mutation hook or you can add here too
      }
    );
  };

  const handleDeletePricing = (id: number) => {
    deletePricingPlan.mutate(id);
  };

  // Pricing API

  const resetUserForm = () => {
    setUserFormData({
      user_role: "admin",
      name: "",
      email: "",
      phone_number: "",
      password: "",
    });
  };

  const openEditUserModal = (user: Member) => {
    setEditingUser(user);
    setUserFormData({
      user_role: user.user_role
        ? (user.user_role.toLowerCase() as
            | "admin"
            | "builder"
            | "supervisor"
            | "owner"
            | "viewer")
        : user.user_role_id === 1
        ? "admin"
        : user.user_role_id === 2
        ? "builder"
        : user.user_role_id === 3
        ? "supervisor"
        : user.user_role_id === 4
        ? "owner"
        : "viewer",
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      password: "", // Don't pre-fill password for security
    });
    setIsEditUserModalOpen(true);
  };

  const handleUserInputChange = (field: keyof UserFormData, value: string) => {
    setUserFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !userFormData.name.trim() ||
      !userFormData.email.trim() ||
      !userFormData.phone_number.trim() ||
      !userFormData.password.trim()
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userFormData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Phone validation
    if (userFormData.phone_number.length < 10) {
      toast({
        title: "Validation Error",
        description: "Phone number must be at least 10 digits",
        variant: "destructive",
      });
      return;
    }

    // Password validation
    if (userFormData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    addUserMutation.mutate({
      ...userFormData,
      name: userFormData.name.trim(),
      email: userFormData.email.trim(),
      phone_number: userFormData.phone_number.trim(),
    });
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUser) return;

    // Validation
    if (
      !userFormData.name.trim() ||
      !userFormData.email.trim() ||
      !userFormData.phone_number.trim()
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userFormData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Phone validation
    if (userFormData.phone_number.length < 10) {
      toast({
        title: "Validation Error",
        description: "Phone number must be at least 10 digits",
        variant: "destructive",
      });
      return;
    }

    // Password validation (only if password is provided)
    if (userFormData.password && userFormData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    const updateData = {
      ...userFormData,
      name: userFormData.name.trim(),
      email: userFormData.email.trim(),
      phone_number: userFormData.phone_number.trim(),
    };

    // Remove password if empty (don't update password)
    if (!userFormData.password.trim()) {
      delete updateData.password;
    }

    updateUserMutation.mutate({
      id: editingUser.id,
      userData: updateData,
    });
  };

  const handleLaborWageInputChange = (
    field: keyof LaborWageFormData,
    value: string
  ) => {
    setLaborWageFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLaborWageSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !laborWageFormData.mason_wage ||
      !laborWageFormData.helper_wage ||
      !laborWageFormData.lady_helper_wage
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all wage fields",
        variant: "destructive",
      });
      return;
    }

    // Validate positive numbers
    const wages = [
      parseFloat(laborWageFormData.mason_wage),
      parseFloat(laborWageFormData.helper_wage),
      parseFloat(laborWageFormData.lady_helper_wage),
    ];

    if (wages.some((wage) => isNaN(wage) || wage <= 0)) {
      toast({
        title: "Validation Error",
        description: "All wages must be positive numbers",
        variant: "destructive",
      });
      return;
    }

    saveLaborWagesMutation.mutate(laborWageFormData);
  };

  const resetBusinessForm = () => {
    setBusinessFormData({
      name: "",
    });
  };

  const openEditBusinessModal = (business: Business) => {
    setEditingBusiness(business);
    setBusinessFormData({
      name: business.name,
    });
    setIsEditBusinessModalOpen(true);
  };

  const handleBusinessInputChange = (
    field: keyof BusinessFormData,
    value: string
  ) => {
    setBusinessFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!businessFormData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a business name",
        variant: "destructive",
      });
      return;
    }

    if (businessFormData.name.trim().length < 2) {
      toast({
        title: "Validation Error",
        description: "Business name must be at least 2 characters long",
        variant: "destructive",
      });
      return;
    }

    addBusinessMutation.mutate({
      name: businessFormData.name.trim(),
    });
  };

  const handleEditBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingBusiness) return;

    // Validation
    if (!businessFormData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a business name",
        variant: "destructive",
      });
      return;
    }

    if (businessFormData.name.trim().length < 2) {
      toast({
        title: "Validation Error",
        description: "Business name must be at least 2 characters long",
        variant: "destructive",
      });
      return;
    }

    updateBusinessMutation.mutate({
      id: editingBusiness.id,
      businessData: {
        name: businessFormData.name.trim(),
      },
    });
  };

  // Material Category form handlers
  const resetMaterialCategoryForm = () => {
    setMaterialCategoryFormData({
      name: "",
    });
  };

  const handleMaterialCategoryInputChange = (
    field: keyof MaterialCategoryFormData,
    value: string
  ) => {
    setMaterialCategoryFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddMaterialCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!materialCategoryFormData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    if (materialCategoryFormData.name.trim().length < 2) {
      toast({
        title: "Validation Error",
        description: "Category name must be at least 2 characters long",
        variant: "destructive",
      });
      return;
    }

    addMaterialCategoryMutation.mutate({
      name: materialCategoryFormData.name.trim(),
    });
  };

  const handleEditMaterialCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingMaterialCategory) return;

    // Validation
    if (!materialCategoryFormData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    if (materialCategoryFormData.name.trim().length < 2) {
      toast({
        title: "Validation Error",
        description: "Category name must be at least 2 characters long",
        variant: "destructive",
      });
      return;
    }

    updateMaterialCategoryMutation.mutate({
      id: editingMaterialCategory.id,
      categoryData: {
        name: materialCategoryFormData.name.trim(),
      },
    });
  };
  const handleDeleteMaterialCategory = (id: number) => {
    deleteMaterialCategoryMutation.mutate(id);
  };
  const resetPasswordForm = () => {
    setPasswordFormData({
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
  };

  const handlePasswordInputChange = (
    field: keyof ChangePasswordFormData,
    value: string
  ) => {
    setPasswordFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !passwordFormData.old_password ||
      !passwordFormData.new_password ||
      !passwordFormData.new_password_confirmation
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (
      passwordFormData.new_password !==
      passwordFormData.new_password_confirmation
    ) {
      toast({
        title: "Validation Error",
        description: "New password and confirmation do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordFormData.new_password.length < 6) {
      toast({
        title: "Validation Error",
        description: "New password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (passwordFormData.old_password === passwordFormData.new_password) {
      toast({
        title: "Validation Error",
        description: "New password must be different from the old password",
        variant: "destructive",
      });
      return;
    }

    changePasswordMutation.mutate(passwordFormData);
  };

  const openEditSiteModal = (site: ConstructionSite) => {
    setEditingSite(site);
    setSiteFormData({
      business_id: site.business_id.toString(),
      site_name: site.site_name,
      address: site.address,
      currency: site.currency,
      estimated_budget: site.estimated_budget,
      location: site.location,
      progress: site.progress.toString(),
      total_spent: site.total_spent,
    });
    setIsEditSiteModalOpen(true);
  };

  const handleSiteInputChange = (field: keyof SiteFormData, value: string) => {
    setSiteFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSiteSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !siteFormData.site_name ||
      !siteFormData.address ||
      !siteFormData.estimated_budget ||
      !siteFormData.location
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(siteFormData.estimated_budget) <= 0) {
      toast({
        title: "Validation Error",
        description: "Estimated budget must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (
      parseFloat(siteFormData.progress) < 0 ||
      parseFloat(siteFormData.progress) > 100
    ) {
      toast({
        title: "Validation Error",
        description: "Progress must be between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    addSiteMutation.mutate(siteFormData);
  };

  const handleEditSiteSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingSite) return;

    // Validation
    if (
      !siteFormData.site_name ||
      !siteFormData.address ||
      !siteFormData.estimated_budget ||
      !siteFormData.location
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(siteFormData.estimated_budget) <= 0) {
      toast({
        title: "Validation Error",
        description: "Estimated budget must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (
      parseFloat(siteFormData.progress) < 0 ||
      parseFloat(siteFormData.progress) > 100
    ) {
      toast({
        title: "Validation Error",
        description: "Progress must be between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    editSiteMutation.mutate({
      id: editingSite.id,
      siteData: siteFormData,
    });
  };

  const renderContent = () => {
    const option = adminOptions.find((opt) => opt.id === selectedOption);
    if (!option) return null;

    // Handle loading and error states for manage-sites
    if (selectedOption === "manage-sites") {
      if (sitesLoading)
        <SiteLoading
          option={option}
          isAddSiteModalOpen={isAddSiteModalOpen}
          setIsAddSiteModalOpen={setIsAddSiteModalOpen}
          handleAddSiteSubmit={handleAddSiteSubmit}
          siteFormData={siteFormData}
          handleSiteInputChange={handleSiteInputChange}
          addSiteMutation={addSiteMutation}
        />;

      if (sitesError)
        <SitesError
          option={option}
          isAddSiteModalOpen={isAddSiteModalOpen}
          setIsAddSiteModalOpen={setIsAddSiteModalOpen}
          handleAddSiteSubmit={handleAddSiteSubmit}
          siteFormData={siteFormData}
          handleSiteInputChange={handleSiteInputChange}
          addSiteMutation={addSiteMutation}
          sitesError={sitesError}
        />;
    }

    // Handle loading and error states for manage-businesses
    if (selectedOption === "manage-businesses") {
      if (businessesLoading)
        return (
          <BusinessLoading
            option={option}
            isAddBusinessModalOpen={isAddBusinessModalOpen}
            setIsAddBusinessModalOpen={setIsAddBusinessModalOpen}
            handleAddBusinessSubmit={handleAddBusinessSubmit}
            businessFormData={businessFormData}
            handleBusinessInputChange={handleBusinessInputChange}
            addBusinessMutation={addBusinessMutation}
          />
        );

      if (businessesError)
        return (
          <BusinessError
            option={option}
            isAddBusinessModalOpen={isAddBusinessModalOpen}
            setIsAddBusinessModalOpen={setIsAddBusinessModalOpen}
            handleAddBusinessSubmit={handleAddBusinessSubmit}
            businessFormData={businessFormData}
            handleBusinessInputChange={handleBusinessInputChange}
            addBusinessMutation={addBusinessMutation}
            businessesError={businessesError}
          />
        );
    }
    // Handle loading and error states for manage-users
    if (selectedOption === "manage-users") {
      if (membersLoading)
        return (
          <UserLoading
            option={option}
            isAddUserModalOpen={isAddUserModalOpen}
            setIsAddUserModalOpen={setIsAddUserModalOpen}
            handleAddUserSubmit={handleAddUserSubmit}
            userFormData={userFormData}
            handleUserInputChange={handleUserInputChange}
            addUserMutation={addUserMutation}
          />
        );

      if (membersError)
        return (
          <UserError
            option={option}
            isAddUserModalOpen={isAddUserModalOpen}
            setIsAddUserModalOpen={setIsAddUserModalOpen}
            handleAddUserSubmit={handleAddUserSubmit}
            userFormData={userFormData}
            handleUserInputChange={handleUserInputChange}
            addUserMutation={addUserMutation}
            membersError={membersError}
          />
        );
    }
    // Handle loading and error states for material-categories
    if (selectedOption === "material-categories") {
      if (materialCategoriesLoading) return <MaterialCategoryLoading />;

      if (materialCategoriesError)
        return (
          <MaterialCategoryError
            materialCategoriesError={materialCategoriesError}
          />
        );
    }
    // Use API data for manage-sites, manage-businesses, manage-users, and material-categories, pricing plans for pricing-management, mock data for others mark
    const data =
      selectedOption === "manage-sites"
        ? sites
        : selectedOption === "manage-businesses"
        ? businesses
        : selectedOption === "manage-users"
        ? members
        : selectedOption === "material-categories"
        ? materialCategories
        : selectedOption === "pricing-management"
        ? pricingPlans
        : selectedOption === "plan-management"
        ? plans
        : selectedOption === "userSubscriptionPlan-management"
        ? userSubscriptionPlan
        : mockData[selectedOption as keyof typeof mockData] || [];

    // console.log(data);

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <option.icon className={`h-5 w-5 ${option.color}`} />
              <div>
                <CardTitle>{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </div>
            </div>
            {selectedOption === "manage-sites" ? (
              <AddManageSite
                isAddSiteModalOpen={isAddSiteModalOpen}
                setIsAddSiteModalOpen={setIsAddSiteModalOpen}
                handleAddSiteSubmit={handleAddSiteSubmit}
                siteFormData={siteFormData}
                handleSiteInputChange={handleSiteInputChange}
                addSiteMutation={addSiteMutation}
                check={check}
              />
            ) : selectedOption === "manage-businesses" ? (
              <AddManageBusiness
                isAddBusinessModalOpen={isAddBusinessModalOpen}
                setIsAddBusinessModalOpen={setIsAddBusinessModalOpen}
                handleAddBusinessSubmit={handleAddBusinessSubmit}
                businessFormData={businessFormData}
                handleBusinessInputChange={handleBusinessInputChange}
                addBusinessMutation={addBusinessMutation}
              />
            ) : selectedOption === "manage-users" ? (
              <AddManageUser
                isAddUserModalOpen={isAddUserModalOpen}
                setIsAddUserModalOpen={setIsAddUserModalOpen}
                handleAddUserSubmit={handleAddUserSubmit}
                userFormData={userFormData}
                handleUserInputChange={handleUserInputChange}
                addUserMutation={addUserMutation}
                check={checkUser}
              />
            ) : selectedOption === "pricing-management" ? (
              <AddPricing
                isAddPricingModalOpen={isAddPricingModalOpen}
                setIsAddPricingModalOpen={setIsAddPricingModalOpen}
                pricingPlans={pricingPlans}
                handleAddPricingSubmit={handleAddPricingSubmit}
                pricingFormData={pricingFormData}
                handlePricingInputChange={handlePricingInputChange}
              />
            ) : selectedOption === "material-categories" ? (
              <AddMaterialCategory
                isAddMaterialCategoryModalOpen={isAddMaterialCategoryModalOpen}
                setIsAddMaterialCategoryModalOpen={
                  setIsAddMaterialCategoryModalOpen
                }
                handleAddMaterialCategorySubmit={
                  handleAddMaterialCategorySubmit
                }
                materialCategoryFormData={materialCategoryFormData}
                handleMaterialCategoryInputChange={
                  handleMaterialCategoryInputChange
                }
                addMaterialCategoryMutation={addMaterialCategoryMutation}
              />
            ) : selectedOption !== "change-password" &&
              selectedOption !== "data-management" &&
              selectedOption !== "labor-wages" &&
              selectedOption !== "razorpay-management" &&
              selectedOption !== "plan-management" &&
              selectedOption !== "userSubscriptionPlan-management" ? (
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          {data.length === 0 && selectedOption === "manage-sites" ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No construction sites found</p>
              <p className="text-sm text-gray-500">
                Start by adding your first site
              </p>
            </div>
          ) : data.length === 0 && selectedOption === "manage-businesses" ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No businesses found</p>
              <p className="text-sm text-gray-500">
                Start by adding your first business
              </p>
            </div>
          ) : data.length === 0 && selectedOption === "manage-users" ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No users found</p>
              <p className="text-sm text-gray-500">
                Start by adding your first user
              </p>
            </div>
          ) : data.length === 0 && selectedOption === "material-categories" ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No material categories found</p>
              <p className="text-sm text-gray-500">
                No categories available at the moment
              </p>
            </div>
          ) : data?.length === 0 && selectedOption === "pricing-management" ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No pricing plans found</p>
              <p className="text-sm text-gray-500">
                Start by adding your first pricing plan (Max 3)
              </p>
            </div>
          ) : (
            renderTable(selectedOption, data)
          )}
        </CardContent>
      </Card>
    );
  };

  const renderTable = (optionId: string, data: any[]) => {
    switch (optionId) {
      case "manage-sites":
        return (
          <ManageSites data={data} openEditSiteModal={openEditSiteModal} />
        );

      case "manage-businesses":
        return (
          <ManageBusinesses
            data={data}
            openEditBusinessModal={openEditBusinessModal}
          />
        );

      case "labor-wages":
        return (
          <LaborWages
            laborWageLoading={laborWageLoading}
            laborWageError={laborWageError}
            handleLaborWageSubmit={handleLaborWageSubmit}
            laborWageFormData={laborWageFormData}
            handleLaborWageInputChange={handleLaborWageInputChange}
            laborWage={laborWage}
            saveLaborWagesMutation={saveLaborWagesMutation}
          />
        );

      case "material-categories":
        return (
          <MaterialCategories
            data={data}
            openEditMaterialCategoryModal={openEditMaterialCategoryModal}
            handleDeleteMaterialCategory={handleDeleteMaterialCategory}
          />
        );

      case "pricing-management":
        return (
          <PricingManagement
            data={data}
            openEditPricingModal={openEditPricingModal}
            handleDeletePricing={handleDeletePricing}
          />
        );

      case "change-password":
        return (
          <ChangePassword
            handleChangePasswordSubmit={handleChangePasswordSubmit}
            passwordFormData={passwordFormData}
            handlePasswordInputChange={handlePasswordInputChange}
            changePasswordMutation={changePasswordMutation}
          />
        );

      case "data-management":
        return (
          <DataManagement
            handleDatabaseExport={handleDatabaseExport}
            isExporting={isExporting}
          />
        );

      case "razorpay-management":
        return <RazorpayManagement />;

      case "manage-users":
        return (
          <ManageUsers data={data} openEditUserModal={openEditUserModal} />
        );
      case "plan-management":
        return <ManageUserPlan data={data} />;

      case "userSubscriptionPlan-management":
        return <UserSubscriptionPlanList data={data} />;

      default:
        return <div>Content not available</div>;
    }
  };
  const check1 = 0;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {t("admin.title")}
        </h1>
      </div>

      {planExpireCheck?.days_remaining === 0 ? (
        <div className="min-h-96 flex items-center justify-center bg-gray-50 p-4">
          <SubscriptionExpiredCard />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Sidebar */}
          <div className="grid md:grid-cols-5 gap-1 bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
            {visibleTabs.map((option) => (
              <div
                key={option.id}
                className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                  selectedOption === option.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
                onClick={() => handleTabSelect(option.id)}
              >
                <option.icon className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{option.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      )}

      {/* Edit Site Modal */}
      <EditSite
        isEditSiteModalOpen={isEditSiteModalOpen}
        setIsEditSiteModalOpen={setIsEditSiteModalOpen}
        handleEditSiteSubmit={handleEditSiteSubmit}
        siteFormData={siteFormData}
        handleSiteInputChange={handleSiteInputChange}
        editSiteMutation={editSiteMutation}
      />

      {/* Edit Pricing Modal */}
      <EditPricing
        isEditPricingModalOpen={isEditPricingModalOpen}
        setIsEditPricingModalOpen={setIsEditPricingModalOpen}
        handleEditPricingSubmit={handleEditPricingSubmit}
        pricingFormData={pricingFormData}
        handlePricingInputChange={handlePricingInputChange}
      />

      {/* Edit Business */}
      <EditBusiness
        isEditBusinessModalOpen={isEditBusinessModalOpen}
        setIsEditBusinessModalOpen={setIsEditBusinessModalOpen}
        handleEditBusinessSubmit={handleEditBusinessSubmit}
        businessFormData={businessFormData}
        handleBusinessInputChange={handleBusinessInputChange}
        updateBusinessMutation={updateBusinessMutation}
      />

      {/* Edit Material Category Modal */}
      <EditMaterialCategory
        isEditMaterialCategoryModalOpen={isEditMaterialCategoryModalOpen}
        setIsEditMaterialCategoryModalOpen={setIsEditMaterialCategoryModalOpen}
        handleEditMaterialCategorySubmit={handleEditMaterialCategorySubmit}
        materialCategoryFormData={materialCategoryFormData}
        handleMaterialCategoryInputChange={handleMaterialCategoryInputChange}
        updateMaterialCategoryMutation={updateMaterialCategoryMutation}
      />

      {/* Edit User Modal */}
      <EditUser
        isEditUserModalOpen={isEditUserModalOpen}
        setIsEditUserModalOpen={setIsEditUserModalOpen}
        handleEditUserSubmit={handleEditUserSubmit}
        userFormData={userFormData}
        handleUserInputChange={handleUserInputChange}
        updateUserMutation={updateUserMutation}
      />
    </div>
  );
}
