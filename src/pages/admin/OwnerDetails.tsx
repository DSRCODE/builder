import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Edit,
  Trash2,
  User,
  Phone,
  MapPin,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  Building,
  PhoneCall,
  Landmark,
  ListCheck,
  Pen,
} from "lucide-react";
import { useOwners, useDeleteOwner } from "@/hooks/useOwners";
import { useConstructionSites } from "@/hooks/useConstructionSites";
import { Owner } from "@/types/owner";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { AddOwnerModal } from "@/components/admin/AddOwnerModal";
import { EditOwnerModal } from "@/components/admin/EditOwnerModal";
import { OwnerLogsModal } from "@/components/admin/OwnerLogsModal";
import { OwnerPaymentLogsModal } from "@/components/admin/OwnerPaymentLogsModal";
import { WhatsAppReminderModal } from "@/components/admin/WhatsAppReminderModal";
import { useTranslation } from "react-i18next";

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

// Helper function to format phone number
const formatPhoneNumber = (phoneNumber: string) => {
  // Remove country code if present and format
  const cleaned = phoneNumber.replace(/^\+?91/, "");
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phoneNumber;
};

export function OwnerDetails() {
  const { t } = useTranslation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isPaymentLogsModalOpen, setIsPaymentLogsModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [editingOwnerId, setEditingOwnerId] = useState<number | null>(null);
  const [deletingOwnerId, setDeletingOwnerId] = useState<number | null>(null);
  const [selectedOwnerForLogs, setSelectedOwnerForLogs] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedOwnerForPayments, setSelectedOwnerForPayments] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedOwnerForReminder, setSelectedOwnerForReminder] =
    useState<any>(null);

  const {
    data: ownersResponse,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useOwners();
  const { data: sitesResponse } = useConstructionSites();
  const deleteOwner = useDeleteOwner();

  const handleEdit = (id: number) => {
    setEditingOwnerId(id);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingOwnerId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingOwnerId) return;

    try {
      await deleteOwner.mutateAsync(deletingOwnerId);
      setIsDeleteDialogOpen(false);
      setDeletingOwnerId(null);
    } catch (error) {
      console.error(`${t("owner.messages.failed_to_load")}`, error);
      // Dialog will stay open to show error state
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeletingOwnerId(null);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleEditModalClose = (open: boolean) => {
    setIsEditModalOpen(open);
    if (!open) {
      setEditingOwnerId(null);
    }
  };

  const handleLogsClick = (ownerId: number, ownerName: string) => {
    setSelectedOwnerForLogs({ id: ownerId, name: ownerName });
    setIsLogsModalOpen(true);
  };

  const handleLogsModalClose = () => {
    setIsLogsModalOpen(false);
    setSelectedOwnerForLogs(null);
  };

  const handlePaymentLogsClick = (ownerId: number, ownerName: string) => {
    setSelectedOwnerForPayments({ id: ownerId, name: ownerName });
    setIsPaymentLogsModalOpen(true);
  };

  const handlePaymentLogsModalClose = () => {
    setIsPaymentLogsModalOpen(false);
    setSelectedOwnerForPayments(null);
  };

  // Handle WhatsApp reminder
  const handleSendReminder = (owner: any) => {
    setSelectedOwnerForReminder(owner);
    setIsReminderModalOpen(true);
  };

  const handleReminderModalClose = () => {
    setIsReminderModalOpen(false);
    setSelectedOwnerForReminder(null);
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

        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
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
              {t("owner.owner_details")}
            </h1>
          </div>
          <Button onClick={handleRefresh} disabled={isRefetching}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            {t("owner.retry")}
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            `${t("owner.messages.failed_to_load")}` {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const owners = ownersResponse?.data || [];
  const isSuccess = ownersResponse?.status || false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Side: Heading and Info */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("owner.owner_details")}
          </h1>
          {ownersResponse && (
            <p className="text-sm text-muted-foreground mt-1">
              {isSuccess
                ? `${t("owner.total")}: ${owners.length} ${t("owner.owners")}`
                : ownersResponse.message}
            </p>
          )}
        </div>

        {/* Right Side: Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefetching}
            size="sm"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            {t("owner.refresh")}
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("owner.add_owner")}
          </Button>
        </div>
      </div>

      {!isSuccess ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {ownersResponse?.message || `${t("owner.messages.unable_to_load")}`}
          </AlertDescription>
        </Alert>
      ) : owners.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {t("owner.messages.no_owner_found")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("owner.messages.get_Started")}
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("owner.add_owner")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {owners.map((owner: Owner) => {
            const siteInfo = owner.site || getSiteInfo(owner.site_id);

            return (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold tracking-tight font-headline text-xl flex items-center">
                      <User className="h-5 w-5 text-accent mr-2" />
                      {owner.name}
                    </div>
                    <span className="text-xs font-body text-muted-foreground bg-secondary px-2 py-1 rounded-full flex items-center">
                      <Building className="h-5 w-5 text-accent mr-2" />{" "}
                      {siteInfo ? (
                        <>
                          <div className="font-medium">
                            {siteInfo.site_name}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {siteInfo.address}
                          </div>
                        </>
                      ) : (
                        <div className="text-muted-foreground">
                          {t("owner.site_id")} {owner.site_id}{" "}
                          {t("owner.site_details_not_avaiable")}
                        </div>
                      )}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground font-body flex items-center">
                    <PhoneCall className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{formatPhoneNumber(owner.phone_number)}</span>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <p className="font-body text-lg font-semibold flex items-center">
                    <Landmark className="h-5 w-5 text-green-500 mr-1" />
                    {t("owner.total_recived")} ₹0
                  </p>
                  {/* <div className="mt-4">
                    <h4 className="font-body font-medium text-sm mb-1">
                      Recent Communication:
                    </h4>
                    <div className="text-xs text-muted-foreground font-body space-y-1">
                      <p className="truncate" title="jljlj">
                        <span className="font-semibold">
                          Jul 25, 2025 (SMS):
                        </span>{" "}
                        jljlj
                      </p>
                      <p className="truncate" title="hikhk">
                        <span className="font-semibold">
                          Jul 24, 2025 (Call):
                        </span>{" "}
                        hikhk
                      </p>
                    </div>
                  </div> */}
                  <div className="mt-3">
                    <h4 className="font-body font-medium text-sm mb-1">
                      {t("owner.recent_payments")}
                    </h4>
                    <p className="text-xs text-muted-foreground font-body">
                      {t("owner.no_payments")}
                    </p>
                  </div>
                </div>
                <div className="items-center p-6 flex flex-wrap gap-2 pt-4 bg-secondary/30 rounded-b-lg">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-grow"
                    onClick={() => handleLogsClick(owner.id, owner.name)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t("owner.log_comm")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-grow"
                    onClick={() => handlePaymentLogsClick(owner.id, owner.name)}
                  >
                    <ListCheck className="h-4 w-4 mr-2" />
                    {t("owner.log_pay")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-grow"
                    onClick={() => handleSendReminder(owner)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t("owner.remider")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-grow"
                    onClick={() => handleEdit(owner.id)}
                  >
                    <Pen className="h-4 w-4 mr-2" />
                    {t("owner.edit")}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-grow"
                    onClick={() => handleDeleteClick(owner.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("owner.delete")}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Owner Modal */}
      <AddOwnerModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />

      {/* Edit Owner Modal */}
      <EditOwnerModal
        open={isEditModalOpen}
        onOpenChange={handleEditModalClose}
        ownerId={editingOwnerId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteOwner.isPending}
        title={t("owner.delete_owner")}
        description={
          deletingOwnerId
            ? `${t("owner.delete_confirm")}`
            : `${t("owner.delete_description")}`
        }
      />

      {/* Owner Logs Modal */}
      {selectedOwnerForLogs && (
        <OwnerLogsModal
          isOpen={isLogsModalOpen}
          onClose={handleLogsModalClose}
          ownerId={selectedOwnerForLogs.id}
          ownerName={selectedOwnerForLogs.name}
        />
      )}

      {/* Owner Payment Logs Modal */}
      {selectedOwnerForPayments && (
        <OwnerPaymentLogsModal
          isOpen={isPaymentLogsModalOpen}
          onClose={handlePaymentLogsModalClose}
          ownerId={selectedOwnerForPayments.id}
          ownerName={selectedOwnerForPayments.name}
        />
      )}

      {/* WhatsApp Reminder Modal */}
      {selectedOwnerForReminder && (
        <WhatsAppReminderModal
          isOpen={isReminderModalOpen}
          onClose={handleReminderModalClose}
          owner={selectedOwnerForReminder}
          siteName={
            getSiteInfo(selectedOwnerForReminder.site_id)?.name ||
            "Unknown Site"
          }
        />
      )}
    </div>
  );
}
