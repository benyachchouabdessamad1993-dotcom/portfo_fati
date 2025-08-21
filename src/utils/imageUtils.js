export const getImageUrl = (photoUrl) => {
  if (!photoUrl) return ''
  
  // Si c'est une URL locale (commence par /uploads/), ajouter le cache-busting
  if (photoUrl.startsWith('/uploads/')) {
    return `${photoUrl}?t=${Date.now()}`
  }
  
  // Pour les URLs externes, vérifier s'il y a déjà des paramètres
  const separator = photoUrl.includes('?') ? '&' : '?'
  return `${photoUrl}${separator}t=${Date.now()}`
}