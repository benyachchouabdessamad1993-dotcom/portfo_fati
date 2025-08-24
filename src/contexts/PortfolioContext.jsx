import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { updateFavicon, setDefaultFavicon } from '../utils/faviconUtils'

const PortfolioContext = createContext({})

export const usePortfolio = () => {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }
  return context
}

// Données par défaut du portfolio
// Export explicite pour éviter les références non définies
export const defaultPortfolioData = {
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
    photo: null, // Utiliser null au lieu d'une chaîne vide
    mission: 'Contribuer à l\'avancement des technologies de l\'information et de la communication dans l\'éducation, en développant des solutions innovantes pour l\'enseignement et la formation à l\'ère numérique.',
    langues: [
      { nom: 'Arabe', color: 'from-blue-500 to-cyan-500' },
      { nom: 'Français', color: 'from-green-500 to-teal-500' },
      { nom: 'Anglais', color: 'from-purple-500 to-pink-500' },
      { nom: 'Espagnol', color: 'from-orange-500 to-red-500' }
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
        {
          id: 3,
          title: "Virtualisation & Cloud",
          icon: "CloudIcon",
          color: "from-purple-500 to-indigo-500",
          description: "Maîtrise complète des technologies de virtualisation et d'architecture cloud avec une expertise en transformation digitale",
          skills: [
            "Virtualisation (Serveurs, Systèmes d'exploitation, Postes de travail, Applications, Stockage)",
            "Virtualisation des réseaux (NFV, SDN, SD-WAN)",
            "Conception et mise en place des réseaux sans fil avec et sans infrastructure",
            "Architecture cloud hybride et multi-cloud",
            "Conteneurisation et orchestration",
            "Infrastructure as Code (IaC)",
            "Migration vers le cloud et optimisation des coûts"
          ],
          technologies: [
            "VMware vSphere",
            "Microsoft Hyper-V",
            "Docker & Kubernetes",
            "AWS, Azure, Google Cloud"
          ],
          specialites: [
            "NFV (Network Function Virtualization)",
            "SDN (Software Defined Networking)",
            "SD-WAN (Software Defined WAN)",
            "Infrastructure hyperconvergée"
          ]
        },
        {
          id: 4,
          title: "Analyse de Données",
          icon: "ChartBarIcon",
          color: "from-green-500 to-teal-500",
          description: "Expertise en science des données avec une approche complète du Big Data, de l'analyse prédictive et de l'intelligence d'affaires",
          skills: [
            "Big Data : Architecture et traitement de données massives",
            "Data Warehouse : Conception et optimisation d'entrepôts de données",
            "Data Mining : Extraction de connaissances et patterns",
            "Analyse prédictive et modélisation statistique",
            "Visualisation de données et tableaux de bord",
            "ETL (Extract, Transform, Load) et pipelines de données",
            "Business Intelligence et aide à la décision"
          ],
          outils: [
            "Hadoop, Spark",
            "SQL Server, Oracle",
            "Python, R",
            "Tableau, Power BI"
          ],
          methodologies: [
            "CRISP-DM",
            "Agile Analytics",
            "Data Governance",
            "Machine Learning"
          ]
        },
        {
          id: 5,
          title: "Formation Digitale",
          icon: "BookOpenIcon",
          color: "from-orange-500 to-red-500",
          description: "Expertise complète en ingénierie pédagogique numérique avec une spécialisation dans les technologies éducatives innovantes",
          skills: [
            "Conception pédagogique de dispositifs de formation digitaux",
            "Maîtrise des LMS (360 Learning, Moodle, Blackboard)",
            "Conception et gestion des SPOC/MOOC",
            "Logiciels de conception de Digital Learning : Articulate, Rise, Vyond, Geniall",
            "Conception pédagogique et développement technique des solutions d'apprentissage en ligne et du micro-apprentissage innovantes et créatives",
            "Logiciels d'enregistrement et de traitement multimédia",
            "Numérisation des systèmes et processus de production / Documentaliste",
            "Enseignement à distance et classes virtuelles",
            "Gamification et serious games",
            "Réalité virtuelle et augmentée en éducation",
            "Intelligence artificielle pédagogique"
          ],
          plateformes: [
            "Moodle, 360 Learning",
            "Articulate Storyline",
            "Adobe Captivate",
            "H5P, Genially"
          ],
          methodologies: [
            "ADDIE Model",
            "Design Thinking",
            "Classe inversée",
            "Apprentissage adaptatif"
          ]
        },
        {
          id: 6,
          title: "Programmation & Développement",
          icon: "CodeBracketIcon",
          color: "from-indigo-500 to-purple-500",
          description: "Compétences solides en développement logiciel avec une expertise en programmation web, réseaux et systèmes",
          skills: [
            "Programmation : HTML, CSS, PYTHON, C/C++, JAVA, J2EE",
            "Programmation des réseaux : Sockets, JSP",
            "Expertise en CMS de gestion de contenu (JOOMLA, WORDPRESS, DRUPAL)",
            "Développement d'applications web responsives",
            "Programmation orientée objet et design patterns",
            "Développement d'APIs REST et services web",
            "Bases de données relationnelles et NoSQL",
            "Frameworks JavaScript modernes",
            "DevOps et intégration continue"
          ],
          langages: [
            "Python, Java, C/C++",
            "HTML5, CSS3, JavaScript",
            "PHP, JSP",
            "SQL, MongoDB"
          ],
          frameworks: [
            "Spring Boot, Django",
            "React, Vue.js",
            "Bootstrap, Tailwind",
            "Node.js, Express"
          ]
        },
        {
          id: 7,
          title: "Intelligence Artificielle",
          icon: "SparklesIcon",
          color: "from-pink-500 to-rose-500",
          description: "Expertise avancée en intelligence artificielle avec une spécialisation dans l'apprentissage automatique et les applications éducatives",
          skills: [
            "Machine Learning et apprentissage supervisé/non supervisé",
            "Deep Learning et réseaux de neurones",
            "Traitement du langage naturel (NLP)",
            "Vision par ordinateur et reconnaissance d'images",
            "Intelligence artificielle en éducation",
            "Systèmes de recommandation personnalisés",
            "Analyse prédictive et modélisation",
            "Éthique de l'IA et biais algorithmiques"
          ],
          technologies: [
            "TensorFlow, PyTorch",
            "Scikit-learn, Keras",
            "OpenCV, NLTK",
            "Jupyter, Google Colab"
          ],
          applications: [
            "IA pédagogique",
            "Systèmes adaptatifs",
            "Chatbots éducatifs",
            "Analyse d'apprentissage"
          ]
        }
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
  const { user } = useAuth()
  const [portfolioData, setPortfolioData] = useState(defaultPortfolioData || {})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Vérification de sécurité
  useEffect(() => {
    if (!portfolioData || !portfolioData.sections) {
      console.warn('portfolioData non définie, utilisation des données par défaut')
      setPortfolioData(defaultPortfolioData)
    }
  }, [])

  // Extraire loadPortfolioData comme fonction du composant
  // Ajouter cette fonction utilitaire au début du fichier
  const getApiUrl = (endpoint) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    return `${cleanBaseUrl}${cleanEndpoint}`
  }

  // Fonction utilitaire pour parser les réponses JSON de manière sécurisée
  const safeJsonParse = async (response) => {
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      // Si ce n'est pas du JSON, lire le texte pour debug
      const text = await response.text()
      console.error('Réponse non-JSON reçue:', text.substring(0, 200))
      throw new Error(`Réponse invalide du serveur (${response.status}): ${response.statusText}`)
    }
    return await response.json()
  }

  // Dans la fonction loadPortfolioData
  const loadPortfolioData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!user?.id) {
        // Si pas d'utilisateur connecté, utiliser les données par défaut
        setPortfolioData(defaultPortfolioData)
        setDefaultFavicon()
        return
      }

      // Récupérer le profil depuis l'API
      const profileResponse = await fetch(getApiUrl(`/api/profile/${user.id}`))
      let profileData = {}
      if (profileResponse.ok) {
        try {
          profileData = await safeJsonParse(profileResponse)
        } catch (error) {
          console.error('Erreur parsing profil:', error)
          profileData = {}
        }
      }

      // Récupérer les sections depuis l'API
      const sectionsResponse = await fetch(getApiUrl(`/api/sections/${user.id}`))
      let apiSections = []
      if (sectionsResponse.ok) {
        try {
          apiSections = await safeJsonParse(sectionsResponse)
        } catch (error) {
          console.error('Erreur parsing sections:', error)
          apiSections = []
        }
      }

      // Fusionner les sections par défaut avec celles de l'API
      const mergedSections = defaultPortfolioData.sections.map(defaultSection => {
        const apiSection = apiSections.find(s => s.id === defaultSection.id)
        return apiSection ? { ...defaultSection, ...apiSection } : defaultSection
      })

      // Ajouter les sections supplémentaires de l'API qui ne sont pas dans les défauts
      const additionalSections = apiSections.filter(apiSection => 
        !defaultPortfolioData.sections.find(defaultSection => defaultSection.id === apiSection.id)
      )
      
      setPortfolioData({
        profile: {
          ...defaultPortfolioData.profile,
          ...(profileData || {})
        },
        sections: [...mergedSections, ...additionalSections]
      })
      
      // Mettre à jour le favicon avec l'image de profil
      const photo = profileData?.photo || defaultPortfolioData.profile.photo
      if (photo) {
        updateFavicon(photo)
      } else {
        setDefaultFavicon()
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      setError(error.message)
      // Fallback sur les données par défaut complètes
      setPortfolioData(defaultPortfolioData)
      setDefaultFavicon()
    } finally {
      setLoading(false)
    }
  }

  // Charger les données depuis l'API au démarrage
  useEffect(() => {
    loadPortfolioData()
  }, [user])

  // Dans la fonction updateProfile, après la mise à jour réussie
  const updateProfile = async (profileData) => {
    try {
      setLoading(true)
      
      if (!user?.id) {
        throw new Error('Utilisateur non authentifié')
      }

      // Appel API pour mettre à jour le profil
      const response = await fetch(getApiUrl(`/api/profile/${user.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      })

      const result = await safeJsonParse(response)

      if (!result.success) {
        throw new Error(result.error)
      }

      // Recharger les données depuis l'API pour assurer la synchronisation
      await loadPortfolioData()
      
      // Mettre à jour le favicon si une nouvelle photo a été uploadée
      if (profileData.photo) {
        updateFavicon(profileData.photo)
      }
      
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
      const response = await fetch(getApiUrl(`/api/sections/${user.id}/${sectionId}`), {
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

      // Obtenir la longueur actuelle des sections via l'état
      let currentSectionsLength = 0
      setPortfolioData(prev => {
        currentSectionsLength = prev.sections.length
        return prev
      })

      // Appel API pour ajouter la section
      const response = await fetch(getApiUrl(`/api/sections/${user.id}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...sectionData,
          order: currentSectionsLength + 1,
          visible: true
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error)
      }

      const newSection = {
        id: result.id,
        order: currentSectionsLength + 1,
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
      const response = await fetch(getApiUrl(`/api/sections/${user.id}/${sectionId}`), {
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

      // Préparer les données pour la route de réorganisation
      const sectionsData = sections.map((section, index) => ({
        id: section.id,
        order: index + 1
      }))

      // Utiliser la route spécifique pour la réorganisation
      const response = await fetch(getApiUrl('/api/sections/reorder'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sections: sectionsData })
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la réorganisation')
      }

      // Mettre à jour l'état local
      setPortfolioData(prev => ({
        ...prev,
        sections: sections.map((section, index) => ({
          ...section,
          order: index + 1
        }))
      }))
      
      return { success: true }
    } catch (error) {
      console.error('Erreur lors de la réorganisation des sections:', error)
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    portfolioData,
    loading,
    error,
    loadPortfolioData,
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

const updateProfile = async (profileData) => {
  try {
    setLoading(true)
    
    if (!user?.id) {
      throw new Error('Utilisateur non authentifié')
    }
  
    // Appel API pour mettre à jour le profil
    const response = await fetch(getApiUrl(`/api/profile/${user.id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData)
    })
  
    const result = await safeJsonParse(response)
  
    if (!result.success) {
      throw new Error(result.error)
    }
  
    // Recharger les données depuis l'API pour assurer la synchronisation
    await loadPortfolioData()
    
    // Convertir l'erreur en chaîne
    const errorMessage = error instanceof Error ? error.message : String(error)
    setError(errorMessage)
    
    // Mettre à jour le favicon si une nouvelle photo a été uploadée
    if (profileData.photo) {
      updateFavicon(profileData.photo)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    return { success: false, error }
  } finally {
    setLoading(false)
  }
}