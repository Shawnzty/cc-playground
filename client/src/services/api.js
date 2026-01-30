const API_BASE = import.meta.env.VITE_API_URL || '/api/game'

async function handleResponse(response) {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }
  return data
}

export async function startGame(preferences) {
  const response = await fetch(`${API_BASE}/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ preferences }),
  })
  return handleResponse(response)
}

export async function makeChoice(sessionId, choiceId) {
  const response = await fetch(`${API_BASE}/choose`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sessionId, choiceId }),
  })
  return handleResponse(response)
}

export async function getGameState(sessionId) {
  const response = await fetch(`${API_BASE}/${sessionId}`)
  return handleResponse(response)
}

export async function getGameHistory(sessionId) {
  const response = await fetch(`${API_BASE}/${sessionId}/history`)
  return handleResponse(response)
}
