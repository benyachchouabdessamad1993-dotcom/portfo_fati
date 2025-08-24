import React, { useState } from 'react'
import { usePortfolio } from '../../contexts/PortfolioContext'
import { useForm } from 'react-hook-form'
import WysiwygEditor from '../../components/admin/WysiwygEditor'
import toast from 'react-hot-toast'
import { 
  UserIcon,
  SparklesIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

const AboutEditor = () => {
  const { portfolioData, updateSection, loading } = usePortfolio()
  const [isEditing, setIsEditing] = useState(false)
  
  const aboutSection = portfolioData.sections.find(section => section.id === 'a-propos')
  const existingContent = aboutSection?.content || ''
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: aboutSection?.title || 'À Propos',
      visible: aboutSection?.visible !== false
    }
  })

  const [aboutContent, setAboutContent] = useState(existingContent)

  const onSubmit = async (data) => {
    try {
      if (!aboutContent.trim()) {
        toast.error('Veuillez ajouter du contenu à la section À propos')
        return
      }
    
      const result = await updateSection('a-propos', {
        title: data.title,
        type: 'text',
        content: aboutContent,
        visible: data.visible,
        order: 1.5
      })

      if (result.success) {
        toast.success('Section À propos sauvegardée avec succès!')
        setIsEditing(false)
      } else {
        toast.error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Une erreur est survenue')
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setAboutContent(existingContent)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setAboutContent(existingContent)
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-secondary-900 flex items-center">
              <UserIcon className="h-8 w-8 mr-3 text-primary-600" />
              Section À Propos
            </h2>
            <p className="text-secondary-600 mt-2">
              Gérez le contenu de votre section À propos qui apparaît sur votre portfolio
            </p>
          </div>
          <div className="flex space-x-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center"
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              Voir sur le site
            </a>
            <button
              onClick={handleEdit}
              className="btn-primary flex items-center"
            >
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              {existingContent ? 'Modifier le contenu' : 'Ajouter du contenu'}
            </button>
          </div>
        </div>

        {/* Aperçu du contenu existant */}
        {existingContent ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/60 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl mr-4">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Aperçu du contenu</h3>
                <p className="text-gray-600">Contenu actuel de votre section À propos</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200">
              <div 
                className="prose prose-lg max-w-none text-slate-700"
                dangerouslySetInnerHTML={{ __html: existingContent }}
              />
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <InformationCircleIcon className="h-4 w-4 mr-2" />
                Dernière modification : {aboutSection?.updated_at ? new Date(aboutSection.updated_at).toLocaleDateString('fr-FR') : 'Non définie'}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                aboutSection?.visible 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {aboutSection?.visible ? '✓ Visible sur le site' : '○ Masqué'}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-secondary-50 rounded-lg">
            <UserIcon className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-600 mb-2">Section À propos vide</h3>
            <p className="text-secondary-500 mb-6">Ajoutez du contenu pour présenter votre parcours et votre expertise</p>
            <button
              onClick={handleEdit}
              className="btn-primary"
            >
              Ajouter du contenu
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header moderne */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-700 rounded-3xl mx-6 mt-6 mb-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-cyan-600/30"></div>
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl mr-4">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Modifier la section À propos
                  </h1>
                  <p className="text-blue-100 text-lg">
                    Personnalisez le contenu de votre présentation
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
                      <p className="text-white font-medium">Éditeur actif</p>
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
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-400/20 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
      </div>

      <div className="px-6 space-y-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Configuration de la section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/60 shadow-lg">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mr-4">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Configuration de la section</h3>
                <p className="text-gray-600">Paramètres généraux de votre section À propos</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Titre de la section
                </label>
                <input
                  {...register('title', { required: 'Le titre est requis' })}
                  type="text"
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  placeholder="Ex: À Propos, Mon Parcours..."
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center mr-2">!</span>
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  {...register('visible')}
                  type="checkbox"
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-3 text-sm font-medium text-gray-700">
                  <EyeIcon className="h-4 w-4 inline mr-2" />
                  Afficher cette section sur le portfolio public
                </label>
              </div>
            </div>
          </div>

          {/* Éditeur de contenu */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/60 shadow-lg">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl mr-4">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Contenu de la section</h3>
                <p className="text-gray-600">Rédigez votre présentation personnelle</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Votre présentation
              </label>
              <div className="bg-white/70 rounded-xl border border-gray-200 overflow-hidden">
                <WysiwygEditor
                  value={aboutContent}
                  onChange={setAboutContent}
                  placeholder="Présentez-vous : votre parcours, vos passions, votre vision professionnelle..."
                  height="300px"
                />
              </div>
              <div className="mt-3 text-sm text-gray-500">
                💡 <strong>Conseils :</strong> Parlez de votre parcours, vos motivations, votre vision professionnelle, vos centres d'intérêt...
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-white/70 text-gray-700 rounded-xl border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200 font-medium"
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
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              )}
              Sauvegarder la section
            </button>
          </div>
        </form>

        {/* Guide d'utilisation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2" />
            💡 Guide pour votre section À propos
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h5 className="font-medium mb-2">Contenu suggéré :</h5>
              <ul className="space-y-1">
                <li>• Votre parcours académique et professionnel</li>
                <li>• Vos motivations et passions</li>
                <li>• Votre vision de l'enseignement et de la recherche</li>
                <li>• Vos objectifs et projets futurs</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">Conseils de rédaction :</h5>
              <ul className="space-y-1">
                <li>• Utilisez un ton personnel et authentique</li>
                <li>• Structurez avec des paragraphes courts</li>
                <li>• Mettez en valeur vos points forts</li>
                <li>• Restez professionnel mais accessible</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Astuce :</strong> Cette section apparaîtra dans la partie "À propos" de votre portfolio, juste après votre photo et vos informations de base.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutEditor