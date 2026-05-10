const API_BASE_URL = '/api'

export async function createBoard() {
  const response = await fetch(`${API_BASE_URL}/board`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  if (!response.ok) throw new Error('Ошибка при создании доски')
  return await response.json()
}

export async function getBoards() {
  const response = await fetch(`${API_BASE_URL}/boards`)
  if (!response.ok) throw new Error('Ошибка при получении досок')
  return await response.json()
}

export async function getBoard(id) {
  const response = await fetch(`${API_BASE_URL}/board/${id}`)
  if (!response.ok) throw new Error('Ошибка при получении доски')
  return await response.json()
}

export async function updateBoard(id, data) {
  const response = await fetch(`${API_BASE_URL}/board/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Ошибка при обновлении доски')
  return await response.json()
}