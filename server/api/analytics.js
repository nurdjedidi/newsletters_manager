export default defineEventHandler(async (event) => {
  // In a real app, this would interact with a database
  // For demo, we'll return mock data
  
  // Get method and route
  const method = event.req.method
  const url = new URL(event.req.url, 'http://localhost')
  const path = url.pathname.replace('/api/analytics', '')
  
  if (method !== 'GET') {
    throw createError({
      statusCode: 405,
      message: 'Method Not Allowed'
    })
  }
  
  // Handle different routes
  if (path === '' || path === '/') {
    // GET /api/analytics
    return {
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
      },
      recent: [
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
    }
  }
  
  // GET /api/analytics/newsletter/:id
  const id = path.replace('/newsletter/', '')
  if (id) {
    // Generate mock detailed analytics for a specific newsletter
    return {
      id: parseInt(id),
      title: `Newsletter ${id}`,
      sent: 1000 + Math.floor(Math.random() * 300),
      opened: 700 + Math.floor(Math.random() * 200),
      clicked: 250 + Math.floor(Math.random() * 150),
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
  }
  
  throw createError({
    statusCode: 404,
    message: 'Not Found'
  })
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