import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function UserSubscriptionPlanList({ data }: any) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/", { state: { scrollToPricing: true } });
  };
  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <div className="mb-2 flex justify-end">
        <button
          onClick={handleNavigate} // Or use navigate from react-router
          className="bg-[#04418B] text-white text-sm px-3 py-1 rounded hover:bg-[#04418B] transition"
        >
          Upgrade Plan
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        <thead className="bg-gray-50 sticky top-0">
          <TableRow>
            <TableHead className="text-center p-3">
              {t("admin.usersubscriptionlist.name")}
            </TableHead>
            <TableHead className="text-center p-3">
              {t("admin.usersubscriptionlist.email")}
            </TableHead>
            <TableHead className="text-center p-3">
              {t("admin.usersubscriptionlist.Subscriptiontype")}
            </TableHead>
            <TableHead className="text-center p-3">
              {t("admin.usersubscriptionlist.status")}
            </TableHead>
            <TableHead className="text-center p-3">
              {t("admin.usersubscriptionlist.packagename")}
            </TableHead>
          </TableRow>
        </thead>
        <TableBody>
          {data?.map((item: any) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell className="text-center p-3">
                {item?.user?.name ?? "--"}
              </TableCell>
              <TableCell className="text-center p-3">
                {item.user?.email ?? "--"}
              </TableCell>
              <TableCell className="text-center p-3">
                {item?.subscription_type ?? "--"}
              </TableCell>
              <TableCell className="text-center p-3">
                {item?.status ?? "--"}
              </TableCell>
              <TableCell className="text-center p-3">
                {item?.package?.name ?? "Free"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </table>
    </div>
  );
}
