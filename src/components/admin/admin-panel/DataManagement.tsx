import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const DataManagement = ({ isExporting, handleDatabaseExport }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Backup Data</CardTitle>
                  <CardDescription>Create a backup of all system data</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Create Backup</Button>
                </CardContent>
              </Card> */}
        {/* <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Restore Data</CardTitle>
                  <CardDescription>Restore data from a backup file</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">Restore Backup</Button>
                </CardContent>
              </Card> */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {" "}
              {t("admin.datamange.title")}
            </CardTitle>
            <CardDescription>{t("admin.datamange.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleDatabaseExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("admin.datamange.exporting")}
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  {t("admin.datamange.export_db")}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataManagement;
