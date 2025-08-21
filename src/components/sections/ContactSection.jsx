import React from 'react'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  BuildingOffice2Icon,
  SparklesIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'

const ContactSection = ({ profile }) => {
  return (
    <section id="contact" className="section-padding bg-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="container-max relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-blue-300 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <EnvelopeIcon className="h-4 w-4 mr-2" />
            Prenons Contact
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Collaborons </span>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Ensemble
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            N'hésitez pas à me contacter pour toute collaboration, question académique 
            ou opportunité de recherche.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Cards */}
          <div className="space-y-8">
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <EnvelopeIcon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    Email Professionnel
                  </h3>
                  <a 
                    href={`mailto:${profile.email}`}
                    className="group/link inline-flex items-center text-blue-300 hover:text-blue-200 transition-colors text-lg"
                  >
                    <span className="group-hover/link:translate-x-1 transition-transform">{profile.email}</span>
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <PhoneIcon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors">
                    Téléphone
                  </h3>
                  <a 
                    href={`tel:${profile.gsm}`}
                    className="group/link inline-flex items-center text-green-300 hover:text-green-200 transition-colors text-lg"
                  >
                    <span className="group-hover/link:translate-x-1 transition-transform">{profile.gsm}</span>
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MapPinIcon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    Adresse
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {profile.affiliation}
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BuildingOffice2Icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">
                    Laboratoire
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Laboratoire STIC - Sciences et Technologies de l'Information et de la Communication
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Availability Card */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-700/20 backdrop-blur-sm border border-white/10 rounded-3xl p-12 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-8">
                  <SparklesIcon className="h-10 w-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-6">
                  Disponibilité
                </h3>
                
                <div className="space-y-4 text-slate-300">
                  <p className="text-lg">
                    Disponible pour rendez-vous sur demande par email ou téléphone.
                  </p>
                  <p className="text-sm opacity-75">
                    * Consultations en ligne également possibles
                  </p>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-blue-300 font-medium mb-4">Réponse garantie sous 24h</p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                Liens Rapides
              </h3>
              
              <div className="space-y-4">
                <a 
                  href="#research" 
                  className="group flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-slate-300 group-hover:text-white transition-colors">Mes Recherches</span>
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>
                
                <a 
                  href="#publications" 
                  className="group flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-slate-300 group-hover:text-white transition-colors">Publications</span>
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>
                
                <a 
                  href="#teaching" 
                  className="group flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-slate-300 group-hover:text-white transition-colors">Enseignement</span>
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection