import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import SimpleWordEditor from './SimpleWordEditor'
import { 
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  PhotoIcon,
  LinkIcon
} from '@heroicons/react/24/outline'

const SimpleEditor = ({ section, onSave, onCancel, loading }) => {
  const [activeTab, setActiveTab] = useState('content')

  // Helper function to get initial content for editor
  const getInitialContentForEditor = (section) => {
    if (!section) return ''
    
    if (section.type === 'cards') {
      // Pour les cards, convertir en JSON formaté
      try {
        return JSON.stringify(section.content, null, 2)
      } catch (error) {
        return '[]'
      }
    }
    
    if (section.type === 'list') {
      return '' // Les listes utilisent le système items
    }
    
    return section.content || ''
  }

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: section?.title || '',
      content: getInitialContentForEditor(section),
      visible: section?.visible !== false,
      items: Array.isArray(section?.content) ? section.content : ['']
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const watchType = section?.type || 'text'

  const onSubmit = (data) => {
    let content = data.content

    if (watchType === 'list') {
      content = data.items.filter(item => item.trim() !== '')
    } else if (watchType === 'cards') {
      // Pour les sections cards, essayer de parser le JSON du contenu
      try {
        if (typeof data.content === 'string' && data.content.trim()) {
          content = JSON.parse(data.content)
        } else {
          content = section?.content || []
        }
      } catch (error) {
        console.error('Erreur de parsing JSON:', error)
        // En cas d'erreur, garder le contenu original
        content = section?.content || []
        // Optionnel: afficher un message d'erreur à l'utilisateur
        alert('Format JSON invalide. Veuillez vérifier la syntaxe.')
        return // Empêcher la sauvegarde
      }
    } else if (watchType === 'text') {
      // Pour les sections text, utiliser directement le contenu
      content = data.content || ''
    }

    onSave({
      title: data.title,
      type: watchType,
      content,
      visible: data.visible
    })
  }

  const handleContentChange = (value) => {
    setValue('content', value)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-secondary-900">
          {section ? `Modifier: ${section.title}` : 'Nouvelle section'}
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-secondary-500">
            Type: {watchType === 'text' ? 'Texte' : watchType === 'list' ? 'Liste' : 'Cartes'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        {/* Titre de la section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            <DocumentTextIcon className="h-4 w-4 inline mr-1" />
            Titre de la section
          </label>
          <input
            {...register('title', { required: 'Le titre est requis' })}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg font-medium"
            placeholder="Ex: À propos de moi, Mes publications..."
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Contenu selon le type */}
        {watchType === 'text' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Contenu
            </label>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 text-sm">
                <strong>Utilisez l'éditeur Word ci-dessus</strong> pour formater votre contenu avec une interface simple et intuitive.
              </p>
            </div>
            <textarea
              {...register('content')}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              placeholder="Ou saisissez directement votre contenu ici..."
            />
          </div>
        )}

        {watchType === 'list' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Éléments de la liste
            </label>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <input
                      {...register(`items.${index}`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={`Élément ${index + 1}`}
                    />
                  </div>
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
              <button
                type="button"
                onClick={() => append('')}
                className="flex items-center text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Ajouter un élément
              </button>
            </div>
          </div>
        )}

        {watchType === 'cards' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Contenu structuré (JSON)
            </label>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 text-sm">
                <strong>Format JSON requis.</strong> Exemples de structures :
              </p>
              <div className="mt-2 text-xs text-blue-700">
                <p><strong>Publications :</strong> [{"{"}"id": 1, "title": "Titre", "authors": "Auteurs", "year": "2023"{"}"}]</p>
                <p><strong>Cours :</strong> [{"{"}"id": 1, "title": "Nom du cours", "level": "Master", "hours": "40h", "description": "Description", "color": "from-blue-500 to-cyan-500"{"}"}]</p>
              </div>
            </div>
            <textarea
              {...register('content')}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
              placeholder={`Exemple pour cours:
[
  {
    "id": 1,
    "title": "Réseaux Informatiques",
    "level": "Master",
    "hours": "40h",
    "description": "Concepts fondamentaux des réseaux",
    "color": "from-blue-500 to-cyan-500"
  }
]`}
            />
          </div>
        )}

        {/* Visibilité */}
        <div className="mb-6">
          <div className="flex items-center">
            <input
              {...register('visible')}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-secondary-700">
              Afficher cette section sur le site public
            </label>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : null}
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  )
}

export default SimpleEditor