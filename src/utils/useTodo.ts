import { ref, onMounted, watch } from "vue";
import type { Todo } from "@/services/todoServices/type";
import {
    getTodos,
    createTodo,
    deleteTodo,
    updateTodo,
    toggleTodoComplete,
    getTodosDetailsById,
    createTodosDetails,
} from "@/services/todoServices/services";
import { useAlert } from "./useAlert";

export const useTodo = () => {
    const { showSuccess, showError } = useAlert();

    // State
    const todos = ref<Todo[]>([]);
    const taskInput = ref("");
    const dateStartPart = ref("");
    const dateStartTimePart = ref("");
    const dateDuePart = ref("");
    const dateDueTimePart = ref("");
    const loading = ref(true);

    const taskDetails = ref("");
    const notesDetails = ref("");
    const statusDetails = ref("");
    const priorityDetails = ref("");

    // Pagination & Sorting state
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const sortBy = ref("created_at");
    const sortOrder = ref<"ASC" | "DESC">("DESC");
    const totalPages = ref(0);
    const totalItems = ref(0);
    const hasNext = ref(false);
    const hasPrev = ref(false);

    // Methods
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const fetchTodos = async () => {
        try {
            loading.value = true;
            const response = await getTodos(
                currentPage.value,
                itemsPerPage.value,
                sortBy.value,
                sortOrder.value,
            );

            todos.value = response.items;
            totalPages.value = response.pagination.total_pages;
            totalItems.value = response.pagination.total_items;
            hasNext.value = response.pagination.has_next;
            hasPrev.value = response.pagination.has_prev;
        } catch (error) {
            console.error("Error fetching todos:", error);
            showError("Failed to load todos. Please try again.");
        } finally {
            loading.value = false;
        }
    };

    const fetchDetailsId = async (id: string) => {
        const response = await getTodosDetailsById(id);

        return response;
    };

    const handleCreateTodo = async (): Promise<Todo | null> => {
        if (!taskInput.value.trim()) {
            showError("Please fill in the task name.", "Validation Error");
            return null;
        }

        // Only validate dates if both are provided
        if (dateStartPart.value && dateDuePart.value) {
            const startDate = new Date(dateStartPart.value);
            const dueDate = new Date(dateDuePart.value);

            if (startDate > dueDate) {
                showError(
                    "Start date cannot be after due date.",
                    "Invalid Dates",
                );
                return null;
            }
        }

        try {
            const dateStart = dateStartPart.value
                ? dateStartTimePart.value
                    ? `${dateStartPart.value}T${dateStartTimePart.value}:00Z`
                    : dateStartPart.value
                : "";

            const dateDue = dateDuePart.value
                ? dateDueTimePart.value
                    ? `${dateDuePart.value}T${dateDueTimePart.value}:00Z`
                    : dateDuePart.value
                : "";

            const response = await createTodo({
                task: taskInput.value,
                date_start: dateStart,
                date_due: dateDue,
                completed: false,
            });

            // taskInput.value = "";
            // dateStartPart.value = "";
            // dateStartTimePart.value = "";
            // dateDuePart.value = "";
            // dateDueTimePart.value = "";

            // Reset to first page when creating new todo
            currentPage.value = 1;
            await fetchTodos();
            showSuccess("Todo created successfully!", "Success");

            return response.data;
        } catch (error: any) {
            console.error("Error creating todo:", error);
            showError(error.message || "Failed to create todo", "Error");
            return null;
        }
    };

    const handleCreateTodoDetails = async (id: string): Promise<boolean> => {
        if (taskDetails.value.trim()) {
            await createTodosDetails(id, {
                todo_id: id,
                task_details: taskDetails.value,
                notes_details: notesDetails.value,
                status_details: statusDetails.value,
                priority_details: priorityDetails.value,
            });

            await fetchDetailsId(id);
            return true;
        } else {
            showError("No data ges.", "Validation Error");
            return false;
        }
    };

    const handleDeleteTodo = async (id: string) => {
        try {
            await deleteTodo(id);
            await fetchTodos();
            showSuccess("Todo deleted successfully!", "Deleted");
            return true;
        } catch (error: any) {
            console.error("Error deleting todo:", error);
            showError(error.message || "Failed to delete todo", "Error");
            return false;
        }
    };

    const handlStatusTodos = async (id: string) => {
        try {
            await toggleTodoComplete(id);
            await fetchTodos();
            showSuccess("Todo status updated!", "Updated");
            return true;
        } catch (error: any) {
            console.error("Error update status:", error);
            showError(error.message || "Failed to update status", "Error");
            return false;
        }
    };

    // Pagination methods
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page;
        }
    };

    const nextPage = () => {
        if (hasNext.value) {
            currentPage.value++;
        }
    };

    const prevPage = () => {
        if (hasPrev.value) {
            currentPage.value--;
        }
    };

    const changeItemsPerPage = (limit: number) => {
        itemsPerPage.value = limit;
        currentPage.value = 1; // Reset to first page
    };

    const changeSorting = (field: string, order: "ASC" | "DESC") => {
        sortBy.value = field;
        sortOrder.value = order;
        currentPage.value = 1; // Reset to first page when sorting changes
    };

    // Watch for changes in pagination/sorting and fetch new data
    // This is Vue's equivalent to React's useEffect
    watch([currentPage, itemsPerPage, sortBy, sortOrder], () => {
        fetchTodos();
    });

    onMounted(() => {
        fetchTodos();
    });

    return {
        todos,
        taskInput,
        dateStartPart,
        dateStartTimePart,
        dateDuePart,
        dateDueTimePart,
        // Details
        taskDetails,
        notesDetails,
        statusDetails,
        priorityDetails,
        loading,
        // Pagination & Sorting
        currentPage,
        itemsPerPage,
        sortBy,
        sortOrder,
        totalPages,
        totalItems,
        hasNext,
        hasPrev,
        formatDate,
        fetchTodos,
        fetchDetailsId,
        handleCreateTodo,
        handleCreateTodoDetails,
        handleDeleteTodo,
        handlStatusTodos,
        // Pagination methods
        goToPage,
        nextPage,
        prevPage,
        changeItemsPerPage,
        changeSorting,
    };
};
