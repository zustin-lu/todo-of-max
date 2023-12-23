import { SortStrategy } from "../types/SortStrategy";

export const sortStrategies: Record<string, SortStrategy> = {
  date: (todos = []) => todos.sort((a, b) => a.date!.getTime() - b.date!.getTime()),
  priority: (todos = []) => todos.sort((a, b) => (a.priority || 0) - (b.priority || 0)),
};
