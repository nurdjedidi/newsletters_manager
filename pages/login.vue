<template>
  <div>
    <v-app-bar color="primary" fixed flat>
      <v-app-bar-title>
        <span class="text-white font-weight-bold mr-1">Newsletter</span>
        <span class="text-grey-lighten-4">Manager</span>
      </v-app-bar-title>
    </v-app-bar>

    <div class="login-page" :class="securityClasses" style="padding-top: 64px;">
      <div class="background-gradient" :class="alertBackgroundClass"></div>
      <div class="background-pattern" :class="alertPatternClass"></div>
      <div v-if="securityStatus.alertLevel > 0" class="alert-overlay" :class="alertOverlayClass"></div>

      <v-container fluid class="min-h-screen d-flex align-center justify-center position-relative">
        <v-row justify="center">
          <v-col cols="12" sm="10" md="6" lg="4" xl="3">
            <v-card class="login-card mx-auto" elevation="24" :class="[
              { 'card-animate': !loading },
              alertCardClass
            ]">

              <div class="header-section" :class="alertHeaderClass">
                <div class="icon-container">
                  <v-icon class="main-icon" size="64" color="white" :class="alertIconClass">
                    {{ getSecurityIcon() }}
                  </v-icon>
                  <div class="icon-ripple" :class="alertRippleClass"></div>
                  <div class="icon-ripple delay-1" :class="alertRippleClass"></div>
                  <div v-if="securityStatus.alertLevel >= 2" class="icon-ripple delay-2" :class="alertRippleClass">
                  </div>
                </div>
                <h1 class="text-h4 font-weight-bold mt-4 mb-2" :class="alertTextClass">
                  {{ getSecurityTitle() }}
                </h1>
                <p class="text-subtitle-1 font-weight-regular text-white opacity-80" :class="alertSubtitleClass">
                  {{ getSecurityMessage() }}
                </p>

                <div v-if="securityStatus.alertLevel > 0" class="security-warning mt-3" :class="alertWarningClass">
                  <v-icon class="mr-2">{{ getWarningIcon() }}</v-icon>
                  {{ getWarningMessage() }}
                </div>
              </div>

              <v-card-text class="px-8 py-8">
                <div>
                  <div class="text-center mb-6">
                    <v-icon size="48" color="grey-lighten-1" class="mb-3">mdi-key-variant</v-icon>
                    <p class="text-body-1 text-grey-darken-1">
                      Seules les personnes autorisées peuvent accéder à cette application
                    </p>
                  </div>

                  <div class="otp-container mb-4">
                    <label class="text-subtitle-2 text-grey-darken-2 mb-3 d-block text-center">
                      Code d'accès à 6 chiffres
                    </label>
                    <v-otp-input v-model="accessCode" :length="6" type="text" variant="outlined" :error="hasError"
                      @finish="handleOTPComplete" @input="clearError" class="otp-input" color="primary"></v-otp-input>
                    <div v-if="hasError" class="text-error text-caption mt-2 text-center">
                      {{ errorMessage }}
                    </div>
                  </div>

                  <v-btn type="submit" color="primary" size="large" block class="mb-4 login-btn" :loading="processing"
                    prepend-icon="mdi-login">
                    Se connecter
                  </v-btn>

                  <div class="text-center">
                    <p class="text-caption text-grey-darken-2">
                      Contactez l'administrateur si vous avez perdu votre code d'accès
                    </p>
                  </div>
                </div>
              </v-card-text>

            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <div class="particles">
        <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const accessCode = ref('')
const processing = ref(false)
const loading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')

// Computed properties pour le système de sécurité
const securityStatus = computed(() => authStore.getSecurityStatus)

const securityClasses = computed(() => ({
  'security-warning-level-1': securityStatus.value.alertLevel === 1,
  'security-warning-level-2': securityStatus.value.alertLevel === 2,
  'security-danger-level-3': securityStatus.value.alertLevel === 3,
  'security-permanent-level-4': securityStatus.value.alertLevel === 4,
  'chaos-mode': securityStatus.value.alertLevel >= 2
}))

const alertBackgroundClass = computed(() => ({
  'bg-warning': securityStatus.value.alertLevel === 1,
  'bg-danger': securityStatus.value.alertLevel === 2,
  'bg-blocked': securityStatus.value.alertLevel === 3,
  'bg-permanent': securityStatus.value.alertLevel === 4
}))

