import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Package } from "lucide-react";

export default function MaterialCategoryLoading() {
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
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">
              Loading material categories...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
