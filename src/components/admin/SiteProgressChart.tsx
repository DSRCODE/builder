import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building2, CheckCircle, Clock } from "lucide-react";
import { SiteProgress } from "@/types/dashboard";
import { useTranslation } from "react-i18next";

interface SiteProgressChartProps {
  siteProgress: SiteProgress[];
}

export function SiteProgressChart({ siteProgress }: SiteProgressChartProps) {
 const { t } = useTranslation();
  // Calculate summary statistics
  const totalSites = siteProgress.length;
  const completedSites = siteProgress.filter(site => site.progress >= 100).length;
  const averageProgress = totalSites > 0 ? 
    siteProgress.reduce((sum, site) => sum + site.progress, 0) / totalSites : 0;

  // Group sites by progress ranges for better visualization
  const progressRanges = {
    completed: siteProgress.filter(site => site.progress >= 100),
    nearCompletion: siteProgress.filter(site => site.progress >= 75 && site.progress < 100),
    inProgress: siteProgress.filter(site => site.progress >= 25 && site.progress < 75),
    justStarted: siteProgress.filter(site => site.progress < 25)
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {t("Dashboard.site_progress_overview")}
        </CardTitle>
        <CardDescription>
          {totalSites} {t("Dashboard.sites")} • {completedSites}{" "}
          {t("Dashboard.completed_sites")} • {t("Dashboard.avg")}:{" "}
          {averageProgress.toFixed(1)}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">
                {completedSites}
              </div>
              <div className="text-sm text-green-600 font-medium">
                {t("Dashboard.completed_sites")}
              </div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">
                {totalSites - completedSites}
              </div>
              <div className="text-sm text-blue-600 font-medium">
                {t("Dashboard.in_progress")}
              </div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {" "}
                {t("Dashboard.overall_progress")}
              </span>
              <span className="text-sm text-muted-foreground">
                {averageProgress.toFixed(1)}%
              </span>
            </div>
            <Progress value={averageProgress} className="h-3" />
          </div>

          {/* Individual Site Progress */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              {t("Dashboard.individual_sites")}:
            </h4>
            {siteProgress.map((site, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium truncate flex-1 mr-2">
                    {site.name}
                  </span>
                  <div className="flex items-center gap-1">
                    {site.progress >= 100 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                      {site.progress}%
                    </span>
                  </div>
                </div>
                <Progress value={site.progress} className="h-2" />
              </div>
            ))}
          </div>

          {/* Progress Distribution */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              {t("Dashboard.progress_distribution")}:
            </h4>
            <div className="space-y-2">
              {progressRanges.completed.length > 0 && (
                <div className="flex justify-between items-center text-sm p-2 bg-green-50 rounded">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {t("Dashboard.completed")} (100%)
                  </span>
                  <span className="font-medium">
                    {progressRanges.completed.length} {t("Dashboard.sites")}:
                  </span>
                </div>
              )}

              {progressRanges.nearCompletion.length > 0 && (
                <div className="flex justify-between items-center text-sm p-2 bg-blue-50 rounded">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    {t("near_completion")} (75-99%)
                  </span>
                  <span className="font-medium">
                    {progressRanges.nearCompletion.length}{" "}
                    {t("Dashboard.sites")}:
                  </span>
                </div>
              )}

              {progressRanges.inProgress.length > 0 && (
                <div className="flex justify-between items-center text-sm p-2 bg-yellow-50 rounded">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    {t("Dashboard.in_progress")}: (25-74%)
                  </span>
                  <span className="font-medium">
                    {progressRanges.inProgress.length} {t("Dashboard.sites")}
                  </span>
                </div>
              )}

              {progressRanges.justStarted.length > 0 && (
                <div className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    {t("Dashboard.just_started")} (0-24%)
                  </span>
                  <span className="font-medium">
                    {progressRanges.justStarted.length} {t("Dashboard.sites")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
