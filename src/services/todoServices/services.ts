const apiUrl = import.meta.env.VITE_API_URL;

export const getTodos = async (
    page: number = 1,
    limit: number = 10,
    sortBy: string = "created_at",
    sortOrder: string = "DESC",
) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const response = await fetch(`${apiUrl}/api/v1/todos?${params}`);
    const data = await response.json();

    return {
        items: data.data.items || [],
        pagination: data.data.pagination,
    };
};

export const createTodo = async (todoData: {
    task: string;
    date_start: string;
    date_due: string;
    completed: boolean;
}) => {
    const response = await fetch(`${apiUrl}/api/v1/todos/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Msg || "Failed to create todo");
    }

    return await response.json();
};

export const createTodosDetails = async (
    id: string,
    todoDetails: {
        todo_id: string;
        task_details: string;
        notes_details: string;
        status_details: string;
        priority_details: string;
    },
) => {
    const response = await fetch(`${apiUrl}/api/v1/todos/${id}/details`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todoDetails),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Msg || "Failed to create todo");
    }

    return await response.json();
};

export const deleteTodo = async (id: string) => {
    const response = await fetch(`${apiUrl}/api/v1/todos/delete/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Msg || "Failed to delete todo");
    }

    return await response.json();
};

export const updateTodo = async (
    id: string,
    todoData: {
        task: string;
        date_start: string;
        date_due: string;
        completed: boolean;
    },
) => {
    const response = await fetch(`${apiUrl}/api/v1/todos/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Msg || "Failed to update todo");
    }

    return await response.json();
};

export const toggleTodoComplete = async (id: string) => {
    const response = await fetch(`${apiUrl}/api/v1/todos/${id}/complete`, {
        method: "PATCH",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Msg || "Failed to toggle completion");
    }

    return await response.json();
};

export const getTodosDetailsById = async (id: string) => {
    const response = await fetch(`api/v1/todos/tododetails/${id}`);

    return response.json();
};

export const getTodosDetailByTodoId = async (id: string) => {
    const response = await fetch(
        `${apiUrl}/api/v1/todos/tododetails/todoid/${id}`,
    );

    return response.json();
};

export const getTodosDetailsAll = async () => {
    const response = await fetch(`${apiUrl}/api/v1/todos/tododetails`);

    return response.json;
};
