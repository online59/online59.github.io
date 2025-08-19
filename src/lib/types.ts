export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
};

export type Group = {
  id: string;
  name: string;
  notes: Note[];
};
