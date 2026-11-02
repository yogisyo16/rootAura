const apiUrl = import.meta.env.VITE_API_URL;
// router.Get("/users", userHandler.getAllUsers)
import type {
    ApiResponse,
    UsersDetails
} from "./type";

export const getUsers = async () => {
    const response = await fetch(`${apiUrl}/api/v1/users`);
    const data = await response.json();

    return data.data || [];
}