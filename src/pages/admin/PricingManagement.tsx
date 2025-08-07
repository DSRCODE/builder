import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Loader2, Users, Building2, DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import DeletePackageDialog from "@/components/admin/DeletePackageDialog";

interface Package {
  id: number;
  user_id: number;
  name: string;
  monthly_price: string;
  yearly_price: string;
  users_limit: number;
  sites_limit: number;
  description: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    image: string;
  };
}

interface PackagesResponse {
  status: boolean;
  message: string;
  data: Package[];
}

interface PricingFormData {
  name: string;
  monthly_price: string;
  yearly_price: string;
  users_limit: string;
  sites_limit: string;
  description: string;
}

const PricingManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState<PricingFormData>({
    name: "",
    monthly_price: "",
    yearly_price: "",
    users_limit: "",
    sites_limit: "",
    description: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch packages from API
  const { data: packagesData, isLoading, isError, error } = useQuery<PackagesResponse>({
    queryKey: ["packages"],
    queryFn: async () => {
      const response = await api.get("/package");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create package mutation
  const createPackageMutation = useMutation({
    mutationFn: async (packageData: PricingFormData) => {
      const response = await api.post("/package", packageData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Package created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create package",
        variant: "destructive",
      });
    },
  });

  // Update package mutation
  const updatePackageMutation = useMutation({
    mutationFn: async ({ id, packageData }: { id: number; packageData: PricingFormData }) => {
      const response = await api.post(`/package/${id}`, packageData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Package updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update package",
        variant: "destructive",
      });
    },
  });

  // Delete package mutation
  const deletePackageMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/package/delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Package deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete package",
        variant: "destructive",
      });
    },
  });

  const packages = packagesData?.data || [];

  const resetForm = () => {
    setFormData({
      name: "",
      monthly_price: "",
      yearly_price: "",
      users_limit: "",
      sites_limit: "",
      description: ""
    });
    setEditingPackage(null);
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      monthly_price: pkg.monthly_price,
      yearly_price: pkg.yearly_price,
      users_limit: pkg.users_limit.toString(),
      sites_limit: pkg.sites_limit.toString(),
      description: pkg.description
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.monthly_price || !formData.yearly_price || 
        !formData.users_limit || !formData.sites_limit) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(formData.monthly_price) <= 0 || parseFloat(formData.yearly_price) <= 0) {
      toast({
        title: "Validation Error",
        description: "Prices must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (parseInt(formData.users_limit) <= 0 || parseInt(formData.sites_limit) <= 0) {
      toast({
        title: "Validation Error",
        description: "Limits must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (editingPackage) {
      // Update existing package
      updatePackageMutation.mutate({
        id: editingPackage.id,
        packageData: formData
      });
    } else {
      // Create new package
      createPackageMutation.mutate(formData);
    }
  };

  const formatCurrency = (amount: string) => {
    return `$${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateYearlySavings = (monthlyPrice: string, yearlyPrice: string) => {
    const monthly = parseFloat(monthlyPrice) * 12;
    const yearly = parseFloat(yearlyPrice);
    const savings = monthly - yearly;
    const percentage = (savings / monthly) * 100;
    return { savings, percentage };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading packages...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading packages</p>
          <p className="text-sm text-gray-600">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pricing Management</h1>
          <p className="text-muted-foreground">
            Manage your subscription plans and pricing ({packages.length} packages)
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2 bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4" />
              Add New Package
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? "Edit Package" : "Add New Package"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Package Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Professional, Starter, Enterprise"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthly_price">Monthly Price ($) *</Label>
                  <Input
                    id="monthly_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.monthly_price}
                    onChange={(e) => setFormData({ ...formData, monthly_price: e.target.value })}
                    placeholder="49.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearly_price">Yearly Price ($) *</Label>
                  <Input
                    id="yearly_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.yearly_price}
                    onChange={(e) => setFormData({ ...formData, yearly_price: e.target.value })}
                    placeholder="490.00"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="users_limit">Users Limit *</Label>
                  <Input
                    id="users_limit"
                    type="number"
                    min="1"
                    value={formData.users_limit}
                    onChange={(e) => setFormData({ ...formData, users_limit: e.target.value })}
                    placeholder="100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sites_limit">Sites Limit *</Label>
                  <Input
                    id="sites_limit"
                    type="number"
                    min="1"
                    value={formData.sites_limit}
                    onChange={(e) => setFormData({ ...formData, sites_limit: e.target.value })}
                    placeholder="8"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the package features"
                  rows={3}
                />
              </div>

              {/* Price Preview */}
              {formData.monthly_price && formData.yearly_price && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Price Preview:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>Monthly: {formatCurrency(formData.monthly_price)}</p>
                      <p>Yearly: {formatCurrency(formData.yearly_price)}</p>
                    </div>
                    <div>
                      {(() => {
                        const { savings, percentage } = calculateYearlySavings(formData.monthly_price, formData.yearly_price);
                        return savings > 0 ? (
                          <div className="text-green-600">
                            <p>Yearly saves: {formatCurrency(savings.toString())}</p>
                            <p>({percentage.toFixed(1)}% discount)</p>
                          </div>
                        ) : (
                          <p className="text-red-600">Yearly price should be less than monthly × 12</p>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={createPackageMutation.isPending || updatePackageMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createPackageMutation.isPending || updatePackageMutation.isPending}
                >
                  {(createPackageMutation.isPending || updatePackageMutation.isPending) ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingPackage ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      {editingPackage ? "Update Package" : "Create Package"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Package Cards Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => {
          const { savings, percentage } = calculateYearlySavings(pkg.monthly_price, pkg.yearly_price);
          return (
            <Card key={pkg.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Created by {pkg.user.name}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(pkg)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DeletePackageDialog 
                      packageId={pkg.id}
                      packageName={pkg.name}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{formatCurrency(pkg.monthly_price)}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{formatCurrency(pkg.yearly_price)}</span>
                    <span className="text-sm text-muted-foreground">/year</span>
                  </div>
                  {savings > 0 && (
                    <div className="text-sm text-green-600">
                      Save {formatCurrency(savings.toString())} ({percentage.toFixed(1)}%) yearly
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Up to {pkg.users_limit} users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Up to {pkg.sites_limit} sites</span>
                  </div>
                </div>

                {pkg.description && (
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                )}

                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Created: {formatDate(pkg.created_at)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

   
    </div>
  );
};

export default PricingManagement;
