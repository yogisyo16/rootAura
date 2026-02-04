<script setup lang="ts">
import { ref } from "vue";
import { useTodo } from "@/utils/useTodo";
import { useAlert } from "@/utils/useAlert";
import Modal from "../Modal.vue";
import Alert from "../Alert.vue";
import TodoItem from "./TodoItem.vue";
import TodoForm from "./TodoForm.vue";
import {
    getTodos,
    createTodo,
    deleteTodo,
    updateTodo,
    toggleTodoComplete,
    getTodosDetailsById,
    createTodosDetails,
} from "@/services/todoServices/services";
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

const handleSubmit = async () => {
    const createdTodo = await handleCreateTodo();
    let detailsSuccess;
    if (createdTodo) {
        console.log("Successfully created ID:", createdTodo.id);
        console.log("Successfully created Task:", createdTodo.task);

        detailsSuccess = await handleCreateTodoDetails(createdTodo.id);

        console.log("Details created:", detailsSuccess);
        if (detailsSuccess) {
            await fetchTodos();
            closeModal();
        } else {
            alert("Todo created, but details failed to save.");
            await fetchTodos();
            closeModal();
        }
    } else {
        console.log("Todo creation failed.", createdTodo);
        console.log("Todo creation failed.", detailsSuccess);
        // alert("Todo creation failed.");
        closeModal();
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
