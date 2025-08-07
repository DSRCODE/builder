import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Camera, Upload } from "lucide-react";

const sites = [
  {
    id: 1,
    name: "Lavanya - Sai Enclave",
    location: "Ballari India",
    progress: 0,
    budget: "₹8,225,000",
    spent: "₹0",
    users: 0,
    status: "Not Started"
  },
  {
    id: 2,
    name: "Shivaji - Srirampur colony",
    location: "Bombay press road",
    progress: 0,
    budget: "₹700,000",
    spent: "₹0",
    users: 0,
    status: "Not Started"
  },
  {
    id: 3,
    name: "Anil Site",
    location: "Talur road",
    progress: 0,
    budget: "₹20,000,000",
    spent: "₹0",
    users: 0,
    status: "Not Started"
  }
];

export function Sites() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sites Overview</h1>
          <p className="text-muted-foreground">Detailed site management is in the Admin Panel.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => (
          <Card key={site.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">{site.name}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {site.location}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Placeholder Image */}
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <span className="text-muted-foreground text-4xl font-light">600 × 400</span>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress:</span>
                  <span className="font-medium">{site.progress}%</span>
                </div>
                <Progress value={site.progress} className="h-2" />
              </div>

              {/* Site Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-medium">{site.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Spent:</span>
                  <span className="font-medium">{site.spent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Users Assigned:</span>
                  <span className="font-medium">{site.users}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="text-xs">
                  {site.status}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Camera className="mr-2 h-4 w-4" />
                  View Gallery
                </Button>
                <Button size="sm" className="flex-1">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}