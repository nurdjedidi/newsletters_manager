<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <h1 class="text-h4 font-weight-medium">Newsletters</h1>
          <div class="d-flex gap-3">
            <v-btn color="secondary" variant="outlined" prepend-icon="mdi-send" to="/campaigns/create" class="mr-2">
              Envoyer une campagne
            </v-btn>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="showCreateDialog = true">
              Create Newsletter
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-select v-model="filter" :items="filterOptions" label="Filter Status" variant="outlined"
            density="comfortable" hide-details></v-select>
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="3">
          <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
            density="comfortable" hide-details></v-text-field>
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-col cols="12">
          <v-card v-if="!newsletterStore.loading">
            <v-data-table :headers="headers" :items="filteredNewsletters" :search="search" class="elevation-1">
              <template v-slot:item.status="{ item }">
                <v-chip size="small" :color="getStatusColor(item.status === 1 ? 'active' : 'inactive')">
                  {{ item.status === 1 ? 'active' : 'inactive' }}
                </v-chip>
              </template>

              <template v-slot:item.created="{ item }">
                {{ formatHijriDate(item.created) }}
              </template>

              <template v-slot:item.scheduled="{ item }">
                <span v-if="item.scheduled">{{ formatHijriDate(item.scheduled) }}</span>
                <span v-else>-</span>
              </template>

              <template v-slot:item.performance="{ item }">
                <span v-if="item.status === 'sent'">
                  {{ item.statistics.opened }} opens ({{ Math.round(item.statistics.opened / item.statistics.sent * 100)
                  }}%)
                </span>
                <span v-else>-</span>
              </template>

              <template v-slot:item.actions="{ item }">
                <div class="d-flex gap-2">
                  <v-btn icon variant="text" color="primary" @click="startEdit(item)" title="Edit Newsletter">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>

                  <v-btn icon variant="text" color="primary" @click="confirmDelete(item)" title="Delete Newsletter">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card>

          <v-card v-else class="pa-4">
            <div class="d-flex justify-center align-center" style="min-height: 300px">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showCreateDialog" max-width="500px">
      <v-card>
        <v-card-title class="bg-primary text-white">
          <v-icon color="white">mdi-plus</v-icon>
          Create Newsletter
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field v-model="newNewsletter.title" label="Title" variant="outlined" color="primary"></v-text-field>
          <v-text-field v-model="newNewsletter.subject" label="Subject" variant="outlined"
            color="primary"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="showCreateDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="tonal" @click="createNewsletter">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showEditDialog" max-width="500px">
      <v-card>
        <v-card-title class="bg-primary text-white">
          <v-icon color="white">mdi-pencil</v-icon>
          Edit Newsletter
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field v-model="editedNewsletter.title" label="Title" variant="outlined"
            color="primary"></v-text-field>
          <v-text-field v-model="editedNewsletter.subject" label="Subject" variant="outlined"
            color="primary"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="showEditDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="tonal" @click="updateNewsletter">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="bg-error text-white">
          <v-icon color="white">mdi-delete</v-icon>
          Confirm Delete
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ newsletterToDelete?.title }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="tonal" @click="deleteNewsletter">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNewsletterStore } from '~/stores/newsletter'
import { formatHijriDate, monthHijri } from '~/utils/hijri'

const newsletterStore = useNewsletterStore()
const search = ref('')
const filter = ref('all')
const deleteDialog = ref(false)
const newsletterToDelete = ref(null)
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const editingNewsletter = ref(null)
const newNewsletter = ref({
  title: '',
  subject: '',
})

const editedNewsletter = ref({
  id: null,
  title: '',
  subject: ''
})

const filterOptions = [
  { title: 'All', value: 'all' },
  { title: 'Draft', value: 'draft' },
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'Sent', value: 'sent' }
]

const headers = [
  { title: 'Title', key: 'title' },
  { title: 'Status', key: 'status', width: '120px' },
  { title: 'Created', key: 'created', width: '150px' },
  { title: 'Sent/Scheduled', key: 'scheduled', width: '150px' },
  { title: 'Performance', key: 'performance', width: '150px' },
  { title: 'Actions', key: 'actions', sortable: false, width: '120px', align: 'end' }
]

const filteredNewsletters = computed(() => {
  if (filter.value === 'all') {
    return newsletterStore.newsletters
  } else {
    return newsletterStore.newsletters.filter(n => n.status === filter.value)
  }
})

onMounted(async () => {
  await newsletterStore.fetchNewsletters()
})

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'success'
    case 'inactive': return 'error'
    default: return 'grey'
  }
}

const confirmDelete = (newsletter) => {
  newsletterToDelete.value = newsletter
  deleteDialog.value = true
}

const deleteNewsletter = async () => {
  if (newsletterToDelete.value) {
    await newsletterStore.deleteNewsletter(newsletterToDelete.value.id)
    deleteDialog.value = false
    newsletterToDelete.value = null
  }
}

const createNewsletter = async () => {
  try {
    await newsletterStore.createNewsletter(newNewsletter.value)
    showCreateDialog.value = false
    newNewsletter.value = {
      title: '',
      subject: ''
    }
  } catch (error) {
    console.error('Erreur lors de la création de la newsletter:', error)
  }
}

const startEdit = (newsletter) => {
  editingNewsletter.value = newsletter
  editedNewsletter.value = {
    id: newsletter.id,
    title: newsletter.title,
    subject: newsletter.subject
  }
  showEditDialog.value = true
}

const updateNewsletter = async () => {
  try {
    if (editingNewsletter.value) {
      console.log(editingNewsletter.value.id, editedNewsletter.value)
      await newsletterStore.updateNewsletter(editingNewsletter.value.id, editedNewsletter.value)
      showEditDialog.value = false
      editingNewsletter.value = null
      editedNewsletter.value = {
        id: null,
        title: '',
        subject: ''
      }
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la newsletter:', error)
  }
}
</script>