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
import { MaterialCategory } from "@/pages/admin/AdminPanel";
import { Edit, Package, Trash2 } from "lucide-react";

const MaterialCategories = ({ data, openEditMaterialCategoryModal }) => {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category Details</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((category: MaterialCategory) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Category ID: {category.id}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {new Date(category.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {new Date(category.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={category.deleted_at ? "destructive" : "default"}
                >
                  {category.deleted_at ? "Inactive" : "Active"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={() => openEditMaterialCategoryModal(category)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
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
  );
};

export default MaterialCategories;
