import { defineStore } from 'pinia';

interface Newsletter {
  id: number;
  title: string;
  subject: string;
  status: string;
  created: string;
  scheduled: string | null;
  statistics: { sent: number; opened: number; clicked: number };
}

export const useNewsletterStore = defineStore('newsletter', {
  state: () => ({
    newsletters: [] as Newsletter[],
    currentNewsletter: null as Newsletter | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchNewsletters() {
      this.loading = true
      try {
        const response = await $fetch('/api/newsletters', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }) as any
        if (response.success) {
          this.newsletters = response.data
          this.error = null
        } else {
          this.error = response.message
        }
      } catch (error) {
        this.error = 'Failed to load newsletters'
        console.error('Error fetching newsletters:', error)
      } finally {
        this.loading = false
      }
    },

    async getNewsletter(id: number) {
      this.loading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        const newsletter = this.newsletters.find(n => n.id === id)
        this.currentNewsletter = newsletter || null
        this.error = null
      } catch (error) {
        this.error = 'Failed to load newsletter'
        console.error('Error getting newsletter:', error)
      } finally {
        this.loading = false
      }
      return this.currentNewsletter
    },

    async createNewsletter(newsletterData: Newsletter) {
      this.loading = true
      try {
        const response = await $fetch('/api/newsletters', {
          method: 'POST',
          body: newsletterData
        }) as any

        if (response.success) {
          this.newsletters.push(response.data)
          this.error = null
          return response.data
        } else {
          this.error = response.message
          return null
        }
      } catch (error) {
        this.error = 'Failed to create newsletter'
        console.error('Error creating newsletter:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    async updateNewsletter(id: number, newsletterData: Newsletter) {
      this.loading = true
      try {
        const response = await $fetch(`/api/newsletters/${id}`, {
          method: 'PUT',
          body: newsletterData
        }) as any

        if (response.success) {
          this.error = null
          this.newsletters = this.newsletters.map(n => n.id === id ? response.data : n)
          return response.data
        } else {
          this.error = response.message
          return null
        }
      } catch (error) {
        this.error = 'Failed to update newsletter'
        console.error('Error updating newsletter:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    async scheduleNewsletter(id: number, scheduledDate: string) {
      this.loading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        const index = this.newsletters.findIndex(n => n.id === id)
        if (index !== -1) {
          this.newsletters[index].status = 'scheduled'
          this.newsletters[index].scheduled = scheduledDate
          this.error = null
          return this.newsletters[index]
        }
        throw new Error('Newsletter not found')
      } catch (error) {
        this.error = 'Failed to schedule newsletter'
        console.error('Error scheduling newsletter:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    async deleteNewsletter(id: number) {
      this.loading = true
      try {
        const response = await $fetch(`/api/newsletters/${id}`, {
          method: 'DELETE'
        }) as any

        if (response.success) {
          this.newsletters = this.newsletters.filter(n => n.id !== id)
          this.error = null
          return true
        } else {
          this.error = response.message
          return false
        }
      } catch (error) {
        this.error = 'Failed to delete newsletter'
        console.error('Error deleting newsletter:', error)
        return false
      } finally {
        this.loading = false
      }
    }
  }
})