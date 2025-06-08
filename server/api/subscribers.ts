import { pool } from './db'

export default defineEventHandler(async (event) => {
  const method = event.method

  try {
    if (method === 'GET') {
      const [subscribers] = await pool.query('SELECT * FROM newsletters_subscribers')
      return {
        success: true,
        data: subscribers
      }
    } else if (method === 'POST') {
      const { name, email } = await readBody(event)
      const [subscriber] = await pool.query('INSERT INTO newsletters_subscribers (name, email) VALUES (?, ?)', [name, email])
      return {
        success: true,
        data: subscriber
      }
    } else {
      return {
        success: false,
        message: 'Invalid method'
      }
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message
    }
  }
})