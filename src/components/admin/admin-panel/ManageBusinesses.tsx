import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building, Edit } from "lucide-react";
import DeleteBusinessDialog from "../DeleteBusinessDialog";
import { Business } from "@/pages/admin/AdminPanel";
import { useTranslation } from "react-i18next";

const ManageBusinesses = ({ data, openEditBusinessModal }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full">
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.mangebussiness.bussiness_name")}</TableHead>
              <TableHead>{t("admin.mangebussiness.create_date")}</TableHead>
              <TableHead>{t("admin.mangebussiness.last_update")}</TableHead>
              <TableHead>{t("admin.mangebussiness.status")}</TableHead>
              <TableHead className="text-center">
                {t("admin.mangebussiness.action")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((business: Business) => (
              <TableRow key={business.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">{business.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {t("admin.mangebussiness.bussiness_Entity")}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(business.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  {new Date(business.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={business.deleted_at ? "destructive" : "default"}
                  >
                    {business.deleted_at ? "Inactive" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditBusinessModal(business)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DeleteBusinessDialog
                      businessId={business.id}
                      businessName={business.name}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 md:hidden">
        {data.map((business: Business) => (
          <div
            key={business.id}
            className="bg-white border rounded-lg p-4 shadow-sm relative"
          >
            {/* Badge - Top Right */}
            <div className="absolute top-3 right-3">
              <Badge variant={business.deleted_at ? "destructive" : "default"}>
                {business.deleted_at ? "Inactive" : "Active"}
              </Badge>
            </div>

            {/* Main Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">{business.name}</div>
                <div className="text-sm text-muted-foreground">
                  {t("admin.mangebussiness.bussiness_Entity")}
                </div>
              </div>
            </div>

            <div className="text-sm mb-1">
              <strong> {t("admin.mangebussiness.created")}:</strong>{" "}
              {new Date(business.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="text-sm mb-10">
              {" "}
              {/* extra bottom padding for buttons */}
              <strong>{t("admin.mangebussiness.updated")}:</strong>{" "}
              {new Date(business.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>

            {/* Action Buttons - Bottom Right */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditBusinessModal(business)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <DeleteBusinessDialog
                businessId={business.id}
                businessName={business.name}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBusinesses;
