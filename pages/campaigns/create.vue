<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-btn color="grey" variant="text" to="/newsletters" prepend-icon="mdi-arrow-left" class="mb-4">
            Retour aux newsletters
          </v-btn>
          <h1 class="text-h4 font-weight-medium">Créer une campagne email</h1>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="8">
          <v-card class="mb-4">
            <v-card-title>
              <v-icon color="primary" class="mr-2">mdi-palette</v-icon>
              Choisir un template
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col v-for="template in emailTemplates" :key="template.id" cols="6" sm="4" md="3">
                  <v-card :class="{ 'border-primary': selectedTemplate === template.id }"
                    :color="selectedTemplate === template.id ? 'primary' : ''"
                    :variant="selectedTemplate === template.id ? 'tonal' : 'outlined'"
                    class="template-card cursor-pointer" @click="selectTemplate(template.id)" height="120">
                    <v-card-text class="d-flex flex-column align-center justify-center text-center pa-3">
                      <v-icon :color="selectedTemplate === template.id ? 'primary' : 'grey'" size="32" class="mb-2">
                        {{ getTemplateIcon(template.id) }}
                      </v-icon>
                      <div class="text-subtitle-2 font-weight-bold">{{ template.name }}</div>
                      <div class="text-caption text-grey">{{ template.description }}</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card class="mb-4">
            <v-card-title>Détails de la campagne</v-card-title>
            <v-card-text>
              <v-form v-model="isFormValid">
                <v-text-field v-model="campaign.subject" label="Sujet de l'email" variant="outlined"
                  :rules="[rules.required]" class="mb-3"></v-text-field>

                <v-text-field v-model="campaign.fromName" label="Nom de l'expéditeur" variant="outlined"
                  :rules="[rules.required]" class="mb-3"></v-text-field>

                <v-text-field v-model="campaign.fromEmail" label="Email de l'expéditeur" variant="outlined"
                  :rules="[rules.required, rules.email]" class="mb-3"></v-text-field>

                <v-expansion-panels v-if="selectedTemplateData" class="mb-3" multiple>
                  <v-expansion-panel value="styles">
                    <v-expansion-panel-title>
                      <v-icon class="mr-2">mdi-palette</v-icon>
                      Personnaliser les couleurs
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="templateStyles.primary_color" label="Couleur principale"
                            variant="outlined" density="compact" type="color" hint="Couleur de l'en-tête et boutons"
                            persistent-hint></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="templateStyles.secondary_color" label="Couleur secondaire"
                            variant="outlined" density="compact" type="color" hint="Couleur des accents et dégradés"
                            persistent-hint></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="templateStyles.accent_color" label="Couleur accent" variant="outlined"
                            density="compact" type="color" hint="Liens et éléments interactifs"
                            persistent-hint></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="templateStyles.text_color" label="Couleur du texte" variant="outlined"
                            density="compact" type="color" hint="Couleur principale du texte"
                            persistent-hint></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="templateStyles.background_color" label="Arrière-plan"
                            variant="outlined" density="compact" type="color" hint="Couleur de fond principal"
                            persistent-hint></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="templateStyles.border_color" label="Couleur des bordures"
                            variant="outlined" density="compact" type="color" hint="Bordures et séparateurs"
                            persistent-hint></v-text-field>
                        </v-col>
                      </v-row>

                      <v-divider class="my-4"></v-divider>

                      <div class="d-flex gap-2 flex-wrap">
                        <v-btn size="small" variant="outlined" @click="applyColorTheme('modern')"
                          prepend-icon="mdi-palette">
                          Thème Moderne
                        </v-btn>
                        <v-btn size="small" variant="outlined" @click="applyColorTheme('corporate')"
                          prepend-icon="mdi-office-building">
                          Thème Corporate
                        </v-btn>
                        <v-btn size="small" variant="outlined" @click="applyColorTheme('minimal')"
                          prepend-icon="mdi-circle-outline">
                          Thème Minimal
                        </v-btn>
                        <v-btn size="small" variant="outlined" @click="applyColorTheme('newsletter')"
                          prepend-icon="mdi-newspaper">
                          Thème Newsletter
                        </v-btn>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>

                  <v-expansion-panel value="variables">
                    <v-expansion-panel-title>
                      <v-icon class="mr-2">mdi-variable</v-icon>
                      Variables du template ({{ selectedTemplateData.variables.length }})
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-row>
                        <v-col v-for="variable in selectedTemplateData.variables" :key="variable" cols="12" sm="6">
                          <v-text-field v-model="templateVariables[variable.replace(/[{}]/g, '')]" :label="variable"
                            variant="outlined" density="compact" :hint="getVariableHint(variable)"
                            persistent-hint></v-text-field>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>

                <v-textarea v-model="campaign.content" label="Contenu principal de l'email" variant="outlined"
                  :rules="[rules.required]" rows="8"
                  hint="Ce contenu sera inséré dans le template sélectionné. Le contenu change automatiquement selon le template choisi."
                  persistent-hint class="content-textarea"></v-textarea>
              </v-form>
            </v-card-text>
          </v-card>

          <v-card>
            <v-card-text>
              <div class="d-flex ga-3 flex-wrap">
                <v-btn color="primary" variant="outlined" prepend-icon="mdi-printer" @click="showPreview = true"
                  :disabled="!isFormValid">
                  Prévisualiser
                </v-btn>

                <v-btn color="warning" variant="outlined" prepend-icon="mdi-email-fast" @click="sendTestEmail"
                  :disabled="!isFormValid" :loading="sendingTest">
                  Envoyer un test
                </v-btn>

                <v-btn color="secondary" variant="outlined" prepend-icon="mdi-send" @click="confirmSend = true"
                  :disabled="!isFormValid" :loading="sendingCampaign">
                  Envoyer à tous ({{ subscribersStore.activeCount }} subscribers)
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="mb-4">
            <v-card-title>
              <v-icon color="primary" class="mr-2">mdi-account-group</v-icon>
              Audience
            </v-card-title>
            <v-card-text>
              <div class="d-flex flex-column gap-3">
                <div class="d-flex justify-space-between">
                  <span>Total subscribers:</span>
                  <span class="font-weight-bold">{{ subscribersStore.subscriberCount }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span>Actifs:</span>
                  <span class="font-weight-bold text-success">{{ subscribersStore.activeCount }}</span>
                </div>
                <v-divider></v-divider>
                <div class="d-flex justify-space-between">
                  <span>Emails à envoyer:</span>
                  <span class="font-weight-bold text-primary">{{ subscribersStore.activeCount }}</span>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <v-card>
            <v-card-title>
              <v-icon color="info" class="mr-2">mdi-information</v-icon>
              Conseils
            </v-card-title>
            <v-card-text>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title class="text-body-2">
                    • Testez votre email avant l'envoi
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-body-2">
                    • Vérifiez l'orthographe et la grammaire
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-body-2">
                    • Utilisez un sujet accrocheur
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-body-2">
                    • Incluez un lien de désinscription
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showPreview" max-width="800px" scrollable>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Prévisualisation de l'email</span>
          <v-btn icon @click="showPreview = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-0">
          <div class="pa-4 bg-grey-lighten-4">
            <div class="text-body-2 mb-1">
              <strong>De:</strong> {{ campaign.fromName }} &lt;{{ campaign.fromEmail }}&gt;
            </div>
            <div class="text-body-2 mb-1">
              <strong>Sujet:</strong> {{ campaign.subject }}
            </div>
          </div>

          <v-divider></v-divider>

          <div class="pa-0" style="min-height: 300px;">
            <div v-html="processedEmailContent" style="max-width: 100%; overflow-x: auto;"></div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showPreview = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmSend" max-width="500px">
      <v-card>
        <v-card-title class="bg-warning text-white">
          <v-icon color="white" class="mr-2">mdi-alert</v-icon>
          Confirmer l'envoi
        </v-card-title>

        <v-card-text class="pt-4">
          <p class="mb-3">
            Vous êtes sur le point d'envoyer cette campagne à
            <strong>{{ subscribersStore.activeCount }} subscribers actifs</strong>.
          </p>

          <v-alert type="warning" variant="tonal" density="compact">
            Cette action ne peut pas être annulée une fois l'envoi commencé.
          </v-alert>

          <div class="mt-4">
            <div class="text-subtitle-2 mb-2">Résumé:</div>
            <div class="text-body-2">
              <strong>Sujet:</strong> {{ campaign.subject }}<br>
              <strong>Expéditeur:</strong> {{ campaign.fromName }} &lt;{{ campaign.fromEmail }}&gt;<br>
              <strong>Recipients:</strong> {{ subscribersStore.activeCount }} subscribers
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="confirmSend = false">Annuler</v-btn>
          <v-btn color="success" variant="tonal" @click="sendCampaign" :loading="sendingCampaign">
            Confirmer l'envoi
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showResults" max-width="600px">
      <v-card>
        <v-card-title class="bg-success text-white">
          <v-icon color="white" class="mr-2">mdi-check-circle</v-icon>
          Campagne envoyée
        </v-card-title>

        <v-card-text class="pt-4">
          <div v-if="campaignResults">
            <div class="text-h6 mb-3">Résultats de l'envoi:</div>

            <v-row>
              <v-col cols="4">
                <v-card class="text-center pa-3" color="success" variant="tonal">
                  <div class="text-h5">{{ campaignResults.sent }}</div>
                  <div class="text-caption">Envoyés</div>
                </v-card>
              </v-col>

              <v-col cols="4">
                <v-card class="text-center pa-3" color="error" variant="tonal">
                  <div class="text-h5">{{ campaignResults.failed }}</div>
                  <div class="text-caption">Échecs</div>
                </v-card>
              </v-col>

              <v-col cols="4">
                <v-card class="text-center pa-3" color="info" variant="tonal">
                  <div class="text-h5">{{ Math.round((campaignResults.sent / (campaignResults.sent +
                    campaignResults.failed)) * 100) }}%</div>
                  <div class="text-caption">Succès</div>
                </v-card>
              </v-col>
            </v-row>

            <div v-if="campaignResults.errors && campaignResults.errors.length > 0" class="mt-4">
              <v-alert type="error" variant="tonal" density="compact">
                <div class="text-subtitle-2">Erreurs détectées:</div>
                <ul class="mt-2">
                  <li v-for="error in campaignResults.errors.slice(0, 5)" :key="error" class="text-body-2">
                    {{ error }}
                  </li>
                </ul>
                <div v-if="campaignResults.errors.length > 5" class="text-caption">
                  ... et {{ campaignResults.errors.length - 5 }} autres erreurs
                </div>
              </v-alert>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="resetForm">Créer une nouvelle campagne</v-btn>
          <v-btn color="success" to="/newsletters">Retour aux newsletters</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSubscribersStore } from '~/stores/subscribers'
