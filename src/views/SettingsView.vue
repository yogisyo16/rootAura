<script setup lang="ts">
import { ref } from "vue";

const username = ref("");
const email = ref("");
const notifications = ref(true);

const handleSaveSettings = () => {
    // This is going to be the implementation with useAccount
    console.log("Settings saved:", { username, email, notifications });
};
</script>

<template>
    <div class="flex justify-center mx-auto p-4">
        <div class="flex flex-col items-center gap-2">
            <h1 class="text-2xl font-bold mb-6 text-white">Account Settings</h1>
            <form
                @submit.prevent="handleSaveSettings"
                class="flex flex-col gap-6 bg-gray-800 p-6 rounded-lg shadow-lg"
            >
                <div class="flex flex-col gap-2">
                    <label class="block text-sm font-bold mb-2 text-gray-300"
                        >Username</label
                    >
                    <input
                        type="text"
                        v-model="username"
                        placeholder="Enter your username"
                        class="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="block text-sm font-bold mb-2 text-gray-300"
                        >Email</label
                    >
                    <input
                        type="email"
                        v-model="email"
                        placeholder="Enter your email"
                        class="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                </div>

                <div class="flex flex-col gap-[3px]">
                    <div class="flex items-center gap-1">
                        <input
                            type="checkbox"
                            v-model="notifications"
                            id="notifications"
                            class="w-4 h-4 mr-2"
                        />
                        <label for="notifications" class="text-sm text-gray-300">
                            Enable notifications
                        </label>
                    </div>
    
                    <button
                        type="submit"
                        class="w-full p-2.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                        Save Settings
                    </button>
                </div>

            </form>
        </div>
    </div>
</template>
