import { defineEventHandler, getQuery } from 'h3'
import { pool } from './db'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const period = query.period || '30d'

    const now = new Date()
    let startDate = new Date()

    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '3m':
        startDate.setMonth(now.getMonth() - 3)
        break
      case '6m':
        startDate.setMonth(now.getMonth() - 6)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    const connection = await pool.getConnection()

    try {
      const [currentStats] = await connection.execute(`
        SELECT 
          COUNT(*) as totalCampaigns,
          COALESCE(SUM(recipients_count), 0) as totalEmailsSent,
          COALESCE(SUM(opens_count), 0) as totalEmailsOpened,
          COALESCE(SUM(clicks_count), 0) as totalClicks,
          COALESCE(AVG(
            CASE 
              WHEN recipients_count > 0 
              THEN (opens_count / recipients_count) * 100 
              ELSE 0 
            END
          ), 0) as openRate,
          COALESCE(AVG(
            CASE 
              WHEN recipients_count > 0 
              THEN (clicks_count / recipients_count) * 100 
              ELSE 0 
            END
          ), 0) as clickRate,
          COALESCE(SUM(bounces_count), 0) as totalBounces,
          COALESCE(AVG(
            CASE 
              WHEN recipients_count > 0 
              THEN (bounces_count / recipients_count) * 100 
              ELSE 0 
            END
          ), 0) as bounceRate
        FROM campaigns 
        WHERE sent_at >= ? AND sent_at <= ?
      `, [startDate, now])

      const previousStartDate = new Date(startDate)
      const previousEndDate = new Date(startDate)
      const periodDiff = now.getTime() - startDate.getTime()
      previousStartDate.setTime(startDate.getTime() - periodDiff)

      const [previousStats] = await connection.execute(`
        SELECT 
          COUNT(*) as totalCampaigns,
          COALESCE(AVG(
            CASE 
              WHEN recipients_count > 0 
              THEN (opens_count / recipients_count) * 100 
              ELSE 0 
            END
          ), 0) as openRate,
          COALESCE(AVG(
            CASE 
              WHEN recipients_count > 0 
              THEN (clicks_count / recipients_count) * 100 
              ELSE 0 
            END
          ), 0) as clickRate
        FROM campaigns 
        WHERE sent_at >= ? AND sent_at < ?
      `, [previousStartDate, previousEndDate])

      const [unsubscribeStats] = await connection.execute(`
        SELECT COUNT(*) as unsubscribeCount
        FROM subscribers 
        WHERE status = 0 AND updated_at >= ? AND updated_at <= ?
      `, [startDate, now])

      const [previousUnsubscribeStats] = await connection.execute(`
        SELECT COUNT(*) as unsubscribeCount
        FROM subscribers 
        WHERE status = 0 AND updated_at >= ? AND updated_at < ?
      `, [previousStartDate, previousEndDate])

      const [topCampaigns] = await connection.execute(`
        SELECT 
          id,
          subject,
          recipients_count,
          opens_count,
          clicks_count,
          CASE 
            WHEN recipients_count > 0 
            THEN (opens_count / recipients_count) * 100 
            ELSE 0 
          END as open_rate,
          CASE 
            WHEN recipients_count > 0 
            THEN (clicks_count / recipients_count) * 100 
            ELSE 0 
          END as click_rate,
          sent_at
        FROM campaigns 
        WHERE sent_at >= ? AND sent_at <= ?
        ORDER BY open_rate DESC
        LIMIT 5
      `, [startDate, now])

      let timeGroup = 'DATE(sent_at)'
      if (period === '3m' || period === '6m' || period === '1y') {
        timeGroup = 'DATE_FORMAT(sent_at, "%Y-%u")'
      }

      const [chartData] = await connection.execute(`
        SELECT 
          ${timeGroup} as date,
          COUNT(*) as campaigns,
          COALESCE(SUM(recipients_count), 0) as emailsSent,
          COALESCE(SUM(opens_count), 0) as emailsOpened,
          COALESCE(SUM(clicks_count), 0) as clicks,
          COALESCE(AVG(
            CASE 
              WHEN recipients_count > 0 
              THEN (opens_count / recipients_count) * 100 
              ELSE 0 
            END
          ), 0) as openRate,
          COALESCE(AVG(
            CASE 
              WHEN recipients_count > 0 
              THEN (clicks_count / recipients_count) * 100 
              ELSE 0 
            END
          ), 0) as clickRate
        FROM campaigns 
        WHERE sent_at >= ? AND sent_at <= ?
        GROUP BY ${timeGroup}
        ORDER BY date ASC
      `, [startDate, now])

      const current = currentStats[0]
      const previous = previousStats[0]
      const currentUnsub = unsubscribeStats[0]
      const previousUnsub = previousUnsubscribeStats[0]

      const campaignsGrowth = previous.totalCampaigns > 0
        ? ((current.totalCampaigns - previous.totalCampaigns) / previous.totalCampaigns) * 100
        : 0

      const openRateGrowth = previous.openRate > 0
        ? current.openRate - previous.openRate
        : 0

      const clickRateGrowth = previous.clickRate > 0
        ? current.clickRate - previous.clickRate
        : 0

      const unsubscribeGrowth = previousUnsub.unsubscribeCount > 0
        ? ((currentUnsub.unsubscribeCount - previousUnsub.unsubscribeCount) / previousUnsub.unsubscribeCount) * 100
        : 0

      const estimatedRevenue = current.totalClicks * 2.50
      const estimatedCost = current.totalCampaigns * 5
      const roi = estimatedCost > 0 ? ((estimatedRevenue - estimatedCost) / estimatedCost) * 100 : 0

      const analyticsData = {
        totalCampaigns: current.totalCampaigns,
        campaignsGrowth,
        openRate: current.openRate,
        openRateGrowth,
        clickRate: current.clickRate,
        clickRateGrowth,
        unsubscribeCount: currentUnsub.unsubscribeCount,
        unsubscribeGrowth,
        totalEmailsSent: current.totalEmailsSent,
        totalEmailsOpened: current.totalEmailsOpened,
        totalClicks: current.totalClicks,
        bounceRate: current.bounceRate,
        revenue: estimatedRevenue,
        roi,
        topCampaigns,
        emailDistribution: {
          sent: current.totalEmailsSent,
          opened: current.totalEmailsOpened,
          clicked: current.totalClicks,
          bounced: current.totalBounces
        }
      }

      return {
        success: true,
        data: analyticsData,
        chartData,
        period
      }

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des analytics:', error)
    return {
      success: false,
      message: 'Erreur lors de la récupération des données analytics',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }
  }
}) 