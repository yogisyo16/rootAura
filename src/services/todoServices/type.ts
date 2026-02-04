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
