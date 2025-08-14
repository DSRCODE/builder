import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Edit } from "lucide-react";
import { useUpdatePlanSettings } from "@/services/planmanagement";
import { useTranslation } from "react-i18next";

export default function ManageUserPlan({ data }: any) {
  const { t } = useTranslation();
  const planLimits = [
    {
      key: "no_of_days",
      label: `${t("admin.mangeuserplan.l1")}`,
      value: data?.no_of_days ?? 0,
    },
    {
      key: "no_of_sites",
      label: `${t("admin.mangeuserplan.l2")}`,
      value: data?.no_of_sites ?? 0,
    },
    {
      key: "no_of_users",
      label: `${t("admin.mangeuserplan.l3")}`,
      value: data?.no_of_users ?? 0,
    },
  ];

  const [open, setOpen] = useState(false);
  const [formLimits, setFormLimits] = useState({
    no_of_days: "",
    no_of_sites: "",
    no_of_users: "",
  });

  useEffect(() => {
    if (data) {
      setFormLimits({
        no_of_days: String(data.no_of_days ?? ""),
        no_of_sites: String(data.no_of_sites ?? ""),
        no_of_users: String(data.no_of_users ?? ""),
      });
    }
  }, [data]);
  const updatePlan = useUpdatePlanSettings();

  const handleLimitChange = (key: string, value: string) => {
    if (value === "" || (/^\d+$/.test(value) && Number(value) >= 0)) {
      setFormLimits((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSaveLimits = async () => {
    await updatePlan.mutateAsync({
      no_of_days: Number(formLimits.no_of_days),
      no_of_sites: Number(formLimits.no_of_sites),
      no_of_users: Number(formLimits.no_of_users),
    });
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <Table>
        <TableHeader>
          <TableRow>
            {planLimits.map((item) => (
              <TableHead key={item.key} className="text-center">
                {item.label}
              </TableHead>
            ))}
            <TableHead className="text-center">
              {t("admin.mangeuserplan.actionbtn")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {planLimits.map((item) => (
              <TableCell key={item.key} className="text-center">
                {item.value}
              </TableCell>
            ))}
            <TableCell className="text-center">
              <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                <Edit className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Edit Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("admin.mangeuserplan.edit.title")}</DialogTitle>
            <DialogDescription>
              {t("admin.mangeuserplan.edit.subtitle")}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="limits" className="mt-4">
            <TabsContent value="limits" className="space-y-4 mt-0">
              {planLimits.map((item) => (
                <div key={item.key} className="space-y-1">
                  <Label htmlFor={item.key}>{item.label}</Label>
                  <Input
                    id={item.key}
                    type="text"
                    value={formLimits[item.key as keyof typeof formLimits]}
                    onChange={(e) =>
                      handleLimitChange(item.key, e.target.value)
                    }
                  />
                </div>
              ))}
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  {t("admin.mangeuserplan.edit.btn")}
                </Button>
                <Button
                  onClick={handleSaveLimits}
                  disabled={updatePlan.isPending}
                >
                  {updatePlan.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />{" "}
                      {t("admin.mangeuserplan.edit.saving")}
                    </>
                  ) : (
                    `${t("admin.mangeuserplan.edit.save")}`
                  )}
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
