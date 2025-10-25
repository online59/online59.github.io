// This page is now a client component to allow for interactive notes.
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { NotesContainer } from "@/components/notes/notes-container";

export default function NotesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        <CardDescription>Organize your thoughts, ideas, and projects.</CardDescription>
      </CardHeader>
      <CardContent>
        <NotesContainer />
      </CardContent>
    </Card>
  );
}
