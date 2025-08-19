"use client";

import React, { useState, useEffect, useTransition } from "react";
import type { Group, Note } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MoreVertical, Trash2, Edit, Loader2, Wand2, Tag, ChevronRight, GripVertical } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getTagSuggestions } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { db } from "@/lib/firebase";
import { ref, onValue, set, remove, push } from "firebase/database";

// Helper to transform Firebase data into app data structure
const transformDataToGroups = (data: any): Group[] => {
  const fbGroups = data.groups || {};
  const fbPrinciples = data.principles || {};

  const principlesByGroup: { [key: string]: any[] } = {};
  Object.values(fbPrinciples).forEach((p: any) => {
    if (!principlesByGroup[p.groupId]) {
      principlesByGroup[p.groupId] = [];
    }
    principlesByGroup[p.groupId].push(p);
  });
  
  const groupsArray: Group[] = Object.values(fbGroups).map((group: any) => ({
    id: group.id,
    name: group.name,
    notes: (principlesByGroup[group.id] || []).map((p: any) => ({
      id: p.id,
      title: p.doctrine.substring(0, 40) + (p.doctrine.length > 40 ? '...' : ''),
      content: p.doctrine,
      groupId: p.groupId,
      tags: [], // Tags are not in the JSON structure
    })),
  }));

  return groupsArray;
};


export default function NotesContainer() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<{note: Note, groupId: string} | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const notesRef = ref(db, '/');
    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGroups(transformDataToGroups(data));
      } else {
        setGroups([]);
      }
    }, (error) => {
      console.error(error);
      toast({ title: "Error fetching notes", description: "Could not retrieve data from Firebase.", variant: "destructive" });
    });

    return () => unsubscribe();
  }, [toast]);


  const handleAddNote = () => {
    setEditingNote(null);
    setSheetOpen(true);
  };

  const handleEditNote = (note: Note, groupId: string) => {
    setEditingNote({ note, groupId });
    setSheetOpen(true);
  }

  const handleDeleteNote = (noteId: string) => {
    remove(ref(db, `/principles/${noteId}`))
      .then(() => toast({ title: "Note deleted successfully." }))
      .catch((e) => toast({ title: "Error deleting note", description: e.message, variant: 'destructive'}));
  };
  
  const handleMoveNote = (noteId: string, fromGroupId: string, toGroupId: string) => {
    if(fromGroupId === toGroupId) return;
    set(ref(db, `/principles/${noteId}/groupId`), toGroupId)
     .then(() => toast({ title: "Note moved." }))
     .catch((e) => toast({ title: "Error moving note", description: e.message, variant: 'destructive'}));
  }

  const handleSaveNote = (note: Note, groupId: string) => {
    const isEditing = !!note.id;
    const noteId = isEditing ? note.id : push(ref(db, '/principles')).key;
    if (!noteId) return;

    const noteData = {
      id: noteId,
      doctrine: note.content,
      groupId: groupId,
    };
    
    set(ref(db, `/principles/${noteId}`), noteData)
      .then(() => {
        toast({ title: isEditing ? "Note updated successfully." : "Note created successfully." });
        setSheetOpen(false);
        setEditingNote(null);
      })
      .catch((e) => toast({ title: "Error saving note", description: e.message, variant: 'destructive' }));
  };


  const handleAddGroup = (name: string) => {
    if (name.trim()) {
      const groupId = push(ref(db, '/groups')).key;
      if (!groupId) return;
      const newGroup = { id: groupId, name };
      set(ref(db, `/groups/${groupId}`), newGroup)
        .then(() => toast({ title: "Group added." }))
        .catch((e) => toast({ title: "Error adding group", description: e.message, variant: 'destructive'}));
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    // Note: This only deletes the group, not the notes within it.
    // A more robust solution would handle orphaned notes.
    remove(ref(db, `/groups/${groupId}`))
      .then(() => toast({ title: "Group deleted." }))
      .catch((e) => toast({ title: "Error deleting group", description: e.message, variant: 'destructive'}));
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Organize your thoughts, ideas, and projects.</p>
            <Button onClick={handleAddNote}><Plus className="mr-2" />Add Note</Button>
        </div>

        <Accordion type="multiple" defaultValue={groups.map(g => g.id)} className="w-full space-y-2">
            {groups.map((group) => (
                <Card key={group.id} className="overflow-hidden">
                    <AccordionItem value={group.id} className="border-b-0">
                        <AccordionTrigger className="p-4 hover:no-underline bg-muted/30">
                            <div className="flex items-center gap-2">
                                <GripVertical className="size-4 text-muted-foreground" />
                                <span className="font-semibold font-headline">{group.name}</span>
                                <Badge variant="secondary">{group.notes.length}</Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {group.notes.map(note => (
                                <NoteCard 
                                    key={note.id} 
                                    note={note} 
                                    groupId={group.id} 
                                    onEdit={handleEditNote} 
                                    onDelete={handleDeleteNote}
                                    onMove={handleMoveNote}
                                    allGroups={groups}
                                />
                            ))}
                            {group.notes.length === 0 && <p className="text-sm text-muted-foreground col-span-full text-center py-8">No notes in this group yet.</p>}
                        </AccordionContent>
                    </AccordionItem>
                </Card>
            ))}
        </Accordion>
        
        <NoteForm 
          isOpen={isSheetOpen}
          setIsOpen={setSheetOpen}
          onSave={handleSaveNote}
          noteToEdit={editingNote}
          groups={groups}
        />
    </div>
  );
}

