export interface TodoDetails {
  id: string;
  todo_id: string;
  task_details: string;
  notes_details: string;
  status_details: string;
  priority_details: string;
  created_at: string;
  updated_at: string;
}

export interface Todo {
  id: string;
  user_id: string;
  task: string;
  completed: boolean;
  date_start: string;
  date_due: string;
  todo_details: TodoDetails;
  created_at: string;
  update_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  update_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedTodos {
  items: Todo[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  data: T;
  Msg?: string;
}

export type CreateTodoInput = Pick<
  Todo,
  "task" | "date_start" | "date_due" | "completed"
>;

export type UpdateTodoInput = CreateTodoInput;

export type CreateTodoDetailsInput = Omit<
  TodoDetails,
  "id" | "created_at" | "updated_at"
>;
