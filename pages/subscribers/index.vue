<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <h1 class="text-h4 font-weight-medium">Subscribers</h1>
          <div class="d-flex gap-2">
            <v-btn color="secondary" variant="outlined" prepend-icon="mdi-file-upload" @click="showImportDialog = true"
              class="mr-2">
              Import
            </v-btn>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="showAddDialog = true" class="text-white">
              Add Subscriber
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-card class="pa-3 d-flex align-center">
            <v-icon color="primary" size="large" class="me-3">mdi-account-multiple</v-icon>
            <div>
              <div class="text-subtitle-2 text-grey-darken-1">Total Subscribers</div>
              <div class="text-h5">{{ subscribersStore.subscriberCount }}</div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="pa-3 d-flex align-center">
            <v-icon color="success" size="large" class="me-3">mdi-account-check</v-icon>
            <div>
              <div class="text-subtitle-2 text-grey-darken-1">Active Subscribers</div>
              <div class="text-h5">{{ subscribersStore.activeCount }}</div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" class="d-flex align-center">
          <v-text-field v-model="search" label="Search Subscribers" prepend-inner-icon="mdi-magnify" variant="outlined"
            hide-details density="comfortable" class="flex-grow-1"></v-text-field>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-card v-if="!subscribersStore.loading">
            <v-data-table :headers="headers" :items="subscribersStore.subscribers" :search="search" class="elevation-1"
              :items-per-page="10" :items-per-page-options="[10, 25, 50, 100]">
              <template v-slot:item.status="{ item }">
                <v-chip size="small" :color="item.status === 1 ? 'success' : 'grey'">
                  {{ item.status === 1 ? 'Active' : 'Unsubscribed' }}
                </v-chip>
              </template>

              <template v-slot:item.joinedAt="{ item }">
                {{ formatHijriDate(item.joinedAt) }}
              </template>

              <template v-slot:item.lastActivity="{ item }">
                <span v-if="item.lastActivity">{{ formatHijriDate(item.lastActivity) }}</span>
                <span v-else>-</span>
              </template>

              <template v-slot:item.actions="{ item }">
                <div class="d-flex gap-2">
                  <v-btn icon variant="text" color="primary" @click="editSubscriber(item)" title="Edit Subscriber">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>

                  <v-btn icon variant="text" color="error" @click="confirmDelete(item)" title="Delete Subscriber">
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

    <v-dialog v-model="showAddDialog" max-width="500px">
      <v-card>
        <v-card-title class="bg-primary text-white">
          <v-icon color="white">mdi-plus</v-icon>
          Add New Subscriber</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form v-model="isAddFormValid" @submit.prevent="addSubscriber">
            <v-text-field v-model="newSubscriber.email" label="Email Address" :rules="[rules.required, rules.email]"
              variant="outlined" class="mb-2" color="primary"></v-text-field>

            <v-text-field v-model="newSubscriber.name" label="Name (Optional)" variant="outlined"
              color="primary"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="showAddDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="tonal" :disabled="!isAddFormValid || isLoading" :loading="isLoading"
            @click="addSubscriber">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showEditDialog" max-width="500px">
      <v-card>
        <v-card-title class="bg-primary text-white">
          <v-icon color="white">mdi-pencil</v-icon>
          Edit Subscriber</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form v-model="isEditFormValid" @submit.prevent="updateSubscriber">
            <v-text-field v-model="editedSubscriber.email" label="Email Address" :rules="[rules.required, rules.email]"
              variant="outlined" class="mb-2" color="primary"></v-text-field>

            <v-text-field v-model="editedSubscriber.name" label="Name (Optional)" variant="outlined" color="primary"
              class="mb-2"></v-text-field>

            <v-select v-model="editedSubscriber.status" :items="statusOptions" label="Status" variant="outlined"
              color="primary"></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="showEditDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="tonal" :disabled="!isEditFormValid || isLoading" :loading="isLoading"
            @click="updateSubscriber">
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showImportDialog" max-width="600px">
      <v-card>
        <v-card-title class="bg-secondary text-white">
          <v-icon color="white">mdi-file-upload</v-icon>
          Import Subscribers</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <p class="text-body-2 mb-4">
            Téléchargez un fichier CSV avec les données des subscribers. Le fichier doit contenir les colonnes suivantes
            :
          </p>

          <v-alert type="info" variant="tonal" density="compact" class="mb-4">
            <strong>Format attendu :</strong><br>
            • Première ligne : en-têtes (email, name)<br>
            • Colonnes requises : <code>email</code><br>
            • Colonnes optionnelles : <code>name</code><br>
            • Exemple : <code>email,name</code><br>
            •
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>john@example.com,John Doe</code>
          </v-alert>

          <v-file-input v-model="importFile" label="Fichier CSV" accept=".csv" variant="outlined"
            :rules="[rules.required]" prepend-icon="mdi-file-upload" show-size truncate-length="15"></v-file-input>

          <v-alert v-if="importError" type="error" variant="tonal" class="mt-4" density="compact">
            {{ importError }}
          </v-alert>

          <v-alert v-if="importSuccess" type="success" variant="tonal" class="mt-4" density="compact">
            {{ importSuccess }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="showImportDialog = false">Cancel</v-btn>
          <v-btn color="secondary" variant="tonal" :disabled="!importFile || isLoading" :loading="isLoading"
            @click="importSubscribers">
            Import
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="bg-error text-white">
          <v-icon color="white">mdi-delete</v-icon>
          Confirm Delete</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          Are you sure you want to delete the subscriber "{{ subscriberToDelete?.name || subscriberToDelete?.email }}"?
          This
          action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="tonal" @click="deleteSubscriber">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSubscribersStore } from '~/stores/subscribers'
