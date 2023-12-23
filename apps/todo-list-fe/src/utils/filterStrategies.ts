import { FilterStrategy } from "../types/FilterStrategy";

export const filterStrategies: Record<string, FilterStrategy> = {
  all: (todos = []) => todos,
  completed: (todos = []) => todos.filter((todo) => todo.completed),
  active: (todos = []) => todos.filter((todo) => !todo.completed),
};
