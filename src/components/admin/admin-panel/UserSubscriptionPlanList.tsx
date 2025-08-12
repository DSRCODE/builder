import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UserSubscriptionPlanList({ data }: any) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Subscription Type</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Package Name</TableHead>
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
              <TableCell className="text-center">{item.package ?? "NA"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
