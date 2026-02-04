<script setup lang="ts">
import { ref } from "vue";
import type { Todo } from "@/services/todoServices/type";
// import IcEdit from "@/assets/icons/IcEdit.vue";
// import IcPlus from "@/assets/icons/IcPlus.vue";
// import IcEye from "@/assets/icons/IcEye.vue";
// import IcTrash from "@/assets/icons/IcTrash.vue";
// import IcMenu from "@/assets/icons/IcMenu.vue";
// import IcChevronDown from "@/assets/icons/IcChevronDown.vue";
import IcEdit from "../../assets/icons/IcEdit.vue";
import IcPlus from "../../assets/icons/IcPlus.vue";
import IcEye from "../../assets/icons/IcEye.vue";
import IcTrash from "../../assets/icons/IcTrash.vue";
import IcMenu from "../../assets/icons/IcMenu.vue";
import IcChevronDown from "../../assets/icons/IcChevronDown.vue";
import {
    getTodosDetailsAll,
    getTodosDetailsById,
    getTodosDetailByTodoId,
} from "@/services/todoServices/services";

// Define props
const props = defineProps<{
    todo: Todo;
    formatDate: (date: string) => string;
}>();

// Define emits
const emit = defineEmits<{
    delete: [id: string];
    updateStatus: [id: string];
    openDetails: [id: string];
}>();

// Local state for this todo item
const openMenuId = ref(false);
const showDetails = ref(false);

const toggleMenu = () => {
    openMenuId.value = !openMenuId.value;
};

const closeMenu = () => {
    openMenuId.value = false;
};

const toggleDetails = () => {
    showDetails.value = !showDetails.value;
};

const handleEdit = () => {
    console.log("Edit todo:", props.todo.id);
    // TODO: Implement edit functionality
    closeMenu();
};

const handleDetails = () => {
    console.log("View details:", props.todo.id);
    // TODO: Implement details view
    closeMenu();
};

const handleDelete = () => {
    if (confirm("Are you sure you want to delete this todo?")) {
        emit("delete", props.todo.id);
        closeMenu();
    }
};

const handleStatusTodo = () => {
    emit("updateStatus", props.todo.id);
    console.log(getTodosDetailsAll(), ": All GetAllDetails");
    console.log(
        getTodosDetailsById(props.todo.todo_details.id),
        "All DetailsId",
    );
    console.log(getTodosDetailByTodoId(props.todo.id), "All TodoId");
};

const todoProgress = () => {
    return props.todo.completed ? "Completed" : "In-Progress";
};
</script>

<template>
    <li
        class="flex justify-between items-center bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
    >
        <div>
            <div class="flex items-center gap-2 mb-1">
                <strong class="block text-white text-lg">{{
                    todo.task
                }}</strong>
                <span
                    class="px-2.5 py-1 text-xs font-semibold rounded-full"
                    :class="
                        todo.completed
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    "
                >
                    {{ todoProgress() }}
                </span>
            </div>

            <div
                v-if="todo.date_start !== null || todo.date_due !== null"
                class="flex flex-col gap-1 py-2"
            >
                <small v-if="todo.date_start !== null" class="text-gray-400">
                    Start: {{ formatDate(todo.date_start) }}
                </small>
                <small v-if="todo.date_due !== null" class="text-gray-400">
                    Due: {{ formatDate(todo.date_due) }}
                </small>
            </div>

            <!-- Show Details Button -->
            <div
                v-if="
                    todo.todo_details?.task_details ||
                    todo.todo_details?.notes_details ||
                    todo.todo_details?.status_details ||
                    todo.todo_details?.priority_details
                "
                :class="showDetails ? 'pt-1 pb-3' : 'pt-1'"
            >
                <button
                    @click="toggleDetails"
                    class="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                    <IcChevronDown
                        :className="`h-4 w-4 ${showDetails ? 'rotate-180' : ''}`"
                        style="transition: transform 0.2s"
                    />
                    {{ showDetails ? "Hide Details" : "Show Details" }}
                </button>
            </div>

            <!-- Details Section -->
            <div
                v-if="showDetails"
                class="flex flex-col gap-1 md:gap-1.5 pt-3 mt-3 border-t border-gray-700"
            >
                <p class="block text-white font-semibold">Details:</p>
                <div class="flex flex-row gap-4">
                    <div class="flex flex-col">
                        <small class="text-gray-300">
                            Details:
                            <span class="text-gray-400">
                                {{ todo.todo_details?.task_details || "N/A" }}
                            </span>
                        </small>
                        <small class="text-gray-300">
                            Notes:
                            <span class="text-gray-400">
                                {{ todo.todo_details?.notes_details || "N/A" }}
                            </span>
                        </small>
                    </div>
                    <div class="flex flex-col">
                        <small class="text-gray-300">
                            Status:
                            <span class="text-gray-400">
                                {{ todo.todo_details?.status_details || "N/A" }}
                            </span>
                        </small>
                        <small class="text-gray-300">
                            Priority:
                            <span class="text-gray-400">
                                {{
                                    todo.todo_details?.priority_details || "N/A"
                                }}
                            </span>
                        </small>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex items-center gap-4">
            <span class="text-sm font-medium">
                {{ todo.completed ? "✅ Done" : "⏳ Pending" }}
            </span>

            <!-- Menu Button with Dropdown -->
            <div class="relative">
                <button
                    @click="toggleMenu"
                    class="text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-md transition-colors"
                    aria-label="Options menu"
                >
                    <IcMenu className="h-5 w-5" />
                </button>

                <!-- Dropdown Menu -->
                <div
                    v-if="openMenuId"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                >
                    <div class="py-1">
                        <button
                            class="w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed flex items-center gap-2"
                            disabled
                        >
                            <!-- Edit icon - shown when details exist -->
                            <IcEdit
                                v-if="todo.todo_details?.id"
                                className="h-4 w-4"
                            />
                            <!-- Plus icon - shown when no details -->
                            <IcPlus v-else className="h-4 w-4" />

                            {{
                                todo.todo_details?.id
                                    ? "Edit Details"
                                    : "Add Details"
                            }}
                            (Coming soon)
                        </button>

                        <button
                            @click="handleStatusTodo"
                            class="w-full text-left px-4 py-2 text-sm text-black cursor-pointer flex items-center gap-2"
                        >
                            <IcEye className="h-4 w-4" />
                            Update Status
                        </button>

                        <div class="border-t border-gray-200"></div>

                        <button
                            @click="handleDelete"
                            class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                            <IcTrash className="h-4 w-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </li>

    <!-- Click outside to close menu -->
    <div v-if="openMenuId" @click="closeMenu" class="fixed inset-0 z-0"></div>
</template>
