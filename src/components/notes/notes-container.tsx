"use client";

import React, { useState, useEffect, useTransition } from "react";
import type { Group, Note } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MoreVertical, Trash2, Edit, Loader2, Wand2, Tag, ChevronRight, GripVertical, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getTagSuggestions } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { db } from "@/lib/firebase";
import { ref, onValue, set, remove, push, update } from "firebase/database";

// Helper to transform Firebase data into app data structure
const transformDataToGroups = (data: any): Group[] => {
  if (!data || !data.groups || !data.principles) {
    return [];
  }

  const fbGroups = data.groups;
  const fbPrinciples = data.principles;

  const principlesByGroup: { [key: string]: any[] } = {};
  Object.keys(fbPrinciples).forEach((principleId) => {
    const p = fbPrinciples[principleId];
    if (p.groupId) {
      if (!principlesByGroup[p.groupId]) {
        principlesByGroup[p.groupId] = [];
      }
      principlesByGroup[p.groupId].push({ ...p, id: principleId });
    }
  });

  const groupsArray: Group[] = Object.keys(fbGroups).map((groupId) => {
    const group = fbGroups[groupId];
    return {
      id: groupId,
      name: group.name,
      notes: (principlesByGroup[groupId] || []).map((p: any) => ({
        id: p.id,
        title: p.doctrine.substring(0, 40) + (p.doctrine.length > 40 ? '...' : ''),
        content: p.doctrine,
        groupId: p.groupId,
        tags: [], // Tags are not in the JSON structure
      })),
    };
  });
  
  // Sort groups by name, handling potential numeric prefixes
  groupsArray.sort((a, b) => {
    const aNumMatch = a.name.match(/^(\d+)\./);
    const bNumMatch = b.name.match(/^(\d+)\./);
    const aName = aNumMatch ? parseInt(aNumMatch[1]) : a.name;
    const bName = bNumMatch ? parseInt(bNumMatch[1]) : b.name;
    
    if (typeof aName === 'number' && typeof bName === 'number') {
      return aName - bName;
    }
    return String(aName).localeCompare(String(bName));
  });

  return groupsArray;
};


