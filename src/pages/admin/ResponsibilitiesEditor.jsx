import React, { useState } from 'react'
import { usePortfolio } from '../../contexts/PortfolioContext'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { 
  PlusIcon,
  TrashIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  PencilIcon,
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CpuChipIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const ResponsibilitiesEditor = () => {
  const { portfolioData, updateSection, loading } = usePortfolio()
  const [isEditing, setIsEditing] = useState(false)
  const [editingResponsibilityIndex, setEditingResponsibilityIndex] = useState(null)
  
  const responsibilitiesSection = portfolioData.sections.find(section => section.id === 'responsabilites')
  const existingResponsibilities = responsibilitiesSection?.content || []
  
  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      responsibilities: existingResponsibilities.length > 0 ? existingResponsibilities : [
        { 
          title: '', 
          organization: '',
          period: '', 
          status: 'Actuel',
          description: '', 
          icon: 'ShieldCheckIcon',
          color: 'from-blue-500 to-cyan-500',
          details: {
            type: '',
            périmètre: '',
            missions: ['']
          }
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'responsibilities'
  })
  
  const iconOptions = [
    { value: 'ShieldCheckIcon', label: 'Bouclier (Direction)', component: ShieldCheckIcon },
    { value: 'BuildingOffice2Icon', label: 'Bâtiment (Institution)', component: BuildingOffice2Icon },
    { value: 'UserGroupIcon', label: 'Groupe (Équipe)', component: UserGroupIcon },
    { value: 'AcademicCapIcon', label: 'Académique (Pédagogie)', component: AcademicCapIcon },
    { value: 'CpuChipIcon', label: 'Technologie (Digital)', component: CpuChipIcon },
    { value: 'SparklesIcon', label: 'Innovation (Qualité)', component: SparklesIcon }
  ]

  const colorOptions = [
    { value: 'from-blue-500 to-cyan-500', label: 'Bleu', preview: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { value: 'from-green-500 to-teal-500', label: 'Vert', preview: 'bg-gradient-to-r from-green-500 to-teal-500' },
    { value: 'from-purple-500 to-pink-500', label: 'Violet', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { value: 'from-orange-500 to-red-500', label: 'Orange', preview: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { value: 'from-indigo-500 to-purple-500', label: 'Indigo', preview: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
    { value: 'from-pink-500 to-rose-500', label: 'Rose', preview: 'bg-gradient-to-r from-pink-500 to-rose-500' }
  ]

  const statusOptions = [
    { value: 'Actuel', label: 'Actuel' },
    { value: 'Terminé', label: 'Terminé' },
    { value: 'Suspendu', label: 'Suspendu' }
  ]

  const onSubmit = async (data) => {
    try {
      const validResponsibilities = data.responsibilities
        .filter(resp => resp.title.trim() && resp.organization.trim())
        .map((resp, index) => ({
          id: resp.id || Date.now() + index,
          ...resp,
          details: {
            ...resp.details,
            missions: resp.details.missions.filter(mission => mission.trim() !== '')
          }
        }))
    
      if (validResponsibilities.length === 0) {
        toast.error('Veuillez ajouter au moins une responsabilité valide')
        return
      }
    
      const result = await updateSection('responsabilites', {
        title: 'Responsabilités',
        type: 'cards',
        content: validResponsibilities,
        visible: true,
        order: 7
      })

      if (result.success) {
        toast.success(`${validResponsibilities.length} responsabilité${validResponsibilities.length > 1 ? 's' : ''} sauvegardée${validResponsibilities.length > 1 ? 's' : ''} avec succès!`)
        setIsEditing(false)
        setEditingResponsibilityIndex(null)
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
    setEditingResponsibilityIndex(null)
    reset({
      responsibilities: existingResponsibilities.length > 0 ? existingResponsibilities : [
        { 
          title: '', 
          organization: '',
          period: '', 
          status: 'Actuel',
          description: '', 
          icon: 'ShieldCheckIcon',
          color: 'from-blue-500 to-cyan-500',
          details: {
            type: '',
            périmètre: '',
            missions: ['']
          }
        }
      ]
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingResponsibilityIndex(null)
    reset()
  }

  const addNewResponsibility = () => {
    append({ 
      title: '', 
      organization: '',
      period: '', 
      status: 'Actuel',
      description: '', 
      icon: 'ShieldCheckIcon',
      color: 'from-blue-500 to-cyan-500',
      details: {
        type: '',
        périmètre: '',
        missions: ['']
      }
    })
  }

  const handleDeleteSingleResponsibility = async (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette responsabilité ?')) {
      const updatedResponsibilities = existingResponsibilities.filter((_, i) => i !== index)
      
      const result = await updateSection('responsabilites', {
        title: 'Responsabilités',
        type: 'cards',
        content: updatedResponsibilities,
        visible: true,
        order: 7
      })

      if (result.success) {
        toast.success('Responsabilité supprimée avec succès!')
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
              <ShieldCheckIcon className="h-8 w-8 mr-3 text-primary-600" />
              Gestion des Responsabilités
            </h2>
            <p className="text-secondary-600 mt-2">
              Gérez vos responsabilités administratives - {existingResponsibilities.length} responsabilité{existingResponsibilities.length > 1 ? 's' : ''} actuellement
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
              {existingResponsibilities.length > 0 ? 'Modifier les responsabilités' : 'Ajouter des responsabilités'}
            </button>
          </div>
        </div>

        {/* Aperçu des responsabilités existantes */}
        {existingResponsibilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {existingResponsibilities.map((responsibility, index) => {
              const IconComponent = iconOptions.find(icon => icon.value === responsibility.icon)?.component || ShieldCheckIcon
              return (
                <div key={responsibility.id || index} className="card p-6 relative group hover:shadow-xl transition-all duration-300">
                  {/* Boutons d'action */}
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingResponsibilityIndex(index)
                        handleEdit()
                      }}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier cette responsabilité"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSingleResponsibility(index)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer cette responsabilité"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="pr-16">
                    {/* Badge statut et période */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center px-3 py-1 bg-gradient-to-r ${responsibility.color || 'from-blue-500 to-cyan-500'} text-white rounded-full text-sm font-semibold`}>
                        <IconComponent className="h-4 w-4 mr-2" />
                        {responsibility.status}
                      </span>
                      <div className="text-sm text-slate-500">{responsibility.period}</div>
                    </div>

                    {/* Titre */}
                    <h3 className="text-lg font-bold text-secondary-900 mb-2 line-clamp-2">
                      {responsibility.title}
                    </h3>

                    {/* Organisation */}
                    <p className="text-secondary-600 font-medium mb-3">
                      {responsibility.organization}
                    </p>

                    {/* Description */}
                    <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                      {responsibility.description}
                    </p>

                    {/* Barre décorative */}
                    <div className={`w-12 h-1 bg-gradient-to-r ${responsibility.color || 'from-blue-500 to-cyan-500'} rounded-full`}></div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-secondary-50 rounded-lg">
            <ShieldCheckIcon className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-600 mb-2">Aucune responsabilité ajoutée</h3>
            <p className="text-secondary-500 mb-6">Commencez par ajouter vos premières responsabilités</p>
            <button
              onClick={handleEdit}
              className="btn-primary"
            >
              Ajouter ma première responsabilité
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
            <ShieldCheckIcon className="h-8 w-8 mr-3 text-primary-600" />
            {editingResponsibilityIndex !== null ? 'Modifier la responsabilité' : 'Gérer mes responsabilités'}
          </h2>
          <p className="text-secondary-600 mt-2">
            {editingResponsibilityIndex !== null 
              ? 'Modifiez les informations de cette responsabilité'
              : 'Ajoutez ou modifiez vos responsabilités administratives'
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
          // Si on modifie une responsabilité spécifique, n'afficher que celle-ci
          if (editingResponsibilityIndex !== null && index !== editingResponsibilityIndex) {
            return null
          }

          return (
            <div key={field.id} className="card p-6 relative">
              {fields.length > 1 && editingResponsibilityIndex === null && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer cette responsabilité"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}

              <h3 className="text-lg font-semibold text-secondary-900 mb-6 flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2 text-primary-600" />
                {editingResponsibilityIndex !== null ? `Responsabilité: ${existingResponsibilities[editingResponsibilityIndex]?.title || 'Nouvelle responsabilité'}` : `Responsabilité #${index + 1}`}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Titre */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    <span className="text-red-500">*</span> Titre de la responsabilité
                  </label>
                  <input
                    {...register(`responsibilities.${index}.title`, { 
                      required: 'Le titre est requis' 
                    })}
                    type="text"
                    className="input-field"
                    placeholder="Ex: Directrice du pôle de digitalisation..."
                  />
                  {errors.responsibilities?.[index]?.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.responsibilities[index].title.message}</p>
                  )}
                </div>

                {/* Organisation */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    <span className="text-red-500">*</span> Organisation
                  </label>
                  <input
                    {...register(`responsibilities.${index}.organization`, { 
                      required: 'L\'organisation est requise' 
                    })}
                    type="text"
                    className="input-field"
                    placeholder="Ex: Université Chouaib Doukkali"
                  />
                  {errors.responsibilities?.[index]?.organization && (
                    <p className="mt-1 text-sm text-red-600">{errors.responsibilities[index].organization.message}</p>
                  )}
                </div>

                {/* Période */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Période
                  </label>
                  <input
                    {...register(`responsibilities.${index}.period`)}
                    type="text"
                    className="input-field"
                    placeholder="Ex: 2020-2024, Depuis 2022"
                  />
                </div>

                {/* Statut */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Statut
                  </label>
                  <select
                    {...register(`responsibilities.${index}.status`)}
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
                    {...register(`responsibilities.${index}.icon`)}
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
                    Description
                  </label>
                  <textarea
                    {...register(`responsibilities.${index}.description`)}
                    rows={4}
                    className="input-field"
                    placeholder="Décrivez cette responsabilité, son contexte et son impact..."
                  />
                </div>

                {/* Détails */}
                <div className="md:col-span-2 space-y-4 p-4 bg-secondary-50 rounded-lg">
                  <h4 className="font-medium text-secondary-900">Détails de la responsabilité</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Type de responsabilité
                      </label>
                      <input
                        {...register(`responsibilities.${index}.details.type`)}
                        type="text"
                        className="input-field"
                        placeholder="Ex: Direction stratégique, Coordination..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Périmètre
                      </label>
                      <input
                        {...register(`responsibilities.${index}.details.périmètre`)}
                        type="text"
                        className="input-field"
                        placeholder="Ex: 8 établissements, Faculté..."
                      />
                    </div>
                  </div>

                  {/* Missions */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Missions principales
                    </label>
                    <MissionsFieldArray 
                      control={control} 
                      register={register} 
                      responsibilityIndex={index} 
                    />
                  </div>
                </div>

                {/* Couleur */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-3">
                    Couleur de la responsabilité
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {colorOptions.map((color) => (
                      <label key={color.value} className="cursor-pointer">
                        <input
                          {...register(`responsibilities.${index}.color`)}
                          type="radio"
                          value={color.value}
                          className="sr-only"
                        />
                        <div className={`w-full h-12 rounded-lg ${color.preview} flex items-center justify-center text-white text-xs font-medium hover:scale-105 transition-transform border-2 border-transparent hover:border-secondary-300 ${
                          watch(`responsibilities.${index}.color`) === color.value ? 'ring-2 ring-primary-500 ring-offset-2' : ''
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

        {/* Bouton ajouter une responsabilité */}
        {editingResponsibilityIndex === null && (
          <div className="text-center">
            <button
              type="button"
              onClick={addNewResponsibility}
              className="inline-flex items-center px-6 py-3 bg-secondary-100 text-secondary-700 font-medium rounded-lg hover:bg-secondary-200 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Ajouter une autre responsabilité
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
            {editingResponsibilityIndex !== null ? 'Modifier la responsabilité' : 'Sauvegarder mes responsabilités'}
          </button>
        </div>
      </form>

      {/* Aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2" />
          💡 Guide pour bien remplir vos responsabilités
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h5 className="font-medium mb-2">Informations essentielles :</h5>
            <ul className="space-y-1">
              <li>• Titre clair de la responsabilité</li>
              <li>• Organisation ou institution</li>
              <li>• Période d'exercice</li>
              <li>• Statut actuel</li>
              <li>• Les champs avec * sont obligatoires</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Détails avancés :</h5>
            <ul className="space-y-1">
              <li>• Type de responsabilité</li>
              <li>• Périmètre d'action</li>
              <li>• Missions principales</li>
              <li>• Impact et réalisations</li>
              <li>• Icône représentative</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant pour gérer les missions dynamiquement
const MissionsFieldArray = ({ control, register, responsibilityIndex }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `responsibilities.${responsibilityIndex}.details.missions`
  })

  return (
    <div className="space-y-3">
      {fields.map((field, missionIndex) => (
        <div key={field.id} className="flex items-center space-x-2">
          <input
            {...register(`responsibilities.${responsibilityIndex}.details.missions.${missionIndex}`)}
            type="text"
            className="input-field flex-1"
            placeholder={`Mission ${missionIndex + 1}`}
          />
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(missionIndex)}
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
        Ajouter une mission
      </button>
    </div>
  )
}

export default ResponsibilitiesEditor