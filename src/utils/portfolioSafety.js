// Sécurité globale pour éviter les erreurs ReferenceError
import { defaultPortfolioData } from '../contexts/PortfolioContext'

// Export global de portfolioData pour éviter les références non définies
if (typeof window !== 'undefined') {
  window.portfolioData = defaultPortfolioData
  window.defaultPortfolioData = defaultPortfolioData
}

// Vérification de sécurité globale
if (typeof portfolioData === 'undefined') {
  if (typeof window !== 'undefined') {
    window.portfolioData = defaultPortfolioData
  }
}

// Export pour les modules
export { defaultPortfolioData as portfolioData }
export default defaultPortfolioData

// Log de sécurité
console.log('Portfolio safety initialized:', {
  hasDefaultData: !!defaultPortfolioData,
  sectionsCount: defaultPortfolioData?.sections?.length || 0
})