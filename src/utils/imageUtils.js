export const getImageUrl = (photoUrl) => {
  // Vérifier si photoUrl existe et n'est pas vide
  if (!photoUrl || photoUrl.trim() === '' || photoUrl === 'null' || photoUrl === 'undefined') {
    return null // Retourner null au lieu d'une chaîne vide
  }
  
  // Si c'est une URL locale (commence par /uploads/), ajouter l'URL du serveur en production
  if (photoUrl.startsWith('/uploads/')) {
    // En production, utiliser l'URL complète du serveur backend
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    return `${baseUrl}${photoUrl}?t=${Date.now()}`
  }
  
  // Si c'est une URL complète (http/https), l'utiliser telle quelle avec cache-busting
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    const separator = photoUrl.includes('?') ? '&' : '?'
    return `${photoUrl}${separator}t=${Date.now()}`
  }
  
  // Pour les URLs relatives, ajouter le cache-busting
  const separator = photoUrl.includes('?') ? '&' : '?'
  return `${photoUrl}${separator}t=${Date.now()}`
}