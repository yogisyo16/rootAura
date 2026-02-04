<script setup lang="ts">
import { ref } from "vue";
import { useTodo } from "@/utils/useTodo";
import { useAlert } from "@/utils/useAlert";
import Modal from "../Modal.vue";
import Alert from "../Alert.vue";
import TodoItem from "./TodoItem.vue";
import TodoForm from "./TodoForm.vue";
const {
    todos,
    fetchDetailsId,
    taskInput,
    dateStartPart,
    dateStartTimePart,
    dateDuePart,
    dateDueTimePart,
    taskDetails,
    notesDetails,
    priorityDetails,
    statusDetails,
    loading,
    formatDate,
    handleCreateTodo,
    handleDeleteTodo,
    handlStatusTodos,
    handleCreateTodoDetails,
    fetchTodos,
} = useTodo();

// Alert state
const { isAlertOpen, alertTitle, alertMessage, alertType, closeAlert } =
    useAlert();

// Modal state
const isModalOpen = ref(false);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

// Handle submit now have been updated to handle details creation also
// This creates more enhancements to the Todo creation process
// Before the submit it can be done for details but the todos.id it will undefined on backend
// Now it can be done for details and todos.id it will be defined on backend
const handleSubmit = async () => {
    try {
        const createdTodo = await handleCreateTodo();
        if (createdTodo && createdTodo.id) {
            // This is crucial for details creation
            // Because in future details can be created by the user not just only inside the Create Todo Form
            if (taskDetails.value && taskDetails.value.trim() !== "") {
                console.log("Details found, saving...", createdTodo.id);

                await handleCreateTodoDetails(createdTodo.id);
            }
        } else {
            console.error("Todo creation failed or ID is missing", createdTodo);
        }
    } catch (error) {
        console.error("Unexpected error in handleSubmit:", error);
    } finally {
        // The fetchTodos function is crucial for updating the UI with the latest data after a successful submission.
        await fetchTodos();
        closeModal();
    }
};

const handleOpenDetailsModal = (id: string) => {
    openModal();
};

const handleSubmitDetailsId = async (id: string) => {
    try {
        const createdDetails = await handleCreateTodoDetails(id);
        console.log("Details created:", createdDetails);
    } catch (error) {
        console.error("Error creating details:", error);
    }
};
</script>

<template>
    <div class="p-4 mx-auto">
        <!-- Alert Component -->
        <Alert
            :isOpen="isAlertOpen"
            :title="alertTitle"
            :message="alertMessage"
            :type="alertType"
            @close="closeAlert"
        />

        <div class="flex flex-row gap-8">
            <div class="flex flex-col gap-2">
                <h1 class="text-2xl font-bold mb-4 text-white">Create Todos</h1>
                <button
                    @click="openModal"
                    class="bg-indigo-500 p-1.5 rounded-md hover:cursor-pointer hover:bg-indigo-600 hover:text-white transition-colors text-white"
                >
                    Create
                </button>
            </div>

            <div class="flex flex-col flex-1 gap-2">
                <h1 class="text-2xl font-bold mb-4 text-white">My Todos</h1>

                <div v-if="loading" class="text-white">
                    <p>Loading...</p>
                </div>

                <ul v-else class="flex flex-col gap-4">
                    <li v-if="todos.length === 0" class="text-white italic">
                        No todos found.
                    </li>

                    <TodoItem
                        v-for="todo in todos"
                        :key="todo.id"
                        :todo="todo"
                        :formatDate="formatDate"
                        @delete="handleDeleteTodo"
                        @updateStatus="handlStatusTodos"
                    />
                </ul>
            </div>
        </div>

        <!-- Modal Component -->
        <Modal
            :isOpen="isModalOpen"
            @close="closeModal"
            title="Create New Todo"
        >
            <template #body>
                <TodoForm
                    v-model:taskInput="taskInput"
                    v-model:dateStartPart="dateStartPart"
                    v-model:dateStartTimePart="dateStartTimePart"
                    v-model:dateDuePart="dateDuePart"
                    v-model:dateDueTimePart="dateDueTimePart"
                    v-model:taskDetails="taskDetails"
                    v-model:notesDetails="notesDetails"
                    v-model:statusDetails="statusDetails"
                    v-model:priorityDetails="priorityDetails"
                    @submit="handleSubmit"
                />
            </template>

            <template #footer>
                <div class="flex gap-2 justify-end">
                    <button
                        @click="closeModal"
                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        @click="handleSubmit"
                        class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
                    >
                        Add Todo
                    </button>
                </div>
            </template>
        </Modal>
    </div>
</template>
