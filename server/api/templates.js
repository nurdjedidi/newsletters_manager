export default defineEventHandler(async (event) => {
  // In a real app, this would interact with a database
  // For demo, we'll return mock data
  
  // Get method and route
  const method = event.req.method
  const url = new URL(event.req.url, 'http://localhost')
  const path = url.pathname.replace('/api/templates', '')
  const id = path.replace('/', '')
  
  // Handle different HTTP methods
  switch (method) {
    case 'GET':
      // GET /api/templates
      if (!id) {
        return [
          {
            id: 1,
            name: 'Simple Newsletter',
            description: 'A clean, simple newsletter template',
            thumbnail: 'https://picsum.photos/id/180/300/200',
            category: 'general',
            createdAt: '2024-01-15T12:00:00Z'
          },
          {
            id: 2,
            name: 'Monthly Update',
            description: 'Perfect for monthly company updates',
            thumbnail: 'https://picsum.photos/id/24/300/200',
            category: 'business',
            createdAt: '2024-01-20T12:00:00Z'
          },
          {
            id: 3,
            name: 'Product Announcement',
            description: 'Showcase new products or features',
            thumbnail: 'https://picsum.photos/id/3/300/200',
            category: 'product',
            createdAt: '2024-02-01T12:00:00Z'
          },
          {
            id: 4,
            name: 'Event Invitation',
            description: 'Invite your subscribers to events',
            thumbnail: 'https://picsum.photos/id/42/300/200',
            category: 'event',
            createdAt: '2024-02-15T12:00:00Z'
          }
        ]
      }
      
      // GET /api/templates/:id
      return {
        id: parseInt(id),
        name: `Template ${id}`,
        description: `Description for template ${id}`,
        content: `<h1>Template ${id}</h1><p>This is a sample template with ID ${id}.</p><p>You can customize this content for your newsletter.</p>`,
        category: ['general', 'business', 'product', 'event'][parseInt(id) % 4],
        createdAt: new Date().toISOString()
      }
      
    case 'POST':
      // Handle create template
      const body = await readBody(event)
      
      return {
        id: Date.now(),
        ...body,
        createdAt: new Date().toISOString()
      }
      
    case 'PUT':
      // Handle update template
      if (!id) {
        throw createError({
          statusCode: 400,
          message: 'Missing template ID'
        })
      }
      
      const updateBody = await readBody(event)
      
      return {
        id: parseInt(id),
        ...updateBody,
        updatedAt: new Date().toISOString()
      }
      
    case 'DELETE':
      // Handle delete template
      if (!id) {
        throw createError({
          statusCode: 400,
          message: 'Missing template ID'
        })
      }
      
      return { success: true, id: parseInt(id) }
      
    default:
      throw createError({
        statusCode: 405,
        message: 'Method Not Allowed'
      })
  }
})