const alertPatternClass = computed(() => ({
  'pattern-warning': securityStatus.value.alertLevel === 1,
  'pattern-danger': securityStatus.value.alertLevel === 2,
  'pattern-blocked': securityStatus.value.alertLevel === 3,
  'pattern-permanent': securityStatus.value.alertLevel === 4
}))

const alertOverlayClass = computed(() => ({
  'alert-overlay-warning': securityStatus.value.alertLevel === 1,
  'alert-overlay-danger': securityStatus.value.alertLevel === 2,
  'alert-overlay-blocked': securityStatus.value.alertLevel === 3,
  'alert-overlay-permanent': securityStatus.value.alertLevel === 4
}))

const alertCardClass = computed(() => ({
  'card-warning': securityStatus.value.alertLevel === 1,
  'card-danger': securityStatus.value.alertLevel === 2,
  'card-blocked': securityStatus.value.alertLevel === 3,
  'card-permanent': securityStatus.value.alertLevel === 4
}))

const alertHeaderClass = computed(() => ({
  'header-warning': securityStatus.value.alertLevel === 1,
  'header-danger': securityStatus.value.alertLevel === 2,
  'header-blocked': securityStatus.value.alertLevel === 3,
  'header-permanent': securityStatus.value.alertLevel === 4
}))

const alertIconClass = computed(() => ({
  'icon-warning': securityStatus.value.alertLevel === 1,
  'icon-danger': securityStatus.value.alertLevel === 2,
  'icon-blocked': securityStatus.value.alertLevel === 3,
  'icon-permanent': securityStatus.value.alertLevel === 4
}))

const alertRippleClass = computed(() => ({
  'ripple-warning': securityStatus.value.alertLevel === 1,
  'ripple-danger': securityStatus.value.alertLevel === 2,
  'ripple-blocked': securityStatus.value.alertLevel === 3,
  'ripple-permanent': securityStatus.value.alertLevel === 4
}))

const alertTextClass = computed(() => ({
  'text-warning-pulse': securityStatus.value.alertLevel === 1,
  'text-danger-pulse': securityStatus.value.alertLevel === 2,
  'text-blocked-pulse': securityStatus.value.alertLevel === 3,
  'text-permanent-pulse': securityStatus.value.alertLevel === 4
}))

const alertSubtitleClass = computed(() => ({
  'subtitle-warning': securityStatus.value.alertLevel === 1,
  'subtitle-danger': securityStatus.value.alertLevel === 2,
  'subtitle-blocked': securityStatus.value.alertLevel === 3,
  'subtitle-permanent': securityStatus.value.alertLevel === 4
}))

const alertWarningClass = computed(() => ({
  'warning-level-1': securityStatus.value.alertLevel === 1,
  'warning-level-2': securityStatus.value.alertLevel === 2,
  'warning-level-3': securityStatus.value.alertLevel === 3,
  'warning-level-4': securityStatus.value.alertLevel === 4
}))

onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 500))

  authStore.checkAuthFromStorage()
  if (authStore.isAuthenticated) {
    const redirectTo = route.query.redirect as string || '/'
    await router.push(redirectTo)
  }

  loading.value = false
})

const handleLogin = async () => {
  if (securityStatus.value.isPermanentlyBlocked) {
    hasError.value = true
    errorMessage.value = 'Accès bloqué définitivement suite à une tentative de contournement de sécurité.'
    return
  }

  if (securityStatus.value.isBlocked) {
    hasError.value = true
    const remainingMinutes = Math.ceil(securityStatus.value.blockTimeRemaining / 60000)
    errorMessage.value = `Accès bloqué. Réessayez dans ${remainingMinutes} minute(s).`
    return
  }

  if (!accessCode.value || accessCode.value.length !== 6) {
    hasError.value = true
    errorMessage.value = 'Veuillez entrer un code à 6 chiffres'
    return
  }

  processing.value = true
  hasError.value = false
  errorMessage.value = ''

  await new Promise(resolve => setTimeout(resolve, 800))

  if (authStore.authenticate(accessCode.value)) {
    const redirectTo = route.query.redirect as string || '/'
    await router.push(redirectTo)
  } else {
    hasError.value = true
    const remaining = securityStatus.value.remainingAttempts
    if (remaining > 0) {
      errorMessage.value = `Code incorrect. ${remaining} tentative(s) restante(s).`
    } else {
      errorMessage.value = 'Accès bloqué suite à trop de tentatives incorrectes.'
    }
    accessCode.value = ''

    const card = document.querySelector('.login-card')
    card?.classList.add('shake')
    setTimeout(() => card?.classList.remove('shake'), 500)
  }

  processing.value = false
}

