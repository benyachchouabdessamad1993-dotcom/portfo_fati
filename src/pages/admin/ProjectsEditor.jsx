import React, { useState } from 'react'
import { usePortfolio } from '../../contexts/PortfolioContext'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { 
  PlusIcon,
  TrashIcon,
  RocketLaunchIcon,
  BuildingOffice2Icon,
  GlobeAltIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ComputerDesktopIcon,
  BeakerIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  PencilIcon,
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

const ProjectsEditor = () => {
  const { portfolioData, updateSection, loading } = usePortfolio()
  const [isEditing, setIsEditing] = useState(false)
  const [editingProjectIndex, setEditingProjectIndex] = useState(null)
  
  const projectsSection = portfolioData.sections.find(section => section.id === 'projets')
  const existingProjects = projectsSection?.content || []
  
  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      projects: existingProjects.length > 0 ? existingProjects : [
        { 
          title: '', 
          category: '',
          year: '', 
          status: 'En cours',
          description: '', 
          icon: 'RocketLaunchIcon',
          color: 'from-blue-500 to-cyan-500',
          details: {
            type: '',
            financement: '',
            role: '',
            objectifs: ['']
          }
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects'
  })
  
  const iconOptions = [
    { value: 'RocketLaunchIcon', label: 'Fusée (Général)', component: RocketLaunchIcon },
    { value: 'BuildingOffice2Icon', label: 'Bâtiment (Patrimoine)', component: BuildingOffice2Icon },
    { value: 'GlobeAltIcon', label: 'Globe (International)', component: GlobeAltIcon },
    { value: 'AcademicCapIcon', label: 'Académique (Éducation)', component: AcademicCapIcon },
    { value: 'UserGroupIcon', label: 'Groupe (Formation)', component: UserGroupIcon },
    { value: 'ComputerDesktopIcon', label: 'Ordinateur (Numérique)', component: ComputerDesktopIcon },
    { value: 'BeakerIcon', label: 'Laboratoire (Recherche)', component: BeakerIcon },
    { value: 'SparklesIcon', label: 'Étoiles (Innovation)', component: SparklesIcon },
    { value: 'ShieldCheckIcon', label: 'Bouclier (Expertise)', component: ShieldCheckIcon }
  ]

  const colorOptions = [
    { value: 'from-blue-500 to-cyan-500', label: 'Bleu', preview: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { value: 'from-green-500 to-teal-500', label: 'Vert', preview: 'bg-gradient-to-r from-green-500 to-teal-500' },
    { value: 'from-purple-500 to-pink-500', label: 'Violet', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { value: 'from-orange-500 to-red-500', label: 'Orange', preview: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { value: 'from-indigo-500 to-purple-500', label: 'Indigo', preview: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
    { value: 'from-teal-500 to-blue-500', label: 'Turquoise', preview: 'bg-gradient-to-r from-teal-500 to-blue-500' },
    { value: 'from-pink-500 to-rose-500', label: 'Rose', preview: 'bg-gradient-to-r from-pink-500 to-rose-500' },
    { value: 'from-cyan-500 to-blue-500', label: 'Cyan', preview: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
    { value: 'from-emerald-500 to-cyan-500', label: 'Émeraude', preview: 'bg-gradient-to-r from-emerald-500 to-cyan-500' },
    { value: 'from-violet-500 to-purple-500', label: 'Violet foncé', preview: 'bg-gradient-to-r from-violet-500 to-purple-500' }
  ]

  const statusOptions = [
    { value: 'En cours', label: 'En cours' },
    { value: 'Terminé', label: 'Terminé' },
    { value: 'Planifié', label: 'Planifié' },
    { value: 'Suspendu', label: 'Suspendu' }
  ]

  const categoryOptions = [
    'Recherche Territoriale',
    'Éducation Durable', 
    'Innovation Pédagogique',
    'Formation Continue',
    'Formation Numérique',
    'Recherche Pédagogique',
    'Transformation Digitale',
    'Expertise Académique',
    'Transition Éducative',
    'Coopération Internationale'
  ]

  const onSubmit = async (data) => {
    try {
      // Filtrer les projets vides et ajouter des IDs uniques
      const validProjects = data.projects
        .filter(project => project.title.trim() && project.category.trim())
        .map((project, index) => ({
          id: project.id || Date.now() + index,
          ...project,
          details: {
            ...project.details,
            objectifs: project.details.objectifs.filter(obj => obj.trim() !== '')
          }
        }))
    
      if (validProjects.length === 0) {
        toast.error('Veuillez ajouter au moins un projet valide')
        return
      }
    
      // Mettre à jour la section des projets
      const result = await updateSection('projets', {
        title: 'Projets',
        type: 'cards',
        content: validProjects,
        visible: true,
        order: 6
      })

      if (result.success) {
        toast.success(`${validProjects.length} projet${validProjects.length > 1 ? 's' : ''} sauvegardé${validProjects.length > 1 ? 's' : ''} avec succès!`)
        setIsEditing(false)
        setEditingProjectIndex(null)
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
    setEditingProjectIndex(null)
    reset({
      projects: existingProjects.length > 0 ? existingProjects : [
        { 
          title: '', 
          category: '',
          year: '', 
          status: 'En cours',
          description: '', 
          icon: 'RocketLaunchIcon',
          color: 'from-blue-500 to-cyan-500',
          details: {
            type: '',
            financement: '',
            role: '',
            objectifs: ['']
          }
        }
      ]
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingProjectIndex(null)
    reset()
  }

  const addNewProject = () => {
    append({ 
      title: '', 
      category: '',
      year: '', 
      status: 'En cours',
      description: '', 
      icon: 'RocketLaunchIcon',
      color: 'from-blue-500 to-cyan-500',
      details: {
        type: '',
        financement: '',
        role: '',
        objectifs: ['']
      }
    })
  }

  const handleDeleteSingleProject = async (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      const updatedProjects = existingProjects.filter((_, i) => i !== index)
      
      const result = await updateSection('projets', {
        title: 'Projets',
        type: 'cards',
        content: updatedProjects,
        visible: true,
        order: 6
      })

      if (result.success) {
        toast.success('Projet supprimé avec succès!')
      } else {
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-secondary-900 flex items-center">
              <RocketLaunchIcon className="h-8 w-8 mr-3 text-primary-600" />
              Gestion des Projets
            </h2>
            <p className="text-secondary-600 mt-2">
              Gérez vos projets de recherche et collaborations - {existingProjects.length} projet{existingProjects.length > 1 ? 's' : ''} actuellement
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
              {existingProjects.length > 0 ? 'Modifier les projets' : 'Ajouter des projets'}
            </button>
          </div>
        </div>

        {/* Aperçu des projets existants */}
        {existingProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {existingProjects.map((project, index) => {
              const IconComponent = iconOptions.find(icon => icon.value === project.icon)?.component || RocketLaunchIcon
              return (
                <div key={project.id || index} className="card p-6 relative group hover:shadow-xl transition-all duration-300">
                  {/* Boutons d'action */}
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingProjectIndex(index)
                        handleEdit()
                      }}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier ce projet"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSingleProject(index)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer ce projet"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="pr-16">
                    {/* Badge statut et année */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center px-3 py-1 bg-gradient-to-r ${project.color || 'from-blue-500 to-cyan-500'} text-white rounded-full text-sm font-semibold`}>
                        <IconComponent className="h-4 w-4 mr-2" />
                        {project.category}
                      </span>
                      <div className="text-right">
                        <div className="text-sm text-slate-500">{project.year}</div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.status === 'En cours' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>

                    {/* Titre du projet */}
                    <h3 className="text-lg font-bold text-secondary-900 mb-3 line-clamp-2">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Barre décorative */}
                    <div className={`w-12 h-1 bg-gradient-to-r ${project.color || 'from-blue-500 to-cyan-500'} rounded-full`}></div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-secondary-50 rounded-lg">
            <RocketLaunchIcon className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-600 mb-2">Aucun projet ajouté</h3>
            <p className="text-secondary-500 mb-6">Commencez par ajouter vos premiers projets</p>
            <button
              onClick={handleEdit}
              className="btn-primary"
            >
              Ajouter mon premier projet
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
            <RocketLaunchIcon className="h-8 w-8 mr-3 text-primary-600" />
            {editingProjectIndex !== null ? 'Modifier le projet' : 'Gérer mes projets'}
          </h2>
          <p className="text-secondary-600 mt-2">
            {editingProjectIndex !== null 
              ? 'Modifiez les informations de ce projet'
              : 'Ajoutez ou modifiez vos projets de recherche et collaborations'
            }
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
        {fields.map((field, index) => {
          // Si on modifie un projet spécifique, n'afficher que celui-ci
          if (editingProjectIndex !== null && index !== editingProjectIndex) {
            return null
          }

          return (
            <div key={field.id} className="card p-6 relative">
              {fields.length > 1 && editingProjectIndex === null && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer ce projet"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}

              <h3 className="text-lg font-semibold text-secondary-900 mb-6 flex items-center">
                <RocketLaunchIcon className="h-5 w-5 mr-2 text-primary-600" />
                {editingProjectIndex !== null ? `Projet: ${existingProjects[editingProjectIndex]?.title || 'Nouveau projet'}` : `Projet #${index + 1}`}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Titre du projet */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    <span className="text-red-500">*</span> Titre du projet
                  </label>
                  <input
                    {...register(`projects.${index}.title`, { 
                      required: 'Le titre du projet est requis' 
                    })}
                    type="text"
                    className="input-field"
                    placeholder="Ex: Développement d'une plateforme e-learning..."
                  />
                  {errors.projects?.[index]?.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.projects[index].title.message}</p>
                  )}
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    <span className="text-red-500">*</span> Catégorie
                  </label>
                  <select
                    {...register(`projects.${index}.category`, { 
                      required: 'La catégorie est requise' 
                    })}
                    className="input-field"
                  >
                    <option value="">Choisir une catégorie</option>
                    {categoryOptions.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.projects?.[index]?.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.projects[index].category.message}</p>
                  )}
                </div>

                {/* Année */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Année/Période
                  </label>
                  <input
                    {...register(`projects.${index}.year`)}
                    type="text"
                    className="input-field"
                    placeholder="Ex: 2024, 2020-2024, Depuis 2022"
                  />
                </div>

                {/* Statut */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Statut
                  </label>
                  <select
                    {...register(`projects.${index}.status`)}
                    className="input-field"
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>

                {/* Icône */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Icône
                  </label>
                  <select
                    {...register(`projects.${index}.icon`)}
                    className="input-field"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon.value} value={icon.value}>{icon.label}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Description du projet
                  </label>
                  <textarea
                    {...register(`projects.${index}.description`)}
                    rows={4}
                    className="input-field"
                    placeholder="Décrivez le projet, son contexte, ses objectifs..."
                  />
                </div>

                {/* Détails du projet */}
                <div className="md:col-span-2 space-y-4 p-4 bg-secondary-50 rounded-lg">
                  <h4 className="font-medium text-secondary-900">Détails du projet</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Type de projet
                      </label>
                      <input
                        {...register(`projects.${index}.details.type`)}
                        type="text"
                        className="input-field"
                        placeholder="Ex: Projet Erasmus+, Recherche..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Financement
                      </label>
                      <input
                        {...register(`projects.${index}.details.financement`)}
                        type="text"
                        className="input-field"
                        placeholder="Ex: Union Européenne, CNRST..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Mon rôle
                      </label>
                      <input
                        {...register(`projects.${index}.details.role`)}
                        type="text"
                        className="input-field"
                        placeholder="Ex: Coordinatrice, Membre..."
                      />
                    </div>
                  </div>

                  {/* Objectifs */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Objectifs du projet
                    </label>
                    <ObjectivesFieldArray 
                      control={control} 
                      register={register} 
                      projectIndex={index} 
                    />
                  </div>
                </div>

                {/* Couleur */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-3">
                    Couleur du projet
                  </label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                    {colorOptions.map((color) => (
                      <label key={color.value} className="cursor-pointer">
                        <input
                          {...register(`projects.${index}.color`)}
                          type="radio"
                          value={color.value}
                          className="sr-only"
                        />
                        <div className={`w-full h-12 rounded-lg ${color.preview} flex items-center justify-center text-white text-xs font-medium hover:scale-105 transition-transform border-2 border-transparent hover:border-secondary-300 ${
                          watch(`projects.${index}.color`) === color.value ? 'ring-2 ring-primary-500 ring-offset-2' : ''
                        }`}>
                          {color.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Bouton ajouter un projet (seulement si on n'édite pas un projet spécifique) */}
        {editingProjectIndex === null && (
          <div className="text-center">
            <button
              type="button"
              onClick={addNewProject}
              className="inline-flex items-center px-6 py-3 bg-secondary-100 text-secondary-700 font-medium rounded-lg hover:bg-secondary-200 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Ajouter un autre projet
            </button>
          </div>
        )}

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
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            )}
            {editingProjectIndex !== null ? 'Modifier le projet' : 'Sauvegarder mes projets'}
          </button>
        </div>
      </form>

      {/* Aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2" />
          💡 Guide pour bien remplir vos projets
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h5 className="font-medium mb-2">Informations essentielles :</h5>
            <ul className="space-y-1">
              <li>• Titre clair et descriptif</li>
              <li>• Catégorie appropriée</li>
              <li>• Période ou année du projet</li>
              <li>• Statut actuel (En cours/Terminé)</li>
              <li>• Les champs avec * sont obligatoires</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Détails avancés :</h5>
            <ul className="space-y-1">
              <li>• Type de projet (Erasmus+, Recherche...)</li>
              <li>• Source de financement</li>
              <li>• Votre rôle dans le projet</li>
              <li>• Objectifs principaux</li>
              <li>• Icône représentative</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Astuce :</strong> Les projets sont automatiquement organisés par catégorie sur votre portfolio.
          </p>
        </div>
      </div>
    </div>
  )
}

// Composant pour gérer les objectifs dynamiquement
const ObjectivesFieldArray = ({ control, register, projectIndex }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `projects.${projectIndex}.details.objectifs`
  })

  return (
    <div className="space-y-3">
      {fields.map((field, objIndex) => (
        <div key={field.id} className="flex items-center space-x-2">
          <input
            {...register(`projects.${projectIndex}.details.objectifs.${objIndex}`)}
            type="text"
            className="input-field flex-1"
            placeholder={`Objectif ${objIndex + 1}`}
          />
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(objIndex)}
              className="p-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => append('')}
        className="flex items-center text-primary-600 hover:text-primary-700 transition-colors text-sm"
      >
        <PlusIcon className="h-4 w-4 mr-1" />
        Ajouter un objectif
      </button>
    </div>
  )
}

export default ProjectsEditor