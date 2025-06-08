import { pool } from './db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, id } = body

    if (!email || !id) {
      return {
        success: false,
        message: 'Email et ID requis'
      }
    }

    const [rows] = await pool.execute(
      'SELECT id, email, status FROM newsletters_subscribers WHERE id = ? AND email = ?',
      [id, email]
    ) as [any[], any]

    if (rows.length === 0) {
      return {
        success: false,
        message: 'Utilisateur non trouvé'
      }
    }

    const user = rows[0]

    if (user.status === 0) {
      return {
        success: true,
        message: 'Vous étiez déjà désinscrit'
      }
    }

    await pool.execute(
      'UPDATE newsletters_subscribers SET status = 0 WHERE id = ? AND email = ?',
      [id, email]
    )

    console.log(`Utilisateur désinscrit: ${email} (ID: ${id})`)

    return {
      success: true,
      message: 'Désinscription réussie'
    }

  } catch (error) {
    console.error('Erreur lors de la désinscription:', error)
    return {
      success: false,
      message: 'Erreur serveur lors de la désinscription'
    }
  }
}) 