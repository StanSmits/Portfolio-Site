<template>
  <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 opacity-0 animate-fade-right animate-once animate-duration-[800ms] animate-ease-in-out animate-normal animate-fill-forwards">
    <div class="bg-green-50 rounded-xl p-5 cursor-pointer" @click="$router.push('projects')">
      <p class="mt-8 text-green-500 text-sm">Education panel</p>
    </div>
    <div class="bg-purple-50 rounded-xl p-5 cursor-pointer opacity-0 animate-fade-right animate-once animate-duration-[800ms] animate-ease-in-out animate-normal animate-fill-forwards" @click="$router.push('projects')">
      <p class="mt-8 text-purple-500 text-sm">Projects panel</p>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
const router = useRouter();

export default {
  name: "Home",
};
</script>
