<template>
  <v-app>
    <v-layout>
      <app-header v-if="!isPublicRoute" />

      <v-main>
        <v-container fluid :class="{ 'min-h-screen': isPublicRoute }">
          <NuxtPage />
        </v-container>
      </v-main>

    </v-layout>
  </v-app>
</template>

<script setup>
const route = useRoute()

const publicRoutes = ['/login', '/unsubscribe']

const isPublicRoute = computed(() => {
  return publicRoutes.includes(route.path)
})
</script>

<style>
body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.v-container {
  max-width: 1280px;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>