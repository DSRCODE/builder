import { Button } from "@/components/ui/button";
import {
  GalleryThumbnails,
  IndianRupee,
  List,
  Loader2,
  Plus,
  Upload,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import GalleryView from "@/components/admin/GalleryView";
import ImageUploadModal from "@/components/admin/ImageUploadModal";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { useTranslation } from "react-i18next";
import { USER_ROLES } from "@/utils/roleUtils";

export function Sites() {
  return (
    <AdminRoute
      requiredRole={USER_ROLES.ADMIN} // Allow both Admin (1) and Manager (2) to access sites
      fallbackTitle="Sites Management Access Required"
      fallbackMessage="You don't have permission to access sites management. Please contact your administrator."
    >
      <SitesContent />
    </AdminRoute>
  );
}

function SitesContent() {
  const { t } = useTranslation();
  async function fetchSites() {
    const { data } = await api("https://dbuildz.com/api/construction-sites");

    return data;
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["construction-sites"],
    queryFn: fetchSites,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const sites = data?.data ?? [];

  if (isLoading)
    return (
      <div className="flex justify-center flex-col ga-8 items-center h-80">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>{t("sites.loading")}</p>
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center flex-row items-center h-80">
        {t("sites.error_loading_site")}.
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t("sites.sites_mangement")}</h1>
          <p className="text-muted-foreground">
            {t("sites.manage_all_construction_site")}
          </p>
        </div>
        {/* <Button className="flex items-center gap-2 bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4" />    
          Add New Site
        </Button> */}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        {sites.map((site: any) => (
          <div
            key={site.id}
            className="rounded-lg border bg-card text-card-foreground flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="font-semibold tracking-tight font-headline text-xl">
                {site.site_name}
              </div>
              <div className="text-sm text-muted-foreground font-body">
                {site.address}
              </div>
            </div>
            <div className="p-6 pt-0 flex-grow space-y-2">
              <img
                alt={`Image of ${site.site_name}`}
                loading="lazy"
                width={600}
                height={400}
                decoding="async"
                className="rounded-md mb-4 object-cover aspect-video"
                src={site.site_image || "https://placehold.co/600x400.png"}
                style={{ color: "transparent" }}
              />
              <div>
                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-body text-sm text-muted-foreground">
                  {t("sites.progress")}: {site.progress || 0}%
                </label>
                <Progress className="h-2" value={site.progress} />
              </div>
              <p className="font-body text-sm text-muted-foreground">
                {t("Dashboard.buget")}: {site.currency}
                {site.estimated_budget
                  ? Number(site.estimated_budget).toLocaleString(
                      site.currency === "₹" ? "en-IN" : "en-US"
                    )
                  : "0"}
              </p>
              <p className="font-body text-sm text-muted-foreground">
                {t("Dashboard.total_spent")}: {site.currency}
                {site.estimated_budget
                  ? Number(site.total_spent).toLocaleString(
                      site.currency === "₹" ? "en-IN" : "en-US"
                    )
                  : "0"}
              </p>
              {/* <p className="font-body text-sm text-muted-foreground">
                Users Assigned: 0
              </p> */}
            </div>
            <div className=" p-6 pt-0 grid grid-cols-2 gap-2">
              <GalleryView data={site} />
              <ImageUploadModal siteId={site.id} siteName={site.site_name}>
                <Button>
                  <Upload />
                  {t("sites.upload_photo")}
                </Button>
              </ImageUploadModal>
            </div>
          </div>
        ))}
      </div>
      {sites?.length <= 0 && (
        <>
          <div className="text-center flex justify-center items-center flex-col border rounded-sm py-8 w-full h-[50vh]">
            <List className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t("sites.no_found")}</p>
            <p className="text-sm text-gray-500">{t("sites.first_site")}</p>
          </div>
        </>
      )}
    </div>
  );
}
