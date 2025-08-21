import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Servir les fichiers statiques en production
// Remove these lines (20-22):
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'dist')))
// }

// Créer ou ouvrir la base de données
const dbPath = path.join(__dirname, 'portfolio.db')
const db = new Database(dbPath)

// Activer les clés étrangères
db.pragma('foreign_keys = ON')

// Initialiser les tables
const initDatabase = () => {
  // Table des utilisateurs
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Table des profils
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      nom TEXT,
      prenom TEXT,
      nationalite TEXT,
      gsm TEXT,
      grade TEXT,
      fonction TEXT,
      email TEXT,
      affiliation TEXT,
      laboratoire TEXT,
      equipe TEXT,
      mission TEXT,
      photo TEXT,
      linkedin TEXT,
      researchgate TEXT,
      youtube TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `)

  // Table des sections
  db.exec(`
    CREATE TABLE IF NOT EXISTS sections (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT,
      visible BOOLEAN DEFAULT 1,
      section_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `)

  // Créer l'utilisateur admin par défaut s'il n'existe pas
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('lakrami.f@ucd.ac.ma')
  
  let adminUserId;
  
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10)
    const insertUser = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')
    const result = insertUser.run('lakrami.f@ucd.ac.ma', hashedPassword)
    adminUserId = result.lastInsertRowid;
    
    console.log('Utilisateur admin créé avec succès')
    
    // Créer le profil par défaut
    const defaultProfile = {
      user_id: result.lastInsertRowid,
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
      photo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      mission: 'Contribuer à l\'avancement des technologies de l\'information et de la communication dans l\'éducation, en développant des solutions innovantes pour l\'enseignement et la formation à l\'ère numérique.'
    }
    
    const insertProfile = db.prepare(`
      INSERT INTO profiles (user_id, nom, prenom, nationalite, gsm, grade, fonction, email, affiliation, laboratoire, equipe, mission, photo, linkedin, researchgate, youtube)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    insertProfile.run(
      defaultProfile.user_id,
      defaultProfile.nom,
      defaultProfile.prenom,
      defaultProfile.nationalite,
      defaultProfile.gsm,
      defaultProfile.grade,
      defaultProfile.fonction,
      defaultProfile.email,
      defaultProfile.affiliation,
      defaultProfile.laboratoire,
      defaultProfile.equipe,
      defaultProfile.mission,
      defaultProfile.photo,
      defaultProfile.linkedin,
      defaultProfile.researchgate,
      defaultProfile.youtube
    )
    
    // Créer les sections par défaut
    const defaultSections = [
      {
        id: 'axes-recherche',
        title: 'Axes de Recherche',
        type: 'research',
        content: JSON.stringify([
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
        ]),
        visible: 1,
        section_order: 1
      },
      {
        id: 'competences',
        title: 'Compétences',
        type: 'skills',
        content: JSON.stringify({}),
        visible: 1,
        section_order: 2
      },
      {
        id: 'publications',
        title: 'Publications',
        type: 'publications',
        content: JSON.stringify({}),
        visible: 1,
        section_order: 3
      },
      {
        id: 'enseignement',
        title: 'Enseignement',
        type: 'teaching',
        content: JSON.stringify([
          // Faculté des Sciences d'El Jadida - Licence
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
          // Faculté des Sciences d'El Jadida - Master
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
          // Cours supplémentaires
          {
            id: 21, // ✅ Changé de 1 à 21
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
            id: 22, // ✅ Changé de 2 à 22
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
            id: 23, // ✅ Changé de 3 à 23
            title: "Administration Système Linux",
            level: "Licence 3",
            hours: "30h",
            establishment: "EST de Sidi Bennour",
            color: "from-green-500 to-teal-500",
            description: "Administration des systèmes Linux",
            objectives: "Maîtriser l'administration Linux",
            skills: "Shell scripting, services système, monitoring"
          }
        ]),
        visible: 1,
        section_order: 4
      },
      {
        id: 'projets',
        title: 'Projets',
        type: 'projects',
        content: JSON.stringify({}),
        visible: 1,
        section_order: 5
      },
      {
        id: 'responsabilites',
        title: 'Responsabilités',
        type: 'responsibilities',
        content: JSON.stringify({}),
        visible: 1,
        section_order: 6
      }
    ]
    
    const insertSection = db.prepare(`
      INSERT INTO sections (id, user_id, title, type, content, visible, section_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    
    defaultSections.forEach(section => {
      const existingSectionIds = db.prepare('SELECT id FROM sections WHERE user_id = ?').all(adminUserId).map(row => row.id)
      if (!existingSectionIds.includes(section.id)) {
        insertSection.run(
          section.id,
          adminUserId,
          section.title,
          section.type,
          section.content,
          section.visible,
          section.section_order
        )
        console.log(`Section '${section.title}' créée`)
      }
    })
  } // ← Accolade fermante manquante pour le bloc if (!adminExists)
} // ← Accolade fermante pour la fonction initDatabase

// Routes d'authentification
app.post('/api/auth/signin', (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email et mot de passe requis' })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' })
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Utilisateur non trouvé' })
    }
    
    const isValidPassword = bcrypt.compareSync(password, user.password_hash)
    
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Mot de passe incorrect' })
    }
    
    res.json({ 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email 
      } 
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur de connexion' })
  }
})

// Routes pour les profils
// Current routes that might need updating:
app.get('/api/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params
    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId)
    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' })
  }
})

app.put('/api/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params
    const profileData = req.body
    
    const stmt = db.prepare(`
      UPDATE profiles 
      SET nom = ?, prenom = ?, nationalite = ?, gsm = ?, grade = ?, fonction = ?, 
          email = ?, affiliation = ?, laboratoire = ?, equipe = ?, mission = ?, 
          photo = ?, linkedin = ?, researchgate = ?, youtube = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `)
    
    const result = stmt.run(
      profileData.nom,
      profileData.prenom,
      profileData.nationalite,
      profileData.gsm,
      profileData.grade,
      profileData.fonction,
      profileData.email,
      profileData.affiliation,
      profileData.laboratoire,
      profileData.equipe,
      profileData.mission,
      profileData.photo,
      profileData.linkedin,
      profileData.researchgate,
      profileData.youtube,
      userId
    )
    
    res.json({ success: true, changes: result.changes })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour du profil' })
  }
})

// Routes pour les sections
app.get('/api/sections/:userId', (req, res) => {
  try {
    const { userId } = req.params
    const sections = db.prepare('SELECT * FROM sections WHERE user_id = ? ORDER BY section_order').all(userId)
    const formattedSections = sections.map(section => ({
      ...section,
      content: section.content ? JSON.parse(section.content) : null
    }))
    res.json(formattedSections)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des sections' })
  }
})

app.put('/api/sections/:userId/:sectionId', (req, res) => {
  try {
    const { userId, sectionId } = req.params
    const sectionData = req.body
    
    const existingSection = db.prepare('SELECT id FROM sections WHERE id = ? AND user_id = ?').get(sectionId, userId)
    
    if (existingSection) {
      // Mettre à jour
      const stmt = db.prepare(`
        UPDATE sections 
        SET title = ?, type = ?, content = ?, visible = ?, section_order = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `)
      
      const result = stmt.run(
        sectionData.title,
        sectionData.type,
        JSON.stringify(sectionData.content),
        sectionData.visible ? 1 : 0,
        sectionData.order || 0,
        sectionId,
        userId
      )
      
      res.json({ success: true, changes: result.changes })
    } else {
      // Créer
      const stmt = db.prepare(`
        INSERT INTO sections (id, user_id, title, type, content, visible, section_order)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      
      const result = stmt.run(
        sectionId,
        userId,
        sectionData.title,
        sectionData.type,
        JSON.stringify(sectionData.content),
        sectionData.visible ? 1 : 0,
        sectionData.order || 0
      )
      
      res.json({ success: true, changes: result.changes })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour de la section' })
  }
})