import { formatHijriDate } from '~/utils/hijri'
import { parseCSV, readFileAsText, validateSubscriberData } from '~/utils/csvParser'

const subscribersStore = useSubscribersStore()
const search = ref('')

const headers = [
  { title: 'Email', key: 'email' },
  { title: 'Name', key: 'name' },
  { title: 'Status', key: 'status', width: '120px' },
  { title: 'Joined', key: 'joinedAt', width: '120px' },
  { title: 'Last Activity', key: 'lastActivity', width: '120px' },
  { title: 'Actions', key: 'actions', sortable: false, width: '100px', align: 'end' }
]

const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showImportDialog = ref(false)
const showDeleteDialog = ref(false)
const isLoading = ref(false)
const isAddFormValid = ref(false)
const isEditFormValid = ref(false)
const importError = ref('')
const importSuccess = ref('')

const newSubscriber = ref({ email: '', name: '' })
const editedSubscriber = ref({ id: null, email: '', name: '', status: 'active' })
const subscriberToDelete = ref(null)
const importFile = ref(null)

const statusOptions = [
  { title: 'Active', value: 'active' },
  { title: 'Unsubscribed', value: 'unsubscribed' }
]

const rules = {
  required: v => !!v || 'This field is required',
  email: v => /.+@.+\..+/.test(v) || 'Email must be valid'
}

onMounted(async () => {
  await subscribersStore.fetchSubscribers()
})

const addSubscriber = async () => {
  if (!isAddFormValid.value) return

  isLoading.value = true
  try {
    await subscribersStore.addSubscriber(newSubscriber.value)
    newSubscriber.value = { email: '', name: '' }
    showAddDialog.value = false
  } catch (error) {
    console.error('Error adding subscriber:', error)
  } finally {
    isLoading.value = false
  }
}

const editSubscriber = (subscriber) => {
  editedSubscriber.value = { ...subscriber }
  showEditDialog.value = true
}

const updateSubscriber = async () => {
  if (!isEditFormValid.value) return

  isLoading.value = true
  try {
    await subscribersStore.updateSubscriber(editedSubscriber.value.id, editedSubscriber.value)
    showEditDialog.value = false
  } catch (error) {
    console.error('Error updating subscriber:', error)
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = (subscriber) => {
  subscriberToDelete.value = subscriber
  showDeleteDialog.value = true
}

const deleteSubscriber = async () => {
  isLoading.value = true
  try {
    await subscribersStore.removeSubscriber(subscriberToDelete.value.id)
    showDeleteDialog.value = false
    subscriberToDelete.value = null
  } catch (error) {
    console.error('Error deleting subscriber:', error)
  } finally {
    isLoading.value = false
  }
}

const importSubscribers = async () => {
  const file = Array.isArray(importFile.value) ? importFile.value[0] : importFile.value

  if (!file) {
    console.log('No file selected')
    return
  }

  isLoading.value = true
  importError.value = ''
  importSuccess.value = ''

  try {
    const csvText = await readFileAsText(file)

    const parsedData = parseCSV(csvText)

    if (parsedData.length === 0) {
      importError.value = 'Le fichier CSV est vide ou mal formaté.'
      return
    }

    const validSubscribers = []
    const invalidRows = []

    parsedData.forEach((row, index) => {
      const validatedData = validateSubscriberData(row)
      if (validatedData) {
        validSubscribers.push(validatedData)
      } else {
        invalidRows.push(`Ligne ${index + 2}: Email invalide ou manquant`)
      }
    })

    if (validSubscribers.length === 0) {
      importError.value = 'Aucune donnée valide trouvée dans le fichier.'
      return
    }

    let result
    try {
      result = await subscribersStore.importSubscribers(validSubscribers)
    } catch (storeError) {
      console.error('Store error:', storeError)
      importError.value = 'Erreur du store: ' + storeError.message
      return
    }

    if (!result) {
      importError.value = 'Erreur: aucun résultat retourné du store'
      return
    }

    let message = `${result.count} subscribers importés avec succès`
    if (invalidRows.length > 0) {
      message += ` (${invalidRows.length} lignes ignorées)`
    }

    importSuccess.value = message

    if (result.errors && result.errors.length > 0) {
      const errorMessage = result.errors.slice(0, 5).join(', ')
      if (result.errors.length > 5) {
        importError.value = `Erreurs: ${errorMessage}... et ${result.errors.length - 5} autres`
      } else {
        importError.value = `Erreurs: ${errorMessage}`
      }
    }

    importFile.value = null

    if (result.count > 0) {
      setTimeout(() => {
        showImportDialog.value = false
        importSuccess.value = ''
        importError.value = ''
      }, 3000)
    }
  } catch (error) {
    console.error('Error importing subscribers:', error)
    console.error('Error details:', error.message, error.stack)
    importError.value = 'Erreur lors de l\'import. Vérifiez le format de votre fichier CSV.'
  } finally {
    isLoading.value = false
  }
}
</script>