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
import { Loader2 } from "lucide-react";

const EditMaterialCategory = ({
  isEditMaterialCategoryModalOpen,
  setIsEditMaterialCategoryModalOpen,
  handleEditMaterialCategorySubmit,
  materialCategoryFormData,
  handleMaterialCategoryInputChange,
  updateMaterialCategoryMutation,
}) => {
  return (
    <Dialog
      open={isEditMaterialCategoryModalOpen}
      onOpenChange={setIsEditMaterialCategoryModalOpen}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Material Category</DialogTitle>
          <DialogDescription>
            Update the material category information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditMaterialCategorySubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit_category_name">Category Name *</Label>
            <Input
              id="edit_category_name"
              value={materialCategoryFormData.name}
              onChange={(e) =>
                handleMaterialCategoryInputChange("name", e.target.value)
              }
              placeholder="Enter category name"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditMaterialCategoryModalOpen(false)}
              disabled={updateMaterialCategoryMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMaterialCategoryMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {updateMaterialCategoryMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMaterialCategory;
