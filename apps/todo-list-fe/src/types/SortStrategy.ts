import { Todo } from "./Todo";

export type SortStrategy = (todos: Todo[]) => Todo[];
