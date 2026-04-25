export type Index = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
};

export type IndicesResponse = {
  indices: Index[];
};
