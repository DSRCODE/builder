import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/authContext";
import { Link } from "react-router-dom";
import { Building } from "lucide-react";

export function Register() {
  const { register, authLoading } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    address: "",
    phone_number: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const nextStep = () => {
    if (step === 1 && (!form.name || !form.email)) {
      toast({
        title: "Step Incomplete",
        description: "Please fill in name and email.",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && (!form.password || !form.confirm_password)) {
      toast({
        title: "Step Incomplete",
        description: "Please enter both passwords.",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && form.password !== form.confirm_password) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    if (step < 3) {
      return;
    }
    if (!form.address || !form.phone_number) {
      toast({
        title: "Step Incomplete",
        description: "Please fill in address and phone number.",
        variant: "destructive",
      });
      return;
    }
    register(form);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input
                name="confirm_password"
                type="password"
                placeholder="••••••••"
                value={form.confirm_password}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                name="address"
                placeholder="123 Main St"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                name="phone_number"
                placeholder="9876543210"
                value={form.phone_number}
                onChange={handleChange}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center"
            >
              <Building className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                D Buildz
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Register Your Account
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {renderStep()}
              </motion.div>

              <div className="flex justify-between">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="button" onClick={handleSubmit} disabled={authLoading}>
                    {authLoading ? "Registering..." : "Sign Up"}
                  </Button>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center pt-2"
              >
                <span className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </span>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
