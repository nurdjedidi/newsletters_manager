import { pool } from '../db'

export default defineEventHandler(async (event) => {
  const method = event.method
  const id = getRouterParam(event, 'id')

  try {
    if (method === 'PUT') {
      const { title, subject } = await readBody(event)

      await pool.query('UPDATE newsletters SET title = ?, subject = ? WHERE id = ?', [title, subject, id])

      const [rows] = await pool.query('SELECT * FROM newsletters WHERE id = ?', [id])
      const newsletter = (rows as any[])[0]

      if (!newsletter) {
        return {
          success: false,
          message: 'Newsletter not found'
        }
      }

      return {
        success: true,
        data: newsletter
      }
    } else if (method === 'DELETE') {
      const [rows] = await pool.query('SELECT * FROM newsletters WHERE id = ?', [id])
      const newsletter = (rows as any[])[0]

      if (!newsletter) {
        return {
          success: false,
          message: 'Newsletter not found'
        }
      }

      await pool.query('DELETE FROM newsletters WHERE id = ?', [id])

      return {
        success: true,
        message: 'Newsletter deleted successfully'
      }
    } else {
      return {
        success: false,
        message: 'Method not allowed'
      }
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message
    }
  }
}) 