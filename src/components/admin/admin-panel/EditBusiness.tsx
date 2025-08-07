import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Loader2 } from "lucide-react";

const EditBusiness = ({
  isEditBusinessModalOpen,
  setIsEditBusinessModalOpen,
  handleEditBusinessSubmit,
  businessFormData,
  handleBusinessInputChange,
  updateBusinessMutation,
}) => {
  return (
    <Dialog
      open={isEditBusinessModalOpen}
      onOpenChange={setIsEditBusinessModalOpen}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Business</DialogTitle>
          <DialogDescription>Update the business information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditBusinessSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit_business_name">Business Name *</Label>
            <Input
              id="edit_business_name"
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
              onClick={() => setIsEditBusinessModalOpen(false)}
              disabled={updateBusinessMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateBusinessMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {updateBusinessMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update Business
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBusiness;
