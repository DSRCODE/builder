import { useAuth } from "@/contexts/authContext";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

const GuestGuard = () => {
  const { user, userLoading } = useAuth();

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

export default GuestGuard;
