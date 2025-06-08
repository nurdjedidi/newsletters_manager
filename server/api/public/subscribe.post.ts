import { pool } from '../db'

export default defineEventHandler(async (event) => {
  if (event.method === 'OPTIONS') {
    await appendHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '3600'
    })
    return 'OK'
  }

  await appendHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  })

  try {
    const { email } = await readBody(event)

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return {
        success: false,
        message: 'Email invalide'
      }
    }

    const emailLower = email.toLowerCase().trim()

    const emailPart = emailLower.split('@')[0]
    const name = emailPart
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase())

    const [existing] = await pool.query('SELECT id FROM newsletters_subscribers WHERE email = ?', [emailLower])

    if ((existing as any[]).length > 0) {
      return {
        success: false,
        message: 'Cet email est déjà inscrit à la newsletter'
      }
    }

    const [result] = await pool.query(
      'INSERT INTO newsletters_subscribers (email, name, status, subscribed_date) VALUES (?, ?, ?, NOW())',
      [emailLower, name, 1]
    )

    const insertId = (result as any).insertId

    const [newSubscriber] = await pool.query('SELECT * FROM newsletters_subscribers WHERE id = ?', [insertId])

    return {
      success: true,
      message: 'Inscription réussie à la newsletter!',
      data: (newSubscriber as any[])[0]
    }

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    return {
      success: false,
      message: 'Erreur lors de l\'inscription. Veuillez réessayer.'
    }
  }
}) 