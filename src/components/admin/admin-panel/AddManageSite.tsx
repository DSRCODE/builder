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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";

const AddManageSite = ({
  isAddSiteModalOpen,
  setIsAddSiteModalOpen,
  handleAddSiteSubmit,
  siteFormData,
  handleSiteInputChange,
  addSiteMutation,
}) => {
  return (
    <Dialog open={isAddSiteModalOpen} onOpenChange={setIsAddSiteModalOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" />
          Add New Site
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Construction Site</DialogTitle>
          <DialogDescription>
            Create a new construction site with all the necessary details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddSiteSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="site_name">Site Name *</Label>
              <Input
                id="site_name"
                value={siteFormData.site_name}
                onChange={(e) =>
                  handleSiteInputChange("site_name", e.target.value)
                }
                placeholder="Enter site name"
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={siteFormData.location}
                onChange={(e) =>
                  handleSiteInputChange("location", e.target.value)
                }
                placeholder="e.g., India, USA"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={siteFormData.address}
              onChange={(e) => handleSiteInputChange("address", e.target.value)}
              placeholder="Enter complete address"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="currency">Currency *</Label>
              <Select
                value={siteFormData.currency}
                onValueChange={(value) =>
                  handleSiteInputChange("currency", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="₹">₹ (INR)</SelectItem>
                  <SelectItem value="$">$ (USD)</SelectItem>
                  <SelectItem value="€">€ (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="estimated_budget">Estimated Budget *</Label>
              <Input
                id="estimated_budget"
                type="number"
                min="0"
                step="0.01"
                value={siteFormData.estimated_budget}
                onChange={(e) =>
                  handleSiteInputChange("estimated_budget", e.target.value)
                }
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={siteFormData.progress}
                onChange={(e) =>
                  handleSiteInputChange("progress", e.target.value)
                }
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="total_spent">Total Spent</Label>
            <Input
              id="total_spent"
              type="number"
              min="0"
              step="0.01"
              value={siteFormData.total_spent}
              onChange={(e) =>
                handleSiteInputChange("total_spent", e.target.value)
              }
              placeholder="0.00"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddSiteModalOpen(false)}
              disabled={addSiteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addSiteMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {addSiteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Site
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddManageSite;
