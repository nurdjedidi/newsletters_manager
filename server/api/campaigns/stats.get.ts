import { defineEventHandler } from 'h3'
import { pool } from '../db'

export default defineEventHandler(async (event) => {
  try {
    const connection = await pool.getConnection()

    try {
      const [stats] = await connection.execute(`
        SELECT 
          COUNT(*) as total,
          COALESCE(SUM(recipients_count), SUM(sent_count)) as totalRecipients,
          COALESCE(SUM(opens_count), 0) as totalOpens,
          COALESCE(SUM(clicks_count), 0) as totalClicks,
          COALESCE(SUM(bounces_count), 0) as totalBounces,
          COALESCE(SUM(failed_count), 0) as totalFailed,
          COALESCE(AVG(
            CASE 
              WHEN COALESCE(recipients_count, sent_count) > 0 
              THEN (opens_count / COALESCE(recipients_count, sent_count)) * 100 
              ELSE 0 
            END
          ), 0) as avgOpenRate,
          COALESCE(AVG(
            CASE 
              WHEN COALESCE(recipients_count, sent_count) > 0 
              THEN (clicks_count / COALESCE(recipients_count, sent_count)) * 100 
              ELSE 0 
            END
          ), 0) as avgClickRate
        FROM campaigns
      `) as [any[], any]

      return {
        success: true,
        data: stats[0]
      }

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error)
    return {
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }
  }
}) 