const getSecurityIcon = () => {
  switch (securityStatus.value.alertLevel) {
    case 1: return 'mdi-shield-alert'
    case 2: return 'mdi-shield-remove'
    case 3: return 'mdi-shield-off'
    case 4: return 'mdi-lock-alert'
    default: return 'mdi-shield-lock'
  }
}

const getSecurityTitle = () => {
  switch (securityStatus.value.alertLevel) {
    case 1: return 'Attention!'
    case 2: return 'Alerte Sécurité!'
    case 3: return 'ACCÈS BLOQUÉ'
    case 4: return 'ACCÈS INTERDIT DÉFINITIVEMENT'
    default: return 'Accès Sécurisé'
  }
}

const getSecurityMessage = () => {
  switch (securityStatus.value.alertLevel) {
    case 1: return 'Code incorrect détecté'
    case 2: return 'Tentatives multiples détectées'
    case 3: return 'Système de sécurité activé'
    case 4: return 'Contournement de sécurité détecté'
    default: return 'Entrez le code d\'accès pour continuer'
  }
}

const getWarningIcon = () => {
  switch (securityStatus.value.alertLevel) {
    case 1: return 'mdi-alert'
    case 2: return 'mdi-alert-octagon'
    case 3: return 'mdi-lock-alert'
    case 4: return 'mdi-security'
    default: return 'mdi-information'
  }
}

const getWarningMessage = () => {
  switch (securityStatus.value.alertLevel) {
    case 1: return `Attention: ${securityStatus.value.remainingAttempts} tentative(s) restante(s)`
    case 2: return `DANGER: ${securityStatus.value.remainingAttempts} tentative restante!`
    case 3: return 'ACCÈS BLOQUÉ - Attendez 5 minutes'
    case 4: return 'ACCÈS BLOQUÉ DÉFINITIVEMENT - Contactez l\'administrateur'
    default: return ''
  }
}

const handleOTPComplete = (value: string) => {
  if (value.length === 6) {
    handleLogin()
  }
}

const clearError = () => {
  if (hasError.value) {
    hasError.value = false
    errorMessage.value = ''
  }
}

const getParticleStyle = (index: number) => {
  const random = Math.random()
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 20 + 's',
    animationDuration: (15 + Math.random() * 10) + 's'
  }
}

useHead({
  title: 'Connexion Sécurisée - NewsFaster',
  meta: [
    {
      name: 'description',
      content: 'Accès sécurisé à l\'application NewsFaster'
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
})

definePageMeta({
  layout: false
})
</script>


<style scoped>
.login-page {
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
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%);
  z-index: -2;
}

.background-pattern {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
  z-index: -1;
}

.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: float 20s infinite linear;
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-10vh) rotate(360deg);
    opacity: 0;
  }
}

.login-card {
  border-radius: 20px !important;
  backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.1),
    0 8px 20px rgba(0, 0, 0, 0.05);
  transform: translateY(20px) scale(0.95);
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card-animate {
  transform: translateY(0) scale(1);
  opacity: 1;
}

.shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

.header-section {
  text-align: center;
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px 20px 0 0;
  position: relative;
}

.icon-container {
  position: relative;
  display: inline-block;
}

.main-icon {
  position: relative;
  z-index: 2;
  animation: iconPulse 2s ease-in-out infinite;
}

.icon-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple 2s infinite;
  opacity: 0;
}

.delay-1 {
  animation-delay: 1s;
}

@keyframes iconPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

.login-btn {
  border-radius: 12px !important;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background-color: #1976d2 !important;
  color: #ffffff !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3) !important;
}

:deep(.login-btn .v-btn__content) {
  color: #ffffff !important;
  font-weight: 600;
}

:deep(.login-btn .v-icon) {
  color: #ffffff !important;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.login-btn:hover::before {
  left: 100%;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.4) !important;
  background-color: #1565c0 !important;
}

.login-btn:active {
  transform: translateY(0);
  background-color: #0d47a1 !important;
}

