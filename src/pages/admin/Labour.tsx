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
  Users,
  Calendar,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { AddLaborEntryModal } from "@/components/admin/AddLaborEntryModal";
import { EditLaborEntryModal } from "@/components/admin/EditLaborEntryModal";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { useLaborEntries, useDeleteLaborEntry } from "@/hooks/useLaborEntry";
import { useConstructionSites } from "@/hooks/useConstructionSites";
import { LaborEntry } from "@/types/laborEntry";
import { useTranslation } from "react-i18next";

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

export function Labour() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingLaborEntryId, setEditingLaborEntryId] = useState<number | null>(
    null
  );
  const [deletingLaborEntryId, setDeletingLaborEntryId] = useState<
    number | null
  >(null);

  const {
    data: laborEntriesResponse,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useLaborEntries();
  const { data: sitesResponse } = useConstructionSites();
  const deleteLaborEntry = useDeleteLaborEntry();
  const { t } = useTranslation();

  const handleEdit = (id: number) => {
    setEditingLaborEntryId(id);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingLaborEntryId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLaborEntryId) return;

    try {
      await deleteLaborEntry.mutateAsync(deletingLaborEntryId);
      setIsDeleteDialogOpen(false);
      setDeletingLaborEntryId(null);
    } catch (error) {
      console.error(`${t("labor.failed_to_load_labor_entry")}`, error);
      // Dialog will stay open to show error state
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeletingLaborEntryId(null);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleEditModalClose = (open: boolean) => {
    setIsEditModalOpen(open);
    if (!open) {
      setEditingLaborEntryId(null);
    }
  };

  // Helper function to get site info by ID
  const getSiteInfo = (siteId: number) => {
    if (!sitesResponse?.data) return null;
    return sitesResponse.data.find((site) => site.id === siteId);
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
            <Users className="mr-2 h-5 w-5 text-primary" />
            <div>
              <CardTitle>{t("labor.labor_log")}</CardTitle>
              <CardDescription>
                {t("labor.labor_log_description")}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("labor.table.date")}</TableHead>
                    <TableHead>{t("labor.table.site")}</TableHead>
                    <TableHead>{t("labor.table.masons")}</TableHead>
                    <TableHead>{t("labor.table.helpers")}</TableHead>
                    <TableHead>{t("labor.table.lady_helpers")}</TableHead>
                    <TableHead>{t("labor.table.total_wage")}</TableHead>
                    <TableHead>{t("labor.table.comments")}</TableHead>
                    <TableHead>{t("labor.table.actions")}</TableHead>
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
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16" />
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
              {t("labor.labor_management")}
            </h1>
          </div>
          <Button onClick={handleRefresh} disabled={isRefetching}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            {t("materials.retry")}
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t("labor.failed_to_load_labor_entry")} {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const laborEntries = laborEntriesResponse?.data || [];
  const isSuccess = laborEntriesResponse?.status || false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t("labor.labor_management")}
          </h1>
          {laborEntriesResponse && (
            <p className="text-sm text-muted-foreground mt-1">
              {isSuccess
                ? `${t("Dashboard.total")}: ${laborEntries.length} ${t(
                    "labor.entries"
                  )}`
                : laborEntriesResponse.message}
            </p>
          )}
        </div>
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
            {t("labor.refresh")}
          </Button>
          <Button
            className="bg-accent hover:bg-accent/90"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("labor.add_labor_entry")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0">
          <Users className="mr-2 h-5 w-5 text-primary" />
          <div>
            <CardTitle> {t("labor.labor_log")}</CardTitle>
            <CardDescription>
              {t("labor.labor_log_description")}
              {isRefetching && (
                <span className="ml-2 text-primary">Refreshing...</span>
              )}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {!isSuccess ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {laborEntriesResponse?.message ||
                  "Unable to load labor entries"}
              </AlertDescription>
            </Alert>
          ) : laborEntries.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No labor entries found
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by adding your first labor entry.
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("labor.add_entry_title")}
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("labor.table.date")}</TableHead>
                      <TableHead>{t("labor.table.site")}</TableHead>
                      <TableHead>{t("labor.table.masons")}</TableHead>
                      <TableHead>{t("labor.table.helpers")}</TableHead>
                      <TableHead>{t("labor.table.lady_helpers")}</TableHead>
                      <TableHead>{t("labor.table.total_wage")}</TableHead>
                      <TableHead>{t("labor.table.comments")}</TableHead>
                      <TableHead>{t("labor.table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {laborEntries.map((entry: LaborEntry) => {
                      const siteInfo = entry.site || getSiteInfo(entry.site_id);

                      return (
                        <TableRow key={entry.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatDate(entry.date)}
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
                                  {t("labor.form.table.site_label")} ID:{" "}
                                  {entry.site_id}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {t("labor.site_details_not_avaiable")}
                                </div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {entry.masons > 0 ? (
                              <Badge variant="secondary" className="text-xs">
                                {entry.masons}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {entry.helpers > 0 ? (
                              <Badge variant="secondary" className="text-xs">
                                {entry.helpers}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {entry.lady_helpers > 0 ? (
                              <Badge variant="secondary" className="text-xs">
                                {entry.lady_helpers}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-medium">
                                {formatCurrency(
                                  entry.calculated_total_wage,
                                  siteInfo?.currency || "INR"
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {t("labor.calculated")}
                              </div>
                              {entry.manual_total_wage && (
                                <div className="mt-1">
                                  <div className="text-sm text-blue-600 font-medium">
                                    {formatCurrency(
                                      entry.manual_total_wage,
                                      siteInfo?.currency || "INR"
                                    )}
                                  </div>
                                  <div className="text-xs text-blue-500">
                                    {t("labor.manual")}
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {entry.override_comment ? (
                              <Badge variant="outline" className="text-xs">
                                {entry.override_comment}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(entry.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteClick(entry.id)}
                                disabled={deleteLaborEntry.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
                {laborEntries.map((entry: LaborEntry) => {
                  const siteInfo = entry.site || getSiteInfo(entry.site_id);

                  return (
                    <div
                      key={entry.id}
                      className="relative border rounded-xl p-4 shadow-sm bg-white"
                    >
                      {/* Actions - top right */}
                      <div className="absolute top-3 right-3 flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(entry.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(entry.id)}
                          disabled={deleteLaborEntry.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Entry Content */}
                      <div className="space-y-2">
                        <div className="text-base font-semibold flex items-center gap-2 text-primary">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(entry.date)}
                        </div>

                        <div className="text-sm text-muted-foreground">
                          {siteInfo ? (
                            <>
                              <div className="font-medium">
                                {siteInfo.site_name}
                              </div>
                              <div className="text-xs">{siteInfo.address}</div>
                            </>
                          ) : (
                            <>
                              <div className="font-medium">
                                {t("labor.form.table.site_label")} ID:{" "}
                                {entry.site_id}
                              </div>
                              <div className="text-xs">
                                {t("labor.site_details_not_avaiable")}
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 text-sm">
                          <span>
                            <strong>{t("labor.table.masons")}:</strong>{" "}
                            {entry.masons > 0 ? (
                              <Badge variant="secondary" className="text-xs">
                                {entry.masons}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </span>
                          <span>
                            <strong>{t("labor.table.helpers")}:</strong>{" "}
                            {entry.helpers > 0 ? (
                              <Badge variant="secondary" className="text-xs">
                                {entry.helpers}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </span>
                          <span>
                            <strong>{t("labor.table.lady_helpers")}:</strong>{" "}
                            {entry.lady_helpers > 0 ? (
                              <Badge variant="secondary" className="text-xs">
                                {entry.lady_helpers}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </span>
                        </div>

                        <div className="text-sm">
                          <strong>{t("labor.table.total_wage")}:</strong>
                          <div className="flex gap-4 mt-1">
                            {/* Calculated Wage */}
                            <div className="text-sm font-medium">
                              {formatCurrency(
                                entry.calculated_total_wage,
                                siteInfo?.currency || "INR"
                              )}
                              <div className="text-xs text-muted-foreground">
                                {t("labor.calculated")}
                              </div>
                            </div>

                            {/* Manual Wage (if exists) */}
                            {entry.manual_total_wage && (
                              <div className="text-sm text-blue-600 font-medium">
                                {formatCurrency(
                                  entry.manual_total_wage,
                                  siteInfo?.currency || "INR"
                                )}
                                <div className="text-xs text-blue-500">
                                  {t("labor.manual")}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-sm">
                          <strong>{t("labor.table.comments")}:</strong>{" "}
                          {entry.override_comment ? (
                            <Badge variant="outline" className="text-xs">
                              {entry.override_comment}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Labor Entry Modal */}
      <AddLaborEntryModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      {/* Edit Labor Entry Modal */}
      <EditLaborEntryModal
        open={isEditModalOpen}
        onOpenChange={handleEditModalClose}
        laborEntryId={editingLaborEntryId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteLaborEntry.isPending}
        title={t("labor.confirmation.delete_title")}
        description={
          deletingLaborEntryId
            ? `${t("labor.confirmation.delete_description")}`
            : `${t("labor.confirmation.delete_confirm")}`
        }
      />
    </div>
  );
}