import { emailTemplates, getTemplate, processTemplate } from '~/utils/emailTemplates'

const subscribersStore = useSubscribersStore()

const isFormValid = ref(false)
const showPreview = ref(false)
const confirmSend = ref(false)
const showResults = ref(false)
const sendingTest = ref(false)
const sendingCampaign = ref(false)

const selectedTemplate = ref('modern')
const templateVariables = ref({
  name: 'Cher(e) abonné(e)',
  company: 'NewsFaster',
  date: new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }),
  position: '',
  issue_number: '1',
  cta_text: 'Lire la suite',
  cta_url: 'https://example.com',
  cta_title: 'Découvrez nos nouveautés',
  cta_description: 'Cliquez pour en savoir plus',
  subscriber_count: subscribersStore.activeCount.toString(),
  archive_url: 'https://example.com/archives',
  company_url: 'https://newsfaster.com',
  unsubscribe_url: '#',
  highlights: `• Nouveauté importante cette semaine<br>
• Mise à jour de nos services<br>
• Événement à venir`,
  resources: `• <a href="#" style="color: #451a03;">Guide pratique</a><br>
• <a href="#" style="color: #451a03;">Documentation</a><br>
• <a href="#" style="color: #451a03;">Support technique</a>`
})

const templateStyles = ref({
  primary_color: '#667eea',
  secondary_color: '#764ba2',
  text_color: '#2d3748',
  background_color: '#ffffff',
  accent_color: '#4299e1',
  border_color: '#e2e8f0'
})

