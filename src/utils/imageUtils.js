export const getImageUrl = (photoUrl) => {
  // Vérifier si photoUrl existe et n'est pas vide
  if (!photoUrl || photoUrl.trim() === '') {
    console.warn('URL de photo vide ou undefined')
    return ''
  }
  
  // Si c'est une URL locale (commence par /uploads/), ajouter le cache-busting
  if (photoUrl.startsWith('/uploads/')) {
    return `${photoUrl}?t=${Date.now()}`
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