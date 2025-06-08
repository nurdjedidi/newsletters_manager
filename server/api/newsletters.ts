import { pool } from './db'

export default defineEventHandler(async (event) => {
  const method = event.method

  try {
    if (method === 'POST') {
      const { title, subject } = await readBody(event)
      const [newsletter] = await pool.query('INSERT INTO newsletters (title, subject) VALUES (?, ?)', [title, subject])

      return {
        success: true,
        data: newsletter
      }
    } else if (method === 'GET') {
      const [newsletters] = await pool.query('SELECT * FROM newsletters')
      return {
        success: true,
        data: newsletters
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