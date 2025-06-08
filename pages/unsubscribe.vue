<template>
  <div class="unsubscribe-page">
    <div class="background-gradient"></div>
    <div class="background-pattern"></div>

    <v-container fluid class="min-h-screen d-flex align-center justify-center position-relative">
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6" xl="5">

          <v-card class="unsubscribe-card mx-auto" elevation="24" :class="{ 'card-animate': !loading }">

            <div v-if="loading" class="loading-state">
              <v-card-text class="text-center pa-12">
                <div class="loading-animation">
                  <v-progress-circular indeterminate color="primary" size="64" width="4"></v-progress-circular>
                </div>
                <p class="text-h6 mt-6 mb-2">Chargement de vos informations...</p>
                <p class="text-body-2 text-grey-darken-1">Veuillez patienter un instant</p>
              </v-card-text>
            </div>

            <div v-else-if="!processed" class="unsubscribe-form">
              <div class="header-section">
                <div class="icon-container">
                  <v-icon class="main-icon" size="72" color="warning">mdi-email-minus</v-icon>
                  <div class="icon-ripple"></div>
                  <div class="icon-ripple delay-1"></div>
                  <div class="icon-ripple delay-2"></div>
                </div>
                <h1 class="text-h4 font-weight-bold mt-6 mb-2">Se désinscrire</h1>
                <p class="text-h6 font-weight-regular text-white">
                  de la newsletter NewsFaster
                </p>
              </div>

              <v-divider class="my-6"></v-divider>

              <v-card-text class="px-8 pb-8">
                <div class="user-info-card mb-6">
                  <div class="d-flex align-center">
                    <v-avatar color="primary" size="48" class="mr-4">
                      <v-icon color="white">mdi-account</v-icon>
                    </v-avatar>
                    <div>
                      <p class="text-subtitle-1 font-weight-medium mb-1 text-grey-darken-1">Compte à désinscrire</p>
                      <p class="text-body-2 text-primary font-weight-bold" v-if="userEmail">
                        {{ userEmail }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="confirmation-message text-center mb-6">
                  <p class="text-h6 mb-3 text-grey-darken-1">Êtes-vous sûr de vouloir vous désinscrire ?</p>
                  <p class="text-body-1 text-grey-darken-1 mb-3">
                    Vous ne recevrez plus nos newsletters contenant :
                  </p>

                  <div class="benefits-list mb-4">
                    <v-chip v-for="benefit in benefits" :key="benefit" class="ma-1" color="primary" variant="outlined"
                      size="small">
                      <v-icon start>mdi-check</v-icon>
                      {{ benefit }}
                    </v-chip>
                  </div>
                </div>

                <v-alert v-if="error" type="error" variant="tonal" class="mb-6" prominent border="start">
                  <template v-slot:prepend>
                    <v-icon size="24">mdi-alert-circle</v-icon>
                  </template>
                  {{ error }}
                </v-alert>

                <div class="action-buttons">
                  <v-btn color="error" size="large" block class="mb-3 action-btn" @click="confirmUnsubscribe"
                    :loading="processing" prepend-icon="mdi-email-remove">
                    Oui, me désinscrire définitivement
                  </v-btn>

                  <v-btn color="success" variant="outlined" size="large" block class="action-btn-secondary"
                    href="/login" prepend-icon="mdi-home">
                    Non, garder mon abonnement
                  </v-btn>
                </div>

                <div class="footer-info text-center mt-6">
                  <p class="text-caption text-grey-darken-2">
                    Vous pouvez toujours vous réinscrire plus tard depuis notre site web
                  </p>
                </div>
              </v-card-text>
            </div>

            <div v-else-if="success" class="success-state">
              <div class="success-animation">
                <div class="success-icon-container">
                  <v-icon class="success-icon" size="96" color="success">mdi-check-circle</v-icon>
                  <div class="success-ripple"></div>
                </div>
              </div>

              <div class="success-content text-center pa-8">
                <h2 class="text-h4 font-weight-bold text-success mb-4">
                  Désinscription réussie !
                </h2>
                <p class="text-h6 mb-4">Vous avez été désinscrit avec succès</p>
                <p class="text-body-1 text-grey-darken-1 mb-6">
                  Vous ne recevrez plus d'emails de notre part. Nous sommes désolés de vous voir partir !
                </p>

                <div class="final-actions">
                  <v-btn color="primary" size="large" class="mr-4 mb-2" href="/login" prepend-icon="mdi-home">
                    Retour à l'accueil
                  </v-btn>

                  <v-btn color="success" variant="outlined" size="large" class="mb-2" @click="showFeedback = true"
                    prepend-icon="mdi-message-text">
                    Laisser un avis
                  </v-btn>
                </div>

                <div class="mt-6">
                  <p class="text-caption text-grey-darken-2">
                    Merci d'avoir été avec nous ! 💙
                  </p>
                </div>
              </div>
            </div>

            <div v-else-if="!success && processed" class="error-state">
              <div class="error-header text-center pa-6">
                <v-icon class="error-icon mb-4" size="72" color="error">mdi-alert-octagon</v-icon>
                <h2 class="text-h5 font-weight-bold text-error">Oups ! Une erreur s'est produite</h2>
              </div>

              <v-card-text class="pa-8 text-center">
                <p class="text-body-1 text-grey-darken-1 mb-6">{{ error }}</p>

                <div class="error-actions">
                  <v-btn color="primary" size="large" class="mr-4 mb-3" @click="retryUnsubscribe"
                    prepend-icon="mdi-refresh">
                    Réessayer
                  </v-btn>

                  <v-btn color="grey-darken-1" variant="outlined" size="large" class="mb-3" href="/login"
                    prepend-icon="mdi-home">
                    Retour à l'accueil
                  </v-btn>
                </div>

                <div class="mt-6">
                  <p class="text-caption text-grey-darken-2">
                    Si le problème persiste, contactez notre support
                  </p>
                </div>
              </v-card-text>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showFeedback" max-width="500px">
      <v-card>
        <v-card-title class="bg-primary text-white">
          <v-icon class="mr-2">mdi-message-text</v-icon>
          Votre avis nous intéresse
        </v-card-title>

        <v-card-text class="pa-6">
          <p class="mb-4">Pourquoi vous désinscrivez-vous ? (optionnel)</p>
          <v-textarea v-model="feedbackText" label="Votre commentaire" variant="outlined" rows="4"
            placeholder="Trop d'emails, contenu non pertinent, etc."></v-textarea>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="showFeedback = false">
            Passer
          </v-btn>
          <v-btn color="primary" @click="submitFeedback">
            Envoyer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const route = useRoute()
const loading = ref(true)
const processing = ref(false)
const processed = ref(false)
const success = ref(false)
const error = ref('')
const userEmail = ref('')
const userId = ref('')
const showFeedback = ref(false)
const feedbackText = ref('')

const benefits = [
  'Actualités tech',
  'Conseils exclusifs',
  'Nouvelles fonctionnalités',
  'Événements spéciaux'
]

onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))

  const email = route.query.email
  const id = route.query.id

  if (!email || !id) {
    error.value = 'Lien de désinscription invalide ou expiré'
    loading.value = false
    return
  }

  userEmail.value = email as string;
  userId.value = id as string;
  loading.value = false;
})

