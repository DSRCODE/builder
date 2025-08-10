import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, DollarSign, Loader2 } from "lucide-react";

const LaborWages = ({
  laborWageLoading,
  laborWageError,
  handleLaborWageSubmit,
  laborWageFormData,
  handleLaborWageInputChange,
  laborWage,
  saveLaborWagesMutation,
}) => {
  if (laborWageLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading wage settings...</p>
        </div>
      </div>
    );
  }

  if (laborWageError) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 mb-1">Error loading wage settings</p>
          <p className="text-sm text-muted-foreground">
            {laborWageError instanceof Error
              ? laborWageError.message
              : "Unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleLaborWageSubmit} className=" space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="mason_wage">Mason Wage (per day) *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="mason_wage"
                type="number"
                min="0"
                step="0.01"
                value={laborWageFormData.mason_wage}
                onChange={(e) =>
                  handleLaborWageInputChange("mason_wage", e.target.value)
                }
                placeholder="400.00"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="helper_wage">Helper Wage (per day) *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="helper_wage"
                type="number"
                min="0"
                step="0.01"
                value={laborWageFormData.helper_wage}
                onChange={(e) =>
                  handleLaborWageInputChange("helper_wage", e.target.value)
                }
                placeholder="800.00"
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="lady_helper_wage">
              Lady Helper Wage (per day) *
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="lady_helper_wage"
                type="number"
                min="0"
                step="0.01"
                value={laborWageFormData.lady_helper_wage}
                onChange={(e) =>
                  handleLaborWageInputChange("lady_helper_wage", e.target.value)
                }
                placeholder="600.00"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="currency">Currency *</Label>
            <Select
              value={laborWageFormData.currency}
              onValueChange={(value) =>
                handleLaborWageInputChange("currency", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Indian_rupee">Indian Rupee (₹)</SelectItem>
                <SelectItem value="US_dollar">US Dollar (₹)</SelectItem>
                <SelectItem value="Euro">Euro (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {laborWage && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Current Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Mason:</span>
              <span className="ml-2 font-medium">₹{laborWage.mason_wage}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Helper:</span>
              <span className="ml-2 font-medium">₹{laborWage.helper_wage}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Lady Helper:</span>
              <span className="ml-2 font-medium">
                ₹{laborWage.lady_helper_wage}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Last updated:{" "}
            {new Date(laborWage.updated_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full md:w-auto"
        disabled={saveLaborWagesMutation.isPending}
      >
        {saveLaborWagesMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <DollarSign className="h-4 w-4 mr-2" />
            Save Wage Settings
          </>
        )}
      </Button>
    </form>
  );
};

export default LaborWages;