app.post('/api/sections/:userId', (req, res) => {
  try {
    const { userId } = req.params
    const sectionData = req.body
    
    const sectionId = `section-${Date.now()}`
    const stmt = db.prepare(`
      INSERT INTO sections (id, user_id, title, type, content, visible, section_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(
      sectionId,
      userId,
      sectionData.title,
      sectionData.type,
      JSON.stringify(sectionData.content),
      sectionData.visible ? 1 : 0,
      sectionData.order || 0
    )
    
    res.json({ success: true, id: sectionId })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la section' })
  }
})

app.delete('/api/sections/:userId/:sectionId', (req, res) => {
  try {
    const { userId, sectionId } = req.params
    const stmt = db.prepare('DELETE FROM sections WHERE id = ? AND user_id = ?')
    const result = stmt.run(sectionId, userId)
    
    res.json({ success: true, changes: result.changes })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression de la section' })
  }
})

// Initialiser la base de données
initDatabase()

// Middleware d'authentification simple
const authenticateToken = (req, res, next) => {
  try {
    // Pour cette application, nous utilisons l'ID utilisateur depuis les headers ou les paramètres
    const userId = req.headers['x-user-id'] || req.body.userId || req.params.userId
    
    if (!userId) {
      return res.status(401).json({ success: false, error: 'ID utilisateur requis' })
    }
    
    // Vérifier que l'utilisateur existe
    const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(userId)
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Utilisateur non trouvé' })
    }
    
    req.user = user
    next()
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Token invalide' })
  }
}

// Route pour changer le mot de passe
app.post('/api/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user.id
    
    // Vérifier le mot de passe actuel
    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(userId)
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' })
    }
    
    const isCurrentPasswordValid = bcrypt.compareSync(currentPassword, user.password_hash)
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ success: false, error: 'Mot de passe actuel incorrect' })
    }
    
    // Hasher le nouveau mot de passe
    const newPasswordHash = bcrypt.hashSync(newPassword, 10)
    
    // Mettre à jour le mot de passe
    const stmt = db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    const result = stmt.run(newPasswordHash, userId)
    
    if (result.changes > 0) {
      res.json({ success: true, message: 'Mot de passe modifié avec succès' })
    } else {
      res.status(500).json({ success: false, error: 'Erreur lors de la modification du mot de passe' })
    }
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// Keep and modify the production block at the end (lines 747-751):
if (process.env.NODE_ENV === 'production') {
  // Serve static files first
  app.use(express.static(path.join(__dirname, 'dist')))
  
  // Then handle React Router catch-all (must be last)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
}

// Start server (KEEP ONLY THIS ONE)
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
  console.log(`Mode: ${process.env.NODE_ENV || 'development'}`)
})
