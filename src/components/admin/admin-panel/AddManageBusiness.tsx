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

const AddManageBusiness = ({
  isAddBusinessModalOpen,
  setIsAddBusinessModalOpen,
  handleAddBusinessSubmit,
  businessFormData,
  handleBusinessInputChange,
  addBusinessMutation,
}) => {
  return (
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
          <DialogDescription>Create a new business entity</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddBusinessSubmit} className="space-y-4">
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
  );
};

export default AddManageBusiness;
