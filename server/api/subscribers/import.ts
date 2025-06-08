import { pool } from '../db'

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method !== 'POST') {
    return {
      success: false,
      message: 'Method not allowed'
    }
  }

  try {
    const body = await readBody(event)
    const subscribers = body.subscribers || body

    if (!Array.isArray(subscribers) || subscribers.length === 0) {
      return {
        success: false,
        message: 'Invalid data format or empty array'
      }
    }

    const importedSubscribers = []
    const errors = []

    for (let i = 0; i < subscribers.length; i++) {
      const subscriber = subscribers[i]

      if (!subscriber.email || !subscriber.email.includes('@')) {
        errors.push(`Ligne ${i + 1}: Email invalide (${subscriber.email})`)
        continue
      }

      try {
        const [existing] = await pool.query('SELECT id FROM newsletters_subscribers WHERE email = ?', [subscriber.email])
        if ((existing as any[]).length > 0) {
          errors.push(`Ligne ${i + 1}: L'email ${subscriber.email} existe déjà`)
          continue
        }

        const [result] = await pool.query(
          'INSERT INTO newsletters_subscribers (email, name, status, subscribed_date) VALUES (?, ?, ?, NOW())',
          [subscriber.email, subscriber.name || '', 1]
        )

        const insertId = (result as any).insertId

        const [newSubscriber] = await pool.query('SELECT * FROM newsletters_subscribers WHERE id = ?', [insertId])
        importedSubscribers.push((newSubscriber as any[])[0])

      } catch (dbError) {
        errors.push(`Ligne ${i + 1}: Erreur base de données - ${(dbError as Error).message}`)
      }
    }

    return {
      success: true,
      data: importedSubscribers,
      message: `${importedSubscribers.length} subscribers importés avec succès`,
      errors: errors.length > 0 ? errors : undefined
    }

  } catch (error) {
    return {
      success: false,
      message: (error as Error).message
    }
  }
}) 