const campaign = ref({
  subject: '',
  fromName: 'NewsFaster',
  fromEmail: 'noreply@newsfaster.com',
  content: `<h2>Actualités Modernes</h2>
<p>Découvrez les dernières innovations qui transforment notre industrie.</p>

<h3>Nouveautés Cette Semaine</h3>
<ul>
  <li><strong>Innovation Tech :</strong> Une révolution dans notre approche</li>
  <li><strong>Nouvelle Fonctionnalité :</strong> Simplifiez votre workflow</li>
  <li><strong>Partenariat Stratégique :</strong> Élargissement de nos services</li>
</ul>

<p>Ces développements ouvrent de nouvelles perspectives passionnantes pour l'avenir.</p>
<p><em>Restez connectés pour plus d'innovations !</em></p>`
})

const campaignResults = ref(null)

const selectedTemplateData = computed(() => {
  return getTemplate(selectedTemplate.value)
})

const processedEmailContent = computed(() => {
  if (!selectedTemplateData.value) return campaign.value.content

  const variables = {
    ...templateVariables.value,
    ...templateStyles.value,
    content: campaign.value.content,
    subject: campaign.value.subject
  }

  let processedHtml = processTemplate(selectedTemplateData.value, variables)

  // Appliquer les couleurs personnalisées
  processedHtml = processedHtml
    .replace(/{{primary_color}}/g, templateStyles.value.primary_color)
    .replace(/{{secondary_color}}/g, templateStyles.value.secondary_color)
    .replace(/{{text_color}}/g, templateStyles.value.text_color)
    .replace(/{{background_color}}/g, templateStyles.value.background_color)
    .replace(/{{accent_color}}/g, templateStyles.value.accent_color)
    .replace(/{{border_color}}/g, templateStyles.value.border_color)

  return processedHtml
})

