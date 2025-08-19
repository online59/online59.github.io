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

const initialData: Group[] = [
  { id: 'group-1', name: 'Work Projects', notes: [
    { id: 'note-1', title: 'Q3 Mobile App Feature', content: 'Plan and design the new push notification system for the iOS and Android apps. Consider user segmentation and scheduling capabilities.', tags: ['mobile', 'planning'] },
    { id: 'note-2', title: 'API Security Audit', content: 'Review all public-facing API endpoints for potential security vulnerabilities. Focus on authentication, authorization, and data validation.', tags: ['backend', 'security'] },
  ]},
  { id: 'group-2', name: 'Personal Ideas', notes: [
    { id: 'note-3', title: 'Vacation Planning', content: 'Research destinations for a trip in Southeast Asia. Look into flights, accommodations, and local attractions in Thailand and Vietnam.', tags: ['travel', 'life'] },
  ]},
];


export default function NotesContainer() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<{note: Note, groupId: string} | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load from localStorage or use initialData
    const savedData = localStorage.getItem('notesData');
    if (savedData) {
      setGroups(JSON.parse(savedData));
    } else {
      setGroups(initialData);
    }
    setIsClient(true);
  }, []);

  useEffect(() => {
    if(isClient) {
      localStorage.setItem('notesData', JSON.stringify(groups));
    }
  }, [groups, isClient]);

  const handleAddNote = () => {
    setEditingNote(null);
    setSheetOpen(true);
  };

  const handleEditNote = (note: Note, groupId: string) => {
    setEditingNote({ note, groupId });
    setSheetOpen(true);
  }

  const handleDeleteNote = (noteId: string, groupId: string) => {
    setGroups(prevGroups => prevGroups.map(group => {
      if (group.id === groupId) {
        return { ...group, notes: group.notes.filter(note => note.id !== noteId) };
      }
      return group;
    }));
    toast({ title: "Note deleted successfully." });
  };
  
  const handleMoveNote = (noteId: string, fromGroupId: string, toGroupId: string) => {
    if(fromGroupId === toGroupId) return;

    let noteToMove: Note | undefined;
    const newGroups = groups.map(group => {
        if(group.id === fromGroupId){
            noteToMove = group.notes.find(n => n.id === noteId);
            return {...group, notes: group.notes.filter(n => n.id !== noteId)};
        }
        return group;
    }).map(group => {
        if(group.id === toGroupId && noteToMove){
            return {...group, notes: [...group.notes, noteToMove]};
        }
        return group;
    });

    setGroups(newGroups.filter(g => g !== undefined) as Group[]);
    toast({ title: "Note moved." });
  }

  const handleSaveNote = (note: Note, groupId: string) => {
    if (editingNote) { // Editing
      setGroups(prev => prev.map(g => {
        if (g.id === editingNote.groupId) {
          if (editingNote.groupId === groupId) {
            return { ...g, notes: g.notes.map(n => n.id === note.id ? note : n) };
          } else {
             return { ...g, notes: g.notes.filter(n => n.id !== note.id) };
          }
        }
        if (g.id === groupId && editingNote.groupId !== groupId) {
            return {...g, notes: [...g.notes, note]};
        }
        return g;
      }));
      toast({ title: "Note updated successfully." });
    } else { // Creating
      setGroups(prev => prev.map(g => {
        if (g.id === groupId) {
          return { ...g, notes: [...g.notes, { ...note, id: `note-${Date.now()}` }] };
        }
        return g;
      }));
      toast({ title: "Note created successfully." });
    }
    setEditingNote(null);
    setSheetOpen(false);
  };

  const handleAddGroup = (name: string) => {
    if (name.trim()) {
      const newGroup: Group = { id: `group-${Date.now()}`, name, notes: [] };
      setGroups(prev => [...prev, newGroup]);
      toast({ title: "Group added." });
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    toast({ title: "Group deleted." });
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

function NoteCard({note, groupId, onEdit, onDelete, onMove, allGroups} : {note: Note, groupId: string, onEdit: (note: Note, groupId: string) => void, onDelete: (noteId: string, groupId: string) => void, onMove: (noteId: string, fromGroupId: string, toGroupId: string) => void, allGroups: Group[]}) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>{note.title}</CardTitle>
                <CardDescription className="line-clamp-3">{note.content}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                    {note.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
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
                                    This action cannot be undone. This will permanently delete the note titled "{note.title}".
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(note.id, groupId)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.note.title);
      setContent(noteToEdit.note.content);
      setSelectedGroupId(noteToEdit.groupId);
      setTags(noteToEdit.note.tags);
    } else {
      setTitle('');
      setContent('');
      setSelectedGroupId(groups.length > 0 ? groups[0].id : '');
      setTags([]);
    }
    setSuggestedTags([]);
  }, [noteToEdit, isOpen, groups]);

  const handleSuggestTags = () => {
    if (!content) return;
    startTransition(async () => {
      const result = await getTagSuggestions({ noteContent: content });
      setSuggestedTags(result.filter(t => !tags.includes(t)));
    });
  }

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
        setTags(prev => [...prev, tag]);
    }
  }

  const handleSave = () => {
    const note: Note = {
      id: noteToEdit?.note.id || '', // ID will be generated in parent for new notes
      title,
      content,
      tags
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
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="group">Group</Label>
                <select id="group" value={selectedGroupId} onChange={e => setSelectedGroupId(e.target.value)} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={8}/>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Tags</Label>
                    <Button variant="ghost" size="sm" onClick={handleSuggestTags} disabled={isPending || !content}>
                        {isPending ? <Loader2 className="mr-2 size-4 animate-spin"/> : <Wand2 className="mr-2 size-4" />}
                        Suggest Tags
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="pr-1">
                            {tag}
                            <button onClick={() => setTags(tags.filter(t => t !== tag))} className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 text-destructive">&times;</button>
                        </Badge>
                    ))}
                </div>
                {suggestedTags.length > 0 && (
                    <div className="p-2 bg-muted/50 rounded-md">
                        <p className="text-xs mb-2 text-muted-foreground">Suggestions:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedTags.map(tag => (
                                <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => {
                                    handleAddTag(tag);
                                    setSuggestedTags(suggestedTags.filter(t => t !== tag));
                                }}>
                                    <Plus className="mr-1 size-3"/>{tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
                 <div className="flex items-center gap-2">
                    <Input placeholder="Add a new tag..." value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag(tagInput);
                            setTagInput('');
                        }
                    }}/>
                    <Button variant="outline" onClick={() => { handleAddTag(tagInput); setTagInput(''); }}>Add Tag</Button>
                </div>
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
