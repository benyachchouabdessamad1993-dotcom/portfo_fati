import React from 'react'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  AcademicCapIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="container-max section-padding relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">Dr. Fatima LAKRAMI</div>
                <div className="text-blue-300 text-sm">Enseignant Chercheur</div>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6 max-w-md">
              Spécialisée dans les technologies de l'information et de la communication 
              pour l'éducation et la formation. Vice-directrice du Laboratoire STIC.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/in/fatima-lakrami-96ab23155/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <span className="text-sm font-bold">Li</span>
              </a>
              <a 
                href="https://www.researchgate.net/profile/Fatima-Lakrami-3" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-10 h-10 bg-white/10 hover:bg-green-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <span className="text-sm font-bold">RG</span>
              </a>
              <a 
                href="https://www.youtube.com/results?search_query=stic+laboratory" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-10 h-10 bg-white/10 hover:bg-red-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <span className="text-sm font-bold">YT</span>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full mr-3"></div>
              Contact
            </h3>
            <div className="space-y-4">
              <div className="group flex items-start space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-blue-400 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <a 
                  href="mailto:lakrami.f@ucd.ac.ma"
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                >
                  lakrami.f@ucd.ac.ma
                </a>
              </div>
              <div className="group flex items-start space-x-3">
                <PhoneIcon className="h-5 w-5 text-blue-400 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <a 
                  href="tel:+212690999246"
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                >
                  +212 6 90 99 92 46
                </a>
              </div>
              <div className="group flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-blue-400 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-slate-300 text-sm leading-relaxed">
                  Département de Physique<br />
                  Faculté des Sciences<br />
                  Université Chouaib Doukkali
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
              Navigation
            </h3>
            <div className="space-y-3">
              {[
                { name: 'À propos', href: '#about' },
                { name: 'Recherche', href: '#research' },
                { name: 'Compétences', href: '#competences' },
                { name: 'Publications', href: '#publications' },
                { name: 'Enseignement', href: '#teaching' },
                { name: 'Projets', href: '#projects' },
                { name: 'Responsabilités', href: '#responsibilities' },
                { name: 'Contact', href: '#contact' }
              ].map((item) => (
                <a 
                  key={item.name}
                  href={item.href} 
                  className="group flex items-center text-slate-300 hover:text-white transition-all duration-300 text-sm"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {item.name}
                  </span>
                  <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-400 text-sm">Portfolio en ligne</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                © {new Date().getFullYear()} Dr. Fatima LAKRAMI. Tous droits réservés.
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Portfolio académique hébergé et sécurisé
              </p>
            </div>
            
            <div className="text-slate-500 text-xs">
              Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer