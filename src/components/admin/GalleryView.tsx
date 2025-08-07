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
import { GalleryThumbnails, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api, { BASE_URL } from "@/lib/api";
import { Card, CardContent } from "../ui/card";
import { useTranslation } from "react-i18next";

const GalleryView = ({ data }) => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchImages = async () => {
    const { data: res } = await api(`/site-images/${data.id}`);
    console.log(data);
    if (res?.data) {
      return res.data;
    }
    return [];
  };

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["site-images", data.id],
    queryFn: fetchImages,
    enabled: isDialogOpen,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch images when dialog opens
  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    // Use React Query to fetch images when dialog opens
    // (fetchImages is no longer needed)
    if (open) {
      fetchImages();
    }
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <GalleryThumbnails />
          {t("sites.view_gallery")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>
            {" "}
            {t("sites.photo_gallery")}: {data.site_name}
          </DialogTitle>
          <DialogDescription>{t("sites.click_on_photo")}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <Loader2 className="text-center animate-spin" />
        ) : photos?.images && photos.images.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {photos.images.map((photo, index) => (
              <Card className="p-2">
                <img
                  key={index}
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="rounded-md cursor-pointer object-contain aspect-video"
                  onClick={() => window.open(photo, "_blank")}
                />
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            {t("sites.no_photo_avaliable")}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            {t("sites.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryView;
