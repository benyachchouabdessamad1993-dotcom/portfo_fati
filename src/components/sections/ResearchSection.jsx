import React from 'react'
import { 
  BeakerIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  ComputerDesktopIcon,
  CloudIcon,
  SparklesIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'

const ResearchSection = ({ sections }) => {
  const researchSection = sections.find(section => section.id === 'axes-recherche')
  
  if (!researchSection || !researchSection.visible) return null
  
  // Vérifier que content est un tableau
  const researchContent = Array.isArray(researchSection.content) 
    ? researchSection.content 
    : [
        'Réseaux Informatiques',
        'La Sécurité des Réseaux',
        'L\'enseignement à distance',
        'Les nouvelles techniques en évaluation des apprentissages',
        'Les systèmes embarqués',
        'L\'informatique quantique',
        'Blockchain',
        'Les Réseaux sans fil sans infrastructure',
        'Virtualisation des Réseaux (NFV, SDN…)',
        'Intelligence Artificielle : Machine-Learning, Deep learning, Big Data'
      ]
  
  const getIconForResearch = (research) => {
    const iconMap = {
      'Réseaux Informatiques': ComputerDesktopIcon,
      'La Sécurité des Réseaux': ShieldCheckIcon,
      'L\'enseignement à distance': AcademicCapIcon,
      'Les nouvelles techniques en évaluation des apprentissages': BeakerIcon,
      'Les systèmes embarqués': CpuChipIcon,
      'L\'informatique quantique': CpuChipIcon,
      'Blockchain': ShieldCheckIcon,
      'Les Réseaux sans fil sans infrastructure': ComputerDesktopIcon,
      'Virtualisation des Réseaux (NFV, SDN…)': CloudIcon,
      'Intelligence Artificielle : Machine-Learning, Deep learning, Big Data': BeakerIcon
    }
    return iconMap[research] || BeakerIcon
  }

  const getGradientForIndex = (index) => {
    const gradients = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-blue-500',
      'from-pink-500 to-rose-500',
      'from-cyan-500 to-blue-500',
      'from-emerald-500 to-green-500',
      'from-violet-500 to-purple-500'
    ]
    return gradients[index % gradients.length]
  }

  return (
    <section id="research" className="section-padding bg-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpolygon points=%2250 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40%22/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="container-max relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-blue-300 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <BeakerIcon className="h-4 w-4 mr-2" />
            Recherche & Innovation
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Axes de </span>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Recherche
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Mes domaines d'expertise et axes de recherche principaux dans le domaine 
            des technologies de l'information et de la communication.
          </p>
        </div>

        {/* Research Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {researchContent.map((research, index) => {
            const IconComponent = getIconForResearch(research)
            const gradient = getGradientForIndex(index)
            
            return (
              <div 
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    {research}
                  </h3>
                  
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full group-hover:w-24 transition-all duration-300"></div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            )
          })}
        </div>

        {/* Laboratory Section */}
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-600/20 to-indigo-700/20 backdrop-blur-sm border border-white/10 rounded-3xl p-12 text-center">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full translate-x-12 translate-y-12"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-8">
                <SparklesIcon className="h-10 w-10 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-6">
                Laboratoire STIC
              </h3>
              
              <p className="text-xl text-slate-300 leading-relaxed mb-8 max-w-4xl mx-auto">
                Vice-directrice du Laboratoire des Sciences et Technologies de l'Information 
                et de la Communication (STIC), je dirige l'équipe de recherche TICEF 
                (Technologies de l'Information et de la Communication pour l'Éducation et la Formation).
              </p>
              
              <a 
                href="https://www.youtube.com/results?search_query=stic+laboratory" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <CloudIcon className="h-5 w-5 mr-3" />
                Découvrir nos travaux
                <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ResearchSection