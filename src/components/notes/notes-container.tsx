"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, set, push, remove } from 'firebase/database';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import type { Note, Group } from '@/lib/types';
import { LoaderCircle, Plus, GripVertical, Settings, Pencil, Trash2, ChevronRight } from 'lucide-react';

interface RawGroup {
  name: string;
  id: string;
}

interface RawPrinciple {
  doctrine: string;
  groupId: string;
  id: string;
}

const transformData = (data: { groups: Record<string, RawGroup>, principles: Record<string, RawPrinciple> }): Group[] => {
  if (!data || !data.groups || !data.principles) {
    return [];
  }
  
  const groups = data.groups;
  const principles = data.principles;

  const notesByGroup: Record<string, Note[]> = {};

  Object.keys(principles).forEach(key => {
    const principle = principles[key];
    const note: Note = {
      id: key,
      title: principle.doctrine.substring(0, 40) + (principle.doctrine.length > 40 ? '...' : ''),
      content: principle.doctrine,
      groupId: principle.groupId,
      tags: [],
    };
    if (!notesByGroup[principle.groupId]) {
      notesByGroup[principle.groupId] = [];
    }
    notesByGroup[principle.groupId].push(note);
  });

  const groupArray: Group[] = Object.keys(groups).map(key => ({
    id: key,
    name: groups[key].name,
    notes: notesByGroup[key] || [],
  }));
  
  // Sort groups by name, handling numeric prefixes
  groupArray.sort((a, b) => {
    const aMatch = a.name.match(/^(\d+)\./);
    const bMatch = b.name.match(/^(\d+)\./);
    const aNum = aMatch ? parseInt(aMatch[1]) : a.name;
    const bNum = bMatch ? parseInt(bMatch[1]) : b.name;

    if (typeof aNum === 'number' && typeof bNum === 'number') {
      return aNum - bNum;
    }
    return String(aNum).localeCompare(String(bNum));
  });

  return groupArray;
};


