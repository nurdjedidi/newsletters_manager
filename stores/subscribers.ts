import { defineStore } from 'pinia'

interface Subscriber {
  id: number
  email: string
  name: string
  status: string
  joinedAt: string
  lastActivity: string | null
}

export const useSubscribersStore = defineStore('subscribers', {
  state: () => ({
    subscribers: [] as Subscriber[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    activeSubscribers: (state) => state.subscribers.filter((s: any) => s.status == 1 || s.status === 'active'),
    subscriberCount: (state) => state.subscribers.length,
    activeCount: (state) => {
      const active = state.subscribers.filter((s: any) => {
        return s.status == 1 || s.status === 'active'
      })
      return active.length
    }
  },

  actions: {
    async fetchSubscribers() {
      this.loading = true
      try {
        const response = await $fetch('/api/subscribers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }) as any
        if (response.success) {
          this.subscribers = response.data
          this.error = null
        } else {
          this.error = response.message
        }
      } catch (error) {
        this.error = (error as Error).message as string | null
      } finally {
        this.loading = false
      }
    },

    async addSubscriber(subscriberData: Subscriber) {
      this.loading = true
      try {
        const response = await $fetch('/api/subscribers', {
          method: 'POST',
          body: subscriberData
        }) as any
        if (response.success) {
          this.subscribers.unshift(response.data)
          this.error = null
          return response.data
        } else {
          this.error = response.message
        }
      } catch (error) {
        this.error = (error as Error).message as string | null
      }
    },

    async updateSubscriber(id: number, subscriberData: Subscriber) {
      this.loading = true
      try {
        const response = await $fetch(`/api/subscribers/${id}`, {
          method: 'PUT',
          body: subscriberData
        }) as any
        if (response.success) {
          this.subscribers = this.subscribers.map((s: any) => s.id === id ? response.data : s)
          this.error = null
          return response.data
        } else {
          this.error = response.message
        }
      } catch (error) {
        this.error = (error as Error).message as string | null
      } finally {
        this.loading = false
      }
    },

    async removeSubscriber(id: number) {
      this.loading = true
      try {
        const response = await $fetch(`/api/subscribers/${id}`, {
          method: 'DELETE'
        }) as any
        if (response.success) {
          this.subscribers = this.subscribers.filter((s: any) => s.id !== id)
          this.error = null
          return true
        } else {
          this.error = response.message
        }
      } catch (error) {
        this.error = 'Failed to remove subscriber'
        console.error('Error removing subscriber:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    async importSubscribers(subscribersData: Subscriber[]) {
      this.loading = true
      try {
        const response = await $fetch('/api/subscribers/import', {
          method: 'POST',
          body: { subscribers: subscribersData }
        }) as any

        if (response.success) {
          this.subscribers = [...response.data, ...this.subscribers]
          this.error = null
          const result = {
            count: response.data.length,
            errors: response.errors || [],
            message: response.message
          }
          return result
        } else {
          this.error = response.message
          const result = { count: 0, errors: [response.message], message: response.message }
          return result
        }
      } catch (error) {
        this.error = (error as Error).message
        const result = { count: 0, errors: [(error as Error).message], message: 'Erreur lors de l\'import' }
        return result
      } finally {
        this.loading = false
      }
    }
  }
})