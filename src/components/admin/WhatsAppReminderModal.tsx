import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  MessageSquare,
  Phone,
  Copy,
  ExternalLink,
  Edit,
  RefreshCw,
} from "lucide-react";
import { useOwnerPaymentLogs } from "@/hooks/useOwnerPaymentLogs";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/authContext";

interface WhatsAppReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  owner: {
    id: number;
    name: string;
    phone_number: string; // Changed from phone to phone_number
    site_id: number;
  };
  siteName: string;
}

export const WhatsAppReminderModal: React.FC<WhatsAppReminderModalProps> = ({
  isOpen,
  onClose,
  owner,
  siteName,
}) => {
  console.log(siteName)
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [customMessage, setCustomMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditingMessage, setIsEditingMessage] = useState(false);

  // Fetch payment logs to calculate total received
  const { data: paymentsResponse, isLoading: paymentsLoading } =
    useOwnerPaymentLogs(owner.id);
  const payments = paymentsResponse?.data || [];

  // Calculate total received amount
  const totalReceived = payments.reduce((sum, payment) => {
    return sum + parseFloat(payment.amount || "0");
  }, 0);

  // Format phone number
  const formatPhoneNumber = (phone_number: string) => {
    let formatted = phone_number?.replace(/\D/g, "") || "";
    if (formatted.startsWith("0")) {
      formatted = "91" + formatted.substring(1);
    } else if (!formatted.startsWith("91") && formatted.length === 10) {
      formatted = "91" + formatted;
    }
    return formatted;
  };

  // Generate default message
  const generateDefaultMessage = () => {
    const paymentStatus =
      totalReceived === 0
        ? `${t("owner.whatsapp_model.no_payment_recorded")}`
        : `${t(
            "owner.whatsapp_model.have_received"
          )}${totalReceived.toLocaleString("en-IN")}${t(
            "owner.whatsapp_model.so_far"
          )}`;

    return `${t("owner.whatsapp_model.hlo")} ${owner.name}. ${t(
      "owner.whatsapp_model.friendly_reminder"
    )} ${siteName}. ${paymentStatus} ${t(
      "owner.whatsapp_model.msg"
    )}${totalReceived.toLocaleString("en-IN")}. ${t(
      "owner.whatsapp_model.msg1"
    )}${user?.business_name}`;
  };

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      setPhoneNumber(formatPhoneNumber(owner.phone_number));
      setCustomMessage(generateDefaultMessage());
      setIsEditingMessage(false);
    }
  }, [isOpen, owner, siteName, totalReceived]);

  // Handle send WhatsApp message
  const handleSendWhatsApp = () => {
    if (!phoneNumber) {
      toast({
        title: `${t("owner.whatsapp_model.er")}`,
        description: `${t("owner.whatsapp_model.no.re")}`,
        variant: "destructive",
      });
      return;
    }

    if (!customMessage.trim()) {
      toast({
        title: `${t("owner.whatsapp_model.er")}`,
        description: `${t("owner.whatsapp_model.msg_empty")}`,
        variant: "destructive",
      });
      return;
    }

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(customMessage);

    // Create WhatsApp URL
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodedMessage}&type=phone_number&app_absent=0`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank");

    toast({
      title: `${t("owner.whatsapp_model.suc")}`,
      description: `${t("owner.whatsapp_model.wh_open")}`,
    });

    onClose();
  };

  // Handle copy message
  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(customMessage);
      toast({
        title: `${t("owner.whatsapp_model.suc")}`,
        description: `${t("owner.whatsapp_model.msg_copied")}`,
      });
    } catch (error) {
      toast({
        title: `${t("owner.whatsapp_model.er")}`,
        description: `${t("owner.whatsapp_model.msg_copy_fail")}`,
        variant: "destructive",
      });
    }
  };

  // Handle reset to default message
  const handleResetMessage = () => {
    setCustomMessage(generateDefaultMessage());
    setIsEditingMessage(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t("owner.whatsapp_model.wh_reminder")}
            {owner.name}
          </DialogTitle>
          <DialogDescription>
            {t("owner.whatsapp_model.payment_reminder")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Owner and Payment Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">
              {" "}
              {t("owner.whatsapp_model.owner_info")}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">
                  {" "}
                  {t("owner.whatsapp_model.name")}
                </span>{" "}
                {owner.name}
              </div>
              <div>
                <span className="font-medium">
                  {" "}
                  {t("owner.whatsapp_model.Site")}
                </span>{" "}
                {siteName}
              </div>
              <div>
                <span className="font-medium">
                  {" "}
                  {t("owner.whatsapp_model.Phone")}
                </span>{" "}
                {owner.phone_number}
              </div>
              <div>
                <span className="font-medium">
                  {" "}
                  {t("owner.whatsapp_model.total_recived")}
                </span>{" "}
                {paymentsLoading ? (
                  <span className="text-gray-500">
                    {" "}
                    {t("owner.whatsapp_model.loading")}
                  </span>
                ) : (
                  <span className="font-semibold text-green-600">
                    ₹{totalReceived.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phone">
              {" "}
              {t("owner.whatsapp_model.wh_ohn_no")}
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="919481009999"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPhoneNumber(formatPhoneNumber(owner.phone_number))
                }
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t("owner.whatsapp_model.cntry_cod")}
            </p>
          </div>

          {/* Message */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="message">
                {t("owner.whatsapp_model.reminder_msg")}
              </Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingMessage(!isEditingMessage)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {isEditingMessage
                    ? `${t("owner.whatsapp_model.preview")}`
                    : `${t("owner.whatsapp_model.edit")}`}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetMessage}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  {t("owner.whatsapp_model.reset")}
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopyMessage}>
                  <Copy className="h-4 w-4 mr-1" />
                  {t("owner.whatsapp_model.copy")}
                </Button>
              </div>
            </div>

            {isEditingMessage ? (
              <Textarea
                id="message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={6}
                placeholder={t("owner.whatsapp_model.textarea_text")}
              />
            ) : (
              <div className="border rounded-md p-3 bg-gray-50 min-h-[120px] whitespace-pre-wrap">
                {customMessage}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSendWhatsApp}
              className="flex-1"
              disabled={!phoneNumber || !customMessage.trim()}
            >
              <Phone className="h-4 w-4 mr-2" />
              {t("owner.whatsapp_model.send_via_wh")}
            </Button>
            <Button variant="outline" onClick={onClose}>
              {t("owner.whatsapp_model.cancel")}
            </Button>
          </div>

          {/* Preview URL */}
          {/* <div className="text-xs text-gray-500">
            <p className="font-medium mb-1">WhatsApp URL Preview:</p>
            <div className="bg-gray-100 p-2 rounded text-xs break-all">
              https://api.whatsapp.com/send/?phone={phoneNumber}&text={encodeURIComponent(customMessage).substring(0, 100)}...
            </div>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
