import { defineEventHandler, getQuery, getRouterParam, sendRedirect } from 'h3'
import { pool } from '../../db'

export default defineEventHandler(async (event) => {
  try {
    const campaignId = getRouterParam(event, 'campaignId')
    const query = getQuery(event)
    const targetUrl = query.url as string

    if (!campaignId || !targetUrl) {
      return {
        success: false,
        message: 'Campaign ID et URL manquants'
      }
    }

    const connection = await pool.getConnection()

    try {
      await connection.execute(`
        UPDATE campaigns 
        SET clicks_count = clicks_count + 1 
        WHERE id = ?
      `, [campaignId])

      // Optionnel: enregistrer le clic avec plus de détails
      // await connection.execute(`
      //   INSERT INTO email_clicks (campaign_id, url, ip_address, user_agent, clicked_at) 
      //   VALUES (?, ?, ?, ?, NOW())
      // `, [campaignId, targetUrl, getClientIP(event), getHeader(event, 'user-agent')])

    } finally {
      connection.release()
    }

    return sendRedirect(event, decodeURIComponent(targetUrl), 302)

  } catch (error) {
    console.error('Erreur lors du tracking de clic:', error)

    const query = getQuery(event)
    const targetUrl = query.url as string

    if (targetUrl) {
      return sendRedirect(event, decodeURIComponent(targetUrl), 302)
    }

    return {
      success: false,
      message: 'Erreur lors du tracking du clic'
    }
  }
}) 