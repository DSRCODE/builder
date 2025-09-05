import { useEffect, useState } from "react";
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
  const { register, authLoading, auth0User } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [authid, setAuthid] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    address: "",
    phone_number: "",
    business_name: "",
    // auth_id: "",
    // user_role_id: "",
  });
  // useEffect(() => {
  //   const storedAuth0User = localStorage.getItem("auth0User");
  //   if (storedAuth0User) {
  //     try {
  //       const userObj = JSON.parse(storedAuth0User);
  //       setForm((prev) => ({
  //         ...prev,
  //         name: userObj.name || "",
  //         email: userObj.email || "",
  //         auth_id: userObj.sub || "",
  //       }));
  //       setAuthid(userObj.sub);
  //     } catch (e) {
  //       console.error("Failed to parse auth0User from localStorage", e);
  //     }
  //   }
  // }, []);
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
    if (!form.address || !form.phone_number || !form.business_name) {
      toast({
        title: "Step Incomplete",
        description: "Please fill in address, business name and phone number.",
        variant: "destructive",
      });
      return;
    }
    // terms and conditions check
    if (!acceptedTerms) {
      toast({
        title: "Terms Not Accepted",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive",
      });
      return;
    }
    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      toast({
        title: "Weak Password",
        description:
          "Password must be at least 8 chars, include upper, lower, digit, and special character.",
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
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                name="business_name"
                placeholder="ABC private.Ltd"
                value={form.business_name}
                onChange={handleChange}
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="user_role_id">Role</Label>
              <select
                name="user_role_id"
                value={form.user_role_id}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    user_role_id: Number(e.target.value),
                  }))
                }
                className="bg-white text-gray-900 border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select Role</option>
                <option value={1}>Admin</option>
                <option value={2}>Builder</option>
                <option value={3}>Supervisor</option>
                <option value={4}>Owner</option>
                <option value={5}>Viewer</option>
              </select>
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                name="phone_number"
                placeholder="9876543210"
                value={form.phone_number}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="accepted_terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <Label
                htmlFor="accepted_terms"
                className="cursor-pointer text-sm"
              >
                I accept the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  className="text-primary underline"
                >
                  Terms and Conditions
                </a>{" "}
                &{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  className="text-primary underline"
                >
                  privacy policy
                </a>
              </Label>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
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
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={authLoading}
                    >
                      {authLoading ? "Registering..." : "Sign Up"}
                    </Button>
                  )}
                </div>
                <div></div>
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

      {/* <div className="my-4 text-center">OR</div>
        <Button
          onClick={auth0Login}
          disabled={auth0Loading}
          className="w-[450px] bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5"
        >
          {auth0Loading ? "Redirecting..." : "Log in with Auth0"}
        </Button>
      </div> */}
    </>
  );
}
