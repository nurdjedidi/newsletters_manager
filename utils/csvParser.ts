export function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split('\n')
  if (lines.length === 0) return []

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))

  const result = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
    const obj: any = {}

    headers.forEach((header, index) => {
      obj[header.toLowerCase()] = values[index] || ''
    })

    result.push(obj)
  }

  return result
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

export function validateSubscriberData(data: any): { email: string; name?: string } | null {
  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    return null
  }

  return {
    email: data.email.trim(),
    name: data.name ? data.name.trim() : ''
  }
} 