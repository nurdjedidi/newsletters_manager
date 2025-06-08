<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-btn 
            color="grey" 
            variant="text" 
            to="/newsletters"
            prepend-icon="mdi-arrow-left"
            class="mb-4"
          >
            Back to Newsletters
          </v-btn>
          <h1 class="text-h4 font-weight-medium">Create Newsletter</h1>
        </v-col>
      </v-row>
      
      <v-form v-model="isFormValid" @submit.prevent="saveNewsletter">
        <v-row>
          <v-col cols="12">
            <v-card class="mb-4">
              <v-card-title>Newsletter Details</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="newsletter.title"
                  label="Newsletter Title"
                  :rules="[rules.required]"
                  variant="outlined"
                  class="mb-2"
                ></v-text-field>
                
                <v-text-field
                  v-model="newsletter.subject"
                  label="Email Subject Line"
                  :rules="[rules.required]"
                  variant="outlined"
                  hint="This is what recipients will see in their inbox"
                  persistent-hint
                ></v-text-field>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12">
            <v-card class="mb-4">
              <v-card-title>Newsletter Content</v-card-title>
              <v-card-text>
                <!-- In a real app, this would be a WYSIWYG editor -->
                <!-- For simplicity, we're using a textarea -->
                <v-textarea
                  v-model="newsletter.content"
                  label="Content"
                  :rules="[rules.required]"
                  variant="outlined"
                  rows="10"
                  hint="HTML content is supported"
                  persistent-hint
                ></v-textarea>
                
                <p class="text-caption mt-2">
                  In a production app, this would be a full-featured WYSIWYG editor with image upload, 
                  templates, and more.
                </p>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12">
            <v-card>
              <v-card-title>Send Options</v-card-title>
              <v-card-text>
                <v-radio-group v-model="sendOption" inline>
                  <v-radio label="Save as draft" value="draft"></v-radio>
                  <v-radio label="Schedule for later" value="schedule"></v-radio>
                  <v-radio label="Send immediately" value="send"></v-radio>
                </v-radio-group>
                
                <v-expand-transition>
                  <div v-if="sendOption === 'schedule'">
                    <v-divider class="my-4"></v-divider>
                    <v-datetime-picker
                      v-model="scheduledDateTime"
                      label="Schedule Date & Time"
                      :min="new Date().toISOString()"
                    >
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="formattedScheduledDateTime"
                          label="Schedule Date & Time"
                          readonly
                          prepend-inner-icon="mdi-calendar-clock"
                          variant="outlined"
                        ></v-text-field>
                      </template>
                    </v-datetime-picker>
                    
                    <p class="text-caption mt-2">
                      Your newsletter will be sent automatically at the scheduled time.
                    </p>
                  </div>
                </v-expand-transition>
              </v-card-text>
              
              <v-divider></v-divider>
              
              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn
                  variant="outlined"
                  color="grey-darken-1"
                  class="me-2"
                  to="/newsletters"
                >
                  Cancel
                </v-btn>
                <v-btn
                  :color="getSaveButtonColor()"
                  :loading="isLoading"
                  :disabled="!isFormValid || isLoading"
                  type="submit"
                >
                  {{ getSaveButtonText() }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
    
    <!-- Success Dialog -->
    <v-dialog v-model="showSuccessDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Success!</v-card-title>
        <v-card-text>
          <p>{{ successMessage }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="handleSuccessAction">
            {{ successButtonText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNewsletterStore } from '~/stores/newsletter'

const router = useRouter()
const newsletterStore = useNewsletterStore()

const isFormValid = ref(false)
const isLoading = ref(false)
const newsletter = ref({
  title: '',
  subject: '',
  content: '<h1>Newsletter Title</h1><p>Write your newsletter content here...</p>'
})

const sendOption = ref('draft')
const scheduledDateTime = ref(new Date(Date.now() + 86400000).toISOString()) // tomorrow
const showSuccessDialog = ref(false)
const successMessage = ref('')
const successButtonText = ref('')

const rules = {
  required: v => !!v || 'This field is required'
}

// Format the datetime for display
const formattedScheduledDateTime = computed(() => {
  if (!scheduledDateTime.value) return ''
  const date = new Date(scheduledDateTime.value)
  return date.toLocaleString()
})

// Dynamically change button text based on send option
const getSaveButtonText = () => {
  switch (sendOption.value) {
    case 'draft': return 'Save Draft'
    case 'schedule': return 'Schedule Newsletter'
    case 'send': return 'Send Newsletter'
    default: return 'Save'
  }
}

// Change button color based on send option
const getSaveButtonColor = () => {
  switch (sendOption.value) {
    case 'draft': return 'primary'
    case 'schedule': return 'amber-darken-2'
    case 'send': return 'success'
    default: return 'primary'
  }
}

// Handle form submission
const saveNewsletter = async () => {
  isLoading.value = true
  
  try {
    const result = await newsletterStore.createNewsletter(newsletter.value)
    
    if (result) {
      if (sendOption.value === 'schedule' && scheduledDateTime.value) {
        await newsletterStore.scheduleNewsletter(result.id, scheduledDateTime.value)
        showSuccessDialog.value = true
        successMessage.value = 'Your newsletter has been scheduled to send at ' + formattedScheduledDateTime.value
        successButtonText.value = 'View Newsletters'
      } else if (sendOption.value === 'send') {
        // In a real app, this would call an API to send the newsletter immediately
        await newsletterStore.scheduleNewsletter(result.id, new Date().toISOString())
        showSuccessDialog.value = true
        successMessage.value = 'Your newsletter has been sent successfully!'
        successButtonText.value = 'View Newsletters'
      } else {
        showSuccessDialog.value = true
        successMessage.value = 'Your newsletter draft has been saved.'
        successButtonText.value = 'Edit Draft'
      }
    }
  } catch (error) {
    console.error('Error saving newsletter:', error)
  } finally {
    isLoading.value = false
  }
}

// Handle action after successful save
const handleSuccessAction = () => {
  showSuccessDialog.value = false
  if (sendOption.value === 'draft') {
    // Go to edit page for the new draft
    router.push('/newsletters/' + newsletterStore.newsletters[0].id + '/edit')
  } else {
    // Go to newsletters list
    router.push('/newsletters')
  }
}
</script>