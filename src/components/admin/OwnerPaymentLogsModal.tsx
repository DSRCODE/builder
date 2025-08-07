import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  IndianRupee,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  useOwnerPaymentLogs,
  useAddOwnerPaymentLog,
  useUpdateOwnerPaymentLog,
  useDeleteOwnerPaymentLog,
} from "@/hooks/useOwnerPaymentLogs";
import { OwnerPaymentLog } from "@/services/ownerPaymentLogsService";
import { useTranslation } from "react-i18next";

interface OwnerPaymentLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerId: number;
  ownerName: string;
}

interface PaymentFormData {
  payment_date: string;
  amount: string;
  notes: string;
}

export const OwnerPaymentLogsModal: React.FC<OwnerPaymentLogsModalProps> = ({
  isOpen,
  onClose,
  ownerId,
  ownerName,
}) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [editingPayment, setEditingPayment] = useState<OwnerPaymentLog | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPaymentId, setDeletingPaymentId] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState<PaymentFormData>({
    payment_date: new Date().toISOString().split("T")[0],
    amount: "",
    notes: "",
  });

  // Hooks
  const {
    data: paymentsResponse,
    isLoading,
    error,
    refetch,
  } = useOwnerPaymentLogs(ownerId);
  const addPaymentMutation = useAddOwnerPaymentLog();
  const updatePaymentMutation = useUpdateOwnerPaymentLog();
  const deletePaymentMutation = useDeleteOwnerPaymentLog();

  const payments = paymentsResponse?.data || [];

  // Debug: Monitor form data changes
  useEffect(() => {
    console.log("Form data changed:", formData);
  }, [formData]);

  // Helper function to format date for HTML date input
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return new Date().toISOString().split("T")[0];

    // Try different date parsing approaches
    let date;

    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Try parsing as ISO string or other formats
    date = new Date(dateString);

    // If parsing failed, try manual parsing for common formats
    if (isNaN(date.getTime())) {
      // Try DD/MM/YYYY format
      const ddmmyyyy = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (ddmmyyyy) {
        date = new Date(
          parseInt(ddmmyyyy[3]),
          parseInt(ddmmyyyy[2]) - 1,
          parseInt(ddmmyyyy[1])
        );
      }

      // Try MM/DD/YYYY format
      const mmddyyyy = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (mmddyyyy && isNaN(date.getTime())) {
        date = new Date(
          parseInt(mmddyyyy[3]),
          parseInt(mmddyyyy[1]) - 1,
          parseInt(mmddyyyy[2])
        );
      }
    }

    // If still invalid, return today's date
    if (isNaN(date.getTime())) {
      console.warn("Could not parse date:", dateString, "using today instead");
      date = new Date();
    }

    // Return in YYYY-MM-DD format
    return date.toISOString().split("T")[0];
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  // Helper function to format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle form input changes
  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      payment_date: new Date().toISOString().split("T")[0],
      amount: "",
      notes: "",
    });
    setIsAddingPayment(false);
    setEditingPayment(null);
  };

  // Handle add payment
  const handleAddPayment = async () => {
    if (
      !formData.amount ||
      parseFloat(formData.amount) <= 0 ||
      !formData.notes.trim()
    ) {
      toast({
        title: `${t("owner.paymentlog.error.val")}`,
        description: `${t("owner.paymentlog.error.val_er")}`,
        variant: "destructive",
      });
      return;
    }

    try {
      await addPaymentMutation.mutateAsync({
        ownerId,
        paymentData: formData,
      });

      toast({
        title: `${t("owner.paymentlog.error.suc")}`,
        description: `${t("owner.paymentlog.error.d5")}`,
      });

      resetForm();
    } catch (error: any) {
      toast({
        title: `${t("owner.paymentlog.error.er")}`,
        description: error.message || `${t("owner.paymentlog.error.d6")}`,
        variant: "destructive",
      });
    }
  };

  // Handle edit payment
  const handleEditPayment = (payment: OwnerPaymentLog) => {
    console.log("Editing payment:", payment);
    console.log("Original payment_date:", payment.payment_date);

    setEditingPayment(payment);

    // Use robust date formatting
    const formattedDate = formatDateForInput(payment.payment_date);

    console.log("Formatted payment_date:", formattedDate);

    const newFormData = {
      payment_date: formattedDate,
      amount: payment.amount || "",
      notes: payment.notes || "",
    };

    console.log("Setting form data:", newFormData);

    setFormData(newFormData);
    setIsAddingPayment(true);
  };

  // Handle update payment
  const handleUpdatePayment = async () => {
    if (
      !editingPayment ||
      !formData.amount ||
      parseFloat(formData.amount) <= 0 ||
      !formData.notes.trim()
    ) {
      toast({
        title: `${t("owner.paymentlog.error.val")}`,
        description: `${t("owner.paymentlog.error.val_er")}`,
        variant: "destructive",
      });
      return;
    }

    try {
      await updatePaymentMutation.mutateAsync({
        ownerId,
        paymentId: editingPayment.id,
        paymentData: formData,
      });

      toast({
        title: `${t("owner.paymentlog.error.suc")}`,
        description: `${t("owner.paymentlog.error.d3")}`,
      });

      resetForm();
    } catch (error: any) {
      toast({
        title: `${t("owner.paymentlog.error.er")}`,
        description: error.message || `${t("owner.paymentlog.error.d4")}`,
        variant: "destructive",
      });
    }
  };

  // Handle delete payment - open confirmation dialog
  const handleDeletePayment = (paymentId: number) => {
    setDeletingPaymentId(paymentId);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingPaymentId) return;

    try {
      await deletePaymentMutation.mutateAsync({
        ownerId,
        paymentId: deletingPaymentId,
      });

      toast({
        title: `${t("owner.paymentlog.error.suc")}`,
        description: `${t("owner.paymentlog.error.d1")}`,
      });

      setIsDeleteDialogOpen(false);
      setDeletingPaymentId(null);
    } catch (error: any) {
      toast({
        title: `${t("owner.paymentlog.error.er")}`,
        description: error.message || `${t("owner.paymentlog.error.d2")}`,
        variant: "destructive",
      });
    }
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeletingPaymentId(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              {t("owner.paymentlog.payment_log")} - {ownerName}
            </DialogTitle>
            <DialogDescription>
              {t("owner.paymentlog.payment_log_dec")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Add/Edit Payment Form */}
            {isAddingPayment && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">
                  {editingPayment ? "Edit Payment Log" : "Add Payment Log"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="payment_date">
                      {t("owner.paymentlog.pay_date")}
                    </Label>
                    <Input
                      key={editingPayment ? `edit-${editingPayment.id}` : "add"}
                      id="payment_date"
                      type="date"
                      value={formData.payment_date}
                      onChange={(e) => {
                        console.log("Date input changed:", e.target.value);
                        handleInputChange("payment_date", e.target.value);
                      }}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount">{t("owner.paymentlog.amt")}</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) =>
                        handleInputChange("amount", e.target.value)
                      }
                      placeholder="10000"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="notes">{t("owner.paymentlog.notes")}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder={t("owner.paymentlog.note_text")}
                    rows={3}
                    required
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={
                      editingPayment ? handleUpdatePayment : handleAddPayment
                    }
                    disabled={
                      addPaymentMutation.isPending ||
                      updatePaymentMutation.isPending
                    }
                  >
                    {addPaymentMutation.isPending ||
                    updatePaymentMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingPayment
                          ? `${t("owner.updating")}`
                          : `${t("owner.addping")}`}
                      </>
                    ) : (
                      <>
                        {editingPayment ? (
                          <Edit className="mr-2 h-4 w-4" />
                        ) : (
                          <Plus className="mr-2 h-4 w-4" />
                        )}
                        {editingPayment
                          ? `${t("owner.update_payment")}`
                          : `${t("owner.add_payment")}`}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    {t("owner.cancel")}
                  </Button>
                </div>
              </div>
            )}

            {/* Add Payment Button */}
            {!isAddingPayment && (
              <Button onClick={() => setIsAddingPayment(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("owner.paymentlog.add_payment_log")}
              </Button>
            )}

            {/* Payments List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t("owner.paymentlog.payment_history")}
              </h3>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {t("owner.paymnetlog.error_loading")} {error.message}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                      className="ml-2"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      {t("owner.retry")}
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : payments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <IndianRupee className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t("owner.paymnetlog.payment_not_found")}</p>
                  <p className="text-sm">
                    {t("owner.paymnetlog.add_payment_not_found")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => {
                    return (
                      <div
                        key={payment.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <IndianRupee className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-500">
                              {formatDate(payment.payment_date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {formatTime(payment.created_at)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditPayment(payment)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePayment(payment.id)}
                              disabled={deletePaymentMutation.isPending}
                            >
                              {deletePaymentMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-red-600" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-semibold text-green-600">
                              ₹
                              {parseFloat(payment.amount).toLocaleString(
                                "en-IN"
                              )}
                            </p>
                            {payment.notes && (
                              <p className="text-gray-700 text-sm mt-1">
                                {payment.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("owner.delete_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("owner.delete_title_dec")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              {t("owner.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deletePaymentMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletePaymentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("owner.deleting")}
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("owner.deleted_payment")}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
