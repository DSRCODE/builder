import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Building, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Mock data - replace with API integration
const mockBusinesses = [
  {
    id: 1,
    name: "ABC Construction Ltd",
    email: "contact@abcconstruction.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Ave, City, State 12345",
    status: "Active",
    created_at: "2024-01-15",
    projects_count: 12
  },
  {
    id: 2,
    name: "BuildRight Corp",
    email: "info@buildright.com",
    phone: "+1 (555) 987-6543",
    address: "456 Construction Blvd, City, State 67890",
    status: "Active",
    projects_count: 8
  }
];

export function Businesses() {
  const [businesses] = useState(mockBusinesses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);

  const handleEdit = (business: any) => {
    setEditingBusiness(business);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    // TODO: Implement delete functionality
    console.log("Delete business:", id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Businesses</h1>
          <p className="text-muted-foreground">
            Configure business entities and settings
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Business
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingBusiness ? "Edit Business" : "Add New Business"}
              </DialogTitle>
              <DialogDescription>
                Configure business entity details and settings
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Business Name</Label>
                  <Input id="name" placeholder="ABC Construction Ltd" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="contact@business.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+1 (555) 123-4567" />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Business address" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {editingBusiness ? "Update Business" : "Create Business"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Business Entities</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage all business entities and their configurations
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell className="font-medium">
                    {business.name}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{business.email}</div>
                      <div className="text-sm text-muted-foreground">{business.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={business.address}>
                      {business.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {business.projects_count} projects
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={business.status === 'Active' ? 'default' : 'secondary'}
                    >
                      {business.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{business.created_at}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(business)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(business.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
