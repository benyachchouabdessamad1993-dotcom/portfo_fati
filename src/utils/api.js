// Utilitaire centralisé pour les appels API
export const getApiUrl = (endpoint) => {
  // En développement, utiliser le proxy Vite
  if (import.meta.env.DEV) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    return cleanEndpoint
  }
  
  // En production, utiliser l'URL complète
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${cleanBaseUrl}${cleanEndpoint}`
}

// Fonction utilitaire pour parser les réponses JSON de manière sécurisée
export const safeJsonParse = async (response) => {
  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text()
    console.error('Réponse non-JSON reçue:', text.substring(0, 200))
    throw new Error(`Réponse invalide du serveur (${response.status}): ${response.statusText}`)
  }
  return await response.json()
}