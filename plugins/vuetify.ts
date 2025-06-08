import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          dark: true,
          colors: {
            primary: '#2196F3',
            secondary: '#00BCD4',
            accent: '#9C27B0',
            success: '#4CAF50',
            warning: '#FFC107',
            error: '#FF5252',
            info: '#2196F3',
          }
        }
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})