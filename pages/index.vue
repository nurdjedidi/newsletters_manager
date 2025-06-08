<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 font-weight-medium mb-4">Dashboard</h1>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-card class="h-100" :loading="subscribersStore.loading" elevation="2">
            <v-card-item>
              <v-card-title class="text-subtitle-1 text-grey-darken-1">Subscribers</v-card-title>
              <div class="text-h4 mt-2 d-flex align-center">
                {{ subscribersStore.subscriberCount }}
                <v-chip size="small" color="success" class="ml-3" v-if="subscribersStore.subscriberCount > 0">
                  <v-icon start>mdi-account-multiple</v-icon>
                </v-chip>
              </div>
              <v-card-subtitle class="pt-2">
                {{ subscribersStore.activeCount }} active subscribers
              </v-card-subtitle>
            </v-card-item>

            <v-card-actions>
              <v-btn variant="text" color="primary" to="/subscribers">
                Manage Subscribers
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="h-100" :loading="newsletterStore.loading" elevation="2">
            <v-card-item>
              <v-card-title class="text-subtitle-1 text-grey-darken-1">Newsletters</v-card-title>
              <div class="text-h4 mt-2">
                {{ newsletterStore.newsletters.length }}
              </div>
              <v-card-subtitle class="pt-2">
                {{ recentNewslettersCount }} created recently
              </v-card-subtitle>
            </v-card-item>

            <v-card-actions>
              <v-btn variant="text" color="primary" to="/newsletters">
                Manage Newsletters
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="h-100" elevation="2">
            <v-card-item>
              <v-card-title class="text-subtitle-1 text-grey-darken-1">Quick Actions</v-card-title>
              <div class="text-h6 mt-2">
                Manage your newsletters
              </div>
              <v-card-subtitle class="pt-2">
                Create, edit and send newsletters
              </v-card-subtitle>
            </v-card-item>

            <v-card-actions>
              <v-btn variant="text" color="primary" to="/newsletters/create">
                Create Newsletter
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-card elevation="2">
            <v-card-title class="d-flex justify-space-between align-center">
              Recent Newsletters
              <v-btn color="primary" variant="tonal" to="/newsletters/create" prepend-icon="mdi-plus">
                Create Newsletter
              </v-btn>
            </v-card-title>

            <v-table v-if="newsletterStore.newsletters.length">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Sent/Scheduled</th>
                  <th>Performance</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="newsletter in newsletterStore.newsletters.slice(0, 5)" :key="newsletter.id">
                  <td>{{ newsletter.title }}</td>
                  <td>
                    <v-chip size="small" :color="getStatusColor(newsletter.status)" variant="tonal">
                      {{ newsletter.status === 1 ? 'Active' : 'Draft' }}
                    </v-chip>
                  </td>
                  <td>{{ newsletter.created_at ? formatHijriDate(newsletter.created_at) : '-' }}</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              </tbody>
            </v-table>

            <v-card-text v-else-if="!newsletterStore.loading">
              <p class="text-center pa-4">No newsletters found. Create your first newsletter!</p>
            </v-card-text>

            <v-card-text v-else>
              <div class="d-flex justify-center py-4">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
            </v-card-text>

            <v-card-actions v-if="newsletterStore.newsletters.length > 5">
              <v-spacer></v-spacer>
              <v-btn variant="text" color="primary" to="/newsletters">
                View All
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-card elevation="2">
            <v-card-title>Recent Subscribers</v-card-title>
            <v-card-text>
              <div v-if="subscribersStore.subscribers.length && !subscribersStore.loading">
                <v-list>
                  <v-list-item v-for="subscriber in subscribersStore.subscribers.slice(0, 5)" :key="subscriber.id">
                    <template v-slot:prepend>
                      <v-avatar color="primary" size="small">
                        <v-icon>mdi-account</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title>{{ subscriber.email }}</v-list-item-title>
                    <v-list-item-subtitle>{{ subscriber.name || 'No name' }}</v-list-item-subtitle>
                    <template v-slot:append>
                      <v-chip size="small" :color="subscriber.status === 1 ? 'success' : 'grey'">
                        {{ subscriber.status === 1 ? 'Active' : 'Inactive' }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </div>
              <div v-else-if="subscribersStore.loading" class="d-flex justify-center py-5">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
              <p v-else class="text-center pa-4">No subscribers found.</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="text" color="primary" to="/subscribers">
                View All Subscribers
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card elevation="2">
            <v-card-title>Newsletter Statistics</v-card-title>
            <v-card-text>
              <div class="d-flex flex-column gap-3">
                <div class="d-flex justify-space-between align-center">
                  <span class="text-subtitle-2">Total Newsletters:</span>
                  <span class="text-h6">{{ newsletterStore.newsletters.length }}</span>
                </div>
                <v-divider></v-divider>
                <div class="d-flex justify-space-between align-center">
                  <span class="text-subtitle-2">Total Subscribers:</span>
                  <span class="text-h6">{{ subscribersStore.subscriberCount }}</span>
                </div>
                <v-divider></v-divider>
                <div class="d-flex justify-space-between align-center">
                  <span class="text-subtitle-2">Active Subscribers:</span>
                  <span class="text-h6 text-success">{{ subscribersStore.activeCount }}</span>
                </div>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="text" color="primary" to="/newsletters/create">
                Create Newsletter
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNewsletterStore } from '~/stores/newsletter'
import { useSubscribersStore } from '~/stores/subscribers'
import { formatHijriDate } from '~/utils/hijri'

const newsletterStore = useNewsletterStore()
const subscribersStore = useSubscribersStore()

onMounted(async () => {
  await Promise.all([
    newsletterStore.fetchNewsletters(),
    subscribersStore.fetchSubscribers()
  ])
})

const recentNewslettersCount = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  return newsletterStore.newsletters.filter(newsletter => {
    if (!newsletter.created) return false
    const createdDate = new Date(newsletter.created)
    return createdDate >= oneWeekAgo
  }).length
})

const getStatusColor = (status) => {
  switch (status) {
    case 1:
    case 'active': return 'success'
    case 'draft': return 'grey-lighten-1'
    case 'scheduled': return 'amber-darken-2'
    case 'sent': return 'success'
    case 'failed': return 'error'
    default: return 'grey'
  }
}
</script>
