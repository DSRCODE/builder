import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";

const AddMaterialCategory = ({
  isAddMaterialCategoryModalOpen,
  setIsAddMaterialCategoryModalOpen,
  handleAddMaterialCategorySubmit,
  materialCategoryFormData,
  handleMaterialCategoryInputChange,
  addMaterialCategoryMutation,
}) => {
  return (
    <Dialog
      open={isAddMaterialCategoryModalOpen}
      onOpenChange={setIsAddMaterialCategoryModalOpen}
    >
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Material Category</DialogTitle>
          <DialogDescription>
            Create a new material category to organize your materials
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddMaterialCategorySubmit} className="space-y-4">
          <div>
            <Label htmlFor="category_name">Category Name *</Label>
            <Input
              id="category_name"
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
              onClick={() => setIsAddMaterialCategoryModalOpen(false)}
              disabled={addMaterialCategoryMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addMaterialCategoryMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {addMaterialCategoryMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMaterialCategory;
