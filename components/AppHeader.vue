<template>
  <v-app-bar color="primary" app flat>
    <v-app-bar-title class="cursor-pointer" @click="navigateTo('/')">
      <span class="text-white font-weight-bold mr-1">Newsletter</span>
      <span class="text-grey-lighten-4">Manager</span>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <div class="d-none d-md-flex align-center">
      <v-btn v-for="item in navItems" :key="item.title" :to="item.to" variant="text" color="white">
        {{ item.title }}
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="text" color="white" prepend-icon="mdi-account-circle">
            Admin
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout" prepend-icon="mdi-logout" title="Se déconnecter">
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <v-app-bar-nav-icon @click="drawer = !drawer" class="d-flex d-md-none" color="white"></v-app-bar-nav-icon>

    <v-navigation-drawer v-model="drawer" temporary location="end">
      <v-list>

        <v-list-item v-for="item in navItems" :key="item.title" :title="item.title" :to="item.to"
          @click="drawer = false">
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item title="Log Out" @click="logout" color="error"></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script setup>
import { ref, computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const drawer = ref(false)

const navItems = [
  { title: 'Dashboard', to: '/' },
  { title: 'Newsletters', to: '/newsletters' },
  { title: 'Subscribers', to: '/subscribers' }
]

const logout = async () => {
  authStore.logout()
  await router.push('/login')
  drawer.value = false
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>