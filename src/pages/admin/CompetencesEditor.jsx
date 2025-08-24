import React, { useState } from 'react'
import { usePortfolio } from '../../contexts/PortfolioContext'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { 
  PlusIcon,
  TrashIcon,
  CpuChipIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
  CloudIcon,
  ChartBarIcon,
  BookOpenIcon,
  CodeBracketIcon,
  SparklesIcon,
  CheckCircleIcon,
  PencilIcon,
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

const CompetencesEditor = () => {
  const { portfolioData, updateSection, loading } = usePortfolio()
  const [isEditing, setIsEditing] = useState(false)
  const [editingCompetenceIndex, setEditingCompetenceIndex] = useState(null)
  
  const competencesSection = portfolioData.sections.find(section => section.id === 'competences')
  const existingCompetences = competencesSection?.content || []
  
  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      competences: existingCompetences.length > 0 ? existingCompetences : [
        { 
          title: '', 
          description: '',
          icon: 'ComputerDesktopIcon',
          color: 'from-blue-500 to-cyan-500',
          skills: [''],
          technologies: [''],
          outils: ['']
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'competences'
  })
  
  const iconOptions = [
    { value: 'ComputerDesktopIcon', label: 'Ordinateur (Systèmes)', component: ComputerDesktopIcon },
    { value: 'ShieldCheckIcon', label: 'Bouclier (Sécurité)', component: ShieldCheckIcon },
    { value: 'CloudIcon', label: 'Cloud (Virtualisation)', component: CloudIcon },
    { value: 'ChartBarIcon', label: 'Graphique (Données)', component: ChartBarIcon },
    { value: 'BookOpenIcon', label: 'Livre (Formation)', component: BookOpenIcon },
    { value: 'CodeBracketIcon', label: 'Code (Programmation)', component: CodeBracketIcon },
    { value: 'SparklesIcon', label: 'Étoiles (IA)', component: SparklesIcon },
    { value: 'CpuChipIcon', label: 'Processeur (Hardware)', component: CpuChipIcon }
  ]

  const colorOptions = [
    { value: 'from-blue-500 to-cyan-500', label: 'Bleu', preview: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { value: 'from-red-500 to-pink-500', label: 'Rouge', preview: 'bg-gradient-to-r from-red-500 to-pink-500' },
    { value: 'from-purple-500 to-indigo-500', label: 'Violet', preview: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
    { value: 'from-green-500 to-teal-500', label: 'Vert', preview: 'bg-gradient-to-r from-green-500 to-teal-500' },
    { value: 'from-orange-500 to-red-500', label: 'Orange', preview: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { value: 'from-indigo-500 to-purple-500', label: 'Indigo', preview: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
    { value: 'from-pink-500 to-rose-500', label: 'Rose', preview: 'bg-gradient-to-r from-pink-500 to-rose-500' }
  ]

  const onSubmit = async (data) => {
    try {
      const validCompetences = data.competences
        .filter(comp => comp.title.trim() && comp.description.trim())
        .map((comp, index) => ({
          id: comp.id || Date.now() + index,
          ...comp,
          skills: comp.skills.filter(skill => skill.trim() !== ''),
          technologies: comp.technologies.filter(tech => tech.trim() !== ''),
          outils: comp.outils.filter(outil => outil.trim() !== '')
        }))
    
      if (validCompetences.length === 0) {
        toast.error('Veuillez ajouter au moins une compétence valide')
        return
      }
    
      const result = await updateSection('competences', {
        title: 'Compétences',
        type: 'cards',
        content: validCompetences,
        visible: true,
        order: 4
      })

      if (result.success) {
        toast.success(`${validCompetences.length} compétence${validCompetences.length > 1 ? 's' : ''} sauvegardée${validCompetences.length > 1 ? 's' : ''} avec succès!`)
        setIsEditing(false)
        setEditingCompetenceIndex(null)
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
    setEditingCompetenceIndex(null)
    reset({
      competences: existingCompetences.length > 0 ? existingCompetences : [
        { 
          title: '', 
          description: '',
          icon: 'ComputerDesktopIcon',
          color: 'from-blue-500 to-cyan-500',
          skills: [''],
          technologies: [''],
          outils: ['']
        }
      ]
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingCompetenceIndex(null)
    reset()
  }

  const addNewCompetence = () => {
    append({ 
      title: '', 
      description: '',
      icon: 'ComputerDesktopIcon',
      color: 'from-blue-500 to-cyan-500',
      skills: [''],
      technologies: [''],
      outils: ['']
    })
  }

  const handleDeleteSingleCompetence = async (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
      const updatedCompetences = existingCompetences.filter((_, i) => i !== index)
      
      const result = await updateSection('competences', {
        title: 'Compétences',
        type: 'cards',
        content: updatedCompetences,
        visible: true,
        order: 4
      })

      if (result.success) {
        toast.success('Compétence supprimée avec succès!')
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
              <CpuChipIcon className="h-8 w-8 mr-3 text-primary-600" />
              Gestion des Compétences
            </h2>
            <p className="text-secondary-600 mt-2">
              Gérez vos domaines de compétences - {existingCompetences.length} compétence{existingCompetences.length > 1 ? 's' : ''} actuellement
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
              {existingCompetences.length > 0 ? 'Modifier les compétences' : 'Ajouter des compétences'}
            </button>
          </div>
        </div>

        {/* Aperçu des compétences existantes */}
        {existingCompetences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {existingCompetences.map((competence, index) => {
              const IconComponent = iconOptions.find(icon => icon.value === competence.icon)?.component || ComputerDesktopIcon
              return (
                <div key={competence.id || index} className="card p-6 relative group hover:shadow-xl transition-all duration-300">
                  {/* Boutons d'action */}
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingCompetenceIndex(index)
                        handleEdit()
                      }}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier cette compétence"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSingleCompetence(index)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer cette compétence"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="pr-16">
                    {/* Icône et titre */}
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${competence.color || 'from-blue-500 to-cyan-500'} rounded-xl flex items-center justify-center mr-4`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-secondary-900 line-clamp-2">
                        {competence.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                      {competence.description}
                    </p>

                    {/* Statistiques */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <span>{competence.skills?.length || 0} compétences</span>
                      <span>{competence.technologies?.length || 0} technologies</span>
                      <span>{competence.outils?.length || 0} outils</span>
                    </div>

                    {/* Barre décorative */}
                    <div className={`w-12 h-1 bg-gradient-to-r ${competence.color || 'from-blue-500 to-cyan-500'} rounded-full`}></div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-secondary-50 rounded-lg">
            <CpuChipIcon className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-600 mb-2">Aucune compétence ajoutée</h3>
            <p className="text-secondary-500 mb-6">Commencez par ajouter vos premières compétences</p>
            <button
              onClick={handleEdit}
              className="btn-primary"
            >
              Ajouter ma première compétence
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
            <CpuChipIcon className="h-8 w-8 mr-3 text-primary-600" />
            {editingCompetenceIndex !== null ? 'Modifier la compétence' : 'Gérer mes compétences'}
          </h2>
          <p className="text-secondary-600 mt-2">
            {editingCompetenceIndex !== null 
              ? 'Modifiez les informations de cette compétence'
              : 'Ajoutez ou modifiez vos domaines de compétences'
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
          // Si on modifie une compétence spécifique, n'afficher que celle-ci
          if (editingCompetenceIndex !== null && index !== editingCompetenceIndex) {
            return null
          }

          return (
            <div key={field.id} className="card p-6 relative">
              {fields.length > 1 && editingCompetenceIndex === null && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer cette compétence"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}

              <h3 className="text-lg font-semibold text-secondary-900 mb-6 flex items-center">
                <CpuChipIcon className="h-5 w-5 mr-2 text-primary-600" />
                {editingCompetenceIndex !== null ? `Compétence: ${existingCompetences[editingCompetenceIndex]?.title || 'Nouvelle compétence'}` : `Compétence #${index + 1}`}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Titre */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    <span className="text-red-500">*</span> Titre de la compétence
                  </label>
                  <input
                    {...register(`competences.${index}.title`, { 
                      required: 'Le titre est requis' 
                    })}
                    type="text"
                    className="input-field"
                    placeholder="Ex: Administration Réseaux & Systèmes..."
                  />
                  {errors.competences?.[index]?.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.competences[index].title.message}</p>
                  )}
                </div>

                {/* Icône */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Icône
                  </label>
                  <select
                    {...register(`competences.${index}.icon`)}
                    className="input-field"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon.value} value={icon.value}>{icon.label}</option>
                    ))}
                  </select>
                </div>

                {/* Couleur */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Couleur
                  </label>
                  <select
                    {...register(`competences.${index}.color`)}
                    className="input-field"
                  >
                    {colorOptions.map(color => (
                      <option key={color.value} value={color.value}>{color.label}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    <span className="text-red-500">*</span> Description
                  </label>
                  <textarea
                    {...register(`competences.${index}.description`, { 
                      required: 'La description est requise' 
                    })}
                    rows={3}
                    className="input-field"
                    placeholder="Décrivez cette compétence et votre niveau d'expertise..."
                  />
                  {errors.competences?.[index]?.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.competences[index].description.message}</p>
                  )}
                </div>

                {/* Compétences détaillées */}
                <div className="md:col-span-2 space-y-4 p-4 bg-secondary-50 rounded-lg">
                  <h4 className="font-medium text-secondary-900">Détails de la compétence</h4>
                  
                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Compétences spécifiques
                    </label>
                    <SkillsFieldArray 
                      control={control} 
                      register={register} 
                      competenceIndex={index} 
                      fieldName="skills"
                      placeholder="Compétence"
                    />
                  </div>

                  {/* Technologies */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Technologies maîtrisées
                    </label>
                    <SkillsFieldArray 
                      control={control} 
                      register={register} 
                      competenceIndex={index} 
                      fieldName="technologies"
                      placeholder="Technologie"
                    />
                  </div>

                  {/* Outils */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Outils utilisés
                    </label>
                    <SkillsFieldArray 
                      control={control} 
                      register={register} 
                      competenceIndex={index} 
                      fieldName="outils"
                      placeholder="Outil"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Bouton ajouter une compétence */}
        {editingCompetenceIndex === null && (
          <div className="text-center">
            <button
              type="button"
              onClick={addNewCompetence}
              className="inline-flex items-center px-6 py-3 bg-secondary-100 text-secondary-700 font-medium rounded-lg hover:bg-secondary-200 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Ajouter une autre compétence
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
            {editingCompetenceIndex !== null ? 'Modifier la compétence' : 'Sauvegarder mes compétences'}
          </button>
        </div>
      </form>

      {/* Aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2" />
          💡 Guide pour bien remplir vos compétences
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h5 className="font-medium mb-2">Informations essentielles :</h5>
            <ul className="space-y-1">
              <li>• Titre clair du domaine de compétence</li>
              <li>• Description détaillée de votre expertise</li>
              <li>• Icône appropriée au domaine</li>
              <li>• Les champs avec * sont obligatoires</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Détails techniques :</h5>
            <ul className="space-y-1">
              <li>• Listez vos compétences spécifiques</li>
              <li>• Ajoutez les technologies maîtrisées</li>
              <li>• Mentionnez les outils utilisés</li>
              <li>• Organisez par niveau d'expertise</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant pour gérer les listes dynamiques (skills, technologies, outils)
const SkillsFieldArray = ({ control, register, competenceIndex, fieldName, placeholder }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `competences.${competenceIndex}.${fieldName}`
  })

  return (
    <div className="space-y-3">
      {fields.map((field, itemIndex) => (
        <div key={field.id} className="flex items-center space-x-2">
          <input
            {...register(`competences.${competenceIndex}.${fieldName}.${itemIndex}`)}
            type="text"
            className="input-field flex-1"
            placeholder={`${placeholder} ${itemIndex + 1}`}
          />
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(itemIndex)}
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
        Ajouter {placeholder.toLowerCase()}
      </button>
    </div>
  )
}

export default CompetencesEditor