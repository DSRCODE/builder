import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Edit, Trash2, Plus, Receipt, Loader2, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { useCashLogs } from "@/hooks/useCashLogs";
import { useConstructionSites } from "@/hooks/useConstructionSites";
import { useMembers } from "@/hooks/useMembers";
import DeleteExpenseDialog from "@/components/admin/DeleteExpenseDialog";
import { useTranslation } from "react-i18next";

interface Expense {
  id: number;
  site_id: number;
  created_by: number;
  category_id: number;
  date: string;
  description: string;
  recipient: string;
  amount: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  site: {
    id: number;
    site_name: string;
    address: string;
    currency: string;
    estimated_budget: string;
    location: string;
    progress: number;
    total_spent: string;
  } | null;
  category: {
    id: number;
    name: string;
  };
  creator: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    image: string;
  };
}

interface ExpensesResponse {
  status: boolean;
  message: string;
  data: Expense[];
}

interface Site {
  id: number;
  site_name: string;
  address: string;
  currency: string;
}

interface Category {
  id: number;
  name: string;
}

interface ExpenseForm {
  site_id: string;
  category_id: string;
  date: string;
  description: string;
  recipient: string;
  amount: string;
}

const ITEMS_PER_PAGE = 5;

export function Expenses() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCashLogModalOpen, setIsCashLogModalOpen] = useState(false);

  const [addFormData, setAddFormData] = useState<ExpenseForm>({
    site_id: "",
    category_id: "",
    date: new Date().toISOString().split("T")[0], // Today's date
    description: "",
    recipient: "",
    amount: "",
  });

  const [cashLogFormData, setCashLogFormData] = useState({
    user_id: "",
    site_id: "",
    date: new Date().toISOString().split("T")[0],
    amount: "",
  });

  const [editFormData, setEditFormData] = useState<ExpenseForm>({
    site_id: "",
    category_id: "",
    date: "",
    description: "",
    recipient: "",
    amount: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Cash logs functionality
  const {
    createCashLog,
    isCreating: isCreatingCashLog,
    isSuccess: cashLogSuccess,
    reset: resetCashLog,
  } = useCashLogs();

  // Fetch construction sites
  const { data: constructionSitesData, isLoading: sitesLoading } =
    useConstructionSites();

  // Fetch members for supervisor dropdown
  const {
    data: membersData,
    isLoading: membersLoading,
    error: membersError,
  } = useMembers();

  // Close cash log modal on successful submission
  useEffect(() => {
    if (cashLogSuccess && isCashLogModalOpen) {
      setTimeout(() => {
        handleCashLogModalClose();
      }, 1500); // Give time for success toast to show
    }
  }, [cashLogSuccess, isCashLogModalOpen]);

  // Handle members API errors
  useEffect(() => {
    if (membersError) {
      toast({
        title: "Error",
        description: `Failed to load members: ${membersError.message}`,
        variant: "destructive",
      });
    }
  }, [membersError, toast]);

  // Fetch expenses from API
  const {
    data: expensesData,
    isLoading,
    isError,
    error,
  } = useQuery<ExpensesResponse>({
    queryKey: ["expenses"],
    queryFn: async () => {
      const response = await api.get("/expenses");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch sites for dropdown
  const { data: sitesData } = useQuery({
    queryKey: ["construction-sites"],
    queryFn: async () => {
      const response = await api.get("/construction-sites");
      return response.data;
    },
  });

  // Mock categories - you might want to fetch these from an API too
  const categories: Category[] = [
    { id: 1, name: "Materials" },
    { id: 2, name: "Labour" },
    { id: 3, name: "Utilities" },
    { id: 4, name: "Electrical" },
    { id: 5, name: "Interior Work" },
    { id: 6, name: "Miscellaneous" },
  ];

  // Add expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: async (expenseData: ExpenseForm) => {
      const response = await api.post("/expenses", expenseData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: `${t("expens.error.suc")}`,
        description: `${t("expens.error.suc_dec")}`,
      });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setIsAddModalOpen(false);
      resetAddForm();
    },
    onError: (error: any) => {
      toast({
        title: `${t("expens.error.er")}`,
        description:
          error.response?.data?.message || `${t("expens.error.er_dec")}`,
        variant: "destructive",
      });
    },
  });

  // Update expense mutation
  const updateExpenseMutation = useMutation({
    mutationFn: async ({
      id,
      expenseData,
    }: {
      id: number;
      expenseData: ExpenseForm;
    }) => {
      const response = await api.post(`/expenses/${id}`, expenseData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: `${t("expens.error.suc")}`,
        description: `${t("expens.error.suc_dec_up")}`,
      });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setIsEditModalOpen(false);
      setEditingExpense(null);
    },
    onError: (error: any) => {
      toast({
        title: `${t("expens.error.er")}`,
        description:
          error.response?.data?.message || `${t("expens.error.er_dec_up")}`,
        variant: "destructive",
      });
    },
  });

  const expenses = expensesData?.data || [];
  const sites: Site[] = sitesData?.data || [];
  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return expenses.slice(startIndex, endIndex);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "utilities":
        return "bg-blue-100 text-blue-800";
      case "miscellaneous":
        return "bg-gray-100 text-gray-800";
      case "materials":
        return "bg-green-100 text-green-800";
      case "labour":
        return "bg-yellow-100 text-yellow-800";
      case "electrical":
        return "bg-purple-100 text-purple-800";
      case "interior work":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: string, currency?: string) => {
    const numAmount = parseFloat(amount);
    if (currency === "INR") {
      return `₹${numAmount.toLocaleString("en-IN")}`;
    }
    return `$${numAmount.toLocaleString()}`;
  };

  const handleAddInputChange = (field: keyof ExpenseForm, value: string) => {
    setAddFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditInputChange = (field: keyof ExpenseForm, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetAddForm = () => {
    setAddFormData({
      site_id: "",
      category_id: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      recipient: "",
      amount: "",
    });
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setEditFormData({
      site_id: expense.site_id.toString(),
      category_id: expense.category_id.toString(),
      date: expense.date.split("T")[0], // Format date for input
      description: expense.description,
      recipient: expense.recipient || "",
      amount: expense.amount,
    });
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !addFormData.site_id ||
      !addFormData.category_id ||
      !addFormData.description ||
      !addFormData.amount
    ) {
      toast({
        title: `${t("expens.error.val")}`,
        description: `${t("expens.error.val1")}`,
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(addFormData.amount) <= 0) {
      toast({
        title: `${t("expens.error.val")}`,
        description: `${t("expens.error.val2")}`,
        variant: "destructive",
      });
      return;
    }

    addExpenseMutation.mutate(addFormData);
  };

  // Cash log form handlers
  const handleCashLogInputChange = (
    field: keyof typeof cashLogFormData,
    value: string
  ) => {
    setCashLogFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCashLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !cashLogFormData.user_id ||
      !cashLogFormData.site_id ||
      !cashLogFormData.date ||
      !cashLogFormData.amount
    ) {
      toast({
        title: `${t("expens.error.val")}`,
        description: `${t("expens.error.val1")}`,
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(cashLogFormData.amount) <= 0) {
      toast({
        title: `${t("expens.error.val")}`,
        description: `${t("expens.error.val2")}`,
        variant: "destructive",
      });
      return;
    }

    // Show confirmation with supervisor name
    const supervisorName = getSelectedSupervisorName();
    console.log(
      `Logging ₹${cashLogFormData.amount} cash to supervisor: ${supervisorName}`
    );

    createCashLog(cashLogFormData);
  };

  // Reset cash log form when modal closes
  const handleCashLogModalClose = () => {
    setIsCashLogModalOpen(false);
    setCashLogFormData({
      user_id: "",
      site_id: "",
      date: new Date().toISOString().split("T")[0],
      amount: "",
    });
    resetCashLog();
  };

  // Helper function to get selected supervisor name
  const getSelectedSupervisorName = () => {
    if (!cashLogFormData.user_id || !membersData?.data) return "";
    const supervisor = membersData.data.find(
      (member) => member.id.toString() === cashLogFormData.user_id
    );
    return supervisor ? supervisor?.name : "";
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingExpense) return;

    // Validation
    if (
      !editFormData.site_id ||
      !editFormData.category_id ||
      !editFormData.description ||
      !editFormData.amount
    ) {
      toast({
        title: `${t("expens.error.val")}`,
        description: `${t("expens.error.val1")}`,
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(editFormData.amount) <= 0) {
      toast({
        title: `${t("expens.error.val")}`,
        description: `${t("expens.error.val2")}`,
        variant: "destructive",
      });
      return;
    }

    updateExpenseMutation.mutate({
      id: editingExpense.id,
      expenseData: editFormData,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{t("expens.loading")}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">{t("expens.err_loading")}</p>
          <p className="text-sm text-gray-600">
            {error instanceof Error
              ? error.message
              : `${t("expens.unknown_err")}`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Side: Title and Summary */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("expens.header")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t("expens.summary.total_expenses")}: {expenses.length} |{" "}
            {t("expens.summary.total_amount")}:{" "}
            {formatCurrency(
              expenses
                .reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
                .toString(),
              expenses[0]?.site?.currency || "INR"
            )}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
          {/* Log Cash to Supervisor Modal */}
          <Dialog
            open={isCashLogModalOpen}
            onOpenChange={setIsCashLogModalOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Receipt className="mr-2 h-4 w-4" />
                {t("expens.buttons.log_cash_to_supervisor")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {t("expens.buttons.log_cash_to_supervisor")}
                </DialogTitle>
                <DialogDescription>
                  {t("expens.buttons.title")}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCashLogSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cash-user-id">
                    {t("expens.form.supervisor_lable")}
                  </Label>
                  <Select
                    value={cashLogFormData.user_id}
                    onValueChange={(value) =>
                      handleCashLogInputChange("user_id", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("expens.form.supervisor_placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {membersLoading ? (
                        <SelectItem value="loading" disabled>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          {t("expens.form.supervisor_loading")}
                        </SelectItem>
                      ) : membersData?.data?.length > 0 ? (
                        membersData.data
                          .filter(
                            (member) =>
                              member.is_active === 1 && member.is_deleted === 0
                          )
                          .map((member) => (
                            <SelectItem
                              key={member.id}
                              value={member.id.toString()}
                            >
                              <div className="flex items-center space-x-2">
                                <img
                                  src={member.image}
                                  alt={member?.name ?? ""}
                                  className="w-6 h-6 rounded-full"
                                />
                                <div>
                                  <span className="font-medium">
                                    {member?.name ?? ""}
                                  </span>
                                  {member?.phone_number && (
                                    <span className="text-sm text-muted-foreground ml-2">
                                      ({member?.phone_number})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </SelectItem>
                          ))
                      ) : (
                        <SelectItem value="no-members" disabled>
                          {t("expens.form.no_supervisor")}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cash-site-id">
                    {" "}
                    {t("expens.form.construction_site")}
                  </Label>
                  <Select
                    value={cashLogFormData.site_id}
                    onValueChange={(value) =>
                      handleCashLogInputChange("site_id", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("expens.form.site_placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {sitesLoading ? (
                        <SelectItem value="loading" disabled>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          {t("expens.form.construction_loading")}
                        </SelectItem>
                      ) : constructionSitesData?.data?.length > 0 ? (
                        constructionSitesData.data.map((site) => (
                          <SelectItem key={site.id} value={site.id.toString()}>
                            {site?.site_name} - {site?.location}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-sites" disabled>
                          {t("expens.form.no_sites")}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cash-date">{t("expens.form.date")}</Label>
                  <Input
                    id="cash-date"
                    type="date"
                    value={cashLogFormData.date}
                    onChange={(e) =>
                      handleCashLogInputChange("date", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cash-amount">{t("expens.form.amount")}</Label>
                  <Input
                    id="cash-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={t("expens.form.amount_placeholder")}
                    value={cashLogFormData.amount}
                    onChange={(e) =>
                      handleCashLogInputChange("amount", e.target.value)
                    }
                    required
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCashLogModalClose}
                    disabled={isCreatingCashLog}
                  >
                    {t("expens.buttons.cancel")}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={isCreatingCashLog}
                  >
                    {isCreatingCashLog ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("expens.form.logging_cash")}
                      </>
                    ) : (
                      <>
                        <Receipt className="mr-2 h-4 w-4" />
                        {t("expens.form.log_cash")}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Add New Expense Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-2 h-4 w-4" />
                {t("expens.buttons.add_new_expense")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {" "}
                  {t("expens.buttons.add_new_expense")}
                </DialogTitle>
                <DialogDescription>
                  {t("expens.buttons.title2")}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                {/* Site Selection */}
                <div>
                  <Label htmlFor="site"> {t("expens.form.site")}</Label>
                  <Select
                    value={addFormData.site_id}
                    onValueChange={(value) =>
                      handleAddInputChange("site_id", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("expens.form.site_placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id.toString()}>
                          {site.site_name} - {site.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Selection */}
                <div>
                  <Label htmlFor="category">{t("expens.form.category")}</Label>
                  <Select
                    value={addFormData.category_id}
                    onValueChange={(value) =>
                      handleAddInputChange("category_id", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("expens.form.category_placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category?.name ?? ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div>
                  <Label htmlFor="date">{t("expens.form.date")}</Label>
                  <Input
                    id="date"
                    type="date"
                    value={addFormData.date}
                    onChange={(e) =>
                      handleAddInputChange("date", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">{t("expens.form.desc")}</Label>
                  <Textarea
                    id="description"
                    placeholder={t("expens.form.desc_placeholder")}
                    value={addFormData.description}
                    onChange={(e) =>
                      handleAddInputChange("description", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Recipient */}
                <div>
                  <Label htmlFor="recipient">{t("expens.form.recp")}</Label>
                  <Input
                    id="recipient"
                    placeholder={t("expens.form.recp_label")}
                    value={addFormData.recipient}
                    onChange={(e) =>
                      handleAddInputChange("recipient", e.target.value)
                    }
                  />
                </div>

                {/* Amount */}
                <div>
                  <Label htmlFor="amount">{t("expens.form.amount")}</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={t("expens.form.amount_placeholder")}
                    value={addFormData.amount}
                    onChange={(e) =>
                      handleAddInputChange("amount", e.target.value)
                    }
                    required
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                    disabled={addExpenseMutation.isPending}
                  >
                    {t("expens.buttons.cancel")}
                  </Button>
                  <Button type="submit" disabled={addExpenseMutation.isPending}>
                    {addExpenseMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t("expens.buttons.adding")}
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        {t("expens.buttons.add_exp")}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-orange-500" />
            <div>
              <CardTitle> {t("expens.expense_log.title")}</CardTitle>
              <CardDescription>
                {t("expens.expense_log.subtitle")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {t("expens.expense_log.no_exp_found")}
              </p>
              <p className="text-sm text-gray-500">
                {t("expens.expense_log.add_first_expense")}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block rounded-md border">
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead> {t("expens.table_headers.date")}</TableHead>
                        <TableHead>{t("expens.table_headers.site")}</TableHead>
                        <TableHead>
                          {t("expens.table_headers.category")}
                        </TableHead>
                        <TableHead>
                          {t("expens.table_headers.description")}
                        </TableHead>
                        <TableHead>
                          {t("expens.table_headers.recipient")}
                        </TableHead>
                        <TableHead>
                          {t("expens.table_headers.created_by")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("expens.table_headers.amount")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("expens.table_headers.actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCurrentPageData().map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell className="font-medium">
                            {formatDate(expense.date)}
                          </TableCell>
                          <TableCell>
                            {expense.site ? (
                              <div>
                                <span className="text-blue-600 font-medium">
                                  {expense?.site?.site_name}
                                </span>
                                <p className="text-xs text-gray-500">
                                  {expense.site.address}
                                </p>
                              </div>
                            ) : (
                              <span className="text-gray-400">
                                {t("expens.status.no_site_assigned")}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={getCategoryColor(
                                expense?.category?.name
                              )}
                            >
                              {expense?.category?.name ?? ""}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <p
                                className="truncate"
                                title={expense.description}
                              >
                                {expense.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {expense.recipient || "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <img
                                src={expense.creator.image}
                                alt={expense?.creator?.name ?? ""}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-sm">
                                {expense?.creator?.name ?? ""}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(
                              expense.amount,
                              expense.site?.currency || "INR"
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              {/* Edit Expense Modal */}
                              <Dialog
                                open={
                                  isEditModalOpen &&
                                  editingExpense?.id === expense.id
                                }
                                onOpenChange={(open) => {
                                  if (!open) {
                                    setIsEditModalOpen(false);
                                    setEditingExpense(null);
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditModal(expense)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>
                                      {" "}
                                      {t("expens.buttons.edit_exp")}
                                    </DialogTitle>
                                    <DialogDescription>
                                      {t("expens.buttons.edit_exp_details")}{" "}
                                      {expense?.description}
                                    </DialogDescription>
                                  </DialogHeader>

                                  <form
                                    onSubmit={handleEditSubmit}
                                    className="space-y-4"
                                  >
                                    {/* Site Selection */}
                                    <div>
                                      <Label htmlFor="edit-site">
                                        {t("expens.form.site")}{" "}
                                      </Label>
                                      <Select
                                        value={editFormData.site_id}
                                        onValueChange={(value) =>
                                          handleEditInputChange(
                                            "site_id",
                                            value
                                          )
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue
                                            placeholder={t(
                                              "expens.form.site_placeholder"
                                            )}
                                          />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {sites.map((site) => (
                                            <SelectItem
                                              key={site.id}
                                              value={site.id.toString()}
                                            >
                                              {site?.site_name} - {site?.address}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* Category Selection */}
                                    <div>
                                      <Label htmlFor="edit-category">
                                        {t("expens.form.category")}
                                      </Label>
                                      <Select
                                        value={editFormData.category_id}
                                        onValueChange={(value) =>
                                          handleEditInputChange(
                                            "category_id",
                                            value
                                          )
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue
                                            placeholder={t(
                                              "expens.form.category_placeholder"
                                            )}
                                          />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {categories.map((category) => (
                                            <SelectItem
                                              key={category.id}
                                              value={category.id.toString()}
                                            >
                                              {category?.name ?? ""}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* Date */}
                                    <div>
                                      <Label htmlFor="edit-date">
                                        {t("expens.form.date")}
                                      </Label>
                                      <Input
                                        id="edit-date"
                                        type="date"
                                        value={editFormData.date}
                                        onChange={(e) =>
                                          handleEditInputChange(
                                            "date",
                                            e.target.value
                                          )
                                        }
                                        required
                                      />
                                    </div>

                                    {/* Description */}
                                    <div>
                                      <Label htmlFor="edit-description">
                                        {t("expens.form.desc")}
                                      </Label>
                                      <Textarea
                                        id="edit-description"
                                        placeholder={t(
                                          "expens.form.desc_placeholder"
                                        )}
                                        value={editFormData.description}
                                        onChange={(e) =>
                                          handleEditInputChange(
                                            "description",
                                            e.target.value
                                          )
                                        }
                                        required
                                      />
                                    </div>

                                    {/* Recipient */}
                                    <div>
                                      <Label htmlFor="edit-recipient">
                                        {t("expens.form.recp")}
                                      </Label>
                                      <Input
                                        id="edit-recipient"
                                        placeholder={t(
                                          "expens.form.recp_label"
                                        )}
                                        value={editFormData.recipient}
                                        onChange={(e) =>
                                          handleEditInputChange(
                                            "recipient",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>

                                    {/* Amount */}
                                    <div>
                                      <Label htmlFor="edit-amount">
                                        {" "}
                                        {t("expens.form.amount")}
                                      </Label>
                                      <Input
                                        id="edit-amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder={t(
                                          "expens.form.amount_placeholder"
                                        )}
                                        value={editFormData.amount}
                                        onChange={(e) =>
                                          handleEditInputChange(
                                            "amount",
                                            e.target.value
                                          )
                                        }
                                        required
                                      />
                                    </div>

                                    <DialogFooter>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                          setIsEditModalOpen(false)
                                        }
                                        disabled={
                                          updateExpenseMutation.isPending
                                        }
                                      >
                                        {t("expens.buttons.cancel")}
                                      </Button>
                                      <Button
                                        type="submit"
                                        disabled={
                                          updateExpenseMutation.isPending
                                        }
                                      >
                                        {updateExpenseMutation.isPending ? (
                                          <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            {t("expens.buttons.updating")}
                                          </>
                                        ) : (
                                          <>
                                            <Edit className="h-4 w-4 mr-2" />
                                            {t("expens.buttons.update_expens")}
                                          </>
                                        )}
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </DialogContent>
                              </Dialog>

                              <DeleteExpenseDialog
                                expenseId={expense.id}
                                expenseDescription={expense.description}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="hidden md:block mt-4  items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, expenses.length)} of{" "}
                  {expenses.length} entries
                </p>
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(Math.max(1, currentPage - 1));
                          }}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === i + 1}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(i + 1);
                            }}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            );
                          }}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
              {/* Mobile View */}
              <div className="md:hidden space-y-4grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {getCurrentPageData().map((expense) => (
                  <div
                    key={expense.id}
                    className="border rounded-lg p-4 shadow-sm bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(expense.date)}
                        </p>
                        <h2 className="text-lg font-semibold">
                          {expense?.site?.site_name ||
                            t("expens.status.no_site_assigned")}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {expense?.site?.address}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={getCategoryColor(expense?.category?.name)}
                      >
                        {expense?.category?.name ?? ""}
                      </Badge>
                    </div>

                    <div className="mt-3">
                      <p
                        className="text-sm font-medium truncate"
                        title={expense.description}
                      >
                        {expense.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("expens.form.recp")}: {expense.recipient || "N/A"}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <img
                        src={expense.creator.image}
                        alt={expense?.creator?.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{expense?.creator?.name}</span>
                    </div>

                    <div className="mt-3 flex justify-between items-center font-bold">
                      <span className="text-left">Amount</span>
                      <span className="text-right">
                        {formatCurrency(
                          expense.amount,
                          expense.site?.currency || "INR"
                        )}
                      </span>
                    </div>

                    <div className="mt-3 flex justify-end gap-2">
                      {/* Edit Modal Trigger */}
                      <Dialog
                        open={
                          isEditModalOpen && editingExpense?.id === expense.id
                        }
                        onOpenChange={(open) => {
                          if (!open) {
                            setIsEditModalOpen(false);
                            setEditingExpense(null);
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(expense)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        {/* Reuse your DialogContent component here */}
                      </Dialog>

                      {/* Delete Dialog */}
                      <DeleteExpenseDialog
                        expenseId={expense.id}
                        expenseDescription={expense.description}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
