import React from 'react'
import { useForm } from 'react-hook-form'
import { usePortfolio } from '../../contexts/PortfolioContext'
import { useAuth } from '../../contexts/AuthContext'
import WysiwygEditor from '../../components/admin/WysiwygEditor'
import toast from 'react-hot-toast'
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PhotoIcon,
  CloudArrowUpIcon,
  LockClosedIcon,
  SparklesIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  LinkIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const ProfileEditor = () => {
  const { portfolioData, updateProfile, loading } = usePortfolio()
  const { user } = useAuth()
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      ...portfolioData.profile
    }
  })

  const [missionContent, setMissionContent] = React.useState(portfolioData.profile.mission || '')
  const [photoPreview, setPhotoPreview] = React.useState(portfolioData.profile.photo || '')
  const [photoFile, setPhotoFile] = React.useState(null)
  
  // États pour le changement de mot de passe
  const [showPasswordSection, setShowPasswordSection] = React.useState(false)
  const [passwordData, setPasswordData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordLoading, setPasswordLoading] = React.useState(false)

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      // Vérifier la taille du fichier (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('La photo ne doit pas dépasser 2MB')
        return
      }
      
      setPhotoFile(file)
      
      // Créer un aperçu local
      const previewUrl = URL.createObjectURL(file)
      setPhotoPreview(previewUrl)
      
      try {
        // Upload du fichier vers le serveur
        const formData = new FormData()
        formData.append('photo', file)
        
        const response = await fetch('/api/upload/photo', {
          method: 'POST',
          body: formData
        })
        
        const result = await response.json()
        
        if (result.success) {
          // Stocker l'URL du serveur pour la soumission
          setPhotoPreview(result.url)
          toast.success('Photo uploadée avec succès!')
        } else {
          toast.error('Erreur lors de l\'upload: ' + result.error)
        }
      } catch (error) {
        toast.error('Erreur lors de l\'upload de la photo')
        console.error('Upload error:', error)
      }
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères')
      return
    }
    
    setPasswordLoading(true)
    
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          userId: user?.id
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success('Mot de passe modifié avec succès!')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setShowPasswordSection(false)
      } else {
        toast.error(result.error || 'Erreur lors du changement de mot de passe')
      }
    } catch (error) {
      toast.error('Erreur lors du changement de mot de passe')
    } finally {
      setPasswordLoading(false)
    }
  }

  const onSubmit = async (data) => {
    let photoUrl = data.photo
    
    if (photoFile && photoPreview) {
      // Si photoPreview commence par /uploads/, c'est une URL valide du serveur
      if (photoPreview.startsWith('/uploads/')) {
        photoUrl = photoPreview
      } else if (photoPreview.startsWith('data:')) {
        // Vérifier que les données base64 ne sont pas trop volumineuses
        if (photoPreview.length > 1000000) { // 1MB en base64
          toast.error('La photo est trop volumineuse. Veuillez choisir une image plus petite.')
          return
        }
        photoUrl = photoPreview
      } else {
        photoUrl = photoPreview
      }
    } else if (data.photo && data.photo.trim()) {
      photoUrl = data.photo
    } else {
      photoUrl = portfolioData.profile.photo
    }

    const result = await updateProfile({
      ...data,
      photo: photoUrl,
      mission: missionContent
    })
    if (result.success) {
      toast.success('Profil mis à jour avec succès!')
      setPhotoPreview(photoUrl)
    } else {
      toast.error('Erreur lors de la mise à jour du profil')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header moderne */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-3xl mx-6 mt-6 mb-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30"></div>
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl mr-4">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Modifier le profil
                  </h1>
                  <p className="text-blue-100 text-lg">
                    Gérez vos informations personnelles et professionnelles
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    <div>
                      <p className="text-white font-medium">Profil synchronisé</p>
                      <p className="text-blue-100 text-sm">Modifications en temps réel</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Éléments décoratifs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
      </div>

      <div className="px-6 space-y-8">
        {/* Formulaire principal pour le profil */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Informations personnelles */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/60 shadow-lg">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl mr-4">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Informations personnelles</h3>
                <p className="text-gray-600">Vos données personnelles et de contact</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Nom *
                  </label>
                  <input
                    {...register('nom', { required: 'Le nom est requis' })}
                    type="text"
                    className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  />
                  {errors.nom && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center mr-2">!</span>
                      {errors.nom.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Prénom *
                  </label>
                  <input
                    {...register('prenom', { required: 'Le prénom est requis' })}
                    type="text"
                    className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  />
                  {errors.prenom && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center mr-2">!</span>
                      {errors.prenom.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <MapPinIcon className="h-4 w-4 inline mr-2" />
                    Nationalité
                  </label>
                  <input
                    {...register('nationalite')}
                    type="text"
                    className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <GlobeAltIcon className="h-4 w-4 inline mr-2" />
                    Langues parlées
                  </label>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {['Arabe (Natif)', 'Français (Courant)', 'Anglais (Professionnel)'].map((lang, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {lang}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-blue-600">
                      Pour modifier les langues, contactez l'administrateur système.
                    </p>
                  </div>
                </div>
              </div>

              {/* Photo de profil */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <PhotoIcon className="h-4 w-4 inline mr-2" />
                  Photo de profil
                </label>
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    {photoPreview ? (
                      <div className="relative group">
                        <img 
                          src={photoPreview} 
                          alt="Aperçu photo de profil" 
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <PhotoIcon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 border-white shadow-lg">
                        <UserIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <label className="cursor-pointer group">
                      <div className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5">
                        <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                        Choisir une photo
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    
                    {photoFile && (
                      <div className="flex items-center justify-center">
                        <span className="text-sm text-green-600 font-medium flex items-center">
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Photo sélectionnée: {photoFile.name}
                        </span>
                      </div>
                    )}
                    
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start">
                        <SparklesIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-2">Conseils pour votre photo :</p>
                          <ul className="space-y-1 text-blue-700">
                            <li>• Photo professionnelle de haute qualité</li>
                            <li>• Format carré recommandé (1:1)</li>
                            <li>• Taille minimale : 400x400 pixels</li>
                            <li>• Formats acceptés : JPG, PNG, GIF</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informations académiques */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/60 shadow-lg">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mr-4">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Informations académiques</h3>
                <p className="text-gray-600">Votre parcours et position académique</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <AcademicCapIcon className="h-4 w-4 inline mr-2" />
                  Grade
                </label>
                <input
                  {...register('grade')}
                  type="text"
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <BuildingOfficeIcon className="h-4 w-4 inline mr-2" />
                  Fonction
                </label>
                <input
                  {...register('fonction')}
                  type="text"
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Affiliation
                </label>
                <textarea
                  {...register('affiliation')}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm resize-none"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Laboratoire
                </label>
                <textarea
                  {...register('laboratoire')}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm resize-none"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Équipe de recherche
                </label>
                <textarea
                  {...register('equipe')}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Mission et Vision */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/60 shadow-lg">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl mr-4">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Mission et Vision</h3>
                <p className="text-gray-600">Votre vision professionnelle et vos objectifs</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Mission
              </label>
              <div className="bg-white/70 rounded-xl border border-gray-200 overflow-hidden">
                <WysiwygEditor
                  value={missionContent}
                  onChange={setMissionContent}
                  placeholder="Décrivez votre mission professionnelle..."
                  height="150px"
                />
              </div>
            </div>
          </div>

          {/* Liens professionnels */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/60 shadow-lg">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl mr-4">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Liens professionnels</h3>
                <p className="text-gray-600">Vos profils sur les réseaux professionnels</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <svg className="h-4 w-4 inline mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </label>
                <input
                  {...register('linkedin')}
                  type="url"
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <svg className="h-4 w-4 inline mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.586 0H4.414C1.977 0 0 1.977 0 4.414v15.172C0 22.023 1.977 24 4.414 24h15.172C22.023 24 24 22.023 24 19.586V4.414C24 1.977 22.023 0 19.586 0zM8.707 20.482H4.414V9.103h4.293v11.379zM6.56 7.56c-1.377 0-2.491-1.114-2.491-2.491S5.183 2.578 6.56 2.578s2.491 1.114 2.491 2.491S7.937 7.56 6.56 7.56zm13.922 12.922h-4.293v-5.535c0-1.32-.027-3.017-1.838-3.017-1.84 0-2.121 1.437-2.121 2.921v5.631H8.937V9.103h4.121v1.56h.059c.574-1.087 1.974-2.234 4.062-2.234 4.344 0 5.145 2.859 5.145 6.574v5.479z"/>
                  </svg>
                  ResearchGate
                </label>
                <input
                  {...register('researchgate')}
                  type="url"
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  placeholder="https://researchgate.net/profile/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <svg className="h-4 w-4 inline mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Chaîne YouTube
                </label>
                <input
                  {...register('youtube')}
                  type="url"
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-3 bg-white/70 text-gray-700 rounded-xl border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200 font-medium"
              onClick={() => window.location.reload()}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <CheckCircleIcon className="h-5 w-5 mr-2" />
              )}
              Sauvegarder
            </button>
          </div>
        </form>

        {/* Section Sécurité */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/60 shadow-lg">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl mr-4">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Sécurité</h3>
              <p className="text-gray-600">Gestion de votre mot de passe et sécurité du compte</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
            >
              <LockClosedIcon className="h-5 w-5 mr-2" />
              {showPasswordSection ? 'Masquer' : 'Changer le mot de passe'}
            </button>
            
            {showPasswordSection && (
              <form onSubmit={handlePasswordChange} className="space-y-6 bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    minLength="6"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    minLength="6"
                    required
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center"
                  >
                    {passwordLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <ShieldCheckIcon className="h-5 w-5 mr-2" />
                    )}
                    Changer le mot de passe
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordSection(false)
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                    }}
                    className="px-6 py-3 bg-white/70 text-gray-700 rounded-xl border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200 font-medium"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileEditor