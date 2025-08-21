import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { User } from "@/types/user";
import { useAuth0 } from "@auth0/auth0-react";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
type PlanCheckType = {
  days_remaining: number;
  sites_remaining: number;
  users_remaining: number;
};
type AuthContextType = {
  user: User | null;
  planCheck: PlanCheckType | null;

  login: (email: string, password: string, auth_id: string) => void;
  logout: () => void;
  register: (form: {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    address: string;
    phone_number: string;
  }) => void;
  authLoading: boolean;
  userLoading: boolean;
  // Add Auth0 hooks
  auth0Login: () => void;
  auth0Logout: () => void;
  auth0User: any;
  auth0Loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [planCheck, setPlanCheck] = useState<PlanCheckType | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log(planCheck);

  const login = async (email: string, password: string, auth_id: string) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("auth_id", auth_id);
    setAuthLoading(true);
    try {
      const response = await api.post("/login", formData);
      if (
        response.data.status === "success" &&
        response.data.data?.userDetails
      ) {
        setUser(response.data.data.userDetails);
        localStorage.setItem("token", response.data.token);
        toast({
          title: "Login successful",
          description: "You have been logged in successfully.",
        });
      } else {
        throw new Error(response.data.msg || "Login failed");
      }
      // ✅ Role-based redirect
      if (response.data.data.userDetails.user_role === "admin") {
        navigate("/dashboard");
      } else if (response.data.data.userDetails.user_role === "supervisor") {
        navigate("/sites");
      } else {
        navigate("/dashboard"); // fallback
      }
    } catch (error: any) {
      setUser(null);
      let message = error?.message || "An error occurred during login.";
      if (message === "messages.your_email_or_password_is_incorrect") {
        message = "Your email or password is incorrect.";
      }
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (form: {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    address: string;
    phone_number: string;
    business_name: string;
    user_role_id: Number;
    // auth_id: string;
  }) => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("confirm_password", form.confirm_password);
    formData.append("address", form.address);
    formData.append("phone_number", form.phone_number);
    formData.append("business_name", form.business_name);
    // formData.append("auth_id", form.auth_id);
    // formData.append("user_role_id", Number(form.user_role_id));

    setAuthLoading(true);
    try {
      const response = await api.post("/signup", formData); // Adjust the endpoint as needed

      if (
        response.data.status === "success" &&
        Object.keys(response.data.errors || {}).length === 0
      ) {
        toast({
          title: "Registration successful",
          description: "Your account has been created. Please log in.",
        });
        navigate("/login");
      } else {
        throw new Error(
          response?.data?.errors?.email[0] || "Registration failed"
        );
      }
    } catch (error: any) {
      let message = error?.message || "An error occurred during registration.";
      if (message === "messages.the_email_has_already_been_taken") {
        message = "Email already exists.";
      }
      console.log(error);
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchUser = async () => {
    setUserLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }
      const response = await api.get("/get-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status === "success" && response.data.data) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchUserPlan = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPlanCheck(null);
        return;
      }

      const res = await api.get("/user-plan-data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(res);

      if (res.data.status === true && res.data.data.limits) {
        setPlanCheck(res.data.data.limits);
      } else {
        setPlanCheck(null);
      }
    } catch (error) {
      setPlanCheck(null);
    }
  };
  useEffect(() => {
    fetchUser();
    fetchUserPlan();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  // Auth0 hooks
  const {
    loginWithRedirect,
    logout: auth0Logout,
    user: auth0User,
    isLoading: auth0Loading,
    isAuthenticated,
  } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && auth0User) {
      localStorage.setItem("auth0User", JSON.stringify(auth0User));
    }
  }, [isAuthenticated, auth0User]);

  const auth0Login = () => loginWithRedirect();

  console.log(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        planCheck,
        login,
        register,
        logout,
        authLoading,
        userLoading,
        auth0Login,
        auth0Logout,
        auth0User,
        auth0Loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