const NoteCard: React.FC<{ note: Note; groupId: string; onEdit: (note: Note, groupId: string) => void; onDelete: (noteId: string) => void; onMove: (noteId: string, oldGroupId: string, newGroupId: string) => void; allGroups: Group[] }> = 
({ note, groupId, onEdit, onDelete, onMove, allGroups }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-grow p-4">
        <p className="text-sm">{note.content}</p>
      </CardContent>
      <CardContent className="p-2 justify-end flex">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><Settings className="size-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(note, groupId)}>
                    <Pencil className="mr-2 size-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <ChevronRight className="mr-2 size-4" />
                    Move to
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {allGroups.filter(g => g.id !== groupId).map(group => (
                      <DropdownMenuItem key={group.id} onClick={() => onMove(note.id, groupId, group.id)}>
                        {group.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Trash2 className="mr-2 size-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
      </CardContent>
    </Card>
  )
}

const EditNoteDialog: React.FC<{ isOpen: boolean, setIsOpen: (open: boolean) => void, onSave: (note: { id: string, content: string }, groupId: string) => void, noteToEdit: {note: Note, groupId: string} | null, groups: Group[] }> = 
({ isOpen, setIsOpen, onSave, noteToEdit, groups }) => {
  const [content, setContent] = useState('');
  const [groupId, setGroupId] = useState('');

  useEffect(() => {
    if (noteToEdit) {
      setContent(noteToEdit.note.content);
      setGroupId(noteToEdit.groupId);
    } else {
      setContent('');
      setGroupId(groups.length > 0 ? groups[0].id : '');
    }
  }, [noteToEdit, isOpen, groups]);

  const handleSave = () => {
    if (!groupId) {
      console.error("No group selected");
      return;
    }
    onSave({ id: noteToEdit?.note.id || '', content }, groupId);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">{noteToEdit ? 'Edit Note' : 'Create Note'}</DialogTitle>
          <DialogDescription>
            Fill in the details for your note. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="group">Group</Label>
            <select
              id="group"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {groups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content (Doctrine)</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={8} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditGroupDialog: React.FC<{ isOpen: boolean, setIsOpen: (open: boolean) => void, onSave: (name: string) => void, groupToEdit: Group | null }> = 
({ isOpen, setIsOpen, onSave, groupToEdit }) => {
    const [name, setName] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        if (groupToEdit) {
            setName(groupToEdit.name);
        } else {
            setName('');
        }
    }, [groupToEdit, isOpen]);

    const handleSave = () => {
        if (name.trim() === '') {
            toast({ title: "Group name cannot be empty", variant: "destructive" });
            return;
        }
        onSave(name);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-headline">{groupToEdit ? 'Edit Group' : 'Create Group'}</DialogTitle>
                    <DialogDescription>Enter a name for your group.</DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    <Label htmlFor="group-name">Group Name</Label>
                    <Input id="group-name" value={name} onChange={(e) => setName(e.target.value)} />
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
};

const GroupMenu: React.FC<{ group: Group; onEdit: () => void; onDelete: () => void; }> = 
({ group, onEdit, onDelete }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Settings className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit}>
                        <Pencil className="mr-2 size-4" />
                        Edit Name
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                        <Trash2 className="mr-2 size-4" />
                        Delete Group
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the group "{group.name}". You can only delete a group if it has no notes in it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};


export function NotesContainer() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNoteDialogOpen, setNoteDialogOpen] = useState(false);
  const [isGroupDialogOpen, setGroupDialogOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<{ note: Note, groupId: string } | null>(null);
  const [groupToEdit, setGroupToEdit] = useState<Group | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const notesRef = ref(db, '/');
    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGroups(transformData(data));
      } else {
        setGroups([]);
      }
      setLoading(false);
    }, (error) => {
      console.error(error);
      toast({
        title: "Error fetching notes",
        description: "Could not retrieve data from Firebase.",
        variant: "destructive",
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleEditNote = (note: Note, groupId: string) => {
    setNoteToEdit({note, groupId});
    setNoteDialogOpen(true);
  };
  
  const handleDeleteNote = (noteId: string) => {
    const noteRef = ref(db, `/principles/${noteId}`);
    remove(noteRef)
      .then(() => {
        toast({ title: "Note deleted successfully." });
      })
      .catch((error) => {
        toast({ title: "Error deleting note", description: error.message, variant: "destructive" });
      });
  };

  const handleMoveNote = (noteId: string, oldGroupId: string, newGroupId: string) => {
    const noteRef = ref(db, `/principles/${noteId}`);
    set(noteRef, { groupId: newGroupId })
        .then(() => toast({ title: "Note moved." }))
        .catch(error => toast({ title: "Error moving note", description: error.message, variant: "destructive" }));
  };

  const handleSaveNote = (note: {id: string, content: string}, groupId: string) => {
    const isNew = !note.id;
    const notesRef = isNew ? push(ref(db, '/principles')) : ref(db, `/principles/${note.id}`);
    const noteId = isNew ? notesRef.key : note.id;

    if (!noteId) {
      toast({ title: "Error saving note", description: "Could not generate note ID.", variant: "destructive" });
      return;
    }
    
    const noteData = {
      doctrine: note.content,
      groupId: groupId,
      id: noteId,
    };

    set(notesRef, noteData)
      .then(() => {
        toast({ title: isNew ? "Note created successfully." : "Note updated successfully." });
        setNoteDialogOpen(false);
        setNoteToEdit(null);
      })
      .catch((error) => {
        toast({ title: "Error saving note", description: error.message, variant: "destructive" });
      });
  };
  
  const handleEditGroup = (group: Group) => {
    setGroupToEdit(group);
    setGroupDialogOpen(true);
  };

  const handleDeleteGroup = (group: Group) => {
    if (group.notes.length > 0) {
        toast({ title: "Cannot delete group", description: "Please move or delete all notes in this group first.", variant: "destructive" });
        return;
    }
    const groupRef = ref(db, `/groups/${group.id}`);
    remove(groupRef)
        .then(() => toast({ title: "Group deleted." }))
        .catch(error => toast({ title: "Error deleting group", description: error.message, variant: "destructive" }));
  };

  const handleSaveGroup = (name: string) => {
    if (groupToEdit) {
      // Edit existing group
      const groupRef = ref(db, `/groups/${groupToEdit.id}`);
      set(groupRef, { name: name })
        .then(() => {
          toast({ title: "Group updated." });
          setGroupDialogOpen(false);
          setGroupToEdit(null);
        })
        .catch(error => toast({ title: "Error updating group", description: error.message, variant: "destructive" }));
    } else {
      // Add new group
      const groupsRef = ref(db, '/groups');
      const newGroupRef = push(groupsRef);
      const newGroupId = newGroupRef.key;
      if (!newGroupId) {
          toast({ title: "Error adding group", description: "Could not generate group ID.", variant: "destructive" });
          return;
      }
      set(newGroupRef, { id: newGroupId, name: name })
        .then(() => {
          toast({ title: "Group added." });
          setGroupDialogOpen(false);
        })
        .catch(error => toast({ title: "Error adding group", description: error.message, variant: "destructive" }));
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Organize your thoughts, ideas, and projects.
        </p>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setGroupToEdit(null); setGroupDialogOpen(true); }}>
                <Plus className="mr-2" />
                Add Group
            </Button>
            <Button onClick={() => { setNoteToEdit(null); setNoteDialogOpen(true); }}>
                <Plus className="mr-2" />
                Add Note
            </Button>
        </div>
      </div>
      <Accordion type="multiple" defaultValue={groups.map(g => g.id)} className="w-full space-y-2">
        {groups.map(group => (
          <Card key={group.id} className="overflow-hidden">
            <AccordionItem value={group.id} className="border-b-0">
               <div className="flex items-center group/trigger bg-muted/30">
                <AccordionTrigger className="p-4 hover:no-underline flex-1">
                    <div className="flex items-center gap-2">
                      <GripVertical className="size-4 text-muted-foreground" />
                      <span className="font-semibold font-headline">{group.name}</span>
                      <Badge variant="secondary">{group.notes.length}</Badge>
                    </div>
                </AccordionTrigger>
                <div className="p-4">
                    <GroupMenu group={group} onEdit={() => handleEditGroup(group)} onDelete={() => handleDeleteGroup(group)} />
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
                {group.notes.length === 0 && (
                  <p className="text-sm text-muted-foreground col-span-full text-center py-8">
                    No notes in this group yet.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>

      <EditNoteDialog 
        isOpen={isNoteDialogOpen}
        setIsOpen={setNoteDialogOpen}
        onSave={handleSaveNote}
        noteToEdit={noteToEdit}
        groups={groups}
      />
      <EditGroupDialog
        isOpen={isGroupDialogOpen}
        setIsOpen={setGroupDialogOpen}
        onSave={handleSaveGroup}
        groupToEdit={groupToEdit}
      />
    </div>
  );
}
