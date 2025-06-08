import { defineStore } from 'pinia'

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    loading: false,
    error: null,
    stats: null,
    newsletterStats: []
  }),
  
  actions: {
    async fetchAnalytics() {
      this.loading = true
      try {
        // In a real app, this would be an API call
        // For demo, we'll generate mock data
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Dashboard summary stats
        this.stats = {
          subscribers: {
            total: 1250,
            active: 1180,
            growth: 5.2  // percentage growth this month
          },
          newsletters: {
            total: 24,
            lastMonth: 3
          },
          engagement: {
            openRate: 78.4,
            clickRate: 24.6
          }
        }
        
        // Newsletter specific stats for the chart
        this.newsletterStats = [
          {
            id: 1,
            title: 'January Newsletter',
            sent: 1100,
            opened: 770,
            clicked: 285
          },
          {
            id: 2,
            title: 'February Newsletter',
            sent: 1150,
            opened: 828,
            clicked: 310
          },
          {
            id: 3, 
            title: 'March Newsletter',
            sent: 1200,
            opened: 900,
            clicked: 342
          },
          {
            id: 4,
            title: 'April Newsletter',
            sent: 1250,
            opened: 981,
            clicked: 375
          }
        ]
        
        this.error = null
      } catch (error) {
        this.error = 'Failed to load analytics data'
        console.error('Error fetching analytics:', error)
      } finally {
        this.loading = false
      }
    },
    
    async getNewsletterPerformance(id) {
      this.loading = true
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Find newsletter or generate mock data
        const stats = this.newsletterStats.find(n => n.id === id) || {
          id: id,
          title: 'Newsletter #' + id,
          sent: 1000 + Math.floor(Math.random() * 300),
          opened: 700 + Math.floor(Math.random() * 200),
          clicked: 250 + Math.floor(Math.random() * 150)
        }
        
        // Add detailed time-based data for charts
        const detailedStats = {
          ...stats,
          timeData: {
            opens: generateTimeSeriesData(7),
            clicks: generateTimeSeriesData(7, 0.4)
          },
          deviceData: {
            desktop: 45 + Math.floor(Math.random() * 10),
            mobile: 40 + Math.floor(Math.random() * 10),
            tablet: 15 - Math.floor(Math.random() * 5)
          },
          linkClicks: [
            { url: 'https://example.com/page1', clicks: 125 + Math.floor(Math.random() * 50) },
            { url: 'https://example.com/page2', clicks: 98 + Math.floor(Math.random() * 50) },
            { url: 'https://example.com/page3', clicks: 76 + Math.floor(Math.random() * 30) },
            { url: 'https://example.com/page4', clicks: 43 + Math.floor(Math.random() * 20) }
          ]
        }
        
        this.error = null
        return detailedStats
      } catch (error) {
        this.error = 'Failed to load newsletter performance data'
        console.error('Error fetching newsletter performance:', error)
        return null
      } finally {
        this.loading = false
      }
    }
  }
})

// Helper to generate time series data for charts
function generateTimeSeriesData(days, factor = 1) {
  const data = []
  const now = new Date()
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - (days - 1) + i)
    
    data.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(50 * factor + Math.random() * 100 * factor)
    })
  }
  
  return data
}