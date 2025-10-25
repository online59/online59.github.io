import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function NotesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        <CardDescription>This feature is currently under construction.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <Construction className="size-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">The notes functionality is not available in this static version of the site.
        <br />Please run the application in a server environment to use this feature.</p>
      </CardContent>
    </Card>
  );
}
