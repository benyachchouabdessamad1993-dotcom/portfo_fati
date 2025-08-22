import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { usePortfolio } from '../contexts/PortfolioContext'
import { getImageUrl } from '../utils/imageUtils'
import { 
  Bars3Icon, 
  XMarkIcon, 
  Cog6ToothIcon, 
  UserCircleIcon,
  ChevronDownIcon,
  HomeIcon,
  UserIcon,
  BeakerIcon,
  CpuChipIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

const Header = () => {
  const { portfolioData } = usePortfolio()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Détection de la section active
      const sections = ['home', 'about', 'research', 'competences', 'publications', 'teaching', 'projects', 'responsibilities', 'contact']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Accueil', href: '#home', id: 'home', icon: HomeIcon },
    { name: 'À propos', href: '#about', id: 'about', icon: UserIcon },
    { name: 'Recherche', href: '#research', id: 'research', icon: BeakerIcon },
    { name: 'Compétences', href: '#competences', id: 'competences', icon: CpuChipIcon },
    { name: 'Publications', href: '#publications', id: 'publications', icon: DocumentTextIcon },
    { name: 'Enseignement', href: '#teaching', id: 'teaching', icon: AcademicCapIcon },
    { name: 'Projets', href: '#projects', id: 'projects', icon: BriefcaseIcon },
    { name: 'Responsabilités', href: '#responsibilities', id: 'responsibilities', icon: BuildingOfficeIcon },
    { name: 'Contact', href: '#contact', id: 'contact', icon: EnvelopeIcon },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-2xl shadow-2xl border-b border-slate-200/50' 
        : 'bg-gradient-to-r from-slate-900/90 via-slate-800/85 to-slate-900/90 backdrop-blur-xl'
    }`}>
      <nav className="container-max">
        <div className="flex justify-between items-center py-4">
          {/* Logo avec image de profil modernisé */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center space-x-4 hover:scale-105 transition-transform duration-300">
              {/* Image de profil avec effets avancés */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/30 group-hover:ring-blue-400/70 transition-all duration-300 shadow-xl">
                  {/* Image de profil */}
                  {portfolioData?.profile?.photo ? (
                    <img
                      src={getImageUrl(portfolioData.profile.photo)}
                      alt="Photo de profil"
                      className="w-14 h-14 rounded-full object-cover border-2 border-white/20"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextElementSibling.style.display = 'block'
                      }}
                      onLoad={(e) => {
                        e.target.style.display = 'block'
                        if (e.target.nextElementSibling) {
                          e.target.nextElementSibling.style.display = 'none'
                        }
                      }}
                    />
                  ) : null}
                  
                  {/* Avatar par défaut (fallback) */}
                  <UserCircleIcon 
                    className={`w-14 h-14 text-white/80 ${
                      portfolioData?.profile?.photo ? 'hidden' : 'block'
                    }`}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              </div>
              
              {/* Nom et titre */}
              <div className="hidden md:block">
                <div className={`font-bold text-lg transition-colors duration-300 ${
                  isScrolled ? 'text-slate-800' : 'text-white'
                }`}>
                  {portfolioData?.profile?.prenom} {portfolioData?.profile?.nom}
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  isScrolled ? 'text-slate-600' : 'text-slate-300'
                }`}>
                  {portfolioData?.profile?.fonction || 'Enseignant Chercheur'}
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation desktop ultra-moderne */}
          <div className="hidden xl:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative group flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? isScrolled 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-white/20 text-white backdrop-blur-sm border border-white/30'
                      : isScrolled 
                        ? 'text-slate-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50' 
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.name}
                  
                  {/* Indicateur actif */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
                  )}
                  
                  {/* Effet hover */}
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
                </a>
              )
            })}            
            {/* Suppression du bouton admin - lignes 135-147 à retirer */}
            {/* <div className="ml-6 pl-6 border-l border-slate-300/30">
              <Link
                to="/login"
                className={`group flex items-center px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl ${
                  isScrolled
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30'
                }`}
              >
                <Cog6ToothIcon className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                  Admin
                </span>
              </Link>
            </div> */}
          </div>

          {/* Menu burger moderne pour tablettes */}
          <div className="xl:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`relative p-3 rounded-2xl transition-all duration-300 hover:scale-110 group ${
                isScrolled
                  ? 'text-slate-700 hover:bg-slate-100 shadow-lg'
                  : 'text-white hover:bg-white/15 backdrop-blur-sm border border-white/20'
              }`}
            >
              <div className="relative w-6 h-6">
                <span className={`absolute top-1 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}></span>
                <span className={`absolute top-3 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}></span>
                <span className={`absolute top-5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Menu mobile/tablette ultra-moderne */}
        <div className={`xl:hidden overflow-hidden transition-all duration-500 ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/98 backdrop-blur-2xl border-t border-slate-200/50 shadow-2xl rounded-b-3xl mx-4 mb-4">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {navigation.map((item, index) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`group relative flex items-center px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 hover:scale-105 ${
                        isActive
                          ? isScrolled
                            ? 'bg-white text-slate-800 shadow-xl'
                            : 'bg-white/25 text-white backdrop-blur-sm border border-white/40 shadow-2xl'
                          : isScrolled
                            ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-lg hover:shadow-xl'
                            : 'text-white hover:bg-white/15 backdrop-blur-sm border border-white/20 hover:border-white/40'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                        {item.name}
                      </span>
                      <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header