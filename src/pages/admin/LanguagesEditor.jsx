import React, { useState } from 'react'
import { usePortfolio } from '../../contexts/PortfolioContext'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { 
  PlusIcon,
  TrashIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  SparklesIcon,
  LanguageIcon
} from '@heroicons/react/24/outline'

const LanguagesEditor = () => {
  const { portfolioData, updateProfile, loading } = usePortfolio()
  const [isEditing, setIsEditing] = useState(false)
  
  const existingLanguages = portfolioData.profile.langues || [
    { nom: 'Arabe', color: 'from-blue-500 to-cyan-500' },
    { nom: 'Français', color: 'from-green-500 to-teal-500' },
    { nom: 'Anglais', color: 'from-purple-500 to-pink-500' },
    { nom: 'Espagnol', color: 'from-orange-500 to-red-500' }
  ]
  
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      languages: existingLanguages
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'languages'
  })
  
  const colorOptions = [
    { value: 'from-blue-500 to-cyan-500', label: 'Bleu', preview: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { value: 'from-green-500 to-teal-500', label: 'Vert', preview: 'bg-gradient-to-r from-green-500 to-teal-500' },
    { value: 'from-purple-500 to-pink-500', label: 'Violet', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { value: 'from-orange-500 to-red-500', label: 'Orange', preview: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { value: 'from-indigo-500 to-purple-500', label: 'Indigo', preview: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
    { value: 'from-teal-500 to-blue-500', label: 'Turquoise', preview: 'bg-gradient-to-r from-teal-500 to-blue-500' },
    { value: 'from-pink-500 to-rose-500', label: 'Rose', preview: 'bg-gradient-to-r from-pink-500 to-rose-500' },
    { value: 'from-cyan-500 to-blue-500', label: 'Cyan', preview: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
    { value: 'from-emerald-500 to-green-500', label: 'Émeraude', preview: 'bg-gradient-to-r from-emerald-500 to-green-500' },
    { value: 'from-yellow-500 to-orange-500', label: 'Jaune', preview: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    { value: 'from-red-500 to-pink-500', label: 'Rouge', preview: 'bg-gradient-to-r from-red-500 to-pink-500' },
    { value: 'from-slate-500 to-gray-500', label: 'Gris', preview: 'bg-gradient-to-r from-slate-500 to-gray-500' }
  ]

  const onSubmit = async (data) => {
    try {
      // Filtrer les langues vides et valider
      const validLanguages = data.languages
        .filter(lang => lang.nom && lang.nom.trim() !== '')
        .map(lang => ({
          nom: lang.nom.trim(),
          color: lang.color || 'from-blue-500 to-cyan-500'
        }))
    
      if (validLanguages.length === 0) {
        toast.error('Veuillez ajouter au moins une langue')
        return
      }
    
      // Mettre à jour le profil avec les nouvelles langues
      const result = await updateProfile({
        ...portfolioData.profile,
        langues: validLanguages
      })

      if (result && result.success) {
        toast.success(`${validLanguages.length} langue${validLanguages.length > 1 ? 's' : ''} sauvegardée${validLanguages.length > 1 ? 's' : ''} avec succès!`)
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
      languages: existingLanguages.length > 0 ? existingLanguages : [
        { nom: '', color: 'from-blue-500 to-cyan-500' }
      ]
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset()
  }

  const addNewLanguage = () => {
    append({ nom: '', color: 'from-blue-500 to-cyan-500' })
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-secondary-900 flex items-center">
              <GlobeAltIcon className="h-8 w-8 mr-3 text-primary-600" />
              Gestion des Langues
            </h2>
            <p className="text-secondary-600 mt-2">
              Gérez les langues que vous parlez - {existingLanguages.length} langue{existingLanguages.length > 1 ? 's' : ''} actuellement
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
              {existingLanguages.length > 0 ? 'Modifier les langues' : 'Ajouter des langues'}
            </button>
          </div>
        </div>

        {/* Aperçu des langues existantes */}
        {existingLanguages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {existingLanguages.map((language, index) => (
              <div key={index} className="card p-6 relative group hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  {/* Badge langue avec couleur */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${language.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <LanguageIcon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Nom de la langue */}
                  <h3 className="text-lg font-bold text-secondary-900 mb-2">
                    {language.nom}
                  </h3>
                  
                  {/* Barre décorative */}
                  <div className={`w-12 h-1 bg-gradient-to-r ${language.color} rounded-full mx-auto group-hover:w-16 transition-all duration-300`}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-secondary-50 rounded-lg">
            <GlobeAltIcon className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-600 mb-2">Aucune langue ajoutée</h3>
            <p className="text-secondary-500 mb-6">Commencez par ajouter vos premières langues</p>
            <button
              onClick={handleEdit}
              className="btn-primary"
            >
              Ajouter ma première langue
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
            <GlobeAltIcon className="h-8 w-8 mr-3 text-primary-600" />
            Gérer mes langues
          </h2>
          <p className="text-secondary-600 mt-2">
            Ajoutez ou modifiez les langues que vous parlez
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
        {fields.map((field, index) => (
          <div key={field.id} className="card p-6 relative">
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Supprimer cette langue"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}

            <h3 className="text-lg font-semibold text-secondary-900 mb-6 flex items-center">
              <LanguageIcon className="h-5 w-5 mr-2 text-primary-600" />
              Langue #{index + 1}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nom de la langue */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <span className="text-red-500">*</span> Nom de la langue
                </label>
                <input
                  {...register(`languages.${index}.nom`, { 
                    required: 'Le nom de la langue est requis' 
                  })}
                  type="text"
                  className="input-field"
                  placeholder="Ex: Français, Anglais, Arabe..."
                />
                {errors.languages?.[index]?.nom && (
                  <p className="mt-1 text-sm text-red-600">{errors.languages[index].nom.message}</p>
                )}
              </div>

              {/* Couleur */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-3">
                  Couleur de la langue
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {colorOptions.map((color) => (
                    <label key={color.value} className="cursor-pointer">
                      <input
                        {...register(`languages.${index}.color`)}
                        type="radio"
                        value={color.value}
                        className="sr-only"
                      />
                      <div className={`w-full h-12 rounded-lg ${color.preview} flex items-center justify-center text-white text-xs font-medium hover:scale-105 transition-transform border-2 border-transparent hover:border-secondary-300 ${
                        field.color === color.value ? 'ring-2 ring-primary-500 ring-offset-2' : ''
                      }`}>
                        {color.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Bouton ajouter une langue */}
        <div className="text-center">
          <button
            type="button"
            onClick={addNewLanguage}
            className="inline-flex items-center px-6 py-3 bg-secondary-100 text-secondary-700 font-medium rounded-lg hover:bg-secondary-200 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter une autre langue
          </button>
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
            Sauvegarder mes langues
          </button>
        </div>
      </form>

      {/* Aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2" />
          💡 Guide pour bien gérer vos langues
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h5 className="font-medium mb-2">Conseils :</h5>
            <ul className="space-y-1">
              <li>• Utilisez les noms officiels des langues</li>
              <li>• Choisissez des couleurs distinctes</li>
              <li>• Ordonnez par niveau de maîtrise</li>
              <li>• Le nom de la langue est obligatoire</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Exemples :</h5>
            <ul className="space-y-1">
              <li>• Arabe (langue maternelle)</li>
              <li>• Français (courant)</li>
              <li>• Anglais (professionnel)</li>
              <li>• Espagnol (notions)</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Astuce :</strong> Les langues apparaîtront dans la section "À propos" de votre portfolio avec les couleurs choisies.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LanguagesEditor