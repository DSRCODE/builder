import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertCircle, Package } from "lucide-react";

interface MaterialCategoryErrorProps {
  materialCategoriesError: any;
}

export default function MaterialCategoryError({
  materialCategoriesError,
}: MaterialCategoryErrorProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-600" />
            <div>
              <CardTitle>Material Categories</CardTitle>
              <CardDescription>
                Organize material types and categories
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 mb-1">
              Error loading material categories
            </p>
            <p className="text-sm text-muted-foreground">
              {materialCategoriesError instanceof Error
                ? materialCategoriesError.message
                : "Unknown error occurred"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