function NoteCard({note, groupId, onEdit, onDelete, onMove, allGroups} : {note: Note, groupId: string, onEdit: (note: Note, groupId: string) => void, onDelete: (noteId: string) => void, onMove: (noteId: string, fromGroupId: string, toGroupId: string) => void, allGroups: Group[]}) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>{note.title}</CardTitle>
                <CardDescription className="line-clamp-3">{note.content}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                    {/* Tags are disabled as they are not in the new data structure */}
                </div>
            </CardContent>
            <CardFooter className="justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="size-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(note, groupId)}><Edit className="mr-2 size-4"/>Edit</DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger><ChevronRight className="mr-2 size-4"/>Move to</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {allGroups.filter(g => g.id !== groupId).map(group => (
                                        <DropdownMenuItem key={group.id} onClick={() => onMove(note.id, groupId, group.id)}>
                                            {group.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator/>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                    <Trash2 className="mr-2 size-4"/>Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                             <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the note.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(note.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    )
}

function NoteForm({isOpen, setIsOpen, onSave, noteToEdit, groups}: {isOpen: boolean, setIsOpen: (open: boolean) => void, onSave: (note: Note, groupId: string) => void, noteToEdit: {note: Note, groupId: string} | null, groups: Group[]}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  
  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.note.title);
      setContent(noteToEdit.note.content);
      setSelectedGroupId(noteToEdit.groupId);
    } else {
      setTitle('');
      setContent('');
      setSelectedGroupId(groups.length > 0 ? groups[0].id : '');
    }
  }, [noteToEdit, isOpen, groups]);

  const handleSave = () => {
    // The title is derived from content, so we only need to save content.
    const note: Note = {
      id: noteToEdit?.note.id || '', // ID will be generated in parent for new notes
      title: content.substring(0, 40) + (content.length > 40 ? '...' : ''),
      content,
      groupId: selectedGroupId,
      tags: []
    };
    onSave(note, selectedGroupId);
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-headline">{noteToEdit ? "Edit Note" : "Create Note"}</SheetTitle>
          <SheetDescription>Fill in the details for your note. Click save when you're done.</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="group">Group</Label>
                <select id="group" value={selectedGroupId} onChange={e => setSelectedGroupId(e.target.value)} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="content">Content (Doctrine)</Label>
                <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={8}/>
            </div>
             {/* Tag functionality is removed as it's not in the new data structure */}
        </div>
        <SheetFooter>
            <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={handleSave}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
