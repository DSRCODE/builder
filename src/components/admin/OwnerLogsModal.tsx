import React, { useState } from "react";
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
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  User,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  useOwnerLogs,
  useAddOwnerLog,
  useUpdateOwnerLog,
  useDeleteOwnerLog,
} from "@/hooks/useOwnerLogs";
import { OwnerLog } from "@/services/ownerLogsService";
import { useTranslation } from "react-i18next";

interface OwnerLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerId: number;
  ownerName: string;
}

interface LogFormData {
  log_date: string;
  type: string;
  notes: string;
}

const LOG_TYPES = [
  { value: "Call", label: "Phone Call", icon: Phone },
  { value: "SMS", label: "SMS", icon: MessageSquare },
  { value: "Email", label: "Email", icon: MessageSquare },
  { value: "WhatsApp", label: "WhatsApp", icon: MessageSquare },
];

export const OwnerLogsModal: React.FC<OwnerLogsModalProps> = ({
  isOpen,
  onClose,
  ownerId,
  ownerName,
}) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [editingLog, setEditingLog] = useState<OwnerLog | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingLogId, setDeletingLogId] = useState<number | null>(null);
  const [formData, setFormData] = useState<LogFormData>({
    log_date: new Date().toISOString().split("T")[0],
    type: "",
    notes: "",
  });

  // Hooks
  const {
    data: logsResponse,
    isLoading,
    error,
    refetch,
  } = useOwnerLogs(ownerId);
  const addLogMutation = useAddOwnerLog();
  const updateLogMutation = useUpdateOwnerLog();
  const deleteLogMutation = useDeleteOwnerLog();

  const logs = logsResponse?.data || [];

  // Helper function to format date
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

  // Get log type details
  const getLogTypeDetails = (type: string) => {
    const logType = LOG_TYPES.find((t) => t.value === type);
    return logType || { value: type, label: type, icon: Calendar };
  };

  // Handle form input changes
  const handleInputChange = (field: keyof LogFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      log_date: new Date().toISOString().split("T")[0],
      type: "",
      notes: "",
    });
    setIsAddingLog(false);
    setEditingLog(null);
  };

  // Handle add log
  const handleAddLog = async () => {
    if (!formData.type || !formData.notes.trim()) {
      toast({
        title: `${t("owner.validation_error_title")}`,
        description: `${t("owner.validation_error_description")}`,
        variant: "destructive",
      });
      return;
    }

    try {
      await addLogMutation.mutateAsync({
        ownerId,
        logData: formData,
      });

      toast({
        title: `${t("owner.add_success_title")}`,
        description: `${t("owner.add_success_description")}`,
      });

      resetForm();
    } catch (error: any) {
      toast({
        title: `${t("owner.add_error_title")}`,
        description:
          error.message || `${t("owner.add_error_description_fallback")}`,
        variant: "destructive",
      });
    }
  };

  // Handle edit log
  const handleEditLog = (log: OwnerLog) => {
    setEditingLog(log);
    setFormData({
      log_date: log.log_date,
      type: log.type,
      notes: log.notes,
    });
    setIsAddingLog(true);
  };

  // Handle update log
  const handleUpdateLog = async () => {
    if (!editingLog || !formData.type || !formData.notes.trim()) {
      toast({
        title: `${t("owner.validation_error_title")}`,
        description: `${t("owner.validation_error_description")}`,
        variant: "destructive",
      });
      return;
    }

    try {
      await updateLogMutation.mutateAsync({
        ownerId,
        logId: editingLog.id,
        logData: formData,
      });

      toast({
        title: `${t("owner.add_success_title")}`,
        description: `${t("owner.update_success_description")}`,
      });

      resetForm();
    } catch (error: any) {
      toast({
        title: `${t("owner.update_error_title")}`,
        description:
          error.message || `${t("owner.update_error_description_fallback")}`,
        variant: "destructive",
      });
    }
  };

  // Handle delete log - open confirmation dialog
  const handleDeleteLog = (logId: number) => {
    setDeletingLogId(logId);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingLogId) return;

    try {
      await deleteLogMutation.mutateAsync({
        ownerId,
        logId: deletingLogId,
      });

      toast({
        title: `${t("owner.update_success_title")}`,
        description: `${t("owner.delete_success_description")}`,
      });

      setIsDeleteDialogOpen(false);
      setDeletingLogId(null);
    } catch (error: any) {
      toast({
        title: `${t("owner.update_error_title")}`,
        description:
          error.message || `${t("owner.delete_error_description_fallback")}`,
        variant: "destructive",
      });
    }
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeletingLogId(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {t("owner.comm.comm_log")} - {ownerName}
            </DialogTitle>
            <DialogDescription>
              {t("owner.comm.comm_log_dec")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Add/Edit Log Form */}
            {isAddingLog && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">
                  {editingLog
                    ? "Edit Communication Log"
                    : "Add Communication Log"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="log_date">{t("owner.comm.date")}</Label>
                    <Input
                      id="log_date"
                      type="date"
                      value={formData.log_date}
                      onChange={(e) =>
                        handleInputChange("log_date", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">{t("owner.comm.comm_type")}</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleInputChange("type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("owner.comm.comm_type_placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {LOG_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="notes">{t("owner.comm.notes")}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder={t("owner.comm.notes_textarea")}
                    rows={3}
                    required
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={editingLog ? handleUpdateLog : handleAddLog}
                    disabled={
                      addLogMutation.isPending || updateLogMutation.isPending
                    }
                  >
                    {addLogMutation.isPending || updateLogMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingLog ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      <>
                        {editingLog ? (
                          <Edit className="mr-2 h-4 w-4" />
                        ) : (
                          <Plus className="mr-2 h-4 w-4" />
                        )}
                        {editingLog ? "Update Log" : "Add Log"}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    {t("owner.cancel")}
                  </Button>
                </div>
              </div>
            )}

            {/* Add Log Button */}
            {!isAddingLog && (
              <Button onClick={() => setIsAddingLog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("owner.add_commlog_btn")}
              </Button>
            )}

            {/* Logs List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t("owner.comm.comm_log_history")}
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
                    {t("owner.messages.error_in_loading")} {error.message}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                      className="ml-2"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      {t("owner.retyr")}
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : logs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t("owner.messages.no_comm_log_found")}</p>
                  <p className="text-sm">
                    {t("owner.messages.add_first_comm")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => {
                    const typeDetails = getLogTypeDetails(log.type);
                    const TypeIcon = typeDetails.icon;

                    return (
                      <div
                        key={log.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="h-4 w-4 text-blue-600" />
                            <Badge variant="secondary">
                              {typeDetails.label}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {formatDate(log.log_date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {formatTime(log.created_at)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditLog(log)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLog(log.id)}
                              disabled={deleteLogMutation.isPending}
                            >
                              {deleteLogMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-red-600" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-700">{log.notes}</p>
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
              disabled={deleteLogMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLogMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("owner.deleting")}
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("owner.deleted_log")}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