const confirmUnsubscribe = async () => {
  processing.value = true

  try {
    const response = await $fetch('/api/unsubscribe', {
      method: 'POST',
      body: {
        email: userEmail.value,
        id: userId.value
      }
    })

    if (response.success) {
      success.value = true;
    } else {
      error.value = response.message || 'Erreur lors de la désinscription';
    }
  } catch (err) {
    console.error('Erreur désinscription:', err);
    error.value = 'Erreur de connexion. Veuillez vérifier votre connexion internet et réessayer.';
  } finally {
    processing.value = false;
    processed.value = true;
  }
}

const retryUnsubscribe = () => {
  processed.value = false;
  error.value = '';
  confirmUnsubscribe();
}

const submitFeedback = async () => {
  console.log('Feedback:', feedbackText.value)
  showFeedback.value = false

}

useHead({
  title: 'Se désinscrire - NewsFaster',
  meta: [
    {
      name: 'description',
      content: 'Désinscrivez-vous facilement de notre newsletter NewsFaster'
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
})
</script>

<style scoped>
.unsubscribe-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  z-index: -2;
}

.background-pattern {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  z-index: -1;
  animation: patternFloat 20s ease-in-out infinite;
}

@keyframes patternFloat {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(2deg);
  }
}

/* Card principale */
.unsubscribe-card {
  border-radius: 24px !important;
  backdrop-filter: blur(10px);
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  transform: translateY(30px);
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card-animate {
  transform: translateY(0);
  opacity: 1;
}

/* Header section */
.header-section {
  text-align: center;
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 24px 24px 0 0;
}

.icon-container {
  position: relative;
  display: inline-block;
}

.main-icon {
  position: relative;
  z-index: 2;
  animation: iconBounce 2s ease-in-out infinite;
  color: white !important;
}

.icon-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  border: 2px solid #ff9800;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple 2s infinite;
  opacity: 0;
}

.delay-1 {
  animation-delay: 0.5s;
}
.delay-2 {
  animation-delay: 1s;
}

@keyframes iconBounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

/* User info card */
.user-info-card {
  background: linear-gradient(135deg, #f8f9ff 0%, #f5f7ff 100%);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e3e8ff;
}

/* Benefits list */
.benefits-list {
  max-width: 400px;
  margin: 0 auto;
}

/* Action buttons */
.action-btn {
  border-radius: 12px !important;
  font-weight: 600;
  transition: all 0.3s ease;
  transform: translateY(0);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.action-btn-secondary {
  border-radius: 12px !important;
  font-weight: 600;
  transition: all 0.3s ease;
}

/* Loading state */
.loading-animation {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Success state */
.success-animation {
  text-align: center;
  padding: 2rem;
}

.success-icon-container {
  position: relative;
  display: inline-block;
}

.success-icon {
  animation: successBounce 0.6s ease-out;
}

.success-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  border: 3px solid #4caf50;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: successRipple 0.8s ease-out;
  opacity: 0;
}

@keyframes successBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes successRipple {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

/* Error state */
.error-icon {
  animation: errorShake 0.5s ease-in-out;
}

@keyframes errorShake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

/* Footer info */
.footer-info {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 1rem;
}

/* Responsive */
@media (max-width: 600px) {
  .header-section {
    padding: 1.5rem 1rem 0.5rem;
  }

  .unsubscribe-card {
    margin: 1rem;
    border-radius: 16px !important;
  }

  .final-actions .v-btn {
    display: block;
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

/* Animation d'entrée pour les éléments */
.v-card-text>* {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.v-card-text>*:nth-child(1) {
  animation-delay: 0.1s;
}
.v-card-text>*:nth-child(2) {
  animation-delay: 0.2s;
}
.v-card-text>*:nth-child(3) {
  animation-delay: 0.3s;
}
.v-card-text>*:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>