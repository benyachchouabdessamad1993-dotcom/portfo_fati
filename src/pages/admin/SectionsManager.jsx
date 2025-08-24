import React, { useState } from 'react'
import { usePortfolio } from '../../contexts/PortfolioContext'
import { 
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentTextIcon,
  ListBulletIcon,
  RectangleStackIcon,
  SparklesIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const SectionsManager = () => {
  const { portfolioData, updateSection, deleteSection, loading } = usePortfolio()
  const [editingSection, setEditingSection] = useState(null)
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    visible: true
  })

  const handleEditSection = (section) => {
    setEditingSection(section.id)
    setEditForm({
      title: section.title,
      content: section.type === 'list' 
        ? (Array.isArray(section.content) ? section.content.join('\n') : '')
        : section.type === 'cards'
          ? (typeof section.content === 'string' ? section.content : JSON.stringify(section.content, null, 2))
          : section.content || '',
      visible: section.visible
    })
  }

  const handleSaveSection = async (sectionId) => {
    try {
      const section = portfolioData.sections.find(s => s.id === sectionId)
      let content = editForm.content

      // Traitement selon le type de section
      if (section.type === 'list') {
        content = editForm.content.split('\n').filter(item => item.trim() !== '')
      } else if (section.type === 'cards') {
        try {
          content = JSON.parse(editForm.content)
        } catch (error) {
          toast.error('Format JSON invalide')
          return
        }
      }

      const result = await updateSection(sectionId, {
        title: editForm.title,
        content: content,
        visible: editForm.visible
      })

      if (result && result.success) {
        toast.success('Section mise à jour avec succès!')
        setEditingSection(null)
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette section ?')) {
      try {
        const result = await deleteSection(sectionId)
        if (result && result.success) {
          toast.success('Section supprimée avec succès!')
        } else {
          toast.error('Erreur lors de la suppression')
        }
      } catch (error) {
        console.error('Erreur:', error)
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  const handleToggleVisibility = async (sectionId, currentVisibility) => {
    try {
      const result = await updateSection(sectionId, { visible: !currentVisibility })
      if (result && result.success) {
        toast.success(`Section ${!currentVisibility ? 'affichée' : 'masquée'}`)
      } else {
        toast.error('Erreur lors de la modification')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la modification')
    }
  }

  const handleCancelEdit = () => {
    setEditingSection(null)
    setEditForm({ title: '', content: '', visible: true })
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'text': return DocumentTextIcon
      case 'list': return ListBulletIcon
      case 'cards': return RectangleStackIcon
      default: return DocumentTextIcon
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'text': return 'Texte'
      case 'list': return 'Liste'
      case 'cards': return 'Cartes'
      default: return 'Inconnu'
    }
  }

  const getContentPreview = (section) => {
    if (section.type === 'list' && Array.isArray(section.content)) {
      return `${section.content.length} élément${section.content.length > 1 ? 's' : ''}`
    } else if (section.type === 'cards') {
      const content = typeof section.content === 'string' 
        ? (() => { try { return JSON.parse(section.content) } catch { return [] } })()
        : section.content
      return Array.isArray(content) ? `${content.length} carte${content.length > 1 ? 's' : ''}` : 'Contenu structuré'
    } else if (section.type === 'text') {
      const textContent = section.content || ''
      return textContent.length > 100 ? `${textContent.substring(0, 100)}...` : textContent
    }
    return 'Contenu vide'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-secondary-900 flex items-center">
            <SparklesIcon className="h-8 w-8 mr-3 text-primary-600" />
            Gestion des Sections
          </h2>
          <p className="text-secondary-600 mt-2">
            Modifiez facilement le contenu de chaque section de votre portfolio
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center"
        >
          <EyeIcon className="h-5 w-5 mr-2" />
          Voir le portfolio
        </a>
      </div>

      <div className="space-y-4">
        {portfolioData.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => {
            const TypeIcon = getTypeIcon(section.type)
            const isEditing = editingSection === section.id

            return (
              <div key={section.id} className="card p-6">
                {!isEditing ? (
                  // Mode affichage
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${
                          section.visible ? 'from-green-500 to-teal-500' : 'from-gray-400 to-gray-500'
                        }`}>
                          <TypeIcon className="h-6 w-6 text-white" />
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold text-secondary-900">
                            {section.title}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-secondary-600">
                              Type: {getTypeLabel(section.type)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              section.visible 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {section.visible ? 'Visible' : 'Masqué'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleVisibility(section.id, section.visible)}
                          className="p-2 text-secondary-600 hover:text-secondary-900 transition-colors"
                          title={section.visible ? 'Masquer' : 'Afficher'}
                        >
                          {section.visible ? (
                            <EyeIcon className="h-5 w-5" />
                          ) : (
                            <EyeSlashIcon className="h-5 w-5" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleEditSection(section)}
                          className="p-2 text-secondary-600 hover:text-primary-600 transition-colors"
                          title="Modifier"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-2 text-secondary-600 hover:text-red-600 transition-colors"
                          title="Supprimer"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Aperçu du contenu */}
                    <div className="mt-4 p-4 bg-secondary-50 rounded-lg">
                      <h4 className="text-sm font-medium text-secondary-700 mb-2">Aperçu du contenu:</h4>
                      <div className="text-sm text-secondary-600">
                        {getContentPreview(section)}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Mode édition
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-secondary-900">
                        Modifier: {section.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-secondary-500">
                          Type: {getTypeLabel(section.type)}
                        </span>
                      </div>
                    </div>

                    {/* Titre */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Titre de la section
                      </label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="input-field"
                        placeholder="Titre de la section"
                      />
                    </div>

                    {/* Contenu selon le type */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Contenu
                        {section.type === 'list' && (
                          <span className="text-xs text-secondary-500 ml-2">
                            (Un élément par ligne)
                          </span>
                        )}
                        {section.type === 'cards' && (
                          <span className="text-xs text-secondary-500 ml-2">
                            (Format JSON)
                          </span>
                        )}
                      </label>
                      
                      {section.type === 'text' ? (
                        <textarea
                          value={editForm.content}
                          onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                          rows={6}
                          className="input-field"
                          placeholder="Saisissez votre contenu ici..."
                        />
                      ) : section.type === 'list' ? (
                        <textarea
                          value={editForm.content}
                          onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                          rows={8}
                          className="input-field"
                          placeholder="Élément 1&#10;Élément 2&#10;Élément 3..."
                        />
                      ) : (
                        <div>
                          <textarea
                            value={editForm.content}
                            onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                            rows={12}
                            className="input-field font-mono text-sm"
                            placeholder={`Exemple pour ${section.id}:
[
  {
    "id": 1,
    "title": "Titre",
    "description": "Description"
  }
]`}
                          />
                          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-blue-800 text-sm">
                              <strong>Format JSON requis.</strong> Assurez-vous que la syntaxe est correcte.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Visibilité */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editForm.visible}
                        onChange={(e) => setEditForm({ ...editForm, visible: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-secondary-700">
                        Afficher cette section sur le site public
                      </label>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex justify-end space-x-4 pt-4 border-t border-secondary-200">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="btn-secondary"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveSection(section.id)}
                        disabled={loading}
                        className="btn-primary flex items-center"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                        )}
                        Sauvegarder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
      </div>

      {/* Message si aucune section */}
      {portfolioData.sections.length === 0 && (
        <div className="text-center py-16 bg-secondary-50 rounded-lg">
          <DocumentTextIcon className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary-600 mb-2">Aucune section disponible</h3>
          <p className="text-secondary-500">Les sections apparaîtront ici une fois créées.</p>
        </div>
      )}

      {/* Guide d'utilisation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2" />
          💡 Guide d'utilisation
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <h5 className="font-medium mb-2">Sections Texte :</h5>
            <ul className="space-y-1">
              <li>• Contenu libre en HTML</li>
              <li>• Formatage possible</li>
              <li>• Idéal pour descriptions</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Sections Liste :</h5>
            <ul className="space-y-1">
              <li>• Un élément par ligne</li>
              <li>• Affichage en puces</li>
              <li>• Idéal pour énumérations</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Sections Cartes :</h5>
            <ul className="space-y-1">
              <li>• Format JSON requis</li>
              <li>• Structure complexe</li>
              <li>• Idéal pour données structurées</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionsManager