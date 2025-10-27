
export type Note = {
  id: string;
  title: string;
  content: string; // was 'doctrine'
  groupId: string;
  tags: string[];
};

export type Group = {
  id: string;
  name: string;
  notes: Note[];
};

export type StockLibraryItem = {
    ticker: string;
    calculatedPrice: number;
    calculationDate: string;
    ownerEarnings: number;
    growthRate: number;
    discountRate: number;
    projectionYears: number;
    analysis?: string; // Optional analysis note
};
    