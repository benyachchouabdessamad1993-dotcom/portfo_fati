import React, { useState } from 'react'
import { usePortfolio } from '../../contexts/PortfolioContext'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { 
  PlusIcon,
  TrashIcon,
  BeakerIcon,
  CheckCircleIcon,
  PencilIcon,
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const ResearchEditor = () => {
  const { portfolioData, updateSection, loading } = usePortfolio()
  const [isEditing, setIsEditing] = useState(false)
  
  const researchSection = portfolioData.sections.find(section => section.id === 'axes-recherche')
  const existingResearch = researchSection?.content || []
  
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      researchAreas: Array.isArray(existingResearch) ? existingResearch : ['']
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'researchAreas'
  })

  const onSubmit = async (data) => {
    try {
      const validResearchAreas = data.researchAreas.filter(area => area.trim() !== '')
    
      if (validResearchAreas.length === 0) {
        toast.error('Veuillez ajouter au moins un axe de recherche')
        return
      }
    
      const result = await updateSection('axes-recherche', {
        title: 'Axes de Recherche',
        type: 'list',
        content: validResearchAreas,
        visible: true,
        order: 3
      })

      if (result.success) {
        toast.success(`${validResearchAreas.length} axe${validResearchAreas.length > 1 ? 's' : ''} de recherche sauvegardé${validResearchAreas.length > 1 ? 's' : ''} avec succès!`)
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
    reset({
      researchAreas: Array.isArray(existingResearch) && existingResearch.length > 0 
        ? existingResearch 
        : ['']
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset()
  }

  const addNewResearchArea = () => {
    append('')
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-secondary-900 flex items-center">
              <BeakerIcon className="h-8 w-8 mr-3 text-primary-600" />
              Gestion des Axes de Recherche
            </h2>
            <p className="text-secondary-600 mt-2">
              Gérez vos domaines de recherche - {Array.isArray(existingResearch) ? existingResearch.length : 0} axe{Array.isArray(existingResearch) && existingResearch.length > 1 ? 's' : ''} actuellement
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
              <PlusIcon className="h-5 w-5 mr-2" />
              {Array.isArray(existingResearch) && existingResearch.length > 0 ? 'Modifier les axes' : 'Ajouter des axes'}
            </button>
          </div>
        </div>

        {/* Aperçu des axes existants */}
        {Array.isArray(existingResearch) && existingResearch.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {existingResearch.map((area, index) => (
              <div key={index} className="card p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-3"></div>
                  <span className="text-secondary-900 font-medium">{area}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-secondary-50 rounded-lg">
            <BeakerIcon className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-600 mb-2">Aucun axe de recherche ajouté</h3>
            <p className="text-secondary-500 mb-6">Commencez par ajouter vos premiers axes de recherche</p>
            <button
              onClick={handleEdit}
              className="btn-primary"
            >
              Ajouter mon premier axe
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-secondary-900 flex items-center">
            <BeakerIcon className="h-8 w-8 mr-3 text-primary-600" />
            Gérer mes axes de recherche
          </h2>
          <p className="text-secondary-600 mt-2">
            Ajoutez ou modifiez vos domaines de recherche
          </p>
        </div>
        <button
          onClick={handleCancel}
          className="p-2 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-lg transition-colors"
          title="Fermer"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-6 flex items-center">
            <BeakerIcon className="h-5 w-5 mr-2 text-primary-600" />
            Axes de recherche
          </h3>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                <input
                  {...register(`researchAreas.${index}`, { 
                    required: index === 0 ? 'Au moins un axe de recherche est requis' : false 
                  })}
                  type="text"
                  className="input-field flex-1"
                  placeholder={`Axe de recherche ${index + 1}`}
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            
            {errors.researchAreas?.[0] && (
              <p className="text-sm text-red-600">{errors.researchAreas[0].message}</p>
            )}
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={addNewResearchArea}
              className="inline-flex items-center px-4 py-2 bg-secondary-100 text-secondary-700 font-medium rounded-lg hover:bg-secondary-200 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter un axe de recherche
            </button>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <CheckCircleIcon className="h-4 w-4 mr-2" />
            )}
            Sauvegarder mes axes de recherche
          </button>
        </div>
      </form>

      {/* Aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2" />
          💡 Guide pour vos axes de recherche
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h5 className="font-medium mb-2">Conseils :</h5>
            <ul className="space-y-1">
              <li>• Utilisez des termes techniques précis</li>
              <li>• Organisez par ordre d'importance</li>
              <li>• Soyez spécifique dans vos domaines</li>
              <li>• Au moins un axe est obligatoire</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Exemples :</h5>
            <ul className="space-y-1">
              <li>• Réseaux Informatiques</li>
              <li>• Intelligence Artificielle</li>
              <li>• Cybersécurité</li>
              <li>• E-learning et TICE</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResearchEditor