<template>
  <div class="fixed z-20 top-0 left-0 lg:left-64 right-0 h-14 bg-white border-b border-gray-200 flex flex-row items-center justify-between px-5">
    <h3 class="text-sm font-medium text-gray-600">Welcome, {{ user.name }}</h3>
    <div class="flex items-center">
      <tw-dropdown 
        class="ml-3" 
        origin="right" 
        body-class="top-8">
        <img 
          src="@/assets/avatar.png" 
          alt="Avatar" 
          class="w-6 h-6 rounded-full">
        <template #body>
          <ul>
            <li class="px-4 py-2 cursor-pointer hover:bg-purple-50 hover:text-purple-500" @click="logout()">
              Sign out
            </li>
          </ul>
        </template>
      </tw-dropdown>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TheNavbar',
  
  setup() {
    const user = {
      name: localStorage.getItem('username') || 'Unknown username',
    }

    return {
      user,
    }
  },

  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      this.$router.push('/login')
    }
  }
}
</script>