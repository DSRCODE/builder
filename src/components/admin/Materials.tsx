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
  Package,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useMaterials, useDeleteMaterial } from "@/hooks/useMaterials";
import { Material } from "@/types/material";
import { AddMaterialModal } from "@/components/admin/AddMaterialModal";
import { EditMaterialModal } from "@/components/admin/EditMaterialModal";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { useTranslation } from "react-i18next";

// Helper function to format currency
const formatCurrency = (amount: string, currency: string = "INR") => {
  const numAmount = parseFloat(amount);
  if (currency === "INR") {
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

// Helper function to get category name (you might want to create a categories mapping)
const getCategoryName = (categoryId: number) => {
  const categories: Record<number, string> = {
    1: "Building Materials",
    2: "Structural",
    3: "Electrical",
    4: "Plumbing",
    5: "Finishing",
    // Add more categories as needed
  };
  return categories[categoryId] || `Category ${categoryId}`;
};

export function Materials() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState<number | null>(
    null
  );
  const [deletingMaterialId, setDeletingMaterialId] = useState<number | null>(
    null
  );
  const {
    data: materialsResponse,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useMaterials();
  const deleteMaterial = useDeleteMaterial();
  const { t } = useTranslation();

  const handleEdit = (id: number) => {
    setEditingMaterialId(id);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingMaterialId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMaterialId) return;

    try {
      await deleteMaterial.mutateAsync(deletingMaterialId);
      setIsDeleteDialogOpen(false);
      setDeletingMaterialId(null);
    } catch (error) {
      console.error("Failed to delete material:", error);
      // Dialog will stay open to show error state
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeletingMaterialId(null);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleEditModalClose = (open: boolean) => {
    setIsEditModalOpen(open);
    if (!open) {
      setEditingMaterialId(null);
    }
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
            <Package className="mr-2 h-5 w-5 text-primary" />
            <div>
              <CardTitle>{t("materials.material_list_title")}</CardTitle>
              <CardDescription>
                {t("materials.material_list_description")}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead> {t("materials.material_name")}</TableHead>
                    <TableHead> {t("materials.site")}</TableHead>
                    <TableHead> {t("materials.category")}</TableHead>
                    <TableHead> {t("materials.quantity")}</TableHead>
                    <TableHead> {t("materials.unit")}</TableHead>
                    <TableHead> {t("materials.amount_spent")}</TableHead>
                    <TableHead> {t("materials.date_added")} </TableHead>
                    <TableHead> {t("materials.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
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
              {t("materials.materials_management")}
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
            {t("materials.failed_to_load_materials")}: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const materials = materialsResponse?.data || [];
  const isSuccess = materialsResponse?.status || false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* Left Section: Title + Subtitle */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {t("materials.materials_management")}
          </h1>
          {materialsResponse && (
            <p className="text-sm text-muted-foreground mt-1">
              {isSuccess
                ? `${t("Dashboard.total")}: ${materials.length} ${t(
                    "materials.material"
                  )}`
                : materialsResponse.message}
            </p>
          )}
        </div>

        {/* Right Section: Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefetching}
            size="sm"
            className="w-full sm:w-auto"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            {t("materials.refresh")}
          </Button>
          <Button
            className="bg-accent hover:bg-accent/90 w-full sm:w-auto"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("materials.add_new_material")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0">
          <Package className="mr-2 h-5 w-5 text-primary" />
          <div>
            <CardTitle>{t("materials.material_list_title")}</CardTitle>
            <CardDescription>
              {t("materials.material_list_description")}
              {isRefetching && (
                <span className="ml-2 text-primary">
                  {" "}
                  {t("materials.refreshing")}
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
                {materialsResponse?.message ||
                  `${t("materials.unable_to_load_materials")}`}
              </AlertDescription>
            </Alert>
          ) : materials.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {t("materials.no_materials_found")}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("materials.get_started")}
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("materials.add_new_material")}
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead> {t("materials.material_name")}</TableHead>
                      <TableHead> {t("materials.site")}</TableHead>
                      <TableHead> {t("materials.category")}</TableHead>
                      <TableHead> {t("materials.quantity")}</TableHead>
                      <TableHead> {t("materials.unit")}</TableHead>
                      <TableHead> {t("materials.amount_spent")}</TableHead>
                      <TableHead> {t("materials.date_added")} </TableHead>
                      <TableHead> {t("materials.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((material: Material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">
                          {material.material_name}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {material.site.site_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {material.site.address}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {getCategoryName(material.category_id)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {parseFloat(material.quantity).toLocaleString()}
                        </TableCell>
                        <TableCell>{material.unit}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(
                            material.amount_spent,
                            material.site.currency
                          )}
                        </TableCell>
                        <TableCell>{formatDate(material.date_added)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(material.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(material.id)}
                              disabled={deleteMaterial.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {materials.map((material: Material) => (
                  <div
                    key={material.id}
                    className="relative border rounded-xl p-4 shadow-md bg-white"
                  >
                    {/* Actions - Top right */}
                    <div className="absolute top-3 right-3 flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(material.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(material.id)}
                        disabled={deleteMaterial.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Card content */}
                    <div className="space-y-2">
                      <div className="text-lg font-semibold text-primary">
                        {material.material_name}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <div className="font-medium">
                          {material.site.site_name}
                        </div>
                        <div className="text-xs">{material.site.address}</div>
                      </div>

                      <div className="text-sm flex flex-col gap-1 pt-1">
                        <div>
                          <strong>{t("materials.category")}: </strong>
                          {getCategoryName(material.category_id)}
                        </div>
                        <div>
                          <strong>{t("materials.quantity")}: </strong>
                          {parseFloat(material.quantity).toLocaleString()}
                        </div>
                        <div>
                          <strong>{t("materials.unit")}: </strong>
                          {material.unit}
                        </div>
                        <div>
                          <strong>{t("materials.amount_spent")}: </strong>
                          {formatCurrency(
                            material.amount_spent,
                            material.site.currency
                          )}
                        </div>
                        <div>
                          <strong>{t("materials.date_added")}: </strong>
                          {formatDate(material.date_added)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Material Modal */}
      <AddMaterialModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      {/* Edit Material Modal */}
      <EditMaterialModal
        open={isEditModalOpen}
        onOpenChange={handleEditModalClose}
        materialId={editingMaterialId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMaterial.isPending}
        title={`${t("materials.delete_material_title")}`}
        description={
          deletingMaterialId
            ? `${t("materials.delete_material_description")}`
            : `${t("materials.delete_material_confirmation")}`
        }
      />
    </div>
  );
}
