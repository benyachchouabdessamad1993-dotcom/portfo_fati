import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Middleware de logging pour debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

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
  console.log('=== INITIALISATION DE LA BASE DE DONNÉES ===')
  
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
  
  console.log('Vérification utilisateur admin existant:', adminExists ? 'TROUVÉ' : 'NON TROUVÉ')
  
  let adminUserId;
  
  if (!adminExists) {
    console.log('Création de l\'utilisateur admin...')
    const hashedPassword = bcrypt.hashSync('admin123', 10)
    const insertUser = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')
    const result = insertUser.run('lakrami.f@ucd.ac.ma', hashedPassword)
    adminUserId = result.lastInsertRowid;
    
    console.log('Utilisateur admin créé avec succès - ID:', adminUserId)
    
    // Créer le profil par défaut
    const defaultProfile = {
      user_id: adminUserId,
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
      photo: '',
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
    
    console.log('Profil par défaut créé avec succès')
  } else {
    adminUserId = adminExists.id
    console.log('Utilisateur admin existant - ID:', adminUserId)
  }
  
  // Vérifier que l'utilisateur a bien été créé/existe
  const finalCheck = db.prepare('SELECT * FROM users WHERE email = ?').get('lakrami.f@ucd.ac.ma')
  console.log('Vérification finale utilisateur:', finalCheck ? 'OK' : 'ERREUR')
  if (finalCheck) {
    console.log('Email:', finalCheck.email)
    console.log('Password hash existe:', finalCheck.password_hash ? 'OUI' : 'NON')
  }
}

// Routes d'authentification
app.post('/api/auth/signin', (req, res) => {
  try {
    console.log('=== TENTATIVE DE CONNEXION ===')
    console.log('Email reçu:', req.body.email)
    console.log('Password reçu:', req.body.password ? '[MASQUÉ]' : 'VIDE')
    console.log('Body complet:', JSON.stringify(req.body, null, 2))
    
    const { email, password } = req.body
    
    if (!email || !password) {
      console.log('ERREUR: Email ou mot de passe manquant')
      return res.status(400).json({ success: false, error: 'Email et mot de passe requis' })
    }

    if (password.length < 6) {
      console.log('ERREUR: Mot de passe trop court')
      return res.status(400).json({ success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' })
    }

    console.log('Recherche utilisateur dans la base...')
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    
    if (!user) {
      console.log('Utilisateur non trouvé:', email)
      // Lister tous les utilisateurs pour debug
      const allUsers = db.prepare('SELECT email FROM users').all()
      console.log('Utilisateurs existants:', allUsers.map(u => u.email))
      return res.status(401).json({ success: false, error: 'Utilisateur non trouvé' })
    }
    
    console.log('Utilisateur trouvé, vérification du mot de passe...')
    const isValidPassword = bcrypt.compareSync(password, user.password_hash)
    
    if (!isValidPassword) {
      console.log('Mot de passe incorrect pour:', email)
      return res.status(401).json({ success: false, error: 'Mot de passe incorrect' })
    }
    
    console.log('Connexion réussie pour:', email)
    res.json({ 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email 
      } 
    })
  } catch (error) {
    console.error('Erreur de connexion:', error)
    res.status(500).json({ success: false, error: 'Erreur de connexion' })
  }
})

// Routes pour les profils
// Current routes that might need updating:
app.get('/api/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params
    let profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId)
    
    if (!profile) {
      // Retourner un profil vide par défaut sans INSERT défectueux
      profile = {
        user_id: parseInt(userId),
        nom: '',
        prenom: '',
        nationalite: '',
        gsm: '',
        grade: '',
        fonction: '',
        email: '',
        affiliation: '',
        laboratoire: '',
        equipe: '',
        mission: '',
        photo: '',
        linkedin: '',
        researchgate: '',
        youtube: ''
      }
    }
    
    res.json(profile)
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error)
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du profil' })
  }
})

app.put('/api/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params
    const profileData = req.body
    
    // Vérifier si le profil existe
    const existingProfile = db.prepare('SELECT id FROM profiles WHERE user_id = ?').get(userId)
    
    if (existingProfile) {
      // Mettre à jour le profil existant
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
    } else {
      // Créer un nouveau profil
      const stmt = db.prepare(`
        INSERT INTO profiles (
          user_id, nom, prenom, nationalite, gsm, grade, fonction, 
          email, affiliation, laboratoire, equipe, mission, 
          photo, linkedin, researchgate, youtube
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      
      const result = stmt.run(
        userId,
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
        profileData.youtube
      )
      
      res.json({ success: true, changes: result.changes, created: true })
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour du profil', details: error.message })
  }
})

// Routes pour les sections
app.get('/api/sections/:userId', (req, res) => {
  try {
    const { userId } = req.params
    const sections = db.prepare('SELECT * FROM sections WHERE user_id = ? ORDER BY section_order').all(userId)
    const formattedSections = sections.map(section => {
      try {
        return {
          ...section,
          content: section.content ? JSON.parse(section.content) : null
        }
      } catch (parseError) {
        console.error('Erreur parsing section content:', parseError)
        return {
          ...section,
          content: null
        }
      }
    })
    
    res.json(formattedSections)
  } catch (error) {
    console.error('Erreur serveur sections:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des sections', details: error.message })
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

// Route pour réorganiser les sections
app.put('/api/sections/reorder', (req, res) => {
  try {
    const { sections } = req.body
    
    if (!sections || !Array.isArray(sections)) {
      return res.status(400).json({ success: false, error: 'Données de sections invalides' })
    }

    // Utiliser une transaction pour mettre à jour l'ordre de toutes les sections
    const updateOrder = db.prepare('UPDATE sections SET section_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    
    const transaction = db.transaction((sectionsToUpdate) => {
      for (const section of sectionsToUpdate) {
        updateOrder.run(section.order, section.id)
      }
    })
    
    transaction(sections)
    
    res.json({ success: true, message: 'Ordre des sections mis à jour avec succès' })
  } catch (error) {
    console.error('Erreur lors de la réorganisation des sections:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de la réorganisation des sections' })
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

// Configuration multer pour l'upload de fichiers (DÉPLACER ICI)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, 'profile-' + uniqueSuffix + ext)
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB max
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Seuls les fichiers image sont autorisés'), false)
    }
  }
})

// Routes API d'upload (UNE SEULE FOIS)
app.post('/api/upload/photo', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Aucun fichier fourni' })
    }
    
    const fileUrl = `/uploads/${req.file.filename}`
    
    res.json({ 
      success: true, 
      url: fileUrl,
      filename: req.file.filename
    })
  } catch (error) {
    console.error('Erreur upload:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de l\'upload' })
  }
})

app.get('/api/check-image/:filename', (req, res) => {
  try {
    const { filename } = req.params
    const imagePath = path.join(__dirname, 'uploads', filename)
    
    if (fs.existsSync(imagePath)) {
      res.json({ exists: true, url: `/uploads/${filename}` })
    } else {
      res.json({ exists: false })
    }
  } catch (error) {
    res.status(500).json({ exists: false, error: error.message })
  }
})

// Servir les fichiers statiques depuis le dossier uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// En production, servir les fichiers statiques du frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')))
  
  // IMPORTANT: Le catch-all doit être en dernier, après toutes les routes API
  app.get('*', (req, res) => {
    // Vérifier que ce n'est pas une route API
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Route API non trouvée' })
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
  console.log(`Mode: ${process.env.NODE_ENV || 'development'}`)
})

// FIN DU FICHIER - Supprimer tout le reste
