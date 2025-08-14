import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";

export default function UserSubscriptionPlanList({ data }: any) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">
              {t("admin.usersubscriptionlist.name")}
            </TableHead>
            <TableHead className="text-center">
              {t("admin.usersubscriptionlist.email")}
            </TableHead>
            <TableHead className="text-center">
              {" "}
              {t("admin.usersubscriptionlist.Subscriptiontype")}
            </TableHead>
            <TableHead className="text-center">
              {t("admin.usersubscriptionlist.status")}
            </TableHead>
            <TableHead className="text-center">
              {t("admin.usersubscriptionlist.packagename")}{" "}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className="text-center">
                {item.user?.name ?? "--"}
              </TableCell>
              <TableCell className="text-center">
                {item.user?.email ?? "--"}
              </TableCell>
              <TableCell className="text-center">
                {item.subscription_type ?? "--"}
              </TableCell>
              <TableCell className="text-center">
                {item.status ?? "--"}
              </TableCell>
              <TableCell className="text-center">
                {item.package ?? "NA"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
