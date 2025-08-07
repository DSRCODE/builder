import { useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { useCreateOwner } from "@/hooks/useOwners";
import { useConstructionSites } from "@/hooks/useConstructionSites";
import { OwnerFormData } from "@/types/owner";
import { toast } from "sonner";

interface AddOwnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddOwnerModal({ open, onOpenChange }: AddOwnerModalProps) {
  const createOwner = useCreateOwner();
  const { data: sitesResponse, isLoading: sitesLoading, error: sitesError } = useConstructionSites();
  
  const [formData, setFormData] = useState<OwnerFormData>({
    site_id: "",
    name: "",
    phone_number: ""
  });

  const handleInputChange = (field: keyof OwnerFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.site_id || !formData.name || !formData.phone_number) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone_number.replace(/\D/g, ''))) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      await createOwner.mutateAsync(formData);
      
      // Reset form and close modal on success
      setFormData({
        site_id: "",
        name: "",
        phone_number: ""
      });
      onOpenChange(false);
      
    } catch (error) {
      console.error('Failed to create owner:', error);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      site_id: "",
      name: "",
      phone_number: ""
    });
    onOpenChange(false);
  };

  const sites = sitesResponse?.data || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Owner</DialogTitle>
          <DialogDescription>
            Add a new owner and associate them with a construction site.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Site Selection */}
          <div className="space-y-2">
            <Label htmlFor="site_id">Site *</Label>
            {sitesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : sitesError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load sites: {sitesError.message}
                </AlertDescription>
              </Alert>
            ) : (
              <Select
                value={formData.site_id}
                onValueChange={(value) => handleInputChange("site_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id.toString()}>
                      <div>
                        <div className="font-medium">{site.site_name}</div>
                        <div className="text-xs text-muted-foreground">{site.address}</div>
                        <div className="text-xs text-muted-foreground">
                          {site.business.name} • {site.currency}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Owner Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Owner Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Shivaji, Rajesh, Suresh"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number *</Label>
            <Input
              id="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={(e) => handleInputChange("phone_number", e.target.value)}
              placeholder="919876113200"
            />
            <p className="text-xs text-muted-foreground">
              Enter phone number with country code (e.g., 919876113200)
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createOwner.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createOwner.isPending || sitesLoading}
            >
              {createOwner.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {createOwner.isPending ? 'Adding...' : 'Add Owner'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
