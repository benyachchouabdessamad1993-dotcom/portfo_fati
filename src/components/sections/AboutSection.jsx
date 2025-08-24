import React from 'react'
import { 
  BuildingOffice2Icon,
  UserGroupIcon,
  GlobeAltIcon,
  SparklesIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

const AboutSection = ({ profile }) => {
  // Récupérer le contenu de la section À propos depuis les sections
  const aboutSection = profile?.sections?.find(section => section.id === 'a-propos')
  const aboutContent = aboutSection?.content

  return (
    <section id="about" className="section-padding bg-gradient-to-b from-white to-slate-50">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
            <SparklesIcon className="h-4 w-4 mr-2" />
            À Propos
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Parcours & <span className="text-gradient">Expertise</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez mon parcours académique et professionnel dans le domaine 
            des technologies de l'information et de la communication.
          </p>
        </div>

        {/* Contenu personnalisé À propos */}
        {aboutContent && aboutSection?.visible && (
          <div className="mb-20">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-12 rounded-3xl border border-blue-200 shadow-lg">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div 
                  className="prose prose-lg prose-blue max-w-none text-center text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: aboutContent }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Profile Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="group card p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BuildingOffice2Icon className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Affiliation
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {profile.affiliation}
                </p>
              </div>
            </div>
          </div>

          <div className="group card p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Responsabilités
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-600 leading-relaxed">
                    Vice-directrice du Laboratoire STIC
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Responsable d'équipe TICEF
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="group card p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <GlobeAltIcon className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Présence Numérique
                </h3>
                <div className="space-y-2">
                  <a 
                    href={profile.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-700 transition-colors text-sm"
                  >
                    LinkedIn →
                  </a>
                  <a 
                    href={profile.researchgate} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-700 transition-colors text-sm"
                  >
                    ResearchGate →
                  </a>
                  <a 
                    href={profile.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-700 transition-colors text-sm"
                  >
                    YouTube STIC →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Info & Education */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Personal Information */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-3xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full mr-4"></div>
              Informations Personnelles
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Nom
                </span>
                <p className="text-lg font-bold text-slate-900">
                  {profile.nom}
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Prénom
                </span>
                <p className="text-lg font-bold text-slate-900">
                  {profile.prenom}
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Nationalité
                </span>
                <p className="text-lg font-bold text-slate-900">
                  {profile.nationalite}
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Grade
                </span>
                <p className="text-lg font-bold text-slate-900">
                  Maître de Conférence
                </p>
              </div>
              <div className="col-span-2 space-y-2">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Langues
                </span>
                <div className="flex flex-wrap gap-2">
                  {(profile.langues || []).map((langue, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1 bg-gradient-to-r ${langue.color} text-white rounded-full text-sm font-medium`}
                    >
                      {langue.nom}
                    </span>
                  ))}
                  {(!profile.langues || profile.langues.length === 0) && (
                    <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
                      Aucune langue ajoutée
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Formations & Diplômes */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl border border-green-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full mr-4"></div>
              Formations & Diplômes
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-semibold text-slate-900 mb-1">
                    Diplôme d'habilitation Universitaire
                  </div>
                  <div className="text-slate-600 text-sm">
                    Faculté des Sciences d'El Jadida, 2020
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-semibold text-slate-900 mb-1">
                    Doctorat en Réseaux Informatiques et Télécoms
                  </div>
                  <div className="text-slate-600 text-sm">
                    Faculté des Sciences d'El Jadida, au sein du laboratoire STIC, 2014
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12 rounded-3xl shadow-2xl relative overflow-hidden mb-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl mb-8">
              <SparklesIcon className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-6">
              Mission & Vision
            </h3>
            <div 
              className="text-xl leading-relaxed text-blue-50 max-w-4xl mx-auto"
              dangerouslySetInnerHTML={{ 
                __html: profile.mission || 'Contribuer à l\'avancement des technologies de l\'information et de la communication dans l\'éducation, en développant des solutions innovantes pour l\'enseignement et la formation à l\'ère numérique.' 
              }} 
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
            <div className="text-sm text-slate-600 font-medium">Années d'expérience</div>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
            <div className="text-sm text-slate-600 font-medium">Publications</div>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-green-600 mb-2">7</div>
            <div className="text-sm text-slate-600 font-medium">Thèses encadrées</div>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-orange-600 mb-2">500+</div>
            <div className="text-sm text-slate-600 font-medium">Étudiants formés</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection