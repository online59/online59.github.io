
"use client";

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, set, remove } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle, MoreVertical, Pencil, Trash2, Bot, FileText } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { StockLibraryItem } from '@/lib/types';
import { analyzeStock } from '@/ai/flows/analyze-stock-flow';

const formatCurrency = (value: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
};

const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const EditStockDialog: React.FC<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (item: StockLibraryItem) => void;
  itemToEdit: StockLibraryItem | null;
}> = ({ isOpen, setIsOpen, onSave, itemToEdit }) => {
  
  const [ticker, setTicker] = useState('');
  const [ownerEarnings, setOwnerEarnings] = useState(0);
  const [growthRate, setGrowthRate] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [projectionYears, setProjectionYears] = useState(5);
  const terminalGrowthRate = 2.5;

  const intrinsicValue = useMemo(() => {
    try {
      let projectedEarnings = ownerEarnings;
      let discountedValue = 0;
      for (let i = 1; i <= projectionYears; i++) {
        projectedEarnings *= (1 + growthRate / 100);
        discountedValue += projectedEarnings / Math.pow(1 + discountRate / 100, i);
      }
      const terminalValue = (projectedEarnings * (1 + terminalGrowthRate / 100)) / ((discountRate - terminalGrowthRate) / 100);
      const discountedTerminalValue = terminalValue / Math.pow(1 + discountRate / 100, projectionYears);
      const totalValue = discountedValue + discountedTerminalValue;
      return isNaN(totalValue) || !isFinite(totalValue) ? 0 : totalValue;
    } catch {
      return 0;
    }
  }, [ownerEarnings, growthRate, discountRate, projectionYears]);

  useEffect(() => {
    if (itemToEdit) {
      setTicker(itemToEdit.ticker);
      setOwnerEarnings(itemToEdit.ownerEarnings);
      setGrowthRate(itemToEdit.growthRate);
      setDiscountRate(itemToEdit.discountRate);
      setProjectionYears(itemToEdit.projectionYears);
    }
  }, [itemToEdit]);

  const handleSave = () => {
    if(itemToEdit) {
      onSave({
        ...itemToEdit,
        ticker,
        ownerEarnings,
        growthRate,
        discountRate,
        projectionYears,
        calculatedPrice: intrinsicValue,
        calculationDate: new Date().toISOString(),
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Stock Valuation</DialogTitle>
          <DialogDescription>Update the details for your stock analysis.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ticker-edit" className="text-right">Ticker</Label>
            <Input id="ticker-edit" value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ownerEarnings-edit" className="text-right">Owner's Earnings</Label>
            <Input id="ownerEarnings-edit" type="number" value={ownerEarnings} onChange={(e) => setOwnerEarnings(Number(e.target.value))} className="col-span-3" />
          </div>
          <div className="space-y-2">
              <Label>Growth Rate: {growthRate}%</Label>
              <Slider value={[growthRate]} onValueChange={v => setGrowthRate(v[0])} max={30} step={0.5} />
          </div>
           <div className="space-y-2">
              <Label>Discount Rate: {discountRate}%</Label>
              <Slider value={[discountRate]} onValueChange={v => setDiscountRate(v[0])} max={20} step={0.5} />
          </div>
          <div className="space-y-2">
              <Label>Projection Years: {projectionYears}</Label>
              <Slider value={[projectionYears]} onValueChange={v => setProjectionYears(v[0])} max={20} step={1} />
          </div>
        </div>
         <p className="text-center text-lg font-semibold">New Intrinsic Value: {formatCurrency(intrinsicValue, 'USD')}</p>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

const EditNoteDialog: React.FC<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (note: string) => void;
  item: StockLibraryItem;
}> = ({ isOpen, setIsOpen, onSave, item }) => {
  const [note, setNote] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (item) {
      setNote(item.analysis || "");
    }
  }, [item]);

  const handleGenerateAnalysis = async () => {
    setIsGenerating(true);
    try {
      const analysisInput = {
        ticker: item.ticker,
        eps: String(item.ownerEarnings), // Assuming EPS can be derived or is similar to Owner Earnings for this
        growthRate: String(item.growthRate),
        intrinsicValue: String(item.calculatedPrice),
      };
      const result = await analyzeStock(analysisInput);
      setNote(note + "\n\n--- AI Analysis ---\n" + result.analysis);
    } catch (error) {
      console.error("AI analysis failed:", error);
      toast({
        title: "AI Analysis Failed",
        description: "Could not generate analysis for this stock.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Analysis Note for {item.ticker}</DialogTitle>
          <DialogDescription>Add or edit your analysis for this stock.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={12}
            placeholder="Your analysis notes..."
          />
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={handleGenerateAnalysis} disabled={isGenerating}>
              {isGenerating ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              Analyze with AI
            </Button>
            <div className="flex-grow"></div>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={() => onSave(note)}>Save Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const LibraryCard: React.FC<{ item: StockLibraryItem; onEdit: (item: StockLibraryItem) => void; onDelete: (itemId: string) => void; onNoteSave: (itemId: string, note: string) => void; }> = 
({ item, onEdit, onDelete, onNoteSave }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isNoteDialogOpen, setNoteDialogOpen] = useState(false);
    
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                    <CardTitle className="text-xl font-headline">{item.ticker}</CardTitle>
                    <p className="text-xs text-muted-foreground pt-1">
                        Calculated on: {formatDate(item.calculationDate)}
                    </p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="-mt-2 -mr-2 h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit Valuation
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setNoteDialogOpen(true)}>
                            <FileText className="mr-2 h-4 w-4" /> {item.analysis ? "Edit" : "Add"} Note
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-3 flex-grow">
                <p className="text-3xl font-bold text-primary">{formatCurrency(item.calculatedPrice, 'USD')}</p>
                 <Collapsible>
                    <CollapsibleContent className="prose prose-sm dark:prose-invert text-muted-foreground mt-4 whitespace-pre-wrap">
                      {item.analysis}
                    </CollapsibleContent>
                    {item.analysis && (
                      <CollapsibleTrigger asChild>
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                          {/* This is a bit of a hack to have the state text change */}
                          <span className="data-[state=open]:hidden">Show Note</span>
                          <span className="data-[state=closed]:hidden">Hide Note</span>
                        </Button>
                      </CollapsibleTrigger>
                    )}
                 </Collapsible>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
                <p>G: {item.growthRate}% | D: {item.discountRate}% | Y: {item.projectionYears}</p>
            </CardFooter>
            
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently delete the valuation for {item.ticker}.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(item.ticker)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <EditNoteDialog 
              isOpen={isNoteDialogOpen} 
              setIsOpen={setNoteDialogOpen} 
              onSave={(note) => {
                onNoteSave(item.ticker, note);
                setNoteDialogOpen(false);
              }}
              item={item} 
            />
        </Card>
    );
};

export function LibraryContainer() {
  const [library, setLibrary] = useState<StockLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<StockLibraryItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const libraryRef = ref(db, 'library');
    const unsubscribe = onValue(libraryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const libraryList = Object.keys(data).map(key => ({ ...data[key], ticker: key }));
        setLibrary(libraryList);
      } else {
        setLibrary([]);
      }
      setLoading(false);
    }, (error) => {
      toast({ title: "Error fetching library", description: error.message, variant: "destructive" });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);
  
  const handleEdit = (item: StockLibraryItem) => {
    setItemToEdit(item);
    setEditDialogOpen(true);
  };

  const handleDelete = (itemId: string) => {
    const itemRef = ref(db, `library/${itemId}`);
    remove(itemRef)
      .then(() => toast({ title: "Item deleted." }))
      .catch(error => toast({ title: "Error deleting item", description: error.message, variant: "destructive" }));
  };

  const handleSave = (item: StockLibraryItem) => {
    const itemRef = ref(db, `library/${item.ticker}`);
    // Create a copy of the item without the 'ticker' property for Firebase
    const { ticker, ...dataToSave } = item;
    set(itemRef, dataToSave)
      .then(() => {
        toast({ title: "Valuation updated." });
        setEditDialogOpen(false);
        setItemToEdit(null);
      })
      .catch(error => toast({ title: "Error updating valuation", description: error.message, variant: "destructive" }));
  };
  
  const handleNoteSave = (itemId: string, note: string) => {
    const itemRef = ref(db, `library/${itemId}/analysis`);
    set(itemRef, note)
      .then(() => {
        toast({ title: "Note saved." });
      })
      .catch((error) => {
        toast({ title: "Error saving note", description: error.message, variant: "destructive" });
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div>
      {library.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {library.map(item => (
            <LibraryCard key={item.ticker} item={item} onEdit={handleEdit} onDelete={handleDelete} onNoteSave={handleNoteSave} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>Your library is empty.</p>
          <p>Go to the calculator to add your first stock valuation.</p>
        </div>
      )}
       <EditStockDialog isOpen={isEditDialogOpen} setIsOpen={setEditDialogOpen} onSave={handleSave} itemToEdit={itemToEdit} />
    </div>
  );
}
