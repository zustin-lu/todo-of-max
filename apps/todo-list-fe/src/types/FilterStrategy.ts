import { Todo } from "./Todo";

export type FilterStrategy = (todos: Todo[]) => Todo[];
