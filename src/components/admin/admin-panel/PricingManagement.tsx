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
import { Building2, DollarSign, Edit, Trash2, Users } from "lucide-react";

const PricingManagement = ({
  data,
  openEditPricingModal,
  handleDeletePricing,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Plan Details</TableHead>
          <TableHead>Monthly Price</TableHead>
          <TableHead>Yearly Price</TableHead>
          <TableHead>Max Users</TableHead>
          <TableHead>Max Sites</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((plan: PricingPlan) => (
          <TableRow key={plan.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">{plan.plan}</div>
                  <div className="text-sm text-muted-foreground">
                    Pricing Plan
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium text-green-600">
                ${plan.monthlyPrice.toFixed(2)}/month
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium text-blue-600">
                ${plan.yearlyPrice.toFixed(2)}/year
              </div>
              <div className="text-xs text-muted-foreground">
                Save ${(plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(2)}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className="flex items-center gap-1 w-fit"
              >
                <Users className="h-3 w-3" />
                {plan.users} users
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className="flex items-center gap-1 w-fit"
              >
                <Building2 className="h-3 w-3" />
                {plan.sites} sites
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={plan.status === "Active" ? "default" : "secondary"}
              >
                {plan.status}
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
                  onClick={() => handleDeletePricing(plan.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PricingManagement;
