import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Edit,
  Trash2,

  Calendar,
  RefreshCw,
  AlertCircle,
  IndianRupee,
} from "lucide-react";
import {
  useMasonAdvances,
  useDeleteMasonAdvance,
  useToggleMasonAdvanceStatus,
} from "@/hooks/useMasonAdvances";
import { useConstructionSites } from "@/hooks/useConstructionSites";
import { MasonAdvance } from "@/types/masonAdvance";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { AddMasonAdvanceModal } from "@/components/admin/AddMasonAdvanceModal";
import { EditMasonAdvanceModal } from "@/components/admin/EditMasonAdvanceModal";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";

// Helper function to format currency
const formatCurrency = (amount: string, currency: string = "INR") => {
  const numAmount = parseFloat(amount);
  if (currency === "INR" || currency === "₹") {
    return `₹${numAmount.toLocaleString("en-IN")}`;
  }
  return `${numAmount.toLocaleString()}`;
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export function Advances() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAdvanceId, setEditingAdvanceId] = useState<number | null>(null);
  const [deletingAdvanceId, setDeletingAdvanceId] = useState<number | null>(
    null
  );
  const [toggleStates, setToggleStates] = useState<{ [key: number]: boolean }>(
    {}
  );

  const {
    data: advancesResponse,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useMasonAdvances();
  const { data: sitesResponse } = useConstructionSites();
  const deleteAdvance = useDeleteMasonAdvance();
  const toggleStatusMutation = useToggleMasonAdvanceStatus();
  const { t } = useTranslation();

  const handleEdit = (id: number) => {
    setEditingAdvanceId(id);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingAdvanceId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAdvanceId) return;

    try {
      await deleteAdvance.mutateAsync(deletingAdvanceId);
      setIsDeleteDialogOpen(false);
      setDeletingAdvanceId(null);
    } catch (error) {
      console.error(`${t("advances.messages.failed_to_load")}:`, error);
      // Dialog will stay open to show error state
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeletingAdvanceId(null);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleEditModalClose = (open: boolean) => {
    setIsEditModalOpen(open);
    if (!open) {
      setEditingAdvanceId(null);
    }
  };

  // Helper function to get site info by ID
  const getSiteInfo = (siteId: number) => {
    if (!sitesResponse?.data) return null;
    return sitesResponse.data.find((site) => site.id === siteId);
  };

  // Toggel
  const handleToggleChange = (id: number) => {
    // setToggleStates((prev) => ({
    //   ...prev,
    //   [id]: checked,
    // }));

    toggleStatusMutation.mutate({ id });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0">
            <IndianRupee className="mr-2 h-5 w-5 text-primary" />
            <div>
              <CardTitle>{t("advances.mason_advances")}</CardTitle>
              <CardDescription>{t("advances.description")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("advances.table.date")}</TableHead>
                    <TableHead> {t("advances.table.site")}</TableHead>
                    <TableHead> {t("advances.table.mason_name")}</TableHead>
                    <TableHead> {t("advances.table.amount")}</TableHead>
                    <TableHead> {t("advances.table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              `{t("advances.title")}`
            </h1>
          </div>
          <Button onClick={handleRefresh} disabled={isRefetching}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            `{t("advances.messages.retry")}`
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            `{t("advances.messages.failed_to_load")}`: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const advances = advancesResponse?.data || [];
  const isSuccess = advancesResponse?.status || false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left Section: Title and Description */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t("advances.title")}
          </h1>
          {advancesResponse && (
            <p className="text-sm text-muted-foreground mt-1">
              {isSuccess
                ? `Total: ${advances.length} advances`
                : advancesResponse.message}
            </p>
          )}
        </div>

        {/* Right Section: Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefetching}
            size="sm"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            {t("advances.buttons.refresh")}
          </Button>

          <Button
            className="bg-accent hover:bg-accent/90"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("advances.buttons.add_advance")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0">
          <IndianRupee className="mr-2 h-5 w-5 text-primary" />
          <div>
            <CardTitle> {t("advances.mason_advances")}</CardTitle>
            <CardDescription>
              {t("advances.description")}
              {isRefetching && (
                <span className="ml-2 text-primary">
                  {" "}
                  {t("advances.refreshing")}
                </span>
              )}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {!isSuccess ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {advancesResponse?.message ||
                  `${t("advances.messages.failed_to_load")}`}
              </AlertDescription>
            </Alert>
          ) : advances.length === 0 ? (
            <div className="text-center py-8">
              <IndianRupee className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {t("advances.messages.no_advances_found")}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("advances.messages.get_started")}
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("advances.buttons.add_advance")}
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("advances.table.date")}</TableHead>
                      <TableHead> {t("advances.table.site")}</TableHead>
                      <TableHead> {t("advances.table.mason_name")}</TableHead>
                      <TableHead> {t("advances.table.amount")}</TableHead>
                      <TableHead> {t("advances.table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {advances.map((advance: MasonAdvance) => {
                      const siteInfo =
                        advance.site || getSiteInfo(advance.site_id);

                      return (
                        <TableRow key={advance.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatDate(advance.date)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {siteInfo ? (
                              <div>
                                <div className="font-medium">
                                  {siteInfo.site_name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {siteInfo.address}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="font-medium text-muted-foreground">
                                  {t("advances.table.site_id_label")}{" "}
                                  {advance.site_id}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {t("advances.table.site_details_unavailable")}
                                </div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-medium">
                              {advance.mason_name}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-green-600">
                            {formatCurrency(
                              advance.amount,
                              siteInfo?.currency || "INR"
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(advance.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteClick(advance.id)}
                                disabled={deleteAdvance.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Switch
                                checked={toggleStates[advance.id] || false}
                                onCheckedChange={(checked) =>
                                  handleToggleChange(advance.id)
                                }
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 mt-4">
                {advances.map((advance: MasonAdvance) => {
                  const siteInfo = advance.site || getSiteInfo(advance.site_id);

                  return (
                    <div
                      key={advance.id}
                      className="border rounded-md p-4 shadow-sm bg-white relative"
                    >
                      {/* Action Buttons - top right */}
                      <div className="absolute top-3 right-3 flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(advance.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(advance.id)}
                          disabled={deleteAdvance.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={toggleStates[advance.id] || false}
                          onCheckedChange={(checked) =>
                            handleToggleChange(advance.id )
                          }
                        />
                      </div>

                      {/* Date */}
                      <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(advance.date)}
                      </div>

                      {/* Site Info */}
                      {siteInfo ? (
                        <div className="mb-1">
                          <div className="text-sm font-semibold">
                            {siteInfo?.site_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {siteInfo?.address}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-muted-foreground">
                            {t("advances.table.site_id_label")}{" "}
                            {advance.site_id}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t("advances.table.site_details_unavailable")}
                          </div>
                        </div>
                      )}

                      {/* Mason Name */}
                      <div className="text-sm mb-1">
                        <strong>{t("advances.table.mason_name")}:</strong>{" "}
                        <Badge variant="outline" className="text-xs">
                          {advance.mason_name}
                        </Badge>
                      </div>

                      {/* Amount */}
                      <div className="text-sm mb-1">
                        <strong>{t("advances.table.amount")}:</strong>{" "}
                        <span className="text-green-600 font-medium">
                          {formatCurrency(
                            advance.amount,
                            siteInfo?.currency || "INR"
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Mason Advance Modal */}
      <AddMasonAdvanceModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      {/* Edit Mason Advance Modal */}
      <EditMasonAdvanceModal
        open={isEditModalOpen}
        onOpenChange={handleEditModalClose}
        masonAdvanceId={editingAdvanceId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteAdvance.isPending}
        title={t("advance.delete_confirmation_dialog.title")}
        description={
          deletingAdvanceId
            ? `${t("advance.delete_confirmation_dialog.description_confirm")}`
            : `${t("advance.delete_confirmation_dialog.description_default")}`
        }
      />
    </div>
  );
}
