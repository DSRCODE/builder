import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useToast } from "../ui/use-toast";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface ImageUploadModalProps {
  siteId: number;
  siteName: string;
  children?: React.ReactNode;
}

const ImageUploadModal = ({
  siteId,
  siteName,
  children,
}: ImageUploadModalProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: `${t("sites.invalid_file_type")}`,
          description: `${t("sites.only_image_allowed")}`,
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: `${t("sites.file_too_large")}`,
          description: `${t("sites.file_must_be_smaller")}`,
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast({
        title: `${t("sites.no_image_selected")}`,
        description: `${t("sites.select_image_to_upload")}`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("images[0]", selectedImage);
      formData.append("site_id", siteId.toString());

      // Upload image using the API endpoint
      const response = await api.post("/site-images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        toast({
          title: `${t("sites.upload_successful")}`,
          description: `${t("sites.image_uploaded")}`,
        });

        // Invalidate and refetch site images
        queryClient.invalidateQueries({ queryKey: ["site-images", siteId] });

        // Reset form and close modal
        handleReset();
        setIsDialogOpen(false);
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: `${t("sites.upload_failed")}`,
        description:
          error.response?.data?.message ||
          error.message ||
          `${t("sites.failed_to_upload")}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      handleReset();
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Upload className="h-4 w-4" />
            {t("sites.upload_photo")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("sites.upload_image_title")}</DialogTitle>
          <DialogDescription>
            {t("sites.upload_image_description")} {siteName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Input */}

          {!previewUrl && (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">
                      {t("sites.click_to_upload")}
                    </span>{" "}
                    {t("sites.file_info")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("sites.upload_image_description")}
                  </p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={isUploading}
                />
              </label>
            </div>
          )}

          {/* Image Preview */}
          {previewUrl && (
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleReset}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    {t("sites.file")}: {selectedImage?.name}
                  </p>
                  <p>
                    {t("sites.size")}:{" "}
                    {selectedImage
                      ? (selectedImage.size / 1024 / 1024).toFixed(2)
                      : 0}{" "}
                    MB
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            disabled={isUploading}
          >
            {t("sites.cancel")}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedImage || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("sites.uploading")}...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {t("sites.upload")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadModal;
