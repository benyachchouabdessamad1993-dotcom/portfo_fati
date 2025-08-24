import React, { useState, useCallback } from 'react'
import { 
  AcademicCapIcon, 
  MapPinIcon, 
  EnvelopeIcon,
  PhoneIcon,
  ArrowDownIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

const HeroSection = ({ profile }) => {
  const [imageError, setImageError] = useState(false)
  const [imageRetryCount, setImageRetryCount] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  // Fonction pour gérer les erreurs d'image
  const handleImageError = useCallback(() => {
    if (imageRetryCount < 3) {
      setImageRetryCount(prev => prev + 1)
      // Augmenter le délai entre les tentatives
      setTimeout(() => {
        setImageError(false)
      }, Math.pow(2, imageRetryCount) * 1000) // 1s, 2s, 4s
    } else {
      setImageError(true)
    }
  }, [imageRetryCount])
  
  // Fonction pour obtenir l'URL de l'image avec retry
  const getImageUrlWithRetry = (imagePath) => {
    const baseUrl = getImageUrl(imagePath)
    if (imageRetryCount > 0) {
      return `${baseUrl}?t=${Date.now()}`
    }
    return baseUrl
  }

  const getImageUrl = (photoUrl) => {
    if (!photoUrl || photoUrl.trim() === '' || photoUrl === 'null') {
      return null
    }
    
    // Si c'est une URL locale (commence par /uploads/), ajouter le cache-busting
    if (photoUrl.startsWith('/uploads/')) {
      return `${photoUrl}?t=${Date.now()}`
    }
    
    // Pour les URLs externes, vérifier s'il y a déjà des paramètres
    const separator = photoUrl.includes('?') ? '&' : '?'
    return `${photoUrl}${separator}t=${Date.now()}`
  }

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="container-max relative z-10">
        <div className="min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            {/* Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-200 border border-white/20">
                  <AcademicCapIcon className="h-4 w-4 mr-2" />
                  Enseignant Chercheur
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="block text-white">Dr. {profile.prenom}</span>
                  <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {profile.nom}
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-blue-100 font-light max-w-2xl">
                  {profile.grade}
                </p>
              </div>

              <div 
                className="text-lg text-blue-50 leading-relaxed max-w-2xl"
                dangerouslySetInnerHTML={{ 
                  __html: profile.mission || `${profile.fonction} spécialisée dans les technologies de l'information et de la communication pour l'éducation et la formation.` 
                }} 
              />
              
              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                <div className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <EnvelopeIcon className="h-5 w-5 text-blue-300" />
                  <span className="text-blue-100 text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <PhoneIcon className="h-5 w-5 text-blue-300" />
                  <span className="text-blue-100 text-sm">{profile.gsm}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a 
                  href="#contact" 
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Me Contacter
                  <ArrowDownIcon className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
                </a>
                <a 
                  href="#research" 
                  className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
                >
                  Mes Recherches
                </a>
              </div>
            </div>

            {/* Profile Image - VERSION MODERNISÉE */}
            <div className="flex justify-center lg:justify-end animate-slide-up">
              <div className="relative group">
                {/* Arrière-plan animé sophistiqué */}
                <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/30 via-purple-500/20 to-cyan-500/30 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-700 animate-pulse"></div>
                
                {/* Cercles décoratifs flottants */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-blue-400/40 to-cyan-400/40 rounded-full blur-2xl animate-float"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-float-delayed"></div>
                <div className="absolute top-8 -left-8 w-16 h-16 bg-gradient-to-br from-emerald-400/40 to-teal-400/40 rounded-full blur-xl animate-float-slow"></div>
                
                {/* Conteneur principal de l'image */}
                <div className="relative w-80 h-80 lg:w-[420px] lg:h-[420px] group-hover:scale-105 transition-transform duration-500">
                  {/* Bordure externe avec effet glassmorphism */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-[2.5rem] backdrop-blur-sm border border-white/30 shadow-2xl"></div>
                  
                  {/* Bordure interne */}
                  <div className="absolute inset-2 bg-gradient-to-br from-white/15 to-white/5 rounded-[2rem] border border-white/20">
                    {/* Image principale */}
                    <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative">
                      {profile.photo && !imageError ? (
                        <img
                          src={getImageUrlWithRetry(profile.photo)}
                          alt={`${profile.prenom} ${profile.nom}`}
                          className="w-full h-full object-cover object-center filter brightness-105 contrast-105 group-hover:scale-110 transition-transform duration-700"
                          onError={handleImageError}
                          onLoad={() => {
                            console.log('Image chargée avec succès')
                            setImageError(false)
                            setImageRetryCount(0)
                            setImageLoaded(true)
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                          <UserCircleIcon className="w-32 h-32 text-slate-400" />
                        </div>
                      )}
                      
                      {/* Overlay subtil */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                  
                  {/* Badge flottant modernisé */}
                  <div className="absolute -bottom-6 -right-6 group-hover:-bottom-8 group-hover:-right-8 transition-all duration-500">
                    <div className="relative">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-60"></div>
                      
                      {/* Badge principal */}
                      <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-4 shadow-2xl border border-white/30 backdrop-blur-sm">
                        <AcademicCapIcon className="h-8 w-8 text-white drop-shadow-lg" />
                      </div>
                      
                      {/* Indicateur de statut */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Badges informatifs flottants */}
                  <div className="absolute -top-4 -left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/50">
                      <span className="text-sm font-semibold text-slate-700">Dr. {profile.prenom}</span>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 left-8 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                    <div className="bg-gradient-to-r from-blue-500/90 to-cyan-500/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/30">
                      <span className="text-sm font-semibold text-white">{profile.grade}</span>
                    </div>
                  </div>
                </div>
                
                {/* Particules flottantes */}
                <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-ping"></div>
                <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-40 animate-ping animation-delay-1000"></div>
                <div className="absolute top-1/2 right-1/6 w-1 h-1 bg-cyan-400 rounded-full opacity-50 animate-ping animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center space-y-2 text-white/60">
            <span className="text-sm font-medium">Découvrir</span>
            <ArrowDownIcon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection