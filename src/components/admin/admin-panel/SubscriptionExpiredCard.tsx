import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SubscriptionExpiredCard() {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl border border-yellow-300 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="bg-yellow-100 p-2 rounded-full">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-yellow-800">
              Your Subscription Has Expired
            </h2>
            <p className="text-sm text-yellow-700 mt-1">
              Renew your plan or purchase a new one to continue accessing all
              services.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="default"
            className="bg-yellow-500 hover:bg-yellow-600 text-white w-full sm:w-auto"
            onClick={() => navigate("/")}
          >
            Renew Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
