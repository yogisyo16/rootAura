export interface ApiResponse<T> {
  data: T;
  Msg?: string;
}

export interface UsersDetails {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    created_at: string;
    update_at: string;
}