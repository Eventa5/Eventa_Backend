export interface Todo {
  id: number;
  name: string;
  status: "Todo" | "InProgress" | "Done";
}
