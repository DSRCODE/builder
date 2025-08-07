import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Login } from "./pages/Login";
import { AdminLayout } from "./components/admin/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { Sites } from "./pages/admin/Sites";
import { Materials } from "./pages/admin/Materials";
import { Labour } from "./pages/admin/Labour";
import { Advances } from "./pages/admin/Advances";
import { OwnerDetails } from "./pages/admin/OwnerDetails";
import { Expenses } from "./pages/admin/Expenses";
import { Reports } from "./pages/admin/Reports";
import { AdminPanel } from "./pages/admin/AdminPanel";
import PricingManagement from "./pages/admin/PricingManagement";
import { AuthProvider } from "./contexts/authContext";
import { Register } from "./pages/Signup";
import AuthGuard from "./guards/AuthGuard";
import GuestGuard from "./guards/GuestGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ThemeProvider defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="" element={<GuestGuard />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>
                <Route
                  path="/"
                  element={
                    <AuthGuard>
                      <AdminLayout />
                    </AuthGuard>
                  }
                >
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="sites" element={<Sites />} />
                  <Route path="materials" element={<Materials />} />
                  <Route path="labour" element={<Labour />} />
                  <Route path="advances" element={<Advances />} />
                  <Route path="owner-details" element={<OwnerDetails />} />
                  <Route path="expenses" element={<Expenses />} />
                  {/* <Route path="pricing" element={<PricingManagement />} /> */}
                  <Route path="reports" element={<Reports />} />
                  <Route path="admin" element={<AdminPanel />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