const rules = {
  required: v => !!v || 'Ce champ est requis',
  email: v => /.+@.+\..+/.test(v) || 'Email invalide'
}

onMounted(async () => {
  await subscribersStore.fetchSubscribers()
})

const selectTemplate = (templateId) => {
  selectedTemplate.value = templateId

  const templateContents = {
    modern: `<h2>Actualités Modernes</h2>
<p>Découvrez les dernières innovations qui transforment notre industrie.</p>

<h3>Nouveautés Cette Semaine</h3>
<ul>
  <li><strong>Innovation Tech :</strong> Une révolution dans notre approche</li>
  <li><strong>Nouvelle Fonctionnalité :</strong> Simplifiez votre workflow</li>
  <li><strong>Partenariat Stratégique :</strong> Élargissement de nos services</li>
</ul>

<p>Ces développements ouvrent de nouvelles perspectives passionnantes pour l'avenir.</p>
<p><em>Restez connectés pour plus d'innovations !</em></p>`,

    minimal: `<h2>Réflexions de la Semaine</h2>
<p>Quelques pensées sur les tendances actuelles et les directions à prendre.</p>

<p>Cette semaine, nous avons observé des changements significatifs dans notre secteur. Les entreprises qui s'adaptent rapidement aux nouvelles réalités prospèrent, tandis que celles qui résistent au changement peinent à suivre le rythme.</p>

<p>Trois points méritent notre attention :</p>
<p><strong>L'adaptabilité</strong> devient une compétence essentielle.<br>
<strong>L'innovation collaborative</strong> remplace la compétition pure.<br>
<strong>La simplicité</strong> l'emporte sur la complexité technique.</p>

<p>Ces observations guideront nos prochaines décisions stratégiques.</p>

<p>Cordialement,<br>L'équipe</p>`,

    corporate: `<h2>Rapport Exécutif Hebdomadaire</h2>
<p>Mise à jour officielle sur nos performances et initiatives stratégiques.</p>

<h3>Performances Clés</h3>
<ul>
  <li><strong>Croissance :</strong> +15% par rapport au trimestre précédent</li>
  <li><strong>Satisfaction Client :</strong> 98% de retours positifs</li>
  <li><strong>Expansion :</strong> 3 nouveaux marchés ciblés</li>
</ul>

<h3>Initiatives Stratégiques</h3>
<p>Nos équipes travaillent activement sur plusieurs projets d'envergure qui renforceront notre position de leader du marché. Les investissements en R&D portent leurs fruits avec des innovations brevetées.</p>

<h3>Prochaines Étapes</h3>
<p>Le prochain conseil d'administration validera notre stratégie pour le trimestre suivant, incluant de nouveaux partenariats et l'expansion internationale.</p>

<p>Merci pour votre engagement continu.</p>`,

    newsletter: `<h2>Newsletter NewsFaster #{{issue_number}}</h2>
<p>Votre dose hebdomadaire d'actualités tech et business.</p>

<h3>Trending Cette Semaine</h3>
<ul>
  <li><strong>IA & Productivité :</strong> Les nouveaux outils qui changent la donne</li>
  <li><strong>Startup Spotlight :</strong> L'entreprise qui révolutionne son secteur</li>
  <li><strong>Market Update :</strong> Les tendances à surveiller ce mois-ci</li>
</ul>

<h3>Conseil de la Semaine</h3>
<p>L'automatisation n'est plus une option mais une nécessité. Commencez petit, mais commencez dès aujourd'hui. Identifiez une tâche répétitive dans votre workflow et trouvez un outil pour la simplifier.</p>

<h3>Lecture Recommandée</h3>
<p>Cette semaine, nous recommandons "The Lean Startup" d'Eric Ries. Un incontournable pour comprendre l'innovation continue.</p>

<p>À la semaine prochaine pour plus d'insights !</p>`
  }

  campaign.value.content = templateContents[templateId] || campaign.value.content
}

