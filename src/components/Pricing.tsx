import { motion } from "framer-motion";
import {
  Check,
  Star,
  Loader2,
  Users,
  Building2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "react-router-dom";
import { openRazorpayCheckout } from "@/utils/razorpay";

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

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const { t } = useTranslation();
  const { user } = useAuth();
  console.log(user);
  const navigate = useNavigate();

  const handleNavigation = async (pkg: any) => {
    if (user === null) {
      navigate("/login");
      return;
    }
    try {
       const formData = new FormData();
       formData.append("package_id", pkg.id.toString());
       formData.append("type", billingCycle);
      // Send request to your backend to create a package order
      const response = await api.post("/package/create-order", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
    });

      // The backend should respond with { order_id, amount, ... }
      const { order_id, amount, razorpay_key } = response.data;

      console.log(response)

      openRazorpayCheckout({
        amount: amount / 100, // Razorpay returns amount in paise
        name: pkg.name + " Plan",
        description: "Subscribe to " + pkg.name,
        email: user?.email || "",
        phone: user?.phone_number || "",
        order_id: order_id,
        key: razorpay_key,
        // use actual order ID from backend
      });
    } catch (err) {
      console.error("Order creation failed:", err);
      alert("Could not initiate payment. Please try again.");
    }
  };

  // Fetch packages from API
  const {
    data: packagesData,
    isLoading,
    isError,
    error,
  } = useQuery<PackagesResponse>({
    queryKey: ["packages"],
    queryFn: async () => {
      const response = await api.get("/package-list");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const packages = packagesData?.data || [];

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString();
  };

  const calculateYearlySavings = (
    monthlyPrice: string,
    yearlyPrice: string
  ) => {
    const monthly = parseFloat(monthlyPrice) * 12;
    const yearly = parseFloat(yearlyPrice);
    const savings = monthly - yearly;
    const percentage = (savings / monthly) * 100;
    return { savings, percentage };
  };

  const getMostPopularPackage = () => {
    if (packages.length === 0) return null;
    // You can implement logic to determine the most popular package
    // For now, let's assume the middle package or the one with most users is popular
    return packages.length >= 2 ? packages[1] : packages[0];
  };

  const popularPackage = getMostPopularPackage();

  if (isLoading) {
    return (
      <section
        id="pricing"
        className="py-20 bg-gradient-to-b from-background to-muted/20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("pricing.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("pricing.subtitle")}
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">{t("pricing.loading")}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section
        id="pricing"
        className="py-20 bg-gradient-to-b from-background to-muted/20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("pricing.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("pricing.subtitle")}
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-2"> {t("pricing.err_loading")}</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Please try again later"}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (packages.length === 0) {
    return (
      <section
        id="pricing"
        className="py-20 bg-gradient-to-b from-background to-muted/20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("pricing.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("pricing.subtitle")}
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2"> {t("pricing.no_plans")}</p>
              <p className="text-sm text-muted-foreground">
                {t("pricing.check_back")}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleRazorpayPayment = (pkg: any) => {
    console.log(pkg);
    // Replace amount, user details as needed.
    // openRazorpayCheckout({
    //   amount: billingCycle === "yearly" ? pkg.yearly_price : pkg.monthly_price,
    //   name: pkg.name + " Plan",
    //   description: "Subscribe to " + pkg.name,
    //   email: user?.email || "",
    //   phone: user?.phone_number || "",
    //   order_id: "optional_order_id_from_backend"
    // });
  };

  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t("pricing.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("pricing.subtitle")}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span
              className={`text-sm ${
                billingCycle === "monthly"
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {t("pricing.monthly")}
            </span>
            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly"
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === "yearly" ? "bg-primary" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm ${
                billingCycle === "yearly"
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {t("pricing.yearly")}
            </span>
            {billingCycle === "yearly" && (
              <Badge variant="secondary" className="ml-2">
                {t("pricing.save")}
              </Badge>
            )}
          </div>
        </motion.div>

        <div
          className={`grid gap-8 max-w-7xl mx-auto ${
            packages.length === 1
              ? "md:grid-cols-1 max-w-md"
              : packages.length === 2
              ? "md:grid-cols-2 max-w-4xl"
              : "md:grid-cols-3"
          }`}
        >
          {packages.map((pkg, index) => {
            const isPopular = popularPackage?.id === pkg.id;
            const { savings, percentage } = calculateYearlySavings(
              pkg.monthly_price,
              pkg.yearly_price
            );
            const currentPrice =
              billingCycle === "monthly" ? pkg.monthly_price : pkg.yearly_price;
            const priceLabel = billingCycle === "monthly" ? "/month" : "/year";
            console.log(isPopular);
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card
                  className={`h-full transition-all duration-300 hover:shadow-xl ${
                    isPopular
                      ? "ring-2 ring-primary shadow-lg scale-105"
                      : "hover:scale-105"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1 flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {t("pricing.popular")}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8 pt-8">
                    <CardTitle className="text-2xl font-bold">
                      {pkg.name}
                    </CardTitle>
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold">
                          ₹{formatPrice(currentPrice)}
                        </span>
                        <span className="text-muted-foreground">
                          {priceLabel}
                        </span>
                      </div>
                      {billingCycle === "yearly" && savings > 0 && (
                        <div className="text-sm text-green-600 mt-1">
                          {t("pricing.save1")}₹{formatPrice(savings.toString())}{" "}
                          ({percentage.toFixed(0)}% off)
                        </div>
                      )}
                      {billingCycle === "monthly" && (
                        <div className="text-sm text-muted-foreground mt-1">
                          ₹{formatPrice(pkg.yearly_price)}/ {t("pricing.year")}({" "}
                          {t("pricing.save2")}{" "}
                          {calculateYearlySavings(
                            pkg.monthly_price,
                            pkg.yearly_price
                          ).percentage.toFixed(0)}
                          %)
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="w-4 h-4 text-primary" />
                          <div className="font-semibold text-lg">
                            {pkg.users_limit}
                          </div>
                        </div>
                        <div className="text-muted-foreground">
                          {" "}
                          {t("pricing.users")}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Building2 className="w-4 h-4 text-primary" />
                          <div className="font-semibold text-lg">
                            {pkg.sites_limit}
                          </div>
                        </div>
                        <div className="text-muted-foreground">
                          {t("pricing.sites")}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {pkg.description && (
                      <div className="mb-6">
                        <p className="text-sm text-muted-foreground text-center">
                          {pkg.description}
                        </p>
                      </div>
                    )}

                    {/* Standard Features */}
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">
                          {t("pricing.features.f0")} {pkg.users_limit}{" "}
                          {t("pricing.features.f0.1")}
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">
                          {pkg.sites_limit} {t("pricing.features.f1")}
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">
                          {t("pricing.features.f2")}
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">
                          {t("pricing.features.f3")}
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">
                          {t("pricing.features.f4")}
                        </span>
                      </li>
                      {pkg.users_limit >= 25 && (
                        <>
                          <li className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-sm">
                              {t("pricing.features.f5")}
                            </span>
                          </li>
                          <li className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-sm">
                              {t("pricing.features.f6")}
                            </span>
                          </li>
                        </>
                      )}
                      {pkg.users_limit >= 100 && (
                        <>
                          <li className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-sm">
                              {t("pricing.features.f7")}
                            </span>
                          </li>
                          <li className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-sm">
                              {t("pricing.features.f8")}
                            </span>
                          </li>
                          <li className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-sm">
                              {" "}
                              {t("pricing.features.f9")}
                            </span>
                          </li>
                        </>
                      )}
                    </ul>

                    <Button
                      className={`w-full transition-all duration-300 ${
                        isPopular
                          ? "bg-primary hover:bg-primary-glow"
                          : "bg-primary/70 hover:bg-primary-glow"
                      }`}
                      onClick={() => handleNavigation(pkg)}
                    >
                      {t("pricing.btn")}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            {t("pricing.sln")}

            <span className="text-primary font-medium cursor-pointer hover:underline">
              {t("pricing.cnt")}
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
