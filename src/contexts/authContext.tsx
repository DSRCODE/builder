import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { User } from "@/types/user";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => void;
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
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
  }) => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("confirm_password", form.confirm_password);
    formData.append("address", form.address);
    formData.append("phone_number", form.phone_number);

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

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, authLoading, userLoading }}
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