:deep(.v-text-field .v-field) {
  border-radius: 12px;
  transition: all 0.3s ease;
  background-color: #ffffff !important;
  border: 2px solid #e0e0e0 !important;
}

:deep(.v-text-field .v-field__input) {
  color: #212121 !important;
  font-weight: 500;
}

:deep(.v-text-field .v-field__input::placeholder) {
  color: #757575 !important;
  opacity: 0.8;
}

:deep(.v-text-field .v-label) {
  color: #424242 !important;
  font-weight: 500;
}

:deep(.v-text-field.v-text-field--focused .v-label) {
  color: #1976d2 !important;
}

:deep(.v-text-field .v-field__prepend-inner .v-icon) {
  color: #616161 !important;
}

:deep(.v-text-field.v-text-field--focused .v-field__prepend-inner .v-icon) {
  color: #1976d2 !important;
}

/* Styles pour le composant OTP */
.otp-container {
  padding: 16px;
  background: rgba(33, 150, 243, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(33, 150, 243, 0.1);
}

:deep(.v-otp-input) {
  justify-content: center;
  gap: 12px;
}

:deep(.v-otp-input .v-field) {
  border-radius: 12px !important;
  background-color: #ffffff !important;
  border: 2px solid #e0e0e0 !important;
  transition: all 0.3s ease;
  width: 48px !important;
  height: 56px !important;
}

:deep(.v-otp-input .v-field:hover) {
  border-color: #2196f3 !important;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
}

:deep(.v-otp-input .v-field--focused) {
  border-color: #1976d2 !important;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
  transform: scale(1.05);
}

:deep(.v-otp-input .v-field--error) {
  border-color: #f44336 !important;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.2);
  animation: shake 0.3s ease-in-out;
}

:deep(.v-otp-input .v-field__input) {
  text-align: center !important;
  font-size: 1.8rem !important;
  font-weight: 700 !important;
  color: #212121 !important;
  padding: 0 !important;
  letter-spacing: 2px !important;
  background-color: transparent !important;
}

:deep(.v-otp-input input) {
  color: #212121 !important;
  background-color: transparent !important;
  text-align: center !important;
  font-size: 1.8rem !important;
  font-weight: 700 !important;
}

:deep(.v-otp-input .v-field__input::placeholder) {
  color: #bdbdbd !important;
  font-size: 1.2rem !important;
}

:deep(.v-otp-input .v-field--filled .v-field__input) {
  animation: numberPop 0.2s ease-out;
  color: #212121 !important;
}

@keyframes numberPop {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 600px) {
  .header-section {
    padding: 1.5rem 1rem;
  }

  .login-card {
    margin: 1rem;
    border-radius: 16px !important;
  }
}

.v-card-text>* {
  animation: slideUp 0.6s ease-out forwards;
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

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =================================
   SYSTÈME DE SÉCURITÉ PROGRESSIF
   ================================= */

/* Overlay d'alerte */
.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.alert-overlay-warning {
  background: rgba(255, 193, 7, 0.1);
  animation: pulseWarning 2s infinite;
}

.alert-overlay-danger {
  background: rgba(255, 87, 34, 0.15);
  animation: pulseDanger 1.5s infinite;
}

.alert-overlay-blocked {
  background: rgba(244, 67, 54, 0.2);
  animation: chaosRed 1s infinite;
}

/* Animations de pulsation */
@keyframes pulseWarning {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.2;
  }
}

@keyframes pulseDanger {
  0%,
  100% {
    opacity: 0.15;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes chaosRed {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
  25% {
    opacity: 0.4;
    transform: scale(1.002);
  }
  50% {
    opacity: 0.1;
    transform: scale(0.998);
  }
  75% {
    opacity: 0.35;
    transform: scale(1.001);
  }
}

/* Backgrounds progressifs */
.bg-warning {
  background: linear-gradient(135deg, #ff9800 0%, #ff6f00 50%, #e65100 100%) !important;
}

.bg-danger {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 50%, #b71c1c 100%) !important;
  animation: dangerShake 0.5s infinite;
}

.bg-blocked {
  background: linear-gradient(135deg, #b71c1c 0%, #000000 50%, #b71c1c 100%) !important;
  animation: chaosBackground 2s infinite;
}

@keyframes dangerShake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}

@keyframes chaosBackground {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.1);
  }
}

/* Patterns d'alerte */
.pattern-warning {
  filter: saturate(1.5);
  animation: patternWarning 3s infinite;
}

.pattern-danger {
  filter: saturate(2);
  animation: patternDanger 2s infinite;
}

.pattern-blocked {
  filter: saturate(2.5) contrast(1.2);
  animation: patternChaos 1s infinite;
}

@keyframes patternWarning {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.9;
  }
}

@keyframes patternDanger {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes patternChaos {
  0% {
    opacity: 0.8;
    transform: rotate(0deg) scale(1);
  }
  25% {
    opacity: 1;
    transform: rotate(1deg) scale(1.02);
  }
  50% {
    opacity: 0.6;
    transform: rotate(-1deg) scale(0.98);
  }
  75% {
    opacity: 0.9;
    transform: rotate(0.5deg) scale(1.01);
  }
  100% {
    opacity: 0.8;
    transform: rotate(0deg) scale(1);
  }
}

/* Cartes d'alerte */
.card-warning {
  border: 3px solid #ff9800 !important;
  box-shadow: 0 0 20px rgba(255, 152, 0, 0.5) !important;
  animation: cardWarning 2s infinite;
}

.card-danger {
  border: 3px solid #f44336 !important;
  box-shadow: 0 0 30px rgba(244, 67, 54, 0.7) !important;
  animation: cardDanger 1.5s infinite;
}

.card-blocked {
  border: 4px solid #b71c1c !important;
  box-shadow:
    0 0 40px rgba(183, 28, 28, 0.9),
    inset 0 0 20px rgba(183, 28, 28, 0.3) !important;
  animation: cardChaos 1s infinite;
}

@keyframes cardWarning {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-2px) scale(1.01);
  }
}

