export interface Grade {
  id: number;
  name: string;
  sections: {
    id: number;
    name: string;
  }[];
}
