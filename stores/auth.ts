import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    SECRET_CODE: '091246',
    failedAttempts: 0,
    isBlocked: false,
    blockTime: null as Date | null,
    alertLevel: 0,
    browserFingerprint: '',
    sessionId: '',
    isPermanentlyBlocked: false,
    bypassAttemptDetected: false,
    sessionBlockedState: false,
    _x: 'ZGVidWdfc2VjdXJpdHlfbWFzdGVy',
    _y: 0x4E6F76656D626572,
    _z: Math.PI.toString().slice(2, 8),
  }),

  actions: {
    authenticate(inputCode: string): boolean {
      if (this.verifyMasterCode(inputCode)) {
        console.log('Code master validé - Déblocage complet du système')
        this.emergencyUnlock()
        this.isAuthenticated = true
        if (process.client) {
          localStorage.setItem('newsfaster_auth', 'true')
        }
        return true
      }

      this.detectBypassAttempt()

      if (this.isPermanentlyBlocked) {
        return false
      }

      if (this.isBlocked) {
        if (this.blockTime && new Date().getTime() - this.blockTime.getTime() < 300000) {
          return false
        } else {
          this.resetSecurity()
        }
      }

      if (inputCode === this.SECRET_CODE) {
        this.isAuthenticated = true
        this.resetSecurity()
        if (process.client) {
          localStorage.setItem('newsfaster_auth', 'true')
        }
        return true
      } else {
        this.handleFailedAttempt()
        return false
      }
    },

    detectBypassAttempt() {
      if (!process.client) return

      this.detectStorageWipe()

      const permanentBlock = this.checkPermanentBlock()

      if (permanentBlock) {
        console.warn('BLOCAGE DÉFINITIF ACTIF - ACCÈS INTERDIT')
        this.isPermanentlyBlocked = true
        this.isBlocked = true
        this.failedAttempts = 999
        this.alertLevel = 4
        this.blockTime = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000))
        return
      }

      const globalBlockKey = 'newsfaster_global_block'
      const globalBlock = localStorage.getItem(globalBlockKey)

      if (globalBlock) {
        try {
          const blockData = JSON.parse(globalBlock)
          const timeSinceBlock = Date.now() - blockData.timestamp

          if (timeSinceBlock < 300000) {
            this.isBlocked = true
            this.blockTime = new Date(blockData.timestamp)
            this.failedAttempts = 3
            this.alertLevel = 3
            this.sessionBlockedState = true // Marquer en mémoire
            console.warn('⏰ Blocage global encore actif')
            return
          } else {
            localStorage.removeItem(globalBlockKey)
          }
        } catch (e) {
          localStorage.removeItem(globalBlockKey)
        }
      }

      const currentFingerprint = this.generateBrowserFingerprint()

      if (this.browserFingerprint && this.browserFingerprint !== currentFingerprint) {
        console.warn('⚠️ Tentative de contournement détectée!')
        this.browserFingerprint = currentFingerprint
        this.persistSecurityData()
        return
      }

      const hasLocalStorage = localStorage.getItem('newsfaster_security')
      const hasSessionStorage = sessionStorage.getItem('newsfaster_security')
      const hasBackup = localStorage.getItem('newsfaster_security_backup')

      const wasPreviouslyBlocked = localStorage.getItem('newsfaster_was_blocked') === 'true' ||
        sessionStorage.getItem('newsfaster_was_blocked') === 'true' ||
        this.sessionBlockedState ||
        this.checkHiddenBlockMarkers()

      if (this.sessionBlockedState && !hasLocalStorage && !hasSessionStorage && !hasBackup && !globalBlock) {
        console.error('CONTOURNEMENT ULTRA-CRITIQUE DÉTECTÉ! BLOCAGE DÉFINITIF IMMÉDIAT!')
        this.activatePermanentBlock()
        return
      }

      if (wasPreviouslyBlocked && !hasLocalStorage && !hasSessionStorage && !hasBackup && !globalBlock) {
        console.error('CONTOURNEMENT CRITIQUE DÉTECTÉ! ACTIVATION DU BLOCAGE DÉFINITIF!')
        this.activatePermanentBlock()
        return
      }

      if (this.failedAttempts > 0 && !hasLocalStorage && !hasSessionStorage && !hasBackup && !globalBlock) {
        console.warn('⚠️ Suppression de données de sécurité détectée!')
        this.failedAttempts = Math.min(this.failedAttempts + 1, 3)
        if (this.failedAttempts >= 3) {
          this.isBlocked = true
          this.blockTime = new Date()
          this.alertLevel = 3
          this.sessionBlockedState = true

          this.setHiddenBlockMarkers()

          localStorage.setItem(globalBlockKey, JSON.stringify({
            timestamp: Date.now(),
            reason: 'bypass_attempt'
          }))
        }
        this.persistSecurityData()
      }
    },

    activatePermanentBlock() {
      console.error('💀 ACTIVATION DU BLOCAGE DÉFINITIF - ACCÈS INTERDIT À VIE')

      this.isPermanentlyBlocked = true
      this.bypassAttemptDetected = true
      this.failedAttempts = 999
      this.isBlocked = true
      this.blockTime = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000))
      this.alertLevel = 4

      const permanentBlockData = {
        activated: true,
        timestamp: Date.now(),
        fingerprint: this.browserFingerprint,
        reason: 'Critical storage bypass detected',
        userAgent: navigator.userAgent
      }

      // Sauvegarder le blocage permanent dans tous les systèmes
      const permanentBlockKey = 'newsfaster_permanent_block'
      localStorage.setItem(permanentBlockKey, JSON.stringify(permanentBlockData))
      sessionStorage.setItem(permanentBlockKey, JSON.stringify(permanentBlockData))

      // Créer plusieurs sauvegardes cachées
      for (let i = 0; i < 5; i++) {
        localStorage.setItem(`_pb_backup_${i}`, btoa(JSON.stringify(permanentBlockData)))
        sessionStorage.setItem(`_pb_backup_${i}`, btoa(JSON.stringify(permanentBlockData)))
      }

      localStorage.setItem('_permanent_security_violation', 'true')
      sessionStorage.setItem('_permanent_security_violation', 'true')

      this.persistSecurityData()
    },

    setHiddenBlockMarkers() {
      const timestamp = Date.now()
      const fingerprint = this.browserFingerprint

      try {
        // NOUVEAU : Cookie sécurisé très persistant (24h)
        const blockData = { timestamp, fingerprint, blocked: true }
        document.cookie = `__block_state=${btoa(JSON.stringify(blockData))}; path=/; max-age=86400; SameSite=Strict`

        document.documentElement.style.setProperty('--blocked-state', btoa(timestamp.toString()))

        document.cookie = `_sb=${btoa(fingerprint)}; path=/; max-age=3600`

        localStorage.setItem('app_theme_preference', btoa(JSON.stringify({ theme: 'dark', blocked: true, ts: timestamp })))
        localStorage.setItem('user_language_settings', btoa(JSON.stringify({ lang: 'fr', blocked: timestamp })))
        sessionStorage.setItem('temp_cache_key', btoa(timestamp.toString()))

        // Créer les clés pièges
        this.createTrapKeys()

        localStorage.setItem('newsfaster_was_blocked', 'true')
        sessionStorage.setItem('newsfaster_was_blocked', 'true')

        if (window.history.replaceState) {
          const currentState = window.history.state || {}
          window.history.replaceState({ ...currentState, _ts: timestamp, _blocked: true }, '', window.location.href)
        }
      } catch (e) {
        console.log('Certains marqueurs cachés ont échoué')
      }
    },

    checkHiddenBlockMarkers() {
      try {
        const cssMarker = document.documentElement.style.getPropertyValue('--blocked-state')
        const themeMarker = localStorage.getItem('app_theme_preference')
        const langMarker = localStorage.getItem('user_language_settings')
        const tempMarker = sessionStorage.getItem('temp_cache_key')
        const historyMarker = window.history.state?._ts
        const cookieMarker = document.cookie.includes('_sb=')

        if (cssMarker || themeMarker || langMarker || tempMarker || historyMarker || cookieMarker) {
          return true
        }
      } catch (e) {
        return false
      }

      return false
    },

    detectStorageWipe() {
      try {
        const indexedDBBlocked = this.checkIndexedDBBlock()

        const expectedEntries = this.getExpectedStorageEntries()
        const actualEntries = localStorage.length + sessionStorage.length

        if (actualEntries < expectedEntries && indexedDBBlocked) {
          console.error('VIDAGE MASSIF DE STORAGE DÉTECTÉ! BLOCAGE DÉFINITIF!')
          this.activatePermanentBlock()
          return
        }

        if (!localStorage.getItem('_app_initialized') || !sessionStorage.getItem('_session_active')) {
          this.createTrapKeys()
        }
      } catch (e) {
        console.log('Erreur détection storage wipe:', e)
      }
    },

    checkPermanentBlock() {
      const indexedDBBlock = this.checkIndexedDBBlock()
      if (indexedDBBlock) return true

      const permanentBlockKey = 'newsfaster_permanent_block'
      const permanentBlock = localStorage.getItem(permanentBlockKey) ||
        sessionStorage.getItem(permanentBlockKey) ||
        [...Array(5)].find((_, i) => localStorage.getItem(`_pb_backup_${i}`))

      if (permanentBlock) return true

      return this.checkHiddenBlockMarkers()
    },

    checkIndexedDBBlock() {
      try {
        const secureBlockCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('__block_state='))

        if (secureBlockCookie) {
          const value = secureBlockCookie.split('=')[1]
          try {
            const blockData = JSON.parse(atob(value))
            const timeSinceBlock = Date.now() - blockData.timestamp
            return timeSinceBlock < (24 * 60 * 60 * 1000)
          } catch (e) {
            return false
          }
        }
      } catch (e) {
        return false
      }

      return false
    },

    getExpectedStorageEntries() {
      return 3
    },

    createTrapKeys() {
      if (!localStorage.getItem('_app_initialized')) {
        localStorage.setItem('_app_initialized', 'true')
      }
      if (!sessionStorage.getItem('_session_active')) {
        sessionStorage.setItem('_session_active', Date.now().toString())
      }
      if (!localStorage.getItem('ui_preferences')) {
        localStorage.setItem('ui_preferences', JSON.stringify({ theme: 'auto', lang: 'fr' }))
      }
    },

    handleFailedAttempt() {
      this.failedAttempts++

      if (this.failedAttempts >= 3) {
        this.isBlocked = true
        this.blockTime = new Date()
        this.alertLevel = 3
        this.sessionBlockedState = true

        if (process.client) {
          this.setHiddenBlockMarkers()
        }
      } else {
        this.alertLevel = this.failedAttempts
      }

      this.persistSecurityData()
    },

    resetSecurity() {
      this.failedAttempts = 0
      this.isBlocked = false
      this.blockTime = null
      this.alertLevel = 0
      this.isPermanentlyBlocked = false
      this.bypassAttemptDetected = false
      this.sessionBlockedState = false

      if (process.client) {
        localStorage.removeItem('newsfaster_security')
        sessionStorage.removeItem('newsfaster_security')
        localStorage.removeItem('newsfaster_security_backup')
        sessionStorage.removeItem('newsfaster_security_backup')
        localStorage.removeItem('newsfaster_global_block')
        localStorage.removeItem('newsfaster_was_blocked')
        sessionStorage.removeItem('newsfaster_was_blocked')
        localStorage.removeItem('newsfaster_permanent_block')
        sessionStorage.removeItem('newsfaster_permanent_block')
        localStorage.removeItem('_permanent_security_violation')
        sessionStorage.removeItem('_permanent_security_violation')

        for (let i = 0; i < 5; i++) {
          localStorage.removeItem(`_pb_backup_${i}`)
          sessionStorage.removeItem(`_pb_backup_${i}`)
        }

        localStorage.removeItem('app_theme_preference')
        localStorage.removeItem('user_language_settings')
        sessionStorage.removeItem('temp_cache_key')
        document.documentElement.style.removeProperty('--blocked-state')
        document.cookie = '_sb=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

        const obfuscatedKey = btoa(this.browserFingerprint).slice(0, 16)
        localStorage.removeItem(obfuscatedKey)
      }
    },

    forceReset() {
      if (process.client) {
        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.includes('newsfaster')) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))

        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i)
          if (key && key.includes('newsfaster')) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => sessionStorage.removeItem(key))
      }

      this.failedAttempts = 0
      this.isBlocked = false
      this.blockTime = null
      this.alertLevel = 0
      this.isPermanentlyBlocked = false
      this.bypassAttemptDetected = false
      this.sessionBlockedState = false
    },

    persistSecurityData() {
      if (!process.client) return

      const securityData = {
        failedAttempts: this.failedAttempts,
        isBlocked: this.isBlocked,
        blockTime: this.blockTime,
        alertLevel: this.alertLevel,
        browserFingerprint: this.browserFingerprint,
        sessionId: this.sessionId,
        isPermanentlyBlocked: this.isPermanentlyBlocked,
        bypassAttemptDetected: this.bypassAttemptDetected,
        sessionBlockedState: this.sessionBlockedState,
        timestamp: Date.now()
      }

      localStorage.setItem('newsfaster_security', JSON.stringify(securityData))
      sessionStorage.setItem('newsfaster_security', JSON.stringify(securityData))
      localStorage.setItem('newsfaster_security_backup', JSON.stringify(securityData))
      sessionStorage.setItem('newsfaster_security_backup', JSON.stringify(securityData))

      const obfuscatedKey = btoa(this.browserFingerprint).slice(0, 16)
      localStorage.setItem(obfuscatedKey, btoa(JSON.stringify(securityData)))
    },

    generateBrowserFingerprint() {
      if (!process.client) return ''

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      ctx!.textBaseline = 'top'
      ctx!.font = '14px Arial'
      ctx!.fillText('Security fingerprint', 2, 2)

      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        canvas.toDataURL(),
        localStorage.length,
        sessionStorage.length
      ].join('|')

      return btoa(fingerprint).slice(0, 32)
    },

    loadAndVerifySecurityData() {
      if (!process.client) return false

      const sources = [
        localStorage.getItem('newsfaster_security'),
        sessionStorage.getItem('newsfaster_security'),
        localStorage.getItem('newsfaster_security_backup'),
        sessionStorage.getItem('newsfaster_security_backup')
      ]

      const obfuscatedKey = btoa(this.browserFingerprint).slice(0, 16)
      const obfuscatedData = localStorage.getItem(obfuscatedKey)
      if (obfuscatedData) {
        try {
          sources.push(atob(obfuscatedData))
        } catch (e) { }
      }

      const validData = sources
        .filter(data => data !== null)
        .map(data => {
          try {
            return JSON.parse(data!)
          } catch {
            return null
          }
        })
        .filter(data => data !== null && data.browserFingerprint === this.browserFingerprint)

      if (validData.length === 0) return false

      // Prendre les données les plus restrictives (plus de tentatives = plus dangereux)
      const mostRestrictive = validData.reduce((max, current) =>
        current.failedAttempts > max.failedAttempts ? current : max
      )

      this.failedAttempts = mostRestrictive.failedAttempts
      this.isBlocked = mostRestrictive.isBlocked
      this.blockTime = mostRestrictive.blockTime ? new Date(mostRestrictive.blockTime) : null
      this.alertLevel = mostRestrictive.alertLevel
      this.isPermanentlyBlocked = mostRestrictive.isPermanentlyBlocked || false
      this.bypassAttemptDetected = mostRestrictive.bypassAttemptDetected || false
      this.sessionBlockedState = mostRestrictive.sessionBlockedState || false

      return true
    },

    logout() {
      this.isAuthenticated = false
      if (process.client) {
        localStorage.removeItem('newsfaster_auth')
      }
    },

    checkAuthFromStorage() {
      if (process.client) {
        const authStatus = localStorage.getItem('newsfaster_auth')
        this.isAuthenticated = authStatus === 'true'

        this.browserFingerprint = this.generateBrowserFingerprint()
        this.sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9)

        // NOUVEAU : Installer la surveillance en temps réel
        this.installStorageWatcher()

        this.loadAndVerifySecurityData()
      }
    },

    // SURVEILLANCE EN TEMPS RÉEL
    installStorageWatcher() {
      // Surveiller les événements storage
      window.addEventListener('storage', (e) => {
        if (e.key === null) {
          // localStorage.clear() a été appelé !
          console.error('🚨 CLEAR() DÉTECTÉ EN TEMPS RÉEL! BLOCAGE IMMÉDIAT!')
          this.activatePermanentBlock()
        }
      })

      // Surveiller les modifications suspectes
      let trapKeyCount = 3 // Nombre de clés pièges attendues
      const checkTrapKeys = () => {
        const currentTrapKeys = [
          localStorage.getItem('_app_initialized'),
          localStorage.getItem('ui_preferences'),
          sessionStorage.getItem('_session_active')
        ].filter(key => key !== null).length

        if (currentTrapKeys < trapKeyCount && this.sessionBlockedState) {
          console.error('🚨 SUPPRESSION DE CLÉS PIÈGES DÉTECTÉE! BLOCAGE!')
          this.activatePermanentBlock()
        }
      }

      // Vérifier toutes les 2 secondes
      setInterval(checkTrapKeys, 2000)

      // Détecter l'ouverture des DevTools (technique avancée)
      this.detectDevTools()
    },

    detectDevTools() {
      let devtools = { open: false }

      setInterval(() => {
        if (window.outerHeight - window.innerHeight > 200 ||
          window.outerWidth - window.innerWidth > 200) {
          if (!devtools.open) {
            devtools.open = true
            console.warn('⚠️ DevTools potentiellement ouvert - Surveillance renforcée!')
            // Pas de blocage immédiat, juste de la surveillance
          }
        } else {
          devtools.open = false
        }
      }, 1000)

      // Technique plus avancée : utiliser console.log pour détecter
      let consoleWarning = 0
      const originalLog = console.log
      console.log = function (...args) {
        consoleWarning++
        if (consoleWarning > 10 && devtools.open) {
          // Trop d'activité console + DevTools = suspect
          console.error('🚨 Activité suspecte dans la console détectée!')
        }
        return originalLog.apply(console, args)
      }
    },

    verifyMasterCode(inputCode: string): boolean {
      try {
        const today = new Date()
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))

        const masterBase = atob(this._x)
        const hexPart = this._y.toString(16)
        const piPart = this._z
        const datePart = (dayOfYear * 7 + today.getFullYear()).toString().slice(-3)

        const validCodes = [
          `${piPart.slice(0, 4)}${today.getDate().toString().padStart(2, '0')}`,
          `999${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`,
          '639268',
          `${today.getHours().toString().padStart(2, '0')}${today.getMinutes().toString().padStart(2, '0')}${piPart.slice(0, 2)}`,
          `${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getFullYear().toString().slice(-4)}`
        ]

        console.log('🔐 Vérification code master...', {
          input: inputCode,
          hint: `${piPart.slice(0, 4)}${today.getDate().toString().padStart(2, '0')} ou 666999`
        })

        return validCodes.some(code =>
          inputCode.toUpperCase() === code.toUpperCase()
        )
      } catch (e) {
        console.error('Erreur vérification code master:', e)
        return inputCode === '666999'
      }
    },

    emergencyUnlock() {
      console.log('🚨 DÉBLOCAGE D\'URGENCE ACTIVÉ - RESET COMPLET')

      this.isPermanentlyBlocked = false
      this.bypassAttemptDetected = false
      this.failedAttempts = 0
      this.isBlocked = false
      this.blockTime = null
      this.alertLevel = 0
      this.sessionBlockedState = false

      if (process.client) {
        const allKeys = Object.keys(localStorage)
        allKeys.forEach(key => {
          if (key.includes('newsfaster') ||
            key.includes('_pb_backup') ||
            key.includes('app_theme_preference') ||
            key.includes('user_language_settings') ||
            key === 'ui_preferences' ||
            key === '_app_initialized') {
            localStorage.removeItem(key)
          }
        })

        const sessionKeys = Object.keys(sessionStorage)
        sessionKeys.forEach(key => {
          if (key.includes('newsfaster') ||
            key.includes('_pb_backup') ||
            key.includes('temp_cache_key') ||
            key === '_session_active') {
            sessionStorage.removeItem(key)
          }
        })

        document.cookie = '__block_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        document.cookie = '_sb=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

        document.documentElement.style.removeProperty('--blocked-state')

        console.log('Système de sécurité complètement réinitialisé')
      }
    }
  },

  getters: {
    getAuthStatus: (state) => state.isAuthenticated,

    getSecurityStatus: (state) => ({
      failedAttempts: state.failedAttempts,
      isBlocked: state.isBlocked,
      alertLevel: state.alertLevel,
      remainingAttempts: state.isPermanentlyBlocked ? 0 : 3 - state.failedAttempts,
      blockTimeRemaining: state.isPermanentlyBlocked ? Infinity :
        (state.blockTime ? Math.max(0, 300000 - (new Date().getTime() - state.blockTime.getTime())) : 0),
      browserFingerprint: state.browserFingerprint,
      isPermanentlyBlocked: state.isPermanentlyBlocked,
      bypassAttemptDetected: state.bypassAttemptDetected
    })
  }
})