const getTemplateIcon = (templateId) => {
  const icons = {
    modern: 'mdi-palette-outline',
    minimal: 'mdi-text-box-outline',
    corporate: 'mdi-office-building',
    newsletter: 'mdi-newspaper'
  }
  return icons[templateId] || 'mdi-email-outline'
}

const getVariableHint = (variable) => {
  const hints = {
    '{{name}}': 'Nom du destinataire',
    '{{company}}': 'Nom de votre entreprise',
    '{{date}}': 'Date de l\'envoi',
    '{{position}}': 'Poste du destinataire',
    '{{issue_number}}': 'Numéro de l\'édition',
    '{{cta_text}}': 'Texte du bouton d\'action',
    '{{cta_url}}': 'Lien du bouton d\'action',
    '{{cta_title}}': 'Titre de la section CTA',
    '{{cta_description}}': 'Description de la section CTA',
    '{{subscriber_count}}': 'Nombre d\'abonnés',
    '{{archive_url}}': 'Lien vers les archives',
    '{{company_url}}': 'Site web de l\'entreprise',
    '{{highlights}}': 'Points clés à mettre en avant (HTML supporté)',
    '{{resources}}': 'Liste des ressources utiles (HTML supporté)'
  }
  return hints[variable] || 'Variable personnalisée'
}

const applyColorTheme = (theme) => {
  const themes = {
    modern: {
      primary_color: '#667eea',
      secondary_color: '#764ba2',
      text_color: '#2d3748',
      background_color: '#ffffff',
      accent_color: '#4299e1',
      border_color: '#e2e8f0'
    },
    corporate: {
      primary_color: '#1e3a8a',
      secondary_color: '#3b82f6',
      text_color: '#1f2937',
      background_color: '#ffffff',
      accent_color: '#2563eb',
      border_color: '#e5e7eb'
    },
    minimal: {
      primary_color: '#2d3748',
      secondary_color: '#4a5568',
      text_color: '#2d3748',
      background_color: '#ffffff',
      accent_color: '#4299e1',
      border_color: '#e2e8f0'
    },
    newsletter: {
      primary_color: '#2563eb',
      secondary_color: '#1d4ed8',
      text_color: '#1f2937',
      background_color: '#ffffff',
      accent_color: '#3b82f6',
      border_color: '#e5e7eb'
    }
  }

  if (themes[theme]) {
    templateStyles.value = { ...themes[theme] }
  }
}

