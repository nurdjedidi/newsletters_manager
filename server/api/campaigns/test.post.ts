import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { subject, fromName, fromEmail, content, testEmail } = body

    if (!subject || !fromName || !fromEmail || !content || !testEmail) {
      return {
        success: false,
        message: 'Tous les champs sont requis'
      }
    }

    const emailData = {
      from: `${fromName} <support@stackunity.tech>`,
      to: ['djedidinur@gmail.com'],
      subject: `[TEST] ${subject}`,
      html: `
        <div style="background-color: #fffbeb; padding: 20px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
          <h3 style="margin: 0; color: #92400e;">🧪 Email de test</h3>
          <p style="margin: 5px 0 0 0; color: #92400e;">Ceci est un email de test. Il ne sera pas envoyé aux subscribers.</p>
        </div>
        ${content}
        <hr style="margin: 30px 0;">
        <div style="font-size: 12px; color: #666; text-align: center;">
          <p>Email de test envoyé depuis NewsFaster</p>
        </div>
      `
    }

    const result = await resend.emails.send(emailData)

    if (result.error) {
      console.error('Erreur Resend:', result.error)
      return {
        success: false,
        message: `Erreur Resend: ${result.error.message}`
      }
    }

    return {
      success: true,
      message: 'Email de test envoyé avec succès',
      emailId: result.data?.id
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi du test:', error)
    return {
      success: false,
      message: 'Erreur serveur lors de l\'envoi du test'
    }
  }
}) 