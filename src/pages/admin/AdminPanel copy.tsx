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
import ManageUsers from "@/components/admin/admin-panel/ManageUsers";
import AddManageUser from "@/components/admin/admin-panel/AddManageUser";
import EditUser from "@/components/admin/admin-panel/EditUser";

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
  monthlyPrice: number;
  yearlyPrice: number;
  users: number;
  sites: number;
  status: string;
}

interface PricingFormData {
  plan: string;
  monthlyPrice: string;
  yearlyPrice: string;
  users: string;
  sites: string;
  status: string;
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
const adminOptions = [
  {
    id: "manage-sites",
    title: "Manage Sites",
    description: "Add, edit, or remove construction sites",
    icon: Building2,
    color: "text-blue-600",
  },
  {
    id: "manage-businesses",
    title: "Manage Businesses",
    description: "Configure business entities and settings",
    icon: Building,
    color: "text-green-600",
  },
  {
    id: "labor-wages",
    title: "Labor Wages",
    description: "Set wage rates and payment schedules",
    icon: DollarSign,
    color: "text-yellow-600",
  },
  {
    id: "material-categories",
    title: "Material Categories",
    description: "Organize material types and categories",
    icon: Package,
    color: "text-purple-600",
  },
  {
    id: "manage-users",
    title: "Manage Users",
    description: "User accounts and access permissions",
    icon: Users,
    color: "text-orange-600",
  },
  {
    id: "pricing-management",
    title: "Pricing Management",
    description: "Manage subscription plans and pricing",
    icon: Wallet,
    color: "text-pink-600",
  },
  {
    id: "change-password",
    title: "Change Password",
    description: "Update admin security credentials",
    icon: Key,
    color: "text-red-600",
  },
  {
    id: "data-management",
    title: "Data Management",
    description: "Backup, restore, and data operations",
    icon: Database,
    color: "text-indigo-600",
  },
  {
    id: "razorpay-management",
    title: "Razorpay Management",
    description: "Configure payment gateway settings",
    icon: CreditCard,
    color: "text-blue-600",
  },
];

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
      requiredRole={USER_ROLES.ADMIN}
      fallbackTitle="Admin Panel Access Required"
      fallbackMessage="You don't have permission to access the admin panel. Only administrators can view this page."
    >
      <AdminContent />
    </AdminRoute>
  );
}