const sendTestEmail = async () => {
  sendingTest.value = true
  try {
    const response = await $fetch('/api/campaigns/test', {
      method: 'POST',
      body: {
        ...campaign.value,
        content: processedEmailContent.value,
        testEmail: 'test@example.com'
      }
    })

    if (response.success) {
      alert('Email de test envoyé avec succès !')
    } else {
      alert('Erreur lors de l\'envoi du test: ' + response.message)
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de l\'envoi du test')
  } finally {
    sendingTest.value = false
  }
}

const sendCampaign = async () => {
  sendingCampaign.value = true
  try {
    const response = await $fetch('/api/campaigns/send', {
      method: 'POST',
      body: {
        ...campaign.value,
        content: processedEmailContent.value
      }
    })

    if (response.success) {
      campaignResults.value = response.results
      confirmSend.value = false
      showResults.value = true
    } else {
      alert('Erreur lors de l\'envoi: ' + response.message)
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de l\'envoi de la campagne')
  } finally {
    sendingCampaign.value = false
  }
}

const resetForm = () => {
  campaign.value = {
    subject: '',
    fromName: 'NewsFaster',
    fromEmail: 'noreply@newsfaster.com',
    content: `<h2>Actualités Modernes</h2>
<p>Découvrez les dernières innovations qui transforment notre industrie.</p>

<h3>Nouveautés Cette Semaine</h3>
<ul>
  <li><strong>Innovation Tech :</strong> Une révolution dans notre approche</li>
  <li><strong>Nouvelle Fonctionnalité :</strong> Simplifiez votre workflow</li>
  <li><strong>Partenariat Stratégique :</strong> Élargissement de nos services</li>
</ul>

<p>Ces développements ouvrent de nouvelles perspectives passionnantes pour l'avenir.</p>
<p><em>Restez connectés pour plus d'innovations !</em></p>`
  }

  selectedTemplate.value = 'modern'
  templateVariables.value = {
    name: 'Cher(e) abonné(e)',
    company: 'NewsFaster',
    date: new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    position: '',
    issue_number: '1',
    cta_text: 'Lire la suite',
    cta_url: 'https://example.com',
    cta_title: 'Découvrez nos nouveautés',
    cta_description: 'Cliquez pour en savoir plus',
    subscriber_count: subscribersStore.activeCount.toString(),
    archive_url: 'https://example.com/archives',
    company_url: 'https://newsfaster.com',
    unsubscribe_url: '#',
    highlights: `• Nouveauté importante cette semaine<br>
• Mise à jour de nos services<br>
• Événement à venir`,
    resources: `• <a href="#" style="color: #451a03;">Guide pratique</a><br>
• <a href="#" style="color: #451a03;">Documentation</a><br>
• <a href="#" style="color: #451a03;">Support technique</a>`
  }

  templateStyles.value = {
    primary_color: '#667eea',
    secondary_color: '#764ba2',
    text_color: '#2d3748',
    background_color: '#ffffff',
    accent_color: '#4299e1',
    border_color: '#e2e8f0'
  }

  showResults.value = false
  campaignResults.value = null
}
</script>

<style scoped>
.template-card {
  transition: all 0.2s ease;
}

.template-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cursor-pointer {
  cursor: pointer;
}

.border-primary {
  border: 2px solid rgb(var(--v-theme-primary)) !important;
}

/* Preview email styles */
.preview-email {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.preview-email table {
  border-collapse: collapse;
  width: 100%;
}

.preview-email td {
  padding: 8px;
  vertical-align: top;
}

.preview-email h1,
.preview-email h2,
.preview-email h3 {
  margin-top: 0;
}

.preview-email a {
  color: #2563eb;
  text-decoration: none;
}

.preview-email a:hover {
  text-decoration: underline;
}

.content-textarea {
  transition: all 0.3s ease;
}

.content-textarea:focus-within {
  transform: scale(1.01);
}
</style>