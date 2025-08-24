import React, { useState, useContext } from 'react'
import { PortfolioContext } from '../../contexts/PortfolioContext'
import { 
  DocumentTextIcon,
  AcademicCapIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ShieldCheckIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'

const PublicationsEditor = () => {
  const { portfolioData, updatePortfolioData } = useContext(PortfolioContext)
  const [activeTab, setActiveTab] = useState('reseauxSecurite')
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    journal: '',
    year: '',
    type: '',
    pages: '',
    conference: '',
    link: ''
  })

  const publicationsSection = portfolioData.sections.find(section => section.id === 'publications')
  const publicationsData = publicationsSection?.content || {
    reseauxSecurite: {
      title: "Réseaux et Sécurité",
      icon: "ShieldCheckIcon",
      color: "from-red-500 to-pink-500",
      articles: [],
      communications: []
    },
    elearningIA: {
      title: "E-learning et Intelligence Artificielle",
      icon: "BeakerIcon", 
      color: "from-blue-500 to-cyan-500",
      articles: [],
      communications: []
    }
  }

  const domains = [
    { key: 'reseauxSecurite', label: 'Réseaux et Sécurité', icon: ShieldCheckIcon },
    { key: 'elearningIA', label: 'E-learning et IA', icon: BeakerIcon }
  ]

  const publicationTypes = [
    'SCOPUS',
    'Web of Science', 
    'IEEE',
    'Book Chapter',
    'Article de journal',
    'ESCI',
    'Thomson/Web of Sciences'
  ]

  const handleAddItem = (domain, type) => {
    setEditingItem({ domain, type, isNew: true })
    setFormData({
      title: '',
      authors: '',
      journal: type === 'articles' ? '' : undefined,
      conference: type === 'communications' ? '' : undefined,
      year: new Date().getFullYear().toString(),
      type: type === 'articles' ? 'SCOPUS' : undefined,
      pages: '',
      link: ''
    })
  }

  const handleEditItem = (domain, type, item) => {
    setEditingItem({ domain, type, isNew: false, id: item.id })
    setFormData({
      title: item.title || '',
      authors: item.authors || '',
      journal: item.journal || '',
      conference: item.conference || '',
      year: item.year || '',
      type: item.type || '',
      pages: item.pages || '',
      link: item.link || ''
    })
  }

  const handleSaveItem = () => {
    if (!formData.title || !formData.authors || !formData.year) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    const updatedData = { ...publicationsData }
    const { domain, type, isNew, id } = editingItem

    const newItem = {
      id: isNew ? Date.now() : id,
      title: formData.title,
      authors: formData.authors,
      year: formData.year,
      ...(type === 'articles' && {
        journal: formData.journal,
        type: formData.type,
        pages: formData.pages
      }),
      ...(type === 'communications' && {
        conference: formData.conference,
        pages: formData.pages,
        link: formData.link
      })
    }

    if (isNew) {
      updatedData[domain][type].push(newItem)
    } else {
      const index = updatedData[domain][type].findIndex(item => item.id === id)
      if (index !== -1) {
        updatedData[domain][type][index] = newItem
      }
    }

    const updatedSection = {
      ...publicationsSection,
      content: updatedData
    }

    const updatedSections = portfolioData.sections.map(section =>
      section.id === 'publications' ? updatedSection : section
    )

    updatePortfolioData({
      ...portfolioData,
      sections: updatedSections
    })

    setEditingItem(null)
    setFormData({
      title: '',
      authors: '',
      journal: '',
      year: '',
      type: '',
      pages: '',
      conference: '',
      link: ''
    })
  }

  const handleDeleteItem = (domain, type, itemId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return

    const updatedData = { ...publicationsData }
    updatedData[domain][type] = updatedData[domain][type].filter(item => item.id !== itemId)

    const updatedSection = {
      ...publicationsSection,
      content: updatedData
    }

    const updatedSections = portfolioData.sections.map(section =>
      section.id === 'publications' ? updatedSection : section
    )

    updatePortfolioData({
      ...portfolioData,
      sections: updatedSections
    })
  }

  const currentDomain = publicationsData[activeTab]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Publications Scientifiques</h2>
            <p className="text-gray-600 mt-1">Gérez vos articles et communications par domaine de recherche</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {domains.map((domain) => {
              const IconComponent = domain.icon
              const domainData = publicationsData[domain.key]
              const totalCount = (domainData?.articles?.length || 0) + (domainData?.communications?.length || 0)
              
              return (
                <button
                  key={domain.key}
                  onClick={() => setActiveTab(domain.key)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === domain.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5 mr-2" />
                  {domain.label}
                  <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                    {totalCount}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Domain Content */}
        {currentDomain && (
          <div className="space-y-8">
            {/* Articles Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Articles ({currentDomain.articles?.length || 0})
                </h3>
                <button
                  onClick={() => handleAddItem(activeTab, 'articles')}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Ajouter un article
                </button>
              </div>

              <div className="space-y-3">
                {currentDomain.articles?.map((article) => (
                  <div key={article.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{article.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">{article.authors}</p>
                        <p className="text-sm text-gray-500">
                          <em>{article.journal}</em> ({article.year})
                          {article.type && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {article.type}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEditItem(activeTab, 'articles', article)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(activeTab, 'articles', article.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Communications Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Communications ({currentDomain.communications?.length || 0})
                </h3>
                <button
                  onClick={() => handleAddItem(activeTab, 'communications')}
                  className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Ajouter une communication
                </button>
              </div>

              <div className="space-y-3">
                {currentDomain.communications?.map((comm) => (
                  <div key={comm.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{comm.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">{comm.authors}</p>
                        <p className="text-sm text-gray-500">
                          <em>{comm.conference}</em> ({comm.year})
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEditItem(activeTab, 'communications', comm)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(activeTab, 'communications', comm.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem.isNew ? 'Ajouter' : 'Modifier'} {editingItem.type === 'articles' ? 'un article' : 'une communication'}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Titre de la publication"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auteurs *
                </label>
                <input
                  type="text"
                  value={formData.authors}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Liste des auteurs"
                />
              </div>

              {editingItem.type === 'articles' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Journal/Revue
                    </label>
                    <input
                      type="text"
                      value={formData.journal}
                      onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom du journal ou de la revue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de publication
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner un type</option>
                      {publicationTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conférence/Événement
                  </label>
                  <input
                    type="text"
                    value={formData.conference}
                    onChange={(e) => setFormData({ ...formData, conference: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom de la conférence ou de l'événement"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Année *
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2024"
                    min="1990"
                    max="2030"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pages
                  </label>
                  <input
                    type="text"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ex: 1-10, p. 25-40"
                  />
                </div>
              </div>

              {editingItem.type === 'communications' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lien (optionnel)
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingItem.isNew ? 'Ajouter' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PublicationsEditor