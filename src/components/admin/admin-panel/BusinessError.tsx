import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, Loader2, Plus } from "lucide-react";

interface BusinessFormData {
  name: string;
}

interface BusinessErrorProps {
  option: {
    icon: any;
    color: string;
    title: string;
    description: string;
  };
  isAddBusinessModalOpen: boolean;
  setIsAddBusinessModalOpen: (open: boolean) => void;
  handleAddBusinessSubmit: (e: React.FormEvent) => void;
  businessFormData: BusinessFormData;
  handleBusinessInputChange: (field: keyof BusinessFormData, value: string) => void;
  addBusinessMutation: {
    isPending: boolean;
  };
  businessesError: any;
}

export default function BusinessError({
  option,
  isAddBusinessModalOpen,
  setIsAddBusinessModalOpen,
  handleAddBusinessSubmit,
  businessFormData,
  handleBusinessInputChange,
  addBusinessMutation,
  businessesError,
}: BusinessErrorProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <option.icon className={`h-5 w-5 ${option.color}`} />
            <div>
              <CardTitle>{option.title}</CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </div>
          </div>
          <Dialog
            open={isAddBusinessModalOpen}
            onOpenChange={setIsAddBusinessModalOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-2 h-4 w-4" />
                Add New Business
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Add New Business</DialogTitle>
                <DialogDescription>
                  Create a new business entity
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleAddBusinessSubmit}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    value={businessFormData.name}
                    onChange={(e) =>
                      handleBusinessInputChange("name", e.target.value)
                    }
                    placeholder="Enter business name"
                    required
                    minLength={2}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum 2 characters required
                  </p>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddBusinessModalOpen(false)}
                    disabled={addBusinessMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={addBusinessMutation.isPending}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    {addBusinessMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Business
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 mb-1">Error loading businesses</p>
            <p className="text-sm text-muted-foreground">
              {businessesError instanceof Error
                ? businessesError.message
                : "Unknown error occurred"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
