const API_BASE_URL = '/api'

export async function createBoard() {
  const response = await fetch(`${API_BASE_URL}/board`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Ошибка при создании доски')
  }

  const data = await response.json()
  return data
}