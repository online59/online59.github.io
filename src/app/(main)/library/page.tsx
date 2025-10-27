
"use client";

import { LibraryContainer } from "@/components/library/library-container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LibraryPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Stock Library</CardTitle>
            <CardDescription>A collection of your saved stock analyses.</CardDescription>
        </CardHeader>
        <CardContent>
            <LibraryContainer />
        </CardContent>
    </Card>
  );
}
