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

const ManageBusinesses = ({ data, openEditBusinessModal }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Business Name</TableHead>
          <TableHead>Created Date</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Actions</TableHead>
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
                    Business Entity
                  </div>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <div className="text-sm">
                {new Date(business.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {new Date(business.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={business.deleted_at ? "destructive" : "default"}>
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
  );
};

export default ManageBusinesses;
