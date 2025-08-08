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
import { Loader2, Plus } from "lucide-react";

const AddPricing = ({
  isAddPricingModalOpen,
  setIsAddPricingModalOpen,
  pricingPlans,
  handleAddPricingSubmit,
  pricingFormData,
  handlePricingInputChange,
}) => {
  return (
    <Dialog
      open={isAddPricingModalOpen}
      onOpenChange={setIsAddPricingModalOpen}
    >
      <DialogTrigger asChild>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          // disabled={pricingPlans.length >= 3}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Plan {pricingPlans.length >= 3 && "(Max 3)"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Pricing Plan</DialogTitle>
          <DialogDescription>
            Create a new pricing plan with features and limits (Maximum 3 plans
            allowed)
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddPricingSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plan_name">Plan Name *</Label>
              <Input
                id="plan_name"
                value={pricingFormData.plan}
                onChange={(e) =>
                  handlePricingInputChange("plan", e.target.value)
                }
                placeholder="e.g., Starter, Professional"
                required
              />
            </div>
            <div>
              <Label htmlFor="plan_status">Status *</Label>
              <Select
                value={pricingFormData.status}
                onValueChange={(value) =>
                  handlePricingInputChange("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthly_price">Monthly Price ($) *</Label>
              <Input
                id="monthly_price"
                type="number"
                min="0"
                step="0.01"
                value={pricingFormData.monthlyPrice}
                onChange={(e) =>
                  handlePricingInputChange("monthlyPrice", e.target.value)
                }
                placeholder="49.99"
                required
              />
            </div>
            <div>
              <Label htmlFor="yearly_price">Yearly Price ($) *</Label>
              <Input
                id="yearly_price"
                type="number"
                min="0"
                step="0.01"
                value={pricingFormData.yearlyPrice}
                onChange={(e) =>
                  handlePricingInputChange("yearlyPrice", e.target.value)
                }
                placeholder="499.99"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max_users">Max Users *</Label>
              <Input
                id="max_users"
                type="number"
                min="1"
                value={pricingFormData.users}
                onChange={(e) =>
                  handlePricingInputChange("users", e.target.value)
                }
                placeholder="5"
                required
              />
            </div>
            <div>
              <Label htmlFor="max_sites">Max Sites *</Label>
              <Input
                id="max_sites"
                type="number"
                min="1"
                value={pricingFormData.sites}
                onChange={(e) =>
                  handlePricingInputChange("sites", e.target.value)
                }
                placeholder="3"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddPricingModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPricing;
