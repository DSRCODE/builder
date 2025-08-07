import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Building2, Edit } from "lucide-react";
import DeleteSiteDialog from "../DeleteSiteDialog";
import { Badge } from "@/components/ui/badge";
import { ConstructionSite } from "@/pages/admin/AdminPanel";

const ManageSites = ({ data, openEditSiteModal }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Site Details</TableHead>
          <TableHead>Business</TableHead>
          <TableHead>Address & Location</TableHead>
          <TableHead>Budget & Spent</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Created Date</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((site: ConstructionSite) => (
          <TableRow key={site.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                {site.site_image ? (
                  <img
                    src={site.site_image}
                    alt={site.site_name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-gray-500" />
                  </div>
                )}
                <div>
                  <div className="font-medium">{site.site_name}</div>
                  <div className="text-sm text-muted-foreground">
                    ID: {site.id}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium text-blue-600">
                  {site.business.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  Business ID: {site.business.id}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="max-w-xs">
                <div className="truncate font-medium" title={site.address}>
                  {site.address}
                </div>
                <Badge variant="outline" className="mt-1">
                  {site.location}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="text-muted-foreground">Budget: </span>
                  <span className="font-medium">
                    {site.currency === "INR" || site.currency === "₹"
                      ? "₹"
                      : site.currency}
                    {parseFloat(site.estimated_budget).toLocaleString(
                      site.currency === "INR" ? "en-IN" : "en-US"
                    )}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Spent: </span>
                  <span className="font-medium text-red-600">
                    {site.currency === "INR" || site.currency === "₹"
                      ? "₹"
                      : site.currency}
                    {parseFloat(site.total_spent).toLocaleString(
                      site.currency === "INR" ? "en-IN" : "en-US"
                    )}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(site.progress, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{site.progress}%</span>
              </div>
            </TableCell>
            <TableCell>
              {site.user ? (
                <div className="flex items-center gap-2">
                  <img
                    src={site.user.image}
                    alt={site.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-medium">{site.user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {site.user.user_role || "User"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No user assigned
                </div>
              )}
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {new Date(site.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditSiteModal(site)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <DeleteSiteDialog siteId={site.id} siteName={site.site_name} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ManageSites;
