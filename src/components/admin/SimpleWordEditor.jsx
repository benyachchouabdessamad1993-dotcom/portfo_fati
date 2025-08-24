import React, { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { 
  DocumentTextIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const SimpleWordEditor = ({ section, onSave, onCancel, loading }) => {
  const [title, setTitle] = useState(section?.title || '')
  const [content, setContent] = useState('')
  const [visible, setVisible] = useState(section?.visible !== false)

  useEffect(() => {
    if (section) {
      setTitle(section.title || '')
      setVisible(section.visible !== false)
      
      // Convertir le contenu selon le type
      if (section.type === 'list' && Array.isArray(section.content)) {
        // Convertir la liste en HTML
        const listHtml = '<ul>' + section.content.map(item => `<li>${item}</li>`).join('') + '</ul>'
        setContent(listHtml)
      } else if (section.type === 'cards') {
        // Convertir les cartes en HTML lisible
        try {
          const cards = Array.isArray(section.content) ? section.content : JSON.parse(section.content || '[]')
          const cardsHtml = cards.map(card => {
            if (typeof card === 'object') {
              return `<div style="border: 1px solid #e5e7eb; padding: 16px; margin: 8px 0; border-radius: 8px;">
                ${card.title ? `<h3><strong>${card.title}</strong></h3>` : ''}
                ${card.description ? `<p>${card.description}</p>` : ''}
                ${card.authors ? `<p><em>Auteurs: ${card.authors}</em></p>` : ''}
                ${card.year ? `<p>Année: ${card.year}</p>` : ''}
                ${card.level ? `<p>Niveau: ${card.level}</p>` : ''}
                ${card.hours ? `<p>Heures: ${card.hours}</p>` : ''}
              </div>`
            }
            return `<p>${String(card)}</p>`
          }).join('')
          setContent(cardsHtml)
        } catch (error) {
          setContent(section.content || '')
        }
      } else {
        setContent(section.content || '')
      }
    }
  }, [section])

  const handleSave = () => {
    if (!title.trim()) {
      alert('Le titre est requis')
      return
    }

    // Pour les sections de type liste, convertir le HTML en tableau
    let finalContent = content
    if (section?.type === 'list') {
      // Extraire les éléments de liste du HTML
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = content
      const listItems = Array.from(tempDiv.querySelectorAll('li')).map(li => li.textContent.trim())
      finalContent = listItems.filter(item => item !== '')
    }

    onSave({
      title: title.trim(),
      content: finalContent,
      visible: visible,
      type: section?.type || 'text'
    })
  }

  // Configuration de l'éditeur comme Word
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link'
  ]

  return (
    <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <div className="flex items-center">
          <DocumentTextIcon className="h-6 w-6 mr-3" />
          <div>
            <h2 className="text-xl font-bold">
              {section ? 'Modifier la section' : 'Nouvelle section'}
            </h2>
            <p className="text-blue-100 text-sm">
              Éditeur simple comme Word
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Contenu */}
      <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
        <div className="space-y-6">
          {/* Titre de la section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DocumentTextIcon className="h-4 w-4 inline mr-1" />
              Titre de la section
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
              placeholder="Ex: À propos de moi, Mes publications..."
            />
          </div>

          {/* Éditeur de contenu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu
              {section?.type === 'list' && (
                <span className="text-blue-600 text-xs ml-2">
                  (Utilisez les puces pour créer une liste)
                </span>
              )}
            </label>
            
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Écrivez votre contenu ici... Utilisez la barre d'outils pour formater le texte comme dans Word."
                style={{
                  height: '400px',
                  backgroundColor: 'white'
                }}
              />
            </div>
          </div>

          {/* Visibilité */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="visible"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="visible" className="text-sm text-gray-700 flex items-center">
              <EyeIcon className="h-4 w-4 mr-2" />
              Afficher cette section sur le site public
            </label>
          </div>

          {/* Guide d'utilisation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center">
              <SparklesIcon className="h-4 w-4 mr-2" />
              💡 Comment utiliser l'éditeur
            </h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• <strong>Formatage :</strong> Utilisez les boutons de la barre d'outils (gras, italique, couleurs...)</p>
              <p>• <strong>Listes :</strong> Cliquez sur les boutons de liste pour créer des puces ou numéros</p>
              <p>• <strong>Titres :</strong> Utilisez le menu déroulant "Header" pour les sous-titres</p>
              <p>• <strong>Liens :</strong> Sélectionnez du texte et cliquez sur le bouton lien</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer avec boutons */}
      <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
        >
          Annuler
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center shadow-lg hover:shadow-xl"
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
  )
}

export default SimpleWordEditor