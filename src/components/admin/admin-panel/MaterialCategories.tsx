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
      {/* Desktop Table */}
      <div className="hidden md:block">
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

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {data.map((category: MaterialCategory) => (
          <div
            key={category.id}
            className="border rounded-lg p-4 shadow-sm bg-white relative"
          >
            {/* Status badge top-right */}
            <div className="absolute top-2 right-2">
              <Badge variant={category.deleted_at ? "destructive" : "default"}>
                {category.deleted_at ? "Inactive" : "Active"}
              </Badge>
            </div>

            <div className="flex items-center gap-3 mb-3">
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

            <div className="text-sm mb-1">
              <span className="font-medium">Created:</span>{" "}
              {new Date(category.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>

            <div className="text-sm mb-3">
              <span className="font-medium">Updated:</span>{" "}
              {new Date(category.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>

            {/* Action buttons bottom-right */}
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => openEditMaterialCategoryModal(category)}
                variant="outline"
                size="sm"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialCategories;
