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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Loader2 } from "lucide-react";

const EditSite = ({
  isEditSiteModalOpen,
  setIsEditSiteModalOpen,
  handleEditSiteSubmit,
  siteFormData,
  handleSiteInputChange,
  editSiteMutation,
}) => {
  return (
    <Dialog open={isEditSiteModalOpen} onOpenChange={setIsEditSiteModalOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Construction Site</DialogTitle>
          <DialogDescription>
            Update the construction site details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditSiteSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit_site_name">Site Name *</Label>
              <Input
                id="edit_site_name"
                value={siteFormData.site_name}
                onChange={(e) =>
                  handleSiteInputChange("site_name", e.target.value)
                }
                placeholder="Enter site name"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_location">Location *</Label>
              <Input
                id="edit_location"
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
            <Label htmlFor="edit_address">Address *</Label>
            <Textarea
              id="edit_address"
              value={siteFormData.address}
              onChange={(e) => handleSiteInputChange("address", e.target.value)}
              placeholder="Enter complete address"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="edit_currency">Currency *</Label>
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
                  {/* <SelectItem value="$">$ (USD)</SelectItem>
                  <SelectItem value="€">€ (EUR)</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_estimated_budget">Estimated Budget *</Label>
              <Input
                id="edit_estimated_budget"
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
              <Label htmlFor="edit_progress">Progress (%)</Label>
              <Input
                id="edit_progress"
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
            <Label htmlFor="edit_total_spent">Total Spent</Label>
            <Input
              id="edit_total_spent"
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
              onClick={() => setIsEditSiteModalOpen(false)}
              disabled={editSiteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={editSiteMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {editSiteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update Site
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSite;