function AdminContent() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Valid tab options
  const validTabs = [
    "manage-sites",
    "manage-businesses",
    "labor-wages",
    "material-categories",
    "manage-users",
    "pricing-management",
    "change-password",
    "data-management",
    "razorpay-management",
  ];

  const tabFromUrl = searchParams.get("tab");
  const initialTab =
    tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "manage-sites";
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
  const [pricingFormData, setPricingFormData] = useState<PricingFormData>({
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
    const tabFromUrl = searchParams.get("tab");
    const validTab =
      tabFromUrl && validTabs.includes(tabFromUrl)
        ? tabFromUrl
        : "manage-sites";
    setSelectedOption(validTab);

    // If URL has invalid tab, update it to default
    if (tabFromUrl && !validTabs.includes(tabFromUrl)) {
      setSearchParams({ tab: "manage-sites" });
    }
  }, [searchParams, setSearchParams]);

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

  // Pricing plans state (dynamic with max 3 plans)
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([
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
  ]);

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

  const openEditPricingModal = (pricing: PricingPlan) => {
    setEditingPricing(pricing);
    setPricingFormData({
      plan: pricing.plan,
      monthlyPrice: pricing.monthlyPrice.toString(),
      yearlyPrice: pricing.yearlyPrice.toString(),
      users: pricing.users.toString(),
      sites: pricing.sites.toString(),
      status: pricing.status,
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

  const handleAddPricingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if maximum plans reached
    if (pricingPlans.length >= 3) {
      toast({
        title: "Maximum Plans Reached",
        description: "You can only have a maximum of 3 pricing plans",
        variant: "destructive",
      });
      return;
    }

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

    // Check for duplicate plan names
    if (
      pricingPlans.some(
        (plan) =>
          plan.plan.toLowerCase() === pricingFormData.plan.trim().toLowerCase()
      )
    ) {
      toast({
        title: "Validation Error",
        description: "A plan with this name already exists",
        variant: "destructive",
      });
      return;
    }

    // Validate positive numbers
    const monthlyPrice = parseFloat(pricingFormData.monthlyPrice);
    const yearlyPrice = parseFloat(pricingFormData.yearlyPrice);
    const users = parseInt(pricingFormData.users);
    const sites = parseInt(pricingFormData.sites);

    if (
      isNaN(monthlyPrice) ||
      monthlyPrice <= 0 ||
      isNaN(yearlyPrice) ||
      yearlyPrice <= 0 ||
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

    // Create new plan
    const newPlan: PricingPlan = {
      id: Math.max(...pricingPlans.map((p) => p.id), 0) + 1,
      plan: pricingFormData.plan.trim(),
      monthlyPrice,
      yearlyPrice,
      users,
      sites,
      status: pricingFormData.status,
    };

    setPricingPlans((prev) => [...prev, newPlan]);
    setIsAddPricingModalOpen(false);
    resetPricingForm();

    toast({
      title: "Success",
      description: "Pricing plan added successfully",
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

    // Check for duplicate plan names (excluding current plan)
    if (
      pricingPlans.some(
        (plan) =>
          plan.id !== editingPricing.id &&
          plan.plan.toLowerCase() === pricingFormData.plan.trim().toLowerCase()
      )
    ) {
      toast({
        title: "Validation Error",
        description: "A plan with this name already exists",
        variant: "destructive",
      });
      return;
    }

    // Validate positive numbers
    const monthlyPrice = parseFloat(pricingFormData.monthlyPrice);
    const yearlyPrice = parseFloat(pricingFormData.yearlyPrice);
    const users = parseInt(pricingFormData.users);
    const sites = parseInt(pricingFormData.sites);

    if (
      isNaN(monthlyPrice) ||
      monthlyPrice <= 0 ||
      isNaN(yearlyPrice) ||
      yearlyPrice <= 0 ||
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

    // Update plan
    setPricingPlans((prev) =>
      prev.map((plan) =>
        plan.id === editingPricing.id
          ? {
              ...plan,
              plan: pricingFormData.plan.trim(),
              monthlyPrice,
              yearlyPrice,
              users,
              sites,
              status: pricingFormData.status,
            }
          : plan
      )
    );

    setIsEditPricingModalOpen(false);
    setEditingPricing(null);
    resetPricingForm();

    toast({
      title: "Success",
      description: "Pricing plan updated successfully",
    });
  };

  const handleDeletePricing = (id: number) => {
    setPricingPlans((prev) => prev.filter((plan) => plan.id !== id));
    toast({
      title: "Success",
      description: "Pricing plan deleted successfully",
    });
  };

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
      if (sitesLoading) {
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
                <Dialog
                  open={isAddSiteModalOpen}
                  onOpenChange={setIsAddSiteModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Site
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add New Construction Site</DialogTitle>
                      <DialogDescription>
                        Create a new construction site with all the necessary
                        details
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSiteSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="site_name">Site Name *</Label>
                          <Input
                            id="site_name"
                            value={siteFormData.site_name}
                            onChange={(e) =>
                              handleSiteInputChange("site_name", e.target.value)
                            }
                            placeholder="Enter site name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location *</Label>
                          <Input
                            id="location"
                            value={siteFormData.location}
                            onChange={(e) =>
                              handleSiteInputChange("location", e.target.value)
                            }
                            placeholder="e.g., India, USA"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Address *</Label>
                        <Textarea
                          id="address"
                          value={siteFormData.address}
                          onChange={(e) =>
                            handleSiteInputChange("address", e.target.value)
                          }
                          placeholder="Enter complete address"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="currency">Currency *</Label>
                          <Select
                            value={siteFormData.currency}
                            onValueChange={(value) =>
                              handleSiteInputChange("currency", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="₹">₹ (INR)</SelectItem>
                              {/* <SelectItem value="$">$ (USD)</SelectItem>
                              <SelectItem value="€">€ (EUR)</SelectItem> */}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="estimated_budget">
                            Estimated Budget *
                          </Label>
                          <Input
                            id="estimated_budget"
                            type="number"
                            min="0"
                            step="0.01"
                            value={siteFormData.estimated_budget}
                            onChange={(e) =>
                              handleSiteInputChange(
                                "estimated_budget",
                                e.target.value
                              )
                            }
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="progress">Progress (%)</Label>
                          <Input
                            id="progress"
                            type="number"
                            min="0"
                            max="100"
                            value={siteFormData.progress}
                            onChange={(e) =>
                              handleSiteInputChange("progress", e.target.value)
                            }
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="total_spent">Total Spent</Label>
                        <Input
                          id="total_spent"
                          type="number"
                          min="0"
                          step="0.01"
                          value={siteFormData.total_spent}
                          onChange={(e) =>
                            handleSiteInputChange("total_spent", e.target.value)
                          }
                          placeholder="0.00"
                        />
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddSiteModalOpen(false)}
                          disabled={addSiteMutation.isPending}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={addSiteMutation.isPending}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          {addSiteMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Site
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading sites...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }

      if (sitesError) {
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
                <Dialog
                  open={isAddSiteModalOpen}
                  onOpenChange={setIsAddSiteModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Site
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add New Construction Site</DialogTitle>
                      <DialogDescription>
                        Create a new construction site with all the necessary
                        details
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSiteSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="site_name">Site Name *</Label>
                          <Input
                            id="site_name"
                            value={siteFormData.site_name}
                            onChange={(e) =>
                              handleSiteInputChange("site_name", e.target.value)
                            }
                            placeholder="Enter site name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location *</Label>
                          <Input
                            id="location"
                            value={siteFormData.location}
                            onChange={(e) =>
                              handleSiteInputChange("location", e.target.value)
                            }
                            placeholder="e.g., India, USA"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Address *</Label>
                        <Textarea
                          id="address"
                          value={siteFormData.address}
                          onChange={(e) =>
                            handleSiteInputChange("address", e.target.value)
                          }
                          placeholder="Enter complete address"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="currency">Currency *</Label>
                          <Select
                            value={siteFormData.currency}
                            onValueChange={(value) =>
                              handleSiteInputChange("currency", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="₹">₹ (INR)</SelectItem>
                              {/* <SelectItem value="$">$ (USD)</SelectItem>
                              <SelectItem value="€">€ (EUR)</SelectItem> */}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="estimated_budget">
                            Estimated Budget *
                          </Label>
                          <Input
                            id="estimated_budget"
                            type="number"
                            min="0"
                            step="0.01"
                            value={siteFormData.estimated_budget}
                            onChange={(e) =>
                              handleSiteInputChange(
                                "estimated_budget",
                                e.target.value
                              )
                            }
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="progress">Progress (%)</Label>
                          <Input
                            id="progress"
                            type="number"
                            min="0"
                            max="100"
                            value={siteFormData.progress}
                            onChange={(e) =>
                              handleSiteInputChange("progress", e.target.value)
                            }
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="total_spent">Total Spent</Label>
                        <Input
                          id="total_spent"
                          type="number"
                          min="0"
                          step="0.01"
                          value={siteFormData.total_spent}
                          onChange={(e) =>
                            handleSiteInputChange("total_spent", e.target.value)
                          }
                          placeholder="0.00"
                        />
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddSiteModalOpen(false)}
                          disabled={addSiteMutation.isPending}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={addSiteMutation.isPending}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          {addSiteMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Site
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 mb-1">Error loading sites</p>
                  <p className="text-sm text-muted-foreground">
                    {sitesError instanceof Error
                      ? sitesError.message
                      : "Unknown error occurred"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }
    }

    // Handle loading and error states for manage-businesses
    if (selectedOption === "manage-businesses") {
      if (businessesLoading) {
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
                <Dialog
                  open={isAddBusinessModalOpen}
                  onOpenChange={setIsAddBusinessModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Business
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogTitle>Add New Business</DialogTitle>
                      <DialogDescription>
                        Create a new business entity
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleAddBusinessSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="business_name">Business Name *</Label>
                        <Input
                          id="business_name"
                          value={businessFormData.name}
                          onChange={(e) =>
                            handleBusinessInputChange("name", e.target.value)
                          }
                          placeholder="Enter business name"
                          required
                          minLength={2}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Minimum 2 characters required
                        </p>
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddBusinessModalOpen(false)}
                          disabled={addBusinessMutation.isPending}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={addBusinessMutation.isPending}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          {addBusinessMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Business
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading businesses...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }

      if (businessesError) {
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
                <Dialog
                  open={isAddBusinessModalOpen}
                  onOpenChange={setIsAddBusinessModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Business
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogTitle>Add New Business</DialogTitle>
                      <DialogDescription>
                        Create a new business entity
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleAddBusinessSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="business_name">Business Name *</Label>
                        <Input
                          id="business_name"
                          value={businessFormData.name}
                          onChange={(e) =>
                            handleBusinessInputChange("name", e.target.value)
                          }
                          placeholder="Enter business name"
                          required
                          minLength={2}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Minimum 2 characters required
                        </p>
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddBusinessModalOpen(false)}
                          disabled={addBusinessMutation.isPending}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={addBusinessMutation.isPending}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          {addBusinessMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Business
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 mb-1">Error loading businesses</p>
                  <p className="text-sm text-muted-foreground">
                    {businessesError instanceof Error
                      ? businessesError.message
                      : "Unknown error occurred"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }
    }

    // Handle loading and error states for manage-users
    if (selectedOption === "manage-users") {
      if (membersLoading) {
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
                <Dialog
                  open={isAddUserModalOpen}
                  onOpenChange={setIsAddUserModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account with role and permissions
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddUserSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="user_name">Full Name *</Label>
                          <Input
                            id="user_name"
                            value={userFormData.name}
                            onChange={(e) =>
                              handleUserInputChange("name", e.target.value)
                            }
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="user_role">User Role *</Label>
                          <Select
                            value={userFormData.user_role}
                            onValueChange={(value) =>
                              handleUserInputChange("user_role", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="builder">Builder</SelectItem>
                              <SelectItem value="supervisor">
                                Supervisor
                              </SelectItem>
                              <SelectItem value="owner">Owner</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="user_email">Email Address *</Label>
                        <Input
                          id="user_email"
                          type="email"
                          value={userFormData.email}
                          onChange={(e) =>
                            handleUserInputChange("email", e.target.value)
                          }
                          placeholder="Enter email address"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="user_phone">Phone Number *</Label>
                        <Input
                          id="user_phone"
                          type="tel"
                          value={userFormData.phone_number}
                          onChange={(e) =>
                            handleUserInputChange(
                              "phone_number",
                              e.target.value
                            )
                          }
                          placeholder="Enter phone number (min 10 digits)"
                          required
                          minLength={10}
                        />
                      </div>

                      <div>
                        <Label htmlFor="user_password">Password *</Label>
                        <Input
                          id="user_password"
                          type="password"
                          value={userFormData.password}
                          onChange={(e) =>
                            handleUserInputChange("password", e.target.value)
                          }
                          placeholder="Enter password (min 6 characters)"
                          required
                          minLength={6}
                        />
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddUserModalOpen(false)}
                          disabled={addUserMutation.isPending}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={addUserMutation.isPending}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          {addUserMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Add User
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }

      if (membersError) {
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
                <Dialog
                  open={isAddUserModalOpen}
                  onOpenChange={setIsAddUserModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account with role and permissions
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddUserSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="user_name">Full Name *</Label>
                          <Input
                            id="user_name"
                            value={userFormData.name}
                            onChange={(e) =>
                              handleUserInputChange("name", e.target.value)
                            }
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="user_role">User Role *</Label>
                          <Select
                            value={userFormData.user_role}
                            onValueChange={(value) =>
                              handleUserInputChange("user_role", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="builder">Builder</SelectItem>
                              <SelectItem value="supervisor">
                                Supervisor
                              </SelectItem>
                              <SelectItem value="owner">Owner</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="user_email">Email Address *</Label>
                        <Input
                          id="user_email"
                          type="email"
                          value={userFormData.email}
                          onChange={(e) =>
                            handleUserInputChange("email", e.target.value)
                          }
                          placeholder="Enter email address"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="user_phone">Phone Number *</Label>
                        <Input
                          id="user_phone"
                          type="tel"
                          value={userFormData.phone_number}
                          onChange={(e) =>
                            handleUserInputChange(
                              "phone_number",
                              e.target.value
                            )
                          }
                          placeholder="Enter phone number (min 10 digits)"
                          required
                          minLength={10}
                        />
                      </div>

                      <div>
                        <Label htmlFor="user_password">Password *</Label>
                        <Input
                          id="user_password"
                          type="password"
                          value={userFormData.password}
                          onChange={(e) =>
                            handleUserInputChange("password", e.target.value)
                          }
                          placeholder="Enter password (min 6 characters)"
                          required
                          minLength={6}
                        />
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddUserModalOpen(false)}
                          disabled={addUserMutation.isPending}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={addUserMutation.isPending}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          {addUserMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Add User
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 mb-1">Error loading users</p>
                  <p className="text-sm text-muted-foreground">
                    {membersError instanceof Error
                      ? membersError.message
                      : "Unknown error occurred"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }
    }

    // Handle loading and error states for material-categories
    if (selectedOption === "material-categories") {
      if (materialCategoriesLoading) {
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  <div>
                    <CardTitle>Material Categories</CardTitle>
                    <CardDescription>
                      Organize material types and categories
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Loading material categories...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }

      if (materialCategoriesError) {
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  <div>
                    <CardTitle>Material Categories</CardTitle>
                    <CardDescription>
                      Organize material types and categories
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 mb-1">
                    Error loading material categories
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {materialCategoriesError instanceof Error
                      ? materialCategoriesError.message
                      : "Unknown error occurred"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }
    }
    // Use API data for manage-sites, manage-businesses, manage-users, and material-categories, pricing plans for pricing-management, mock data for others
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
        : mockData[selectedOption as keyof typeof mockData] || [];

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
              />
            ) : selectedOption === "manage-businesses" ? (
              <Dialog
                open={isAddBusinessModalOpen}
                onOpenChange={setIsAddBusinessModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Business
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Add New Business</DialogTitle>
                    <DialogDescription>
                      Create a new business entity
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={handleAddBusinessSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="business_name">Business Name *</Label>
                      <Input
                        id="business_name"
                        value={businessFormData.name}
                        onChange={(e) =>
                          handleBusinessInputChange("name", e.target.value)
                        }
                        placeholder="Enter business name"
                        required
                        minLength={2}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum 2 characters required
                      </p>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddBusinessModalOpen(false)}
                        disabled={addBusinessMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={addBusinessMutation.isPending}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        {addBusinessMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Business
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            ) : selectedOption === "manage-users" ? (
              <Dialog
                open={isAddUserModalOpen}
                onOpenChange={setIsAddUserModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account with role and permissions
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddUserSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="user_name">Full Name *</Label>
                        <Input
                          id="user_name"
                          value={userFormData.name}
                          onChange={(e) =>
                            handleUserInputChange("name", e.target.value)
                          }
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="user_role">User Role *</Label>
                        <Select
                          value={userFormData.user_role}
                          onValueChange={(value) =>
                            handleUserInputChange("user_role", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="builder">Builder</SelectItem>
                            <SelectItem value="supervisor">
                              Supervisor
                            </SelectItem>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="user_email">Email Address *</Label>
                      <Input
                        id="user_email"
                        type="email"
                        value={userFormData.email}
                        onChange={(e) =>
                          handleUserInputChange("email", e.target.value)
                        }
                        placeholder="Enter email address"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="user_phone">Phone Number *</Label>
                      <Input
                        id="user_phone"
                        type="tel"
                        value={userFormData.phone_number}
                        onChange={(e) =>
                          handleUserInputChange("phone_number", e.target.value)
                        }
                        placeholder="Enter phone number (min 10 digits)"
                        required
                        minLength={10}
                      />
                    </div>

                    <div>
                      <Label htmlFor="user_password">Password *</Label>
                      <Input
                        id="user_password"
                        type="password"
                        value={userFormData.password}
                        onChange={(e) =>
                          handleUserInputChange("password", e.target.value)
                        }
                        placeholder="Enter password (min 6 characters)"
                        required
                        minLength={6}
                      />
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddUserModalOpen(false)}
                        disabled={addUserMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={addUserMutation.isPending}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        {addUserMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Add User
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            ) : selectedOption === "pricing-management" ? (
              <Dialog
                open={isAddPricingModalOpen}
                onOpenChange={setIsAddPricingModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={pricingPlans.length >= 3}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Plan {pricingPlans.length >= 3 && "(Max 3)"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Pricing Plan</DialogTitle>
                    <DialogDescription>
                      Create a new pricing plan with features and limits
                      (Maximum 3 plans allowed)
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddPricingSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="plan_name">Plan Name *</Label>
                        <Input
                          id="plan_name"
                          value={pricingFormData.plan}
                          onChange={(e) =>
                            handlePricingInputChange("plan", e.target.value)
                          }
                          placeholder="e.g., Starter, Professional"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="plan_status">Status *</Label>
                        <Select
                          value={pricingFormData.status}
                          onValueChange={(value) =>
                            handlePricingInputChange("status", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="monthly_price">
                          Monthly Price (₹) *
                        </Label>
                        <Input
                          id="monthly_price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={pricingFormData.monthlyPrice}
                          onChange={(e) =>
                            handlePricingInputChange(
                              "monthlyPrice",
                              e.target.value
                            )
                          }
                          placeholder="49.99"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="yearly_price">Yearly Price (₹) *</Label>
                        <Input
                          id="yearly_price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={pricingFormData.yearlyPrice}
                          onChange={(e) =>
                            handlePricingInputChange(
                              "yearlyPrice",
                              e.target.value
                            )
                          }
                          placeholder="499.99"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="max_users">Max Users *</Label>
                        <Input
                          id="max_users"
                          type="number"
                          min="1"
                          value={pricingFormData.users}
                          onChange={(e) =>
                            handlePricingInputChange("users", e.target.value)
                          }
                          placeholder="5"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="max_sites">Max Sites *</Label>
                        <Input
                          id="max_sites"
                          type="number"
                          min="1"
                          value={pricingFormData.sites}
                          onChange={(e) =>
                            handlePricingInputChange("sites", e.target.value)
                          }
                          placeholder="3"
                          required
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddPricingModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Plan
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            ) : selectedOption === "material-categories" ? (
              <Dialog
                open={isAddMaterialCategoryModalOpen}
                onOpenChange={setIsAddMaterialCategoryModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Material Category</DialogTitle>
                    <DialogDescription>
                      Create a new material category to organize your materials
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={handleAddMaterialCategorySubmit}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="category_name">Category Name *</Label>
                      <Input
                        id="category_name"
                        value={materialCategoryFormData.name}
                        onChange={(e) =>
                          handleMaterialCategoryInputChange(
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Enter category name"
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddMaterialCategoryModalOpen(false)}
                        disabled={addMaterialCategoryMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={addMaterialCategoryMutation.isPending}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        {addMaterialCategoryMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Category"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            ) : selectedOption !== "change-password" &&
              selectedOption !== "data-management" &&
              selectedOption !== "labor-wages" &&
              selectedOption !== "razorpay-management" ? (
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
              ) : data.length === 0 && selectedOption === "material-categories"
              ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No material categories found</p>
                <p className="text-sm text-gray-500">
                  No categories available at the moment
                </p>
              </div>{" "}
            </div>
          ) : data.length === 0 && selectedOption === "pricing-management" ? (
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
          />
        );
      case "manage-users":
        return (
          <ManageUsers
            data={data}
            openEditUserModal={openEditUserModal}
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

      default:
        return <div>Content not available</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
      </div>

      <div className="flex flex-col gap-6">
        {/* Sidebar */}
        <div className="grid md:grid-cols-5 gap-1 bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
          {adminOptions.map((option) => (
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
      {/* Edit User Modal */}
      <EditUser
        isEditUserModalOpen={isEditUserModalOpen}
        setIsEditUserModalOpen={setIsEditUserModalOpen}
        handleEditUserSubmit={handleEditUserSubmit}
        userFormData={userFormData}
        handleUserInputChange={handleUserInputChange}
        updateUserMutation={updateUserMutation}
      />      />
    </div>
  );
}
