import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Filter,
  Download,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConstructionSites } from "@/hooks/useConstructionSites";
import { useWeeklyPayouts } from "@/hooks/useWeeklyPayouts";
import { useMembers } from "@/hooks/useMembers";
import { useMaterialCosts } from "@/hooks/useMaterialCosts";
import { useSupervisorFlow } from "@/hooks/useSupervisorFlow";
import { useDetailedLogs } from "@/hooks/useDetailedLogs";
import { getRoleName } from "@/utils/roleUtils";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function Reports() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL parameters or localStorage, with fallbacks
  const getInitialTab = () => {
    return (
      searchParams.get("tab") ||
      localStorage.getItem("reports-active-tab") ||
      "weekly-payouts"
    );
  };

  const getInitialFilters = () => {
    const urlFilters = {
      site:
        searchParams.get("site") ||
        localStorage.getItem("reports-filter-site") ||
        "all",
      startDate:
        searchParams.get("startDate") ||
        localStorage.getItem("reports-filter-startDate") ||
        "2025-07-01",
      endDate:
        searchParams.get("endDate") ||
        localStorage.getItem("reports-filter-endDate") ||
        "2025-07-31",
      supervisor:
        searchParams.get("supervisor") ||
        localStorage.getItem("reports-filter-supervisor") ||
        "all",
    };
    return urlFilters;
  };
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [filters, setFilters] = useState(getInitialFilters);

  // Fetch construction sites using the API
  const {
    data: constructionSitesData,
    isLoading: sitesLoading,
    error: sitesError,
  } = useConstructionSites();
  // Fetch members/users for the supervisor filter
  const {
    data: membersData,
    isLoading: membersLoading,
    error: membersError,
  } = useMembers();
  // Handle API errors
  useEffect(() => {
    if (sitesError) {
      toast.error(`Failed to load construction sites: ${sitesError.message}`);
    }
  }, [sitesError]);

  // Handle members API errors
  useEffect(() => {
    if (membersError) {
      toast.error(`Failed to load members: ${membersError.message}`);
    }
  }, [membersError]);

  // Fetch weekly payouts data
  const {
    data: weeklyPayoutsData,
    isLoading: payoutsLoading,
    error: payoutsError,
  } = useWeeklyPayouts({
    business_id: "1", // You might want to get this from context or props
    start_date: filters.startDate,
    end_date: filters.endDate,
    site_id: filters.site !== "all" ? filters.site : undefined,
    supervisor_id:
      filters.supervisor !== "all" ? filters.supervisor : undefined,
  });
  // Fetch material costs data
  const {
    data: materialCostsData,
    isLoading: materialCostsLoading,
    error: materialCostsError,
  } = useMaterialCosts({
    business_id: "1", // You might want to get this from context or props
    start_date: filters.startDate,
    end_date: filters.endDate,
    site_id: filters.site !== "all" ? filters.site : undefined,
  });
  // Fetch supervisor flow data
  const {
    data: supervisorFlowData,
    isLoading: supervisorFlowLoading,
    error: supervisorFlowError,
  } = useSupervisorFlow({
    supervisor_id: filters.supervisor !== "all" ? filters.supervisor : "3", // Default to supervisor ID 3
    start_date: filters.startDate,
    end_date: filters.endDate,
    business_id: "1", // You might want to get this from context or props
    site_id: filters.site !== "all" ? filters.site : undefined,
  });

  // Fetch detailed logs data
  const {
    data: detailedLogsData,
    isLoading: detailedLogsLoading,
    error: detailedLogsError,
  } = useDetailedLogs({
    business_id: "1", // You might want to get this from context or props
    site_id: filters.site !== "all" ? filters.site : "2", // Default to site ID 2
    start_date: filters.startDate,
    end_date: filters.endDate,
    supervisor_id:
      filters.supervisor !== "all" ? filters.supervisor : undefined,
  });

  // Handle material costs API errors  // Handle material costs API errors
  useEffect(() => {
    if (materialCostsError) {
      toast.error(
        `Failed to load material costs: ${materialCostsError.message}`
      );
    }
  }, [materialCostsError]);

  // Handle supervisor flow API errors
  useEffect(() => {
    if (supervisorFlowError) {
      toast.error(
        `Failed to load supervisor flow: ${supervisorFlowError.message}`
      );
    }
  }, [supervisorFlowError]);

  // Handle detailed logs API errors
  useEffect(() => {
    if (detailedLogsError) {
      toast.error(`Failed to load detailed logs: ${detailedLogsError.message}`);
    }
  }, [detailedLogsError]);

  // Handle weekly payouts API errors
  useEffect(() => {
    if (payoutsError) {
      toast.error(`Failed to load weekly payouts: ${payoutsError.message}`);
    }
  }, [payoutsError]);

  // Persist active tab to URL and localStorage
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("tab", activeTab);
    setSearchParams(newSearchParams, { replace: true });
    localStorage.setItem("reports-active-tab", activeTab);
  }, [activeTab, searchParams, setSearchParams]);

  // Persist filters to URL and localStorage
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      newSearchParams.set(key, value);
      localStorage.setItem(`reports-filter-${key}`, value);
    });
    setSearchParams(newSearchParams, { replace: true });
  }, [filters, searchParams, setSearchParams]);

  const summaryStats = {
    totalWages: weeklyPayoutsData?.data?.summary?.total_labor_wages || 0,
    totalAdvances: parseFloat(
      weeklyPayoutsData?.data?.summary?.total_advances_paid || "0"
    ),
    netPayout: weeklyPayoutsData?.data?.summary?.net_payout || 0,
  };

  // Export function for weekly payouts data
  const exportWeeklyPayouts = () => {
    if (!weeklyPayoutsData?.data?.weekly_breakdown) {
      toast.error("No data available to export");
      return;
    }

    const csvContent = [
      // CSV Header
      ["Week Period", "Total Wages", "Total Advances", "Net Payout"].join(","),
      // CSV Data
      ...weeklyPayoutsData.data.weekly_breakdown.map((week) =>
        [
          `"${new Date(week.week_start).toLocaleDateString()} - ${new Date(
            week.week_end
          ).toLocaleDateString()}"`,
          week.total_wages,
          typeof week.total_advances === "string"
            ? parseFloat(week.total_advances)
            : week.total_advances,
          week.net_payout,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `weekly-payouts-${filters.startDate}-to-${filters.endDate}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Weekly payouts data exported successfully");
  };

  // Export function for material costs data
  const exportMaterialCosts = () => {
    if (
      !materialCostsData?.data?.categories ||
      materialCostsData.data.categories.length === 0
    ) {
      toast.error("No material costs data available to export");
      return;
    }

    // Flatten all items from all categories
    const allItems = materialCostsData.data.categories.flatMap((category) =>
      category.items.map((item) => {
        const site = materialCostsData.data.sites.find(
          (s) => s.id === item.site_id
        );
        return {
          ...item,
          site_name: site?.site_name || "Unknown Site",
          category_name: item.category.name,
        };
      })
    );

    const csvContent = [
      // CSV Header
      [
        "Date",
        "Material Name",
        "Category",
        "Quantity",
        "Unit",
        "Amount Spent",
        "Site Name",
      ].join(","),
      // CSV Data
      ...allItems.map((item) =>
        [
          `"${new Date(item.date_added).toLocaleDateString()}"`,
          `"${item.material_name}"`,
          `"${item.category_name}"`,
          parseFloat(item.quantity),
          `"${item.unit}"`,
          parseFloat(item.amount_spent),
          `"${item.site_name}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `material-costs-${filters.startDate}-to-${filters.endDate}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Material costs data exported successfully");
  };
  // Export function for supervisor flow data
  const exportSupervisorFlow = () => {
    if (
      !supervisorFlowData?.data?.supervisor_details ||
      supervisorFlowData.data.supervisor_details.length === 0
    ) {
      toast.error("No supervisor flow data available to export");
      return;
    }

    // Flatten all transactions from all supervisors
    const allTransactions = supervisorFlowData.data.supervisor_details.flatMap(
      (supervisor) =>
        supervisor.transactions.map((transaction) => ({
          supervisor_name: supervisor.supervisor_name,
          supervisor_email: supervisor.supervisor_email,
          date: transaction.date,
          site: transaction.site,
          amount: parseFloat(transaction.amount),
          description: transaction.description,
          total_cash_in: supervisor.total_cash_in,
          total_expenses: supervisor.total_expenses,
          net_balance: supervisor.net_balance,
        }))
    );

    const csvContent = [
      // CSV Header
      [
        "Date",
        "Supervisor Name",
        "Supervisor Email",
        "Site",
        "Amount",
        "Description",
        "Total Cash In",
        "Total Expenses",
        "Net Balance",
      ].join(","),
      // CSV Data
      ...allTransactions.map((transaction) =>
        [
          `"${new Date(transaction.date).toLocaleDateString()}"`,
          `"${transaction.supervisor_name}"`,
          `"${transaction.supervisor_email}"`,
          `"${transaction.site}"`,
          transaction.amount,
          `"${transaction.description}"`,
          transaction.total_cash_in,
          transaction.total_expenses,
          transaction.net_balance,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `supervisor-flow-${filters.startDate}-to-${filters.endDate}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Supervisor flow data exported successfully");
  };

  // Export function for detailed logs data
  const exportDetailedLogs = () => {
    if (
      !detailedLogsData?.data?.logs ||
      detailedLogsData.data.logs.length === 0
    ) {
      toast.error("No detailed logs data available to export");
      return;
    }

    const csvContent = [
      // CSV Header
      [
        "Date",
        "Type",
        "Site",
        "Name",
        "Category",
        "Quantity",
        "Unit",
        "Amount Spent",
      ].join(","),
      // CSV Data
      ...detailedLogsData.data.logs.map((log) =>
        [
          `"${new Date(log.date).toLocaleDateString()}"`,
          `"${log.type.charAt(0).toUpperCase() + log.type.slice(1)}"`,
          `"${log.site}"`,
          `"${log.name}"`,
          `"${log.category || "N/A"}"`,
          log.quantity || "N/A",
          `"${log.unit || "N/A"}"`,
          parseFloat(log.amount_spent),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `detailed-logs-${filters.startDate}-to-${filters.endDate}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Detailed logs data exported successfully");
  };

  // Refresh function to reload data
  const refreshData = () => {
    // Force refetch while preserving current state (tab and filters)
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {t("report.title")}
        </h1>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle> {t("report.filter.title")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="site">{t("report.filter.site")}</Label>
              <Select
                value={filters.site}
                onValueChange={(value) =>
                  setFilters({ ...filters, site: value })
                }
                disabled={sitesLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      sitesLoading
                        ? `${t("report.filter.loading_site")}`
                        : `${t("report.filter.all_sites")}`
                    }
                  />
                  {sitesLoading && (
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("report.filter.all_sites")}
                  </SelectItem>
                  {constructionSitesData?.success &&
                    constructionSitesData.data?.map((site) => (
                      <SelectItem key={site.id} value={site.id.toString()}>
                        {site.site_name} - {site.location}
                      </SelectItem>
                    ))}

                  {sitesError && (
                    <SelectItem value="error" disabled>
                      {t("report.filter.err")}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="start-date">{t("report.filter.s_date")}</Label>
              <Input
                id="start-date"
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="end-date">{t("report.filter.e_date")}</Label>
              <Input
                id="end-date"
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="supervisor">{t("report.filter.user")}</Label>
              <Select
                value={filters.supervisor}
                onValueChange={(value) =>
                  setFilters({ ...filters, supervisor: value })
                }
                disabled={membersLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      membersLoading
                        ? `${t("report.filter.loading_user")}`
                        : `${t("report.filter.all_user")}`
                    }
                  />
                  {membersLoading && (
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("report.filter.all_user")}
                  </SelectItem>
                  {membersData?.success &&
                    membersData.data?.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.name} - {getRoleName(member.user_role_id)}
                      </SelectItem>
                    ))}

                  {membersError && (
                    <SelectItem value="error" disabled>
                      {t("report.filter.err_user")}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weekly-payouts">
            {t("report.weekly_payout.header")}
          </TabsTrigger>
          <TabsTrigger value="material-costs">
            {t("report.material_cost.header")}
          </TabsTrigger>
          <TabsTrigger value="supervisor-flow">
            {t("report.supervisor_flow.header")}
          </TabsTrigger>
          <TabsTrigger value="detailed-logs">
            {t("report.detailed_logs.header")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly-payouts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle> {t("report.weekly_payout.title")}</CardTitle>
                    <CardDescription>
                      {t("report.weekly_payout.subtitle")}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={exportWeeklyPayouts}
                  disabled={
                    payoutsLoading || !weeklyPayoutsData?.data?.weekly_breakdown
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("report.export_report")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("report.weekly_payout.total_labor_wage")}
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      ₹{summaryStats.totalWages.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("report.weekly_payout.total_advance_paid")}
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      ₹{summaryStats.totalAdvances.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("report.weekly_payout.net_payout")}
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      ₹{summaryStats.netPayout.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Weekly Data Table */}
              {payoutsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    {t("report.weekly_payout.loading")}
                  </p>
                </div>
              ) : weeklyPayoutsData?.data?.weekly_breakdown &&
                weeklyPayoutsData.data.weekly_breakdown.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {t("report.weekly_payout.week_period")}
                      </TableHead>
                      <TableHead className="text-right">
                        {" "}
                        {t("report.weekly_payout.total_wage")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("report.weekly_payout.total_advanve")}
                      </TableHead>
                      <TableHead className="text-right">
                        {" "}
                        {t("report.weekly_payout.net_payot")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeklyPayoutsData.data.weekly_breakdown.map(
                      (week, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {new Date(week.week_start).toLocaleDateString()} -{" "}
                            {new Date(week.week_end).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{week.total_wages.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹
                            {(typeof week.total_advances === "string"
                              ? parseFloat(week.total_advances)
                              : week.total_advances
                            ).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{week.net_payout.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t("report.weekly_payout.no_payout_data")}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t("report.weekly_payout.no_weekly_payout")}
                  </p>
                  <div className="text-sm text-gray-500 space-y-1 mb-4">
                    <p> {t("report.weekly_payout.p1")}</p>
                    <p> {t("report.weekly_payout.p2")}</p>
                    <p> {t("report.weekly_payout.p3")}</p>
                  </div>
                  <Button variant="outline" onClick={refreshData} size="sm">
                    {t("report.weekly_payout.refreh_data_btn")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="material-costs">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  <div>
                    <CardTitle>{t("report.material_cost.title")}</CardTitle>
                    <CardDescription>
                      {t("report.material_cost.subtitle")}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={exportMaterialCosts}
                  disabled={
                    materialCostsLoading ||
                    !materialCostsData?.data?.categories ||
                    materialCostsData.data.categories.length === 0
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("report.export_report")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-orange-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("report.material_cost.total_material_cost")}
                    </p>
                    <p className="text-3xl font-bold text-orange-600">
                      ₹
                      {materialCostsData?.data?.total_spent?.toLocaleString() ||
                        0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {filters.startDate} to {filters.endDate}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("report.material_cost.total_item")}
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {materialCostsData?.data?.categories?.reduce(
                        (total, category) => total + category.items.length,
                        0
                      ) || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("report.material_cost.material_entry")}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("report.material_cost.avg_cost")}
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      ₹
                      {(() => {
                        const totalItems =
                          materialCostsData?.data?.categories?.reduce(
                            (total, category) => total + category.items.length,
                            0
                          ) || 0;
                        const totalSpent =
                          materialCostsData?.data?.total_spent || 0;
                        return totalItems > 0
                          ? Math.round(totalSpent / totalItems).toLocaleString()
                          : 0;
                      })()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("report.material_cost.per_material_item")}
                    </p>
                  </CardContent>
                </Card>
                {/* Mini Pie Chart Card */}
                <Card className="bg-purple-50">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground text-center mb-2">
                      {t("report.material_cost.cost_dist")}
                    </p>
                    <div className="h-24 mb-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={
                              materialCostsData?.data?.categories?.map(
                                (category, index) => ({
                                  name: category.category_name,
                                  value: category.total_spent,
                                })
                              ) || []
                            }
                            cx="50%"
                            cy="50%"
                            innerRadius={15}
                            outerRadius={35}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {materialCostsData?.data?.categories?.map(
                              (category, index) => (
                                <Cell
                                  key={`mini-cell-${index}`}
                                  fill={`hsl(${
                                    (index * 137.5) % 360
                                  }, 70%, 50%)`}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => [
                              `₹${value.toLocaleString()}`,
                              "Amount",
                            ]}
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #ccc",
                              borderRadius: "6px",
                              fontSize: "12px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      {materialCostsData?.data?.categories?.length || 0}{" "}
                      {t("report.material_cost.categories")}
                    </p>
                  </CardContent>
                </Card>{" "}
              </div>

              {/* Material Costs Data */}
              {materialCostsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    {t("report.material_cost.loading_material_cost")}
                  </p>
                </div>
              ) : materialCostsData?.data?.categories &&
                materialCostsData.data.categories.length > 0 ? (
                <div className="space-y-6">
                  {/* Material Costs Pie Chart */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {t("report.material_cost.material_cost_dist")}
                    </h3>
                    <Card>
                      <CardContent className="p-6">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={materialCostsData.data.categories.map(
                                  (category, index) => ({
                                    name: category.category_name,
                                    value: category.total_spent,
                                    count: category.items.length,
                                    color: `hsl(${
                                      (index * 137.5) % 360
                                    }, 70%, 50%)`,
                                  })
                                )}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                  `${name} ${(percent * 100).toFixed(1)}%`
                                }
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {materialCostsData.data.categories.map(
                                  (category, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={`hsl(${
                                        (index * 137.5) % 360
                                      }, 70%, 50%)`}
                                    />
                                  )
                                )}
                              </Pie>
                              <Tooltip
                                formatter={(
                                  value: number,
                                  name: string,
                                  props: any
                                ) => [`₹${value.toLocaleString()}`, name]}
                                labelFormatter={(label: string) =>
                                  `Category: ${label}`
                                }
                                contentStyle={{
                                  backgroundColor: "white",
                                  border: "1px solid #ccc",
                                  borderRadius: "6px",
                                  boxShadow:
                                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                              />
                              <Legend
                                formatter={(value: string, entry: any) => (
                                  <span style={{ color: entry.color }}>
                                    {value} (₹
                                    {entry.payload.value.toLocaleString()})
                                  </span>
                                )}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Chart Summary */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {materialCostsData.data.categories.map(
                            (category, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                              >
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{
                                    backgroundColor: `hsl(${
                                      (index * 137.5) % 360
                                    }, 70%, 50%)`,
                                  }}
                                ></div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    {category.category_name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    ₹{category.total_spent.toLocaleString()} •{" "}
                                    {category.items.length} items
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-semibold">
                                    {(
                                      (category.total_spent /
                                        materialCostsData.data.total_spent) *
                                      100
                                    ).toFixed(1)}
                                    %
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  {/* Categories Overview */} {/* Categories Overview */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {t("report.material_cost.cost_by_category")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {materialCostsData.data.categories.map(
                        (category, index) => (
                          <Card
                            key={index}
                            className="border-l-4 border-l-orange-500"
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">
                                  {category.category_name}
                                </h4>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {category.items.length} items
                                </span>
                              </div>
                              <p className="text-2xl font-bold text-orange-600">
                                ₹{category.total_spent.toLocaleString()}
                              </p>
                            </CardContent>
                          </Card>
                        )
                      )}
                    </div>
                  </div>
                  {/* Detailed Items Table */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {t("report.material_cost.material_item")}
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            {" "}
                            {t("report.material_cost.date")}
                          </TableHead>
                          <TableHead>
                            {" "}
                            {t("report.material_cost.material_name")}
                          </TableHead>
                          <TableHead>
                            {" "}
                            {t("report.material_cost.category")}
                          </TableHead>
                          <TableHead>
                            {" "}
                            {t("report.material_cost.site")}
                          </TableHead>
                          <TableHead className="text-right">
                            {" "}
                            {t("report.material_cost.quantity")}
                          </TableHead>
                          <TableHead className="text-right">
                            {t("report.material_cost.amt_spent")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {materialCostsData.data.categories.flatMap((category) =>
                          category.items.map((item, index) => {
                            const site = materialCostsData.data.sites.find(
                              (s) => s.id === item.site_id
                            );
                            return (
                              <TableRow
                                key={`${category.category_name}-${index}`}
                              >
                                <TableCell className="font-medium">
                                  {new Date(
                                    item.date_added
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{item.material_name}</TableCell>
                                <TableCell>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                                    {item.category.name}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  {site?.site_name || "Unknown Site"}
                                </TableCell>
                                <TableCell className="text-right">
                                  {parseFloat(item.quantity).toLocaleString()}{" "}
                                  {item.unit}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  ₹
                                  {parseFloat(
                                    item.amount_spent
                                  ).toLocaleString()}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t("report.material_cost.no_material_data")}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t("report.material_cost.no_material_cost")}
                  </p>
                  <div className="text-sm text-gray-500 space-y-1 mb-4">
                    <p>{t("report.material_cost.m1")}</p>
                    <p>{t("report.material_cost.m2")}</p>
                    <p>{t("report.material_cost.m3")}</p>
                  </div>
                  <Button variant="outline" onClick={refreshData} size="sm">
                    {t("report.material_cost.refre_mdata")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supervisor-flow">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <CardTitle>{t("report.supervisor_flow.title")}</CardTitle>
                    <CardDescription>
                      {t("report.supervisor_flow.subtitle")}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={exportSupervisorFlow}
                  disabled={
                    supervisorFlowLoading ||
                    !supervisorFlowData?.data?.supervisor_details ||
                    supervisorFlowData.data.supervisor_details.length === 0
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("report.export_report")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-green-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("report.supervisor_flow.total_cash_in")}
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      ₹
                      {supervisorFlowData?.data?.summary?.total_cash_in?.toLocaleString() ||
                        0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {filters.startDate} to {filters.endDate}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("report.supervisor_flow.total_expens")}
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      ₹
                      {supervisorFlowData?.data?.summary?.total_expenses?.toLocaleString() ||
                        0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("report.supervisor_flow.outgoing_payment")}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("report.supervisor_flow.net_balance")}
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      ₹
                      {supervisorFlowData?.data?.summary?.net_balance?.toLocaleString() ||
                        0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("report.supervisor_flow.current_balance")}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Supervisor Flow Data */}
              {supervisorFlowLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    {t("report.supervisor_flow.loading_supervisore")}
                  </p>
                </div>
              ) : supervisorFlowData?.data?.supervisor_details &&
                supervisorFlowData.data.supervisor_details.length > 0 ? (
                <div className="space-y-6">
                  {/* Supervisor Details */}
                  {supervisorFlowData.data.supervisor_details.map(
                    (supervisor, index) => (
                      <Card
                        key={index}
                        className="border-l-4 border-l-green-500"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 font-semibold text-sm">
                                  {supervisor.supervisor_name
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {supervisor.supervisor_name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {supervisor.supervisor_email}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                {t("report.supervisor_flow.net_balance")}
                              </p>
                              <p className="text-xl font-bold text-green-600">
                                ₹{supervisor.net_balance.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {/* Supervisor Summary */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                {t("report.supervisor_flow.cash_in")}
                              </p>
                              <p className="text-lg font-semibold text-green-600">
                                ₹{supervisor.total_cash_in.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                {t("report.supervisor_flow.expenses")}
                              </p>
                              <p className="text-lg font-semibold text-red-600">
                                ₹{supervisor.total_expenses.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                {t("report.supervisor_flow.transaction")}
                              </p>
                              <p className="text-lg font-semibold text-blue-600">
                                {supervisor.transactions.length}
                              </p>
                            </div>
                          </div>

                          {/* Transactions Table */}
                          {supervisor.transactions.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-3">
                                {t(
                                  "report.supervisor_flow.recent_trancsaction"
                                )}
                              </h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>
                                      {" "}
                                      {t("report.supervisor_flow.date")}
                                    </TableHead>
                                    <TableHead>
                                      {" "}
                                      {t("report.supervisor_flow.site")}
                                    </TableHead>
                                    <TableHead>
                                      {" "}
                                      {t("report.supervisor_flow.desc")}
                                    </TableHead>
                                    <TableHead className="text-right">
                                      {t("report.supervisor_flow.amt")}
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {supervisor.transactions.map(
                                    (transaction, txIndex) => (
                                      <TableRow key={txIndex}>
                                        <TableCell className="font-medium">
                                          {new Date(
                                            transaction.date
                                          ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                          {transaction.site}
                                        </TableCell>
                                        <TableCell>
                                          <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                              transaction.description
                                                .toLowerCase()
                                                .includes("received")
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                          >
                                            {transaction.description}
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                          <span
                                            className={
                                              transaction.description
                                                .toLowerCase()
                                                .includes("received")
                                                ? "text-green-600"
                                                : "text-red-600"
                                            }
                                          >
                                            ₹
                                            {parseFloat(
                                              transaction.amount
                                            ).toLocaleString()}
                                          </span>
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t("report.supervisor_flow.no_supervisore_data")}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t("report.supervisor_flow.no_supervisor_flow")}
                  </p>
                  <div className="text-sm text-gray-500 space-y-1 mb-4">
                    <p>{t("report.supervisor_flow.s1")}</p>
                    <p>{t("report.supervisor_flow.s2")}</p>
                    <p>{t("report.supervisor_flow.s3")}</p>
                  </div>
                  <Button variant="outline" onClick={refreshData} size="sm">
                    {t("report.supervisor_flow.s_refresdata")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed-logs">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-purple-600" />
                  <div>
                    <CardTitle> {t("report.detailed_logs.title")}</CardTitle>
                    <CardDescription>
                      {t("report.detailed_logs.title")}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={exportDetailedLogs}
                  disabled={
                    detailedLogsLoading ||
                    !detailedLogsData?.data?.logs ||
                    detailedLogsData.data.logs.length === 0
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("report.export_report")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                <Card className="bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("report.supervisor_flow.labor_card")}
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {detailedLogsData?.data?.summary?.labor_entries || 0}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-orange-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("report.supervisor_flow.material_entry")}
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {detailedLogsData?.data?.summary?.material_entries || 0}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("report.supervisor_flow.advance_entry")}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {detailedLogsData?.data?.summary?.advance_entries || 0}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-100">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {" "}
                      {t("report.supervisor_flow.total_labor")}
                    </p>
                    <p className="text-xl font-bold text-blue-700">
                      ₹
                      {detailedLogsData?.data?.summary?.total_labor?.toLocaleString() ||
                        0}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-orange-100">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("report.supervisor_flow.total_material")}
                    </p>
                    <p className="text-xl font-bold text-orange-700">
                      ₹
                      {detailedLogsData?.data?.summary?.total_materials?.toLocaleString() ||
                        0}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-green-100">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("report.supervisor_flow.total_advance")}
                    </p>
                    <p className="text-xl font-bold text-green-700">
                      ₹
                      {detailedLogsData?.data?.summary?.total_advances?.toLocaleString() ||
                        0}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Logs Data */}
              {detailedLogsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    {t("report.supervisor_flow.detaile_log_loading")}
                  </p>
                </div>
              ) : detailedLogsData?.data?.logs &&
                detailedLogsData.data.logs.length > 0 ? (
                <div className="space-y-6">
                  {/* Logs Table */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {t("report.supervisor_flow.activity_log")}
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            {t("report.supervisor_flow.date")}
                          </TableHead>
                          <TableHead>
                            {" "}
                            {t("report.supervisor_flow.type")}
                          </TableHead>
                          <TableHead>
                            {" "}
                            {t("report.supervisor_flow.site")}
                          </TableHead>
                          <TableHead>
                            {" "}
                            {t("report.supervisor_flow.name")}
                          </TableHead>
                          <TableHead>
                            {" "}
                            {t("report.supervisor_flow.category")}
                          </TableHead>
                          <TableHead className="text-right">
                            {" "}
                            {t("report.supervisor_flow.quantity")}
                          </TableHead>
                          <TableHead className="text-right">
                            {" "}
                            {t("report.supervisor_flow.amt")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detailedLogsData.data.logs.map((log, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {new Date(log.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  log.type === "material"
                                    ? "bg-orange-100 text-orange-800"
                                    : log.type === "labor"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {log.type.charAt(0).toUpperCase() +
                                  log.type.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>{log.site}</TableCell>
                            <TableCell className="font-medium">
                              {log.name}
                            </TableCell>
                            <TableCell>
                              {log.category ? (
                                <span className="text-sm text-gray-600">
                                  {log.category}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-400">
                                  N/A
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {log.quantity && log.unit ? (
                                <span className="text-sm">
                                  {parseFloat(log.quantity).toLocaleString()}{" "}
                                  {log.unit}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-400">
                                  N/A
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              <span
                                className={`${
                                  log.type === "material"
                                    ? "text-orange-600"
                                    : log.type === "labor"
                                    ? "text-blue-600"
                                    : "text-green-600"
                                }`}
                              >
                                ₹{parseFloat(log.amount_spent).toLocaleString()}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Summary by Type */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {t("report.supervisor_flow.summary_by_type")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Labor Summary */}
                      <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-blue-900">Labor</h4>
                            <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                              {detailedLogsData.data.summary.labor_entries}{" "}
                              {t("report.supervisor_flow.entries")}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-blue-600">
                            ₹
                            {detailedLogsData.data.summary.total_labor.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {
                              detailedLogsData.data.logs.filter(
                                (log) => log.type === "labor"
                              ).length
                            }{" "}
                            {t("report.supervisor_flow.log_entries")}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Material Summary */}
                      <Card className="border-l-4 border-l-orange-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-orange-900">
                              {t("report.supervisor_flow.materials")}
                            </h4>
                            <span className="text-xs bg-orange-100 px-2 py-1 rounded">
                              {detailedLogsData.data.summary.material_entries}{" "}
                              {t("report.supervisor_flow.entries")}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-orange-600">
                            ₹
                            {detailedLogsData.data.summary.total_materials.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {
                              detailedLogsData.data.logs.filter(
                                (log) => log.type === "material"
                              ).length
                            }{" "}
                            {t("report.supervisor_flow.log_entries")}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Advance Summary */}
                      <Card className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-green-900">
                              {t("report.supervisor_flow.advance")}
                            </h4>
                            <span className="text-xs bg-green-100 px-2 py-1 rounded">
                              {detailedLogsData.data.summary.advance_entries}{" "}
                              {t("report.supervisor_flow.entries")}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            ₹
                            {detailedLogsData.data.summary.total_advances.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {
                              detailedLogsData.data.logs.filter(
                                (log) => log.type === "advance"
                              ).length
                            }{" "}
                            {t("report.supervisor_flow.log_entries")}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <TrendingDown className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t("report.supervisor_flow.no_details_log")}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t("report.supervisor_flow.no_activity")}
                  </p>
                  <div className="text-sm text-gray-500 space-y-1 mb-4">
                    <p>{t("report.supervisor_flow.p1")}</p>
                    <p>{t("report.supervisor_flow.p2")}</p>
                    <p>{t("report.supervisor_flow.p3")}</p>
                  </div>
                  <Button variant="outline" onClick={refreshData} size="sm">
                    {t("report.supervisor_flow.ref_btn")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