@keyframes cardDanger {
  0%,
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
  25% {
    transform: translateY(-1px) scale(1.005) rotate(0.5deg);
  }
  75% {
    transform: translateY(-1px) scale(1.005) rotate(-0.5deg);
  }
}

@keyframes cardChaos {
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
  20% {
    transform: translateY(-3px) scale(1.01) rotate(1deg);
  }
  40% {
    transform: translateY(1px) scale(0.99) rotate(-1deg);
  }
  60% {
    transform: translateY(-2px) scale(1.005) rotate(0.5deg);
  }
  80% {
    transform: translateY(2px) scale(1.01) rotate(-0.5deg);
  }
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
}

/* Headers d'alerte */
.header-warning {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%) !important;
  animation: headerPulse 2s infinite;
}

.header-danger {
  background: linear-gradient(135deg, #f44336 0%, #c62828 100%) !important;
  animation: headerDanger 1.5s infinite;
}

.header-blocked {
  background: linear-gradient(135deg, #b71c1c 0%, #000000 50%, #b71c1c 100%) !important;
  animation: headerChaos 1s infinite;
}

@keyframes headerPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes headerDanger {
  0%,
  100% {
    opacity: 1;
    filter: brightness(1);
  }
  50% {
    opacity: 0.9;
    filter: brightness(1.2);
  }
}

@keyframes headerChaos {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.2);
  }
}

/* Icônes d'alerte */
.icon-warning {
  animation: iconWarning 2s infinite;
  filter: drop-shadow(0 0 10px rgba(255, 152, 0, 0.8));
}

.icon-danger {
  animation: iconDanger 1s infinite;
  filter: drop-shadow(0 0 15px rgba(244, 67, 54, 0.9));
}

.icon-blocked {
  animation: iconChaos 0.5s infinite;
  filter: drop-shadow(0 0 20px rgba(183, 28, 28, 1));
}

@keyframes iconWarning {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes iconDanger {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.1) rotate(5deg);
  }
  75% {
    transform: scale(1.1) rotate(-5deg);
  }
}