export default function NotesContainer() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isNoteSheetOpen, setNoteSheetOpen] = useState(false);
  const [isGroupDialogOpen, setGroupDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<{note: Note, groupId: string} | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
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
    setNoteSheetOpen(true);
  };

  const handleEditNote = (note: Note, groupId: string) => {
    setEditingNote({ note, groupId });
    setNoteSheetOpen(true);
  }

  const handleDeleteNote = (noteId: string) => {
    remove(ref(db, `/principles/${noteId}`))
      .then(() => toast({ title: "Note deleted successfully." }))
      .catch((e) => toast({ title: "Error deleting note", description: e.message, variant: 'destructive'}));
  };
  
  const handleMoveNote = (noteId: string, fromGroupId: string, toGroupId: string) => {
    if(fromGroupId === toGroupId) return;
    update(ref(db, `/principles/${noteId}`), { groupId: toGroupId })
     .then(() => toast({ title: "Note moved." }))
     .catch((e) => toast({ title: "Error moving note", description: e.message, variant: 'destructive'}));
  }

  const handleSaveNote = (note: Note, groupId: string) => {
    const isEditing = !!note.id;
    const noteRef = isEditing ? ref(db, `/principles/${note.id}`) : push(ref(db, '/principles'));
    const noteId = isEditing ? note.id : noteRef.key;

    if (!noteId) {
        toast({ title: "Error saving note", description: "Could not generate note ID.", variant: 'destructive' });
        return;
    }

    const noteData = {
      id: noteId,
      doctrine: note.content,
      groupId: groupId,
    };
    
    set(noteRef, noteData)
      .then(() => {
        toast({ title: isEditing ? "Note updated successfully." : "Note created successfully." });
        setNoteSheetOpen(false);
        setEditingNote(null);
      })
      .catch((e) => toast({ title: "Error saving note", description: e.message, variant: 'destructive' }));
  };

  const handleAddGroup = () => {
    setEditingGroup(null);
    setGroupDialogOpen(true);
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setGroupDialogOpen(true);
  }

  const handleSaveGroup = (groupName: string) => {
      if (groupName.trim() === '') {
        toast({ title: "Group name cannot be empty", variant: "destructive" });
        return;
      }

      if (editingGroup) { // Editing existing group
          update(ref(db, `/groups/${editingGroup.id}`), { name: groupName })
           .then(() => {
                toast({ title: "Group updated." });
                setGroupDialogOpen(false);
                setEditingGroup(null);
            })
           .catch((e) => toast({ title: "Error updating group", description: e.message, variant: 'destructive'}));
      } else { // Creating new group
          const groupRef = push(ref(db, '/groups'));
          const groupId = groupRef.key;
          if (!groupId) {
             toast({ title: "Error adding group", description: "Could not generate group ID.", variant: 'destructive'});
             return;
          }
          const newGroup = { id: groupId, name: groupName };
          set(groupRef, newGroup)
            .then(() => {
                toast({ title: "Group added." });
                setGroupDialogOpen(false);
            })
            .catch((e) => toast({ title: "Error adding group", description: e.message, variant: 'destructive'}));
      }
  };

  const handleDeleteGroup = (group: Group) => {
    if(group.notes.length > 0) {
        toast({ title: "Cannot delete group", description: "Please move or delete all notes in this group first.", variant: "destructive" });
        return;
    }
    remove(ref(db, `/groups/${group.id}`))
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
            <div className="flex gap-2">
                <Button variant="outline" onClick={handleAddGroup}><Plus className="mr-2" />Add Group</Button>
                <Button onClick={handleAddNote}><Plus className="mr-2" />Add Note</Button>
            </div>
        </div>

        <Accordion type="multiple" defaultValue={groups.map(g => g.id)} className="w-full space-y-2">
            {groups.map((group) => (
                <Card key={group.id} className="overflow-hidden">
                    <AccordionItem value={group.id} className="border-b-0">
                        <div className="flex items-center group/trigger">
                            <AccordionTrigger className="p-4 hover:no-underline bg-muted/30 flex-1">
                                <div className="flex items-center gap-2">
                                    <GripVertical className="size-4 text-muted-foreground" />
                                    <span className="font-semibold font-headline">{group.name}</span>
                                    <Badge variant="secondary">{group.notes.length}</Badge>
                                </div>
                            </AccordionTrigger>
                            <div className="p-4 bg-muted/30">
                                <GroupActions 
                                    group={group} 
                                    onEdit={() => handleEditGroup(group)} 
                                    onDelete={() => handleDeleteGroup(group)} 
                                />
                            </div>
                        </div>
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
          isOpen={isNoteSheetOpen}
          setIsOpen={setNoteSheetOpen}
          onSave={handleSaveNote}
          noteToEdit={editingNote}
          groups={groups}
        />

        <GroupDialog
          isOpen={isGroupDialogOpen}
          setIsOpen={setGroupDialogOpen}
          onSave={handleSaveGroup}
          groupToEdit={editingGroup}
        />
    </div>
  );
}

function GroupActions({ group, onEdit, onDelete }: { group: Group, onEdit: () => void, onDelete: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><Settings className="size-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}><Edit className="mr-2 size-4"/>Edit Name</DropdownMenuItem>
                <DropdownMenuSeparator />
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 size-4"/>Delete Group
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the group "{group.name}".
                            You can only delete a group if it has no notes in it.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function NoteCard({note, groupId, onEdit, onDelete, onMove, allGroups} : {note: Note, groupId: string, onEdit: (note: Note, groupId: string) => void, onDelete: (noteId: string) => void, onMove: (noteId: string, fromGroupId: string, toGroupId: string) => void, allGroups: Group[]}) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="text-base font-medium">{note.title}</CardTitle>
                <CardDescription className="line-clamp-3 text-sm">{note.content}</CardDescription>
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
  const [content, setContent] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  
  useEffect(() => {
    if (noteToEdit) {
      setContent(noteToEdit.note.content);
      setSelectedGroupId(noteToEdit.groupId);
    } else {
      setContent('');
      setSelectedGroupId(groups.length > 0 ? groups[0].id : '');
    }
  }, [noteToEdit, isOpen, groups]);

  const handleSave = () => {
    if (!selectedGroupId) {
      // You might want to show a toast message here
      console.error("No group selected");
      return;
    }
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

function GroupDialog({isOpen, setIsOpen, onSave, groupToEdit}: {isOpen: boolean, setIsOpen: (open: boolean) => void, onSave: (name: string) => void, groupToEdit: Group | null}) {
  const [name, setName] = useState('');

  useEffect(() => {
    if(groupToEdit) {
        setName(groupToEdit.name);
    } else {
        setName('');
    }
  }, [groupToEdit, isOpen]);

  const handleSave = () => {
    onSave(name);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="font-headline">{groupToEdit ? "Edit Group" : "Create Group"}</DialogTitle>
                <DialogDescription>
                    Enter a name for your group.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
                <Label htmlFor="group-name">Group Name</Label>
                <Input id="group-name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
