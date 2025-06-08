export default defineNuxtRouteMiddleware((to) => {
  const publicRoutes = ['/login', '/unsubscribe']

  if (publicRoutes.includes(to.path)) {
    return
  }

  if (process.client) {
    const authStore = useAuthStore()

    authStore.checkAuthFromStorage()

    if (!authStore.isAuthenticated) {
      return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
  }
}) 