@keyframes iconChaos {
  0% {
    transform: scale(1) rotate(0deg);
  }
  20% {
    transform: scale(1.2) rotate(10deg);
  }
  40% {
    transform: scale(0.9) rotate(-10deg);
  }
  60% {
    transform: scale(1.1) rotate(5deg);
  }
  80% {
    transform: scale(1.05) rotate(-5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

/* Ripples d'alerte */
.ripple-warning {
  border-color: rgba(255, 152, 0, 0.8) !important;
  animation: rippleWarning 1.5s infinite !important;
}

.ripple-danger {
  border-color: rgba(244, 67, 54, 0.9) !important;
  animation: rippleDanger 1s infinite !important;
}

.ripple-blocked {
  border-color: rgba(183, 28, 28, 1) !important;
  animation: rippleChaos 0.5s infinite !important;
}

@keyframes rippleWarning {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

@keyframes rippleDanger {
  0% {
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
  }
}

@keyframes rippleChaos {
  0% {
    transform: translate(-50%, -50%) scale(0.2);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}

/* Textes d'alerte */
.text-warning-pulse {
  animation: textWarningPulse 2s infinite;
  text-shadow: 0 0 10px rgba(255, 152, 0, 0.8);
}

.text-danger-pulse {
  animation: textDangerPulse 1s infinite;
  text-shadow: 0 0 15px rgba(244, 67, 54, 0.9);
}

.text-blocked-pulse {
  animation: textChaos 0.5s infinite;
  text-shadow: 0 0 20px rgba(183, 28, 28, 1);
}

@keyframes textWarningPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes textDangerPulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@keyframes textChaos {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  25% {
    opacity: 0.8;
    transform: scale(1.1);
  }
  50% {
    opacity: 1;
    transform: scale(0.95);
  }
  75% {
    opacity: 0.9;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Avertissements de sécurité */
.security-warning {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 8px 12px;
  font-weight: 600;
  text-align: center;
}

.warning-level-1 {
  background: rgba(255, 152, 0, 0.9);
  color: white;
  animation: warningPulse 2s infinite;
}

.warning-level-2 {
  background: rgba(244, 67, 54, 0.9);
  color: white;
  animation: dangerFlash 1s infinite;
}

.warning-level-3 {
  background: rgba(183, 28, 28, 0.9);
  color: white;
  animation: blockedFlash 0.5s infinite;
  text-transform: uppercase;
  letter-spacing: 2px;
}

@keyframes warningPulse {
  0%,
  100% {
    opacity: 0.9;
  }
  50% {
    opacity: 1;
  }
}

@keyframes dangerFlash {
  0%,
  100% {
    opacity: 0.9;
  }
  50% {
    opacity: 1;
  }
}

@keyframes blockedFlash {
  0%,
  100% {
    opacity: 0.9;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

/* Mode chaos global */
.chaos-mode {
  animation: globalChaos 2s infinite;
}

@keyframes globalChaos {
  0%,
  100% {
    filter: brightness(1) contrast(1);
  }
  50% {
    filter: brightness(1.05) contrast(1.1);
  }
}

/* Particules plus chaotiques */
.chaos-mode .particle {
  animation-duration: 5s !important;
  background: rgba(244, 67, 54, 0.8) !important;
  width: 3px !important;
  height: 3px !important;
}

.alert-overlay-permanent {
  background: rgba(139, 0, 0, 0.3);
  animation: permanentWarning 3s infinite;
}

@keyframes permanentWarning {
  0%,
  100% {
    opacity: 0.8;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  }
  50% {
    opacity: 0.9;
    background-position: 10px 0, 10px 10px, 20px -10px, 0px 0px;
  }
}

.bg-permanent {
  background: linear-gradient(135deg, #000000 0%, #8b0000 25%, #000000 50%, #8b0000 75%, #000000 100%) !important;
  animation: permanentBackground 5s infinite;
}

@keyframes permanentBackground {
  0%,
  100% {
    filter: brightness(0.8) contrast(1.5);
  }
  25% {
    filter: brightness(1) contrast(2);
  }
  50% {
    filter: brightness(0.6) contrast(1.8);
  }
  75% {
    filter: brightness(1.2) contrast(1.3);
  }
}

.pattern-permanent {
  filter: saturate(3) contrast(2) invert(0.2);
  animation: permanentPattern 2s infinite;
}

@keyframes permanentPattern {
  0%,
  100% {
    opacity: 0.7;
    transform: scale(1) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.1) rotate(2deg);
  }
}

.card-permanent {
  border: 5px solid #8b0000 !important;
  box-shadow:
    0 0 50px rgba(139, 0, 0, 1),
    inset 0 0 30px rgba(139, 0, 0, 0.5),
    0 0 0 2px #000000 !important;
  animation: cardPermanent 2s infinite;
}

@keyframes cardPermanent {
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
    filter: brightness(1);
  }
  25% {
    transform: translateY(-5px) scale(1.02) rotate(1deg);
    filter: brightness(0.8);
  }
  50% {
    transform: translateY(2px) scale(0.98) rotate(-1deg);
    filter: brightness(1.2);
  }
  75% {
    transform: translateY(-3px) scale(1.01) rotate(0.5deg);
    filter: brightness(0.9);
  }
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
    filter: brightness(1);
  }
}

/* Header permanent */
.header-permanent {
  background: linear-gradient(135deg, #8b0000 0%, #000000 50%, #8b0000 100%) !important;
  animation: headerPermanent 3s infinite;
}

@keyframes headerPermanent {
  0%,
  100% {
    filter: brightness(1) saturate(1);
  }
  50% {
    filter: brightness(1.3) saturate(1.5);
  }
}



/* Icône permanente */
.icon-permanent {
  animation: iconPermanent 1s infinite;
  filter: drop-shadow(0 0 25px rgba(139, 0, 0, 1)) drop-shadow(0 0 50px rgba(255, 0, 0, 0.8));
}

@keyframes iconPermanent {
  0% {
    transform: scale(1) rotate(0deg);
    color: #8b0000;
  }
  25% {
    transform: scale(1.3) rotate(90deg);
    color: #ff0000;
  }
  50% {
    transform: scale(0.8) rotate(180deg);
    color: #000000;
  }
  75% {
    transform: scale(1.2) rotate(270deg);
    color: #8b0000;
  }
  100% {
    transform: scale(1) rotate(360deg);
    color: #8b0000;
  }
}

/* Ripples permanent */
.ripple-permanent {
  border-color: rgba(139, 0, 0, 1) !important;
  animation: ripplePermanent 0.8s infinite !important;
}

@keyframes ripplePermanent {
  0% {
    transform: translate(-50%, -50%) scale(0.1);
    opacity: 1;
    border-width: 5px;
  }
  100% {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
    border-width: 1px;
  }
}

/* Texte permanent */
.text-permanent-pulse {
  animation: textPermanent 1s infinite;
  text-shadow: 0 0 30px rgba(139, 0, 0, 1), 0 0 60px rgba(255, 0, 0, 0.8);
  color: #8b0000 !important;
}

@keyframes textPermanent {
  0% {
    opacity: 1;
    transform: scale(1);
    text-shadow: 0 0 30px rgba(139, 0, 0, 1), 0 0 60px rgba(255, 0, 0, 0.8);
  }
  25% {
    opacity: 0.7;
    transform: scale(1.1);
    text-shadow: 0 0 40px rgba(255, 0, 0, 1), 0 0 80px rgba(139, 0, 0, 1);
  }
  50% {
    opacity: 1;
    transform: scale(0.9);
    text-shadow: 0 0 20px rgba(139, 0, 0, 1), 0 0 40px rgba(255, 0, 0, 0.8);
  }
  75% {
    opacity: 0.8;
    transform: scale(1.05);
    text-shadow: 0 0 35px rgba(255, 0, 0, 1), 0 0 70px rgba(139, 0, 0, 1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    text-shadow: 0 0 30px rgba(139, 0, 0, 1), 0 0 60px rgba(255, 0, 0, 0.8);
  }
}

/* Avertissement permanent */
.warning-level-4 {
  background: linear-gradient(45deg, #8b0000 0%, #000000 50%, #8b0000 100%);
  color: white;
  animation: permanentWarningBox 2s infinite;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 900;
  border: 2px solid #ff0000;
}

@keyframes permanentWarningBox {
  0%,
  100% {
    opacity: 0.9;
    transform: scale(1);
    box-shadow: 0 0 20px rgba(139, 0, 0, 0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
    box-shadow: 0 0 40px rgba(255, 0, 0, 1);
  }
}

/* Page entière avec level 4 */
.security-permanent-level-4 {
  animation: permanentPageEffect 4s infinite;
}

@keyframes permanentPageEffect {
  0%,
  100% {
    filter: brightness(1) contrast(1) saturate(1);
  }
  25% {
    filter: brightness(0.7) contrast(1.5) saturate(1.5);
  }
  50% {
    filter: brightness(1.2) contrast(0.8) saturate(2);
  }
  75% {
    filter: brightness(0.9) contrast(1.3) saturate(1.2);
  }
}
</style>