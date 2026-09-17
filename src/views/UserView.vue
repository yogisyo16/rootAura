<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const navigateTo = (path: string) => {
    router.push(path);
};
</script>
<template>
    <div class="flex flex-col items-center p-5 gap-10">
        <h1 class="text-5xl">This is an user page</h1>
        <h1 class="text-lg">Nothing to see here</h1>
        <button
            @click="navigateTo('/todos')"
            class="bg-gray-800 text-white p-2 rounded-md hover:bg-gray-500 hover:text-gray-800 hover:cursor-pointer transition-colors"
        >
            Go back you!
        </button>
    </div>
</template>

<style>
@media (min-width: 1024px) {
    .about {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
}
</style>
