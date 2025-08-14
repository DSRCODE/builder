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
import { PricingPlan } from "@/pages/admin/AdminPanel";
import {
  Building2,
  DollarSign,
  Edit,
  IndianRupee,
  Trash2,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const PricingManagement = ({
  data,
  openEditPricingModal,
  handleDeletePricing,
}) => {
  // console.log(data)
  const { t } = useTranslation();
  return (
    <div className="overflow-x-auto">
      {/* Desktop View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.pricemange.plan_details")}</TableHead>
              <TableHead> {t("admin.pricemange.monthly_price")}</TableHead>
              <TableHead> {t("admin.pricemange.yearly_price")}</TableHead>
              <TableHead> {t("admin.pricemange.max_users")}</TableHead>
              <TableHead> {t("admin.pricemange.max_sites")}</TableHead>
              <TableHead> {t("admin.pricemange.status")}</TableHead>
              <TableHead className="text-center">
                {" "}
                {t("admin.pricemange.action")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((plan: any) => (
              <TableRow key={plan?.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <IndianRupee className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">{plan?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {t("admin.pricemange.title")}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-green-600">
                    ₹{plan?.monthly_price}/month
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-blue-600">
                    ₹{plan?.yearly_price}/year
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Save ₹{plan?.monthly_price * 12 - plan?.yearly_price}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 w-fit"
                  >
                    <Users className="h-3 w-3" />
                    {plan?.users_limit} users
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 w-fit"
                  >
                    <Building2 className="h-3 w-3" />
                    {plan?.sites_limit} sites
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      plan?.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {plan?.status || "NA"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditPricingModal(plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDeletePricing(plan?.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="space-y-4 md:hidden">
        {data?.map((plan: any) => (
          <div
            key={plan?.id}
            className="relative border rounded-lg p-4 shadow-sm bg-white flex flex-col space-y-3"
          >
            {/* Status Badge - Top Right */}
            <Badge
              variant={plan?.status === "Active" ? "default" : "secondary"}
              className="absolute top-3 right-3"
            >
              {plan?.status || "NA"}
            </Badge>

            {/* Plan Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">{plan?.name}</div>
                <div className="text-sm text-muted-foreground">
                  {t("admin.pricemange.title")}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="text-green-600 font-medium">
              {t("admin.pricemange.monthly_price")}: ₹{plan?.monthly_price}
            </div>
            <div className="text-blue-600 font-medium">
              {t("admin.pricemange.yearly_price")}: ₹{plan?.yearly_price}
            </div>
            <div className="text-xs text-muted-foreground">
              {t("admin.pricemange.save")} ₹
              {plan?.monthly_price * 12 - plan?.yearly_price}
            </div>

            {/* Users & Sites badges in one row */}
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {plan?.users_limit} users
              </Badge>

              <Badge variant="outline" className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {plan?.sites_limit} sites
              </Badge>
            </div>

            {/* Action Buttons - Bottom Right */}
            <div className="flex justify-end gap-2 mt-auto pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditPricingModal(plan)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => handleDeletePricing(plan?.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingManagement;
