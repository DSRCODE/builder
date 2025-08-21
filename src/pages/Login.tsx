import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/contexts/authContext";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const baseURL = import.meta.env.VITE_BASE_URL;
interface DecodedIdToken {
  sub: string;
  email?: string;
  name?: string;
  [key: string]: any;
}
export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [stage, setStage] = useState<"login" | "mfa">("login");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const storeTokens = (data: any) => {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("id_token", data.id_token);
    if (data.id_token) {
      localStorage.setItem("id_token", data.id_token);
      const decoded = jwtDecode<DecodedIdToken>(data.id_token);
      console.log("Decoded ID Token:", decoded);
      console.log("Auth ID (user_id):", decoded.sub);
      localStorage.setItem("auth_id", decoded.sub);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Login Failed",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`https://${domain}/oauth/token`, {
        grant_type: "http://auth0.com/oauth/grant-type/password-realm",
        username: email,
        password,
        audience: `https://${domain}/api/v2/`,
        scope: "openid profile email",
        client_id: clientId,
        realm: `Username-Password-Authentication`, // your database connection name
      });
      console.log(res);
      if (res.data.mfa_required) {
        setMfaToken(res.data.mfa_token);
        setStage("mfa");
      } else {
        storeTokens(res.data);
        toast({
          title: "Login Successful",
          description: "You have been signed in.",
        });
        navigate("/"); // or your protected route
      }
    } catch (err: any) {
      // toast({
      //   title: "Login Failed",
      //   description:
      //     err.response?.data?.error_description || "Error during login.",
      //   variant: "destructive",
      // });
      console.log(err.response?.data?.error_description || err);
      setMfaToken(err.response?.data?.mfa_token);
      setStage("mfa");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMfa = async () => {
    if (!otp) {
      toast({
        title: "OTP Failed",
        description: "Please enter the OTP code.",
        variant: "destructive",
      });
      return;
    }
    if (!mfaToken) {
      toast({
        title: "OTP Failed",
        description: "No MFA token found. Please login first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`https://${domain}/oauth/token`, {
        grant_type: "http://auth0.com/oauth/grant-type/mfa-otp",
        client_id: clientId,
        mfa_token: mfaToken,
        otp,
      });

      storeTokens(res.data);
      // Retrieve auth_id from localStorage here
      const authId = localStorage.getItem("auth_id") || "";

      // Call your custom login with stored authId
      login(email, password, authId);
    } catch (err: any) {
      alert(
        err.response?.data?.error_description || "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/10 flex items-center flex-col justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
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
                  Construction Management System
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {stage === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@dbuildz.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-background border-border focus:border-primary"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-background border-border focus:border-primary"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      disabled={loading}
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5"
                    >
                      {loading ? "Signing In..." : "Sign In"}
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center pt-2"
                  >
                    <span className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="text-primary hover:underline font-medium"
                      >
                        Sign up
                      </Link>
                    </span>
                  </motion.div>
                </form>
              )}

              {stage === "mfa" && (
                <>
                  <h2 className="text-center text-lg font-semibold mb-4">
                    Enter OTP (Google Authenticator)
                  </h2>
                  <input
                    type="text"
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                    disabled={loading}
                  />
                  <div className="mt-4">
                    <Button
                      disabled={loading}
                      onClick={handleVerifyMfa}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5"
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
