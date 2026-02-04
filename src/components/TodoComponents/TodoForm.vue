<script setup lang="ts">
import { ref } from "vue";

// This props is for usage on Todos.vue (The main components, where all other component will be merge)
// Define props
const props = defineProps<{
    taskInput: string;
    dateStartPart: string;
    dateStartTimePart: string;
    dateDuePart: string;
    dateDueTimePart: string;

    taskDetails?: string;
    notesDetails?: string;
    statusDetails?: string;
    priorityDetails?: string;
}>();

// Define emits
const emit = defineEmits<{
    "update:taskInput": [value: string];
    "update:dateStartPart": [value: string];
    "update:dateStartTimePart": [value: string];
    "update:dateDuePart": [value: string];
    "update:dateDueTimePart": [value: string];
    "update:taskDetails": [value: string];
    "update:notesDetails": [value: string];
    "update:statusDetails": [value: string];
    "update:priorityDetails": [value: string];
    submit: [];
}>();

const isExtendModal = ref(false);
const isExtendTimeModal = ref(false);

const extendTimeModal = () => {
    console.log("Added time");
    isExtendTimeModal.value = true;
};

const closeTimeModal = () => {
    console.log("Close time");
    isExtendTimeModal.value = false;

    // Reset date inputs
    // emit("update:dateStartPart", "");
    // emit("update:dateStartTimePart", "");
    // emit("update:dateDuePart", "");
    // emit("update:dateDueTimePart", "");
};

const extendModal = () => {
    console.log("Extend Modal");
    isExtendModal.value = true;
};

const closeExtendModal = () => {
    console.log("Close Extend Modal");
    isExtendModal.value = false;

    // emit("update:taskDetails", "");
    // emit("update:notesDetails", "");
    // emit("update:statusDetails", "");
    // emit("update:priorityDetails", "");
};
</script>

<template>
    <form @submit.prevent="emit('submit')" class="space-y-4">
        <div class="flex flex-col">
            <label class="text-sm font-bold mb-1 text-gray-700"
                >Task Name *</label
            >
            <input
                type="text"
                :value="taskInput"
                @input="
                    emit(
                        'update:taskInput',
                        ($event.target as HTMLInputElement).value,
                    )
                "
                placeholder="What needs to be done?"
                required
                class="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
        </div>

        <div class="flex flex-row gap-2 py-2">
            <div v-if="!isExtendTimeModal" class="flex flex-col">
                <button
                    type="button"
                    @click="extendTimeModal"
                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                    Add date
                </button>
            </div>

            <div v-if="!isExtendModal" class="flex flex-col">
                <button
                    type="button"
                    @click="extendModal"
                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                    Add details
                </button>
            </div>
        </div>

        <div class="flex flex-col gap-4">
            <!-- Extended form for Time -->
            <div
                v-if="isExtendTimeModal"
                class="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-300"
            >
                <div class="flex flex-col gap-2 pb-2">
                    <div class="flex flex-col">
                        <label class="text-sm font-bold mb-1 text-gray-700"
                            >Start Date *</label
                        >
                        <input
                            type="date"
                            :value="dateStartPart"
                            @input="
                                emit(
                                    'update:dateStartPart',
                                    ($event.target as HTMLInputElement).value,
                                )
                            "
                            required
                            class="p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    <div class="flex flex-col">
                        <label class="text-sm font-bold mb-1 text-gray-700"
                            >Start Time (Optional)</label
                        >
                        <input
                            type="time"
                            :value="dateStartTimePart"
                            @input="
                                emit(
                                    'update:dateStartTimePart',
                                    ($event.target as HTMLInputElement).value,
                                )
                            "
                            class="p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <small class="text-gray-500 mt-1"
                            >If not specified, defaults to 00:00</small
                        >
                    </div>

                    <div class="flex flex-col">
                        <label class="text-sm font-bold mb-1 text-gray-700"
                            >Due Date *</label
                        >
                        <input
                            type="date"
                            :value="dateDuePart"
                            @input="
                                emit(
                                    'update:dateDuePart',
                                    ($event.target as HTMLInputElement).value,
                                )
                            "
                            required
                            class="p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    <div class="flex flex-col">
                        <label class="text-sm font-bold mb-1 text-gray-700"
                            >Due Time (Optional)</label
                        >
                        <input
                            type="time"
                            :value="dateDueTimePart"
                            @input="
                                emit(
                                    'update:dateDueTimePart',
                                    ($event.target as HTMLInputElement).value,
                                )
                            "
                            class="p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <small class="text-gray-500 mt-1"
                            >If not specified, defaults to 00:00</small
                        >
                    </div>
                </div>

                <button
                    type="button"
                    @click="closeTimeModal"
                    class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                    Close Time
                </button>
            </div>

            <!-- Extended Form Details-->
            <div
                v-if="isExtendModal"
                class="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-300"
            >
                <div class="flex flex-col gap-2 pb-2">
                    <div class="flex flex-col">
                        <label class="text-sm font-bold mb-1 text-gray-700"
                            >Task Detail</label
                        >
                        <input
                            type="text"
                            :value="taskDetails"
                            @input="
                                emit(
                                    'update:taskDetails',
                                    ($event.target as HTMLInputElement).value,
                                )
                            "
                            placeholder="What needs to be done?"
                            required
                            class="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <label class="text-sm font-bold mb-1 text-gray-700"
                            >Task Notes</label
                        >
                        <input
                            type="text"
                            :value="notesDetails"
                            @input="
                                emit(
                                    'update:notesDetails',
                                    ($event.target as HTMLInputElement).value,
                                )
                            "
                            placeholder="What needs to be done?"
                            required
                            class="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <label class="text-sm font-bold mb-1 text-gray-700"
                            >Task Priority</label
                        >
                        <select
                            :value="priorityDetails"
                            @input="
                                emit(
                                    'update:priorityDetails',
                                    ($event.target as HTMLSelectElement).value,
                                )
                            "
                            class="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <label class="text-sm font-bold mb-1 text-gray-700"
                            >Task Status</label
                        >
                        <input
                            type="text"
                            :value="statusDetails"
                            @input="
                                emit(
                                    'update:statusDetails',
                                    ($event.target as HTMLInputElement).value,
                                )
                            "
                            placeholder="What needs to be done?"
                            required
                            class="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    @click="closeExtendModal"
                    class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                    Close Details
                </button>
            </div>
        </div>
    </form>
</template>
