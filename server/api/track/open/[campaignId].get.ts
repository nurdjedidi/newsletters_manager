import { defineEventHandler, getRouterParam, setHeader } from 'h3'
import { pool } from '../../db'

export default defineEventHandler(async (event) => {
  try {
    const campaignId = getRouterParam(event, 'campaignId')

    if (!campaignId) {
      return new Response('Campaign ID manquant', { status: 400 })
    }

    const connection = await pool.getConnection()

    try {
      // Incrémenter le compteur d'ouvertures
      await connection.execute(`
        UPDATE campaigns 
        SET opens_count = opens_count + 1 
        WHERE id = ?
      `, [campaignId])

      // Optionnel: enregistrer l'ouverture avec plus de détails (IP, user agent, timestamp)
      // await connection.execute(`
      //   INSERT INTO email_opens (campaign_id, ip_address, user_agent, opened_at) 
      //   VALUES (?, ?, ?, NOW())
      // `, [campaignId, getClientIP(event), getHeader(event, 'user-agent')])

    } finally {
      connection.release()
    }

    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    )

    setHeader(event, 'Content-Type', 'image/gif')
    setHeader(event, 'Content-Length', pixel.length)
    setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
    setHeader(event, 'Pragma', 'no-cache')
    setHeader(event, 'Expires', '0')

    return pixel

  } catch (error) {
    console.error('Erreur lors du tracking d\'ouverture:', error)

    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    )

    setHeader(event, 'Content-Type', 'image/gif')
    return pixel
  }
}) 