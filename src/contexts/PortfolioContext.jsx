import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const PortfolioContext = createContext({})

export const usePortfolio = () => {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }
  return context
}

// Données par défaut du portfolio
const defaultPortfolioData = {
  profile: {
    nom: 'LAKRAMI',
    prenom: 'Fatima',
    nationalite: 'Marocaine',
    gsm: '+212 6 90 99 92 46',
    grade: 'Maitre de conférence Habilité à la Faculté des Sciences d\'El Jadida',
    fonction: 'Enseignant Chercheur',
    email: 'lakrami.f@ucd.ac.ma',
    affiliation: 'Département de Physique, Faculté des Sciences, Université Chouaib Doukkali',
    laboratoire: 'Vice directrice du Laboratoire des Sciences et Technologies de l\'information et de la communication STIC, faculté des sciences, université Chouaib Doukkali',
    equipe: 'Responsable d\'équipe de recherche : Technologies de l\'Information et de la Communication pour l\'Education et la Formation (TICEF)',
    youtube: 'https://www.youtube.com/results?search_query=stic+laboratory',
    linkedin: 'https://www.linkedin.com/in/fatima-lakrami-96ab23155/',
    researchgate: 'https://www.researchgate.net/profile/Fatima-Lakrami-3',
    photo: '', // Remplacer l'URL Pexels par une chaîne vide
    mission: 'Contribuer à l\'avancement des technologies de l\'information et de la communication dans l\'éducation, en développant des solutions innovantes pour l\'enseignement et la formation à l\'ère numérique.',
    langues: [
      { nom: 'Arabe', niveau: 'Natif', color: 'from-blue-500 to-cyan-500' },
      { nom: 'Français', niveau: 'Courant', color: 'from-green-500 to-teal-500' },
      { nom: 'Anglais', niveau: 'Professionnel', color: 'from-purple-500 to-pink-500' }
    ]
  },
  sections: [
    {
      id: 'etat-civil',
      title: 'État Civil',
      type: 'text',
      order: 1,
      visible: true,
      content: `
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-4">
            <div><strong>Nom :</strong> LAKRAMI</div>
            <div><strong>Prénom :</strong> Fatima</div>
            <div><strong>Nationalité :</strong> Marocaine</div>
            <div><strong>GSM :</strong> 06 90 99 92 46</div>
          </div>
        </div>
      `
    },
    {
      id: 'statut-professionnel',
      title: 'Statut Professionnel',
      type: 'text',
      order: 2,
      visible: true,
      content: `
        <div class="space-y-4">
          <div><strong>Grade :</strong> Maitre de conférence Habilité à la Faculté des Sciences d'El Jadida</div>
          <div><strong>Fonction :</strong> Enseignant Chercheur</div>
          <div><strong>Adresse électronique :</strong> lakrami.f@ucd.ac.ma</div>
          <div><strong>Affiliation :</strong> Département de Physique, Faculté des Sciences, Université Chouaib Doukkali</div>
          <div><strong>Laboratoire d'attachement :</strong> Vice directrice du Laboratoire des Sciences et Technologies de l'information et de la communication STIC, faculté des sciences, université Chouaib Doukkali</div>
          <div><strong>Équipe de recherche :</strong> Responsable d'équipe de recherche : Technologies de l'Information et de la Communication pour l'Education et la Formation (TICEF)</div>
          <div class="mt-4">
            <strong>Liens professionnels :</strong><br>
            • Chaîne Youtube : <a href="https://www.youtube.com/results?search_query=stic+laboratory" target="_blank" class="text-blue-600">STIC Laboratory</a><br>
            • LinkedIn : <a href="https://www.linkedin.com/in/fatima-lakrami-96ab23155/" target="_blank" class="text-blue-600">Profil LinkedIn</a><br>
            • ResearchGate : <a href="https://www.researchgate.net/profile/Fatima-Lakrami-3" target="_blank" class="text-blue-600">Profil ResearchGate</a>
          </div>
        </div>
      `
    },
    {
      id: 'axes-recherche',
      title: 'Axes de Recherche',
      type: 'list',
      order: 3,
      visible: true,
      content: [
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
    },
    {
      id: 'enseignement',
      title: 'Enseignement',
      type: 'cards',
      order: 3.5,
      visible: true,
      content: [
        // Faculté des sciences d'El Jadida - Cycle Licence
        {
          id: 4,
          title: "Les fondamentaux en Réseaux informatiques",
          level: "Licence 3",
          semester: "S6",
          hours: "30h",
          establishment: "Faculté des Sciences d'El Jadida",
          program: "Licence fondamentale en sciences de la matière physique, OPTION : fondamentaux en Télécommunications et Réseaux",
          color: "from-blue-500 to-cyan-500",
          description: "Cours sur les fondamentaux des réseaux informatiques",
          objectives: "Maîtriser les concepts de base des réseaux",
          skills: "Configuration réseau, protocoles, architecture réseau"
        },
        {
          id: 5,
          title: "Les systèmes embarqués et programmation VHDL",
          level: "Licence 3",
          semester: "S5",
          hours: "35h",
          establishment: "Faculté des Sciences d'El Jadida",
          program: "Licence professionnelle en électronique et informatique industrielle",
          color: "from-purple-500 to-pink-500",
          description: "Programmation VHDL et systèmes embarqués",
          objectives: "Maîtriser la programmation VHDL et les systèmes embarqués",
          skills: "VHDL, FPGA, systèmes embarqués, conception numérique"
        },
        {
          id: 6,
          title: "TPs en algèbre de bool",
          level: "Licence 2",
          semester: "S3",
          hours: "20h",
          establishment: "Faculté des Sciences d'El Jadida",
          program: "Licence en SMI",
          color: "from-green-500 to-teal-500",
          description: "Travaux pratiques en algèbre de Boole",
          objectives: "Comprendre les fondements de l'algèbre de Boole",
          skills: "Logique booléenne, circuits logiques, simplification"
        },
        {
          id: 7,
          title: "TPs en électromagnétique dans le vide",
          level: "Licence 2",
          semester: "S3",
          hours: "25h",
          establishment: "Faculté des Sciences d'El Jadida",
          program: "Licence en SMA/SMP/SMC",
          color: "from-orange-500 to-red-500",
          description: "Travaux pratiques en électromagnétisme",
          objectives: "Comprendre les phénomènes électromagnétiques",
          skills: "Électromagnétisme, ondes, champs électriques et magnétiques"
        },
        {
          id: 8,
          title: "TPs en électronique de base",
          level: "Licence 2",
          semester: "S4",
          hours: "25h",
          establishment: "Faculté des Sciences d'El Jadida",
          program: "Licence en SMP",
          color: "from-indigo-500 to-purple-500",
          description: "Travaux pratiques en électronique fondamentale",
          objectives: "Maîtriser les bases de l'électronique",
          skills: "Circuits électroniques, composants, mesures"
        },
        {
          id: 9,
          title: "Tps en électronique numérique",
          level: "Licence 3",
          semester: "S6",
          hours: "25h",
          establishment: "Faculté des Sciences d'El Jadida",
          program: "Licence en SMP",
          color: "from-teal-500 to-blue-500",
          description: "Travaux pratiques en électronique numérique",
          objectives: "Comprendre les systèmes numériques",
          skills: "Logique numérique, circuits intégrés, microprocesseurs"
        },
        
        // Faculté des sciences d'El Jadida - Cycle Master
        {
          id: 10,
          title: "Architecture des Réseaux LAN et WAN",
          level: "Master 1",
          semester: "S1",
          hours: "40h",
          establishment: "Faculté des Sciences d'El Jadida",
          program: "Master en Instrumentation, Réseaux et Énergies Renouvelables",
          color: "from-blue-500 to-cyan-500",
          description: "Architecture et conception des réseaux locaux et étendus",
          objectives: "Maîtriser l'architecture des réseaux LAN/WAN",
          skills: "Conception réseau, protocoles, routage, commutation"
        },
        {
          id: 11,
          title: "Réseaux d'Entreprise : Architecture et Technologies",
          level: "Master 1",
          semester: "S1",
          hours: "40h",
          establishment: "Faculté des Sciences d'El Jadida",
          program: "Master en Télécommunications, Réseaux et cyber-sécurité",
          color: "from-green-500 to-teal-500",
          description: "Architecture et technologies des réseaux d'entreprise",
          objectives: "Concevoir et gérer des réseaux d'entreprise",
          skills: "Architecture réseau, technologies entreprise, sécurité"
        },
        {
          id: 12,
          title: "Administration et Métrologie dans réseaux",
          level: "Master 1",
          semester: "S2",
          hours: "35h",
          establishment: "Faculté des Sciences d'El Jadida",
          program: "Master en Télécommunications, Réseaux et cyber-sécurité",
          color: "from-purple-500 to-pink-500",
          description: "Administration et métrologie des réseaux",
          objectives: "Maîtriser l'administration et la surveillance réseau",
          skills: "Administration réseau, métrologie, monitoring, SNMP"
        },
        {
          id: 13,
          title: "Sécurité des systèmes d'exploitation et applications",
          level: "Master 2",
          semester: "S3",
          hours: "35h",
          establishment: "Faculté des Sciences d'El Jadida",
          program: "Master en Télécommunications, Réseaux et cyber-sécurité",
          color: "from-red-500 to-pink-500",
          description: "Sécurité des systèmes et applications",
          objectives: "Comprendre et implémenter la sécurité des systèmes",
          skills: "Sécurité OS, hardening, audit sécurité, vulnérabilités"
        },
        
        // SUPEMIR
        {
          id: 14,
          title: "ADMINISTRATION SYSTEMES ET RESEAUX",
          level: "Licence 3",
          semester: "S3",
          hours: "40h",
          establishment: "SUPEMIR",
          program: "Filière IRM (Informatique, réseaux et multimédia)",
          color: "from-indigo-500 to-purple-500",
          description: "Administration des systèmes et réseaux",
          objectives: "Maîtriser l'administration système et réseau",
          skills: "Administration Linux/Windows, gestion réseau, services"
        },
        {
          id: 15,
          title: "CRYPTOGRAPHIE AVANCEE & BLOCKCHAIN",
          level: "Master 1",
          semester: "S5",
          hours: "35h",
          establishment: "SUPEMIR",
          program: "IRM option réseaux et cybersécurité",
          color: "from-cyan-500 to-blue-500",
          description: "Cryptographie avancée et technologies blockchain",
          objectives: "Maîtriser la cryptographie moderne et la blockchain",
          skills: "Cryptographie, blockchain, sécurité, smart contracts"
        },
        
        // ENSA d'El Jadida
        {
          id: 16,
          title: "Ingénierie des réseaux d'opérateurs et MPLS",
          level: "Ingénieur",
          semester: "5ème année",
          hours: "40h",
          establishment: "ENSA d'El Jadida",
          program: "Filière ITE",
          color: "from-emerald-500 to-cyan-500",
          description: "Ingénierie des réseaux d'opérateurs et protocole MPLS",
          objectives: "Concevoir et gérer des réseaux d'opérateurs",
          skills: "MPLS, BGP, réseaux opérateurs, QoS, ingénierie trafic"
        },
        {
          id: 17,
          title: "Architecture des réseaux LAN et WAN et modèle TCP/IP",
          level: "Ingénieur",
          semester: "3ème année",
          hours: "35h",
          establishment: "ENSA d'El Jadida",
          program: "Filière ISIC et ITE",
          color: "from-blue-500 to-cyan-500",
          description: "Architecture réseau et modèle TCP/IP",
          objectives: "Comprendre l'architecture réseau et TCP/IP",
          skills: "TCP/IP, architecture réseau, protocoles, routage"
        },
        
        // ESEF d'El Jadida
        {
          id: 18,
          title: "Les TIC pour l'enseignement",
          level: "Master",
          semester: "S1/S2",
          hours: "30h",
          establishment: "ESEF d'El Jadida",
          program: "ESEF toutes filières comprises",
          color: "from-pink-500 to-rose-500",
          description: "Technologies de l'information et communication pour l'enseignement",
          objectives: "Intégrer les TIC dans l'enseignement",
          skills: "Outils numériques, pédagogie numérique, e-learning"
        },
        
        // FLSH d'El Jadida
        {
          id: 19,
          title: "Introduction aux Nouvelles Technologies de l'information et de la communication (NTIC)",
          level: "Master 1",
          semester: "S1",
          hours: "25h",
          establishment: "FLSH d'El Jadida",
          program: "Master des études interculturelles",
          color: "from-violet-500 to-purple-500",
          description: "Introduction aux nouvelles technologies de l'information",
          objectives: "Comprendre les enjeux des NTIC",
          skills: "Technologies numériques, communication, culture numérique"
        },
        
        // EST de Sidi Bennour
        {
          id: 20,
          title: "TP réseaux de CCNA",
          level: "DUT",
          semester: "Variable",
          hours: "30h",
          establishment: "EST de Sidi Bennour",
          program: "Formation CCNA",
          color: "from-teal-500 to-blue-500",
          description: "Travaux pratiques de certification CCNA",
          objectives: "Préparer à la certification CCNA",
          skills: "Configuration Cisco, routage, commutation, dépannage"
        },
        
        // Cours existants conservés
        {
          id: 1,
          title: "Réseaux Informatiques",
          level: "Master 1",
          hours: "40h",
          establishment: "Faculté des Sciences d'El Jadida",
          color: "from-blue-500 to-cyan-500",
          description: "Cours sur les fondamentaux des réseaux informatiques",
          objectives: "Maîtriser les concepts des réseaux TCP/IP",
          skills: "Configuration réseau, troubleshooting, sécurité"
        },
        {
          id: 2,
          title: "Sécurité des Systèmes d'Information",
          level: "Master 2",
          hours: "35h",
          establishment: "ENSA d'El Jadida",
          color: "from-red-500 to-pink-500",
          description: "Sécurité des réseaux et systèmes",
          objectives: "Comprendre les enjeux de la cybersécurité",
          skills: "Audit sécurité, cryptographie, détection d'intrusions"
        },
        {
          id: 3,
          title: "Administration Système Linux",
          level: "Licence 3",
          hours: "30h",
          establishment: "EST de Sidi Bennour",
          color: "from-green-500 to-teal-500",
          description: "Administration des systèmes Linux",
          objectives: "Maîtriser l'administration Linux",
          skills: "Shell scripting, services système, monitoring"
        }
      ]
    },
    {
      id: 'competences',
      title: 'Compétences',
      type: 'cards',
      order: 4,
      visible: true,
      content: [
        {
          id: 1,
          title: "Administration Réseaux & Systèmes",
          icon: "ComputerDesktopIcon",
          color: "from-blue-500 to-cyan-500",
          description: "Expertise complète en administration des services réseaux et systèmes d'exploitation avec une maîtrise approfondie des technologies Microsoft et Linux",
          skills: [
            "Administration des services réseaux (WEB, DNS, SMTP, DHCP, VOIP, WSUS, SMS, NTP, DFS, SAMBA, FTP, VNC, RDP)",
            "Gestion des serveurs Windows Server (2008, 2012, 2016, 2019, 2022)",
            "Administration Linux (Ubuntu, CentOS, Red Hat, Debian)",
            "Virtualisation avec VMware vSphere, Hyper-V, VirtualBox",
            "Scripting PowerShell et Bash pour l'automatisation",
            "Gestion des Active Directory et politiques de groupe",
            "Configuration et maintenance des services de messagerie",
            "Surveillance et monitoring des infrastructures IT"
          ],
          technologies: [
            "Windows Server, Linux",
            "VMware, Hyper-V",
            "PowerShell, Bash",
            "Active Directory"
          ],
          applications: [
            "Gestion d'infrastructure",
            "Automatisation IT",
            "Support technique",
            "Optimisation système"
          ]
        },
        {
          id: 2,
          title: "Sécurité Informatique & Cybersécurité",
          icon: "ShieldCheckIcon",
          color: "from-red-500 to-pink-500",
          description: "Spécialisation avancée en sécurité des systèmes d'information avec expertise en cryptographie, audit sécurité et protection contre les cybermenaces",
          skills: [
            "Audit de sécurité et tests de pénétration",
            "Cryptographie symétrique et asymétrique",
            "Gestion des certificats et PKI",
            "Sécurisation des réseaux et pare-feu",
            "Détection et réponse aux incidents (SIEM)",
            "Analyse de vulnérabilités et remédiation",
            "Sécurité des applications web (OWASP)",
            "Conformité et gouvernance sécurité (ISO 27001)"
          ],
          technologies: [
            "Nessus, OpenVAS",
            "Wireshark, Nmap",
            "Metasploit, Burp Suite",
            "Splunk, ELK Stack"
          ],
          applications: [
            "Audit sécurité",
            "Tests d'intrusion",
            "Analyse forensique",
            "Gestion des risques"
          ]
        }
        // ... ajouter les autres compétences de la même manière
      ]
    },
    {
      id: 'publications',
      title: 'Publications',
      type: 'cards',
      order: 5,
      visible: true,
      content: [] // Données des publications
    },
    {
      id: 'theses-encadrees',
      title: 'Thèses encadrées',
      type: 'cards',
      order: 5.5,
      visible: true,
      content: {
        "Réseaux informatiques et Sécurité": [
          {
            id: 1,
            sujet: "Vers une Gestion Intelligente du Stationnement Urbain : Méthode de Localisation Indoor et Système AI pour les Parkings Connectés",
            statut: "Soutenue",
            annee: "2024",
            color: "from-blue-500 to-cyan-500"
          },
          {
            id: 2,
            sujet: "Contribution à l'amélioration des performances des réseaux sans fil basés sur la technologie Software-Defined Network",
            statut: "Soutenue",
            annee: "2021",
            color: "from-green-500 to-teal-500"
          },
          {
            id: 3,
            sujet: "Sécurité du Cloud Computing: IA et SDN pour la gestion dynamique évolutive des règles de sécurité",
            statut: "En cours",
            annee: "depuis 2022",
            color: "from-orange-500 to-red-500"
          }
        ],
        "E-learning et IA": [
          {
            id: 4,
            sujet: "Développement d'une approche d'adaptative Learning basée sur l'intelligence artificielle",
            statut: "Soutenue",
            annee: "2025",
            color: "from-purple-500 to-pink-500"
          },
          {
            id: 5,
            sujet: "Étude et proposition de nouveaux mécanismes basés sur l'intelligence artificielle pour l'amélioration du processus d'évaluation des apprentissages en ligne",
            statut: "En cours",
            annee: "depuis 2022",
            color: "from-indigo-500 to-purple-500"
          },
          {
            id: 6,
            sujet: "Transformation digitale des territoires et entrepreneuriat",
            statut: "En cours",
            annee: "depuis 2024",
            color: "from-teal-500 to-blue-500"
          },
          {
            id: 7,
            sujet: "Conception d'un système de contrôle de gestion intelligent basé sur le smart data et l'intelligence artificielle pour améliorer la performance organisationnelle",
            statut: "En cours",
            annee: "depuis 2024",
            color: "from-emerald-500 to-cyan-500"
          }
        ]
      }
    },
    {
      id: 'projets',
      title: 'Projets',
      type: 'cards',
      order: 6,
      visible: true,
      content: [] // Données des projets
    },
    {
      id: 'responsabilites',
      title: 'Responsabilités',
      type: 'cards',
      order: 7,
      visible: true,
      content: [] // Données des responsabilités
    }
  ]
}

export const PortfolioProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState(defaultPortfolioData)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Charger les données depuis l'API au démarrage
  useEffect(() => {
    const loadPortfolioData = async () => {
      if (!user?.id) return
      
      try {
        // Dans la fonction loadPortfolioData, ligne ~485
        const profileResponse = await fetch(`/api/profile/${user.id}`)
        let profileData = null
        if (profileResponse.ok) {
          profileData = await profileResponse.json()
        } else {
          console.error('Échec de récupération du profil, status:', profileResponse.status)
        }
        
        // Charger les sections avec validation de réponse
        const sectionsResponse = await fetch(`/api/sections/${user.id}`)
        let sectionsData = null
        if (sectionsResponse.ok) {
          sectionsData = await sectionsResponse.json()
        }
        
        // Fusionner les sections de l'API avec les sections par défaut
        const mergedSections = defaultPortfolioData.sections.map(defaultSection => {
          const apiSection = sectionsData?.find(section => section.id === defaultSection.id)
          
          if (apiSection) {
            // Si l'API a une section mais avec un contenu vide, garder le contenu par défaut
            const hasEmptyContent = !apiSection.content || 
              (Array.isArray(apiSection.content) && apiSection.content.length === 0) ||
              (typeof apiSection.content === 'string' && apiSection.content.trim() === '')
            
            return {
              ...defaultSection,
              ...apiSection,
              content: hasEmptyContent ? defaultSection.content : apiSection.content
            }
          }
          
          return defaultSection
        })
        
        // Ajouter les sections de l'API qui n'existent pas dans les données par défaut
        const additionalSections = sectionsData?.filter(apiSection => 
          !defaultPortfolioData.sections.find(defaultSection => defaultSection.id === apiSection.id)
        ) || []
        
        setPortfolioData({
          profile: {
            ...defaultPortfolioData.profile,
            ...(profileData || {})
          },
          sections: [...mergedSections, ...additionalSections]
        })
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        // Fallback sur les données par défaut complètes
        setPortfolioData(defaultPortfolioData)
      }
    }
    
    loadPortfolioData()
  }, [user])

  const updateProfile = async (profileData) => {
    try {
      setLoading(true)
      
      if (!user?.id) {
        throw new Error('Utilisateur non authentifié')
      }

      // Appel API pour mettre à jour le profil
      const response = await fetch(`/api/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error)
      }

      // Mettre à jour l'état local
      setPortfolioData(prev => ({
        ...prev,
        profile: { ...prev.profile, ...profileData }
      }))
      
      return { success: true }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const updateSection = async (sectionId, sectionData) => {
    try {
      setLoading(true)
      
      if (!user?.id) {
        throw new Error('Utilisateur non authentifié')
      }

      // Appel API pour mettre à jour la section
      const response = await fetch(`/api/sections/${user.id}/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData)
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error)
      }

      // Mettre à jour l'état local
      setPortfolioData(prev => ({
        ...prev,
        sections: prev.sections.map(section =>
          section.id === sectionId ? { ...section, ...sectionData } : section
        )
      }))
      
      return { success: true }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la section:', error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const addSection = async (sectionData) => {
    try {
      setLoading(true)
      
      if (!user?.id) {
        throw new Error('Utilisateur non authentifié')
      }

      // Appel API pour ajouter la section
      const response = await fetch(`/api/sections/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...sectionData,
          order: portfolioData.sections.length + 1,
          visible: true
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error)
      }

      const newSection = {
        id: result.id,
        order: portfolioData.sections.length + 1,
        visible: true,
        ...sectionData
      }

      setPortfolioData(prev => ({
        ...prev,
        sections: [...prev.sections, newSection]
      }))
      
      return { success: true }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la section:', error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const deleteSection = async (sectionId) => {
    try {
      setLoading(true)
      
      if (!user?.id) {
        throw new Error('Utilisateur non authentifié')
      }

      // Appel API pour supprimer la section
      const response = await fetch(`/api/sections/${user.id}/${sectionId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error)
      }

      setPortfolioData(prev => ({
        ...prev,
        sections: prev.sections.filter(section => section.id !== sectionId)
      }))
      
      return { success: true }
    } catch (error) {
      console.error('Erreur lors de la suppression de la section:', error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const reorderSections = async (sections) => {
    try {
      setLoading(true)
      
      if (!user?.id) {
        throw new Error('Utilisateur non authentifié')
      }

      // Mettre à jour l'ordre via l'API
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        const response = await fetch(`/api/sections/${user.id}/${section.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...section, order: i + 1 })
        })
        
        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error)
        }
      }

      setPortfolioData(prev => ({
        ...prev,
        sections
      }))
      
      return { success: true }
    } catch (error) {
      console.error('Erreur lors de la réorganisation des sections:', error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    portfolioData,
    loading,
    updateProfile,
    updateSection,
    addSection,
    deleteSection,
    reorderSections,
  }

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}