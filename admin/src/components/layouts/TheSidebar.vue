<template>
  <!-- Toggle sidebar button -->
  <button 
    class="fixed z-50 bottom-4 right-4 w-16 h-16 rounded-full bg-gray-900 lg:hidden"
    @click="toggleSidebar">
  </button>

  <!-- Sidebar Overlay -->
  <div 
    class="fixed inset-0 bg-black bg-opacity-25 z-30 lg:hidden" 
    :class="{'hidden': !showSidebar}" 
    @click="showSidebar = false" />
  <div 
    class="fixed z-40 left-0 top-0 right-24 lg:right-auto lg:w-64 h-screen border-r border-gray-200 overflow-y-auto bg-white" 
    :class="{'hidden': allowSidebarHide && !showSidebar}">
    <!-- Header -->
    <header class="flex items-center pt-10 px-5">
      <img 
        src="@/assets/logo.svg" 
        alt="Logo" 
        class="w-10">
      <div class="ml-2 flex flex-col">
        <h1 class="text-sm text-gray-700 font-medium">Admin Panel</h1>
        <p class="text-gray-400 text-xs">VueJS + Vite + Tailwind</p>
      </div>
    </header>
    <!-- Menu -->
    <div class="mt-14">

      <!-- Menu Header -->
      <menu-header 
        class="mt-10" 
        text="Menu" />
      <menu-item 
        text="Home" 
        :route="{path: '/'}" />
      <menu-item 
        text="Education panel"
        :route="{path: '/education'}">
      </menu-item>
      <menu-item 
        text="Projects panel"
        :route="{path: '/projects'}">
      </menu-item>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useRoute } from 'vue-router'

import MenuHeader from './TheSidebarMenuHeader.vue'
import MenuItem from './TheSidebarMenuItem.vue'
import SubMenuHeader from './TheSidebarSubMenuHeader.vue'
import SubMenuItem from './TheSidebarSubMenuItem.vue'

export default {
  name: 'TheSidebar',
  components: {
    MenuHeader,
    MenuItem,
    SubMenuHeader,
    SubMenuItem,
  },
  emits: ['visibility-change'],
  setup(_, {emit}) {
    const showSidebar = ref(false)
    const toggleSidebar = () => showSidebar.value = !showSidebar.value
    watch(showSidebar, (val) => {
      emit('visibility-change', val)
    })

    // Automatically hide sidebar when route changed
    const route = useRoute()
    watch(route, () => showSidebar.value = false)
    
    // Automatically hide sidebar when window size
    // lower than width breakpoint
    const widthBreakpoint = 1024 // Tailwind `lg` breakpoint
    const { width: windowWidth } = useWindowSize()
    watch(windowWidth, (newWidth) => {
      if (newWidth < widthBreakpoint) showSidebar.value = false
    })

    const allowSidebarHide = computed(() => windowWidth.value < widthBreakpoint)

    return {
      showSidebar,
      toggleSidebar,
      allowSidebarHide
    }
  }
}
</script>

<style scoped>
.btn-toggle {
  @apply absolute left-1/2 top-1/2 transition duration-300 transform -translate-x-1/2 -translate-y-1/2;
}
</style>