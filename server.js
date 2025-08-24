import express from 'express'
import cors from 'cors'
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

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Chemin du fichier de données JSON
const dataPath = path.join(__dirname, 'data.json')

// Fonction pour lire les données
const readData = () => {
  try {
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8')
      return JSON.parse(data)
    }
    return { users: [], profiles: [], sections: [] }
  } catch (error) {
    console.error('Erreur lecture données:', error)
    return { users: [], profiles: [], sections: [] }
  }
}

// Fonction pour écrire les données
const writeData = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Erreur écriture données:', error)
    return false
  }
}

// Initialiser les données par défaut
const initDatabase = () => {
  console.log('=== INITIALISATION DES DONNÉES ===')
  
  try {
    let data = readData()
    
    // Créer l'utilisateur admin s'il n'existe pas
    const adminExists = data.users.find(u => u.email === 'lakrami.f@ucd.ac.ma')
    
    if (!adminExists) {
      console.log('Création de l\'utilisateur admin...')
      const hashedPassword = bcrypt.hashSync('admin123', 10)
      
      const adminUser = {
        id: 1,
        email: 'lakrami.f@ucd.ac.ma',
        password_hash: hashedPassword,
        created_at: new Date().toISOString()
      }
      
      data.users.push(adminUser)
      
      // Créer le profil par défaut
      const defaultProfile = {
        id: 1,
        user_id: 1,
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
        mission: 'Contribuer à l\'avancement des technologies de l\'information et de la communication dans l\'éducation, en développant des solutions innovantes pour l\'enseignement et la formation à l\'ère numérique.',
        created_at: new Date().toISOString()
      }
      
      data.profiles.push(defaultProfile)
      
      // Sauvegarder les données
      if (writeData(data)) {
        console.log('✅ Utilisateur admin et profil créés avec succès')
      } else {
        throw new Error('Erreur lors de la sauvegarde des données')
      }
    } else {
      console.log('✅ Utilisateur admin existe déjà')
    }
    
    console.log('=== INITIALISATION TERMINÉE ===')
    console.log('Utilisateurs:', data.users.length)
    console.log('Profils:', data.profiles.length)
    console.log('Sections:', data.sections.length)
    
  } catch (error) {
    console.error('❌ ERREUR LORS DE L\'INITIALISATION:', error)
    throw error
  }
}

// Routes d'authentification
app.post('/api/auth/signin', (req, res) => {
  try {
    console.log('=== TENTATIVE DE CONNEXION ===')
    console.log('Email reçu:', req.body.email)
    console.log('Password reçu:', req.body.password ? '[MASQUÉ]' : 'VIDE')
    
    const { email, password } = req.body
    
    if (!email || !password) {
      console.log('ERREUR: Email ou mot de passe manquant')
      return res.status(400).json({ success: false, error: 'Email et mot de passe requis' })
    }

    if (password.length < 6) {
      console.log('ERREUR: Mot de passe trop court')
      return res.status(400).json({ success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' })
    }

    console.log('Lecture des données...')
    const data = readData()
    
    console.log('Recherche utilisateur dans les données...')
    const user = data.users.find(u => u.email === email)
    
    if (!user) {
      console.log('Utilisateur non trouvé:', email)
      console.log('Utilisateurs existants:', data.users.map(u => u.email))
      return res.status(401).json({ success: false, error: 'Utilisateur non trouvé' })
    }
    
    console.log('Utilisateur trouvé, vérification du mot de passe...')
    const isValidPassword = bcrypt.compareSync(password, user.password_hash)
    
    if (!isValidPassword) {
      console.log('Mot de passe incorrect pour:', email)
      return res.status(401).json({ success: false, error: 'Mot de passe incorrect' })
    }
    
    console.log('✅ Connexion réussie pour:', email)
    res.json({ 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email 
      } 
    })
  } catch (error) {
    console.error('❌ Erreur de connexion:', error)
    res.status(500).json({ success: false, error: 'Erreur de connexion: ' + error.message })
  }
})

// Routes pour les profils
app.get('/api/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params
    const data = readData()
    
    let profile = data.profiles.find(p => p.user_id == userId)
    
    if (!profile) {
      // Retourner un profil vide par défaut
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
    
    const data = readData()
    const existingProfileIndex = data.profiles.findIndex(p => p.user_id == userId)
    
    if (existingProfileIndex !== -1) {
      // Mettre à jour le profil existant
      data.profiles[existingProfileIndex] = {
        ...data.profiles[existingProfileIndex],
        ...profileData,
        updated_at: new Date().toISOString()
      }
    } else {
      // Créer un nouveau profil
      const newProfile = {
        id: data.profiles.length + 1,
        user_id: parseInt(userId),
        ...profileData,
        created_at: new Date().toISOString()
      }
      data.profiles.push(newProfile)
    }
    
    if (writeData(data)) {
      res.json({ success: true })
    } else {
      throw new Error('Erreur lors de la sauvegarde')
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour du profil' })
  }
})

// Routes pour les sections
app.get('/api/sections/:userId', (req, res) => {
  try {
    const { userId } = req.params
    const data = readData()
    
    const sections = data.sections.filter(s => s.user_id == userId)
    const formattedSections = sections.map(section => {
      try {
        return {
          ...section,
          content: typeof section.content === 'string' && (section.type === 'cards' || section.type === 'list') 
            ? JSON.parse(section.content) 
            : section.content
        }
      } catch (error) {
        console.error(`Erreur parsing section ${section.id}:`, error)
        return {
          ...section,
          content: section.content
        }
      }
    })
    
    res.json(formattedSections)
  } catch (error) {
    console.error('Erreur serveur sections:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des sections' })
  }
})

app.put('/api/sections/:userId/:sectionId', (req, res) => {
  try {
    const { userId, sectionId } = req.params
    const sectionData = req.body
    
    console.log('=== MISE À JOUR SECTION ===')
    console.log('Section ID:', sectionId)
    console.log('User ID:', userId)
    console.log('Data reçue:', JSON.stringify(sectionData, null, 2))
    
    const data = readData()
    const existingSectionIndex = data.sections.findIndex(s => s.id === sectionId && s.user_id == userId)
    
    if (existingSectionIndex !== -1) {
      // Mettre à jour
      data.sections[existingSectionIndex] = {
        ...data.sections[existingSectionIndex],
        ...sectionData,
        content: typeof sectionData.content === 'string' ? sectionData.content : JSON.stringify(sectionData.content),
        updated_at: new Date().toISOString()
      }
      console.log('Section mise à jour:', data.sections[existingSectionIndex])
    } else {
      // Créer
      const newSection = {
        id: sectionId,
        user_id: parseInt(userId),
        ...sectionData,
        content: typeof sectionData.content === 'string' ? sectionData.content : JSON.stringify(sectionData.content),
        created_at: new Date().toISOString()
      }
      data.sections.push(newSection)
      console.log('Nouvelle section créée:', newSection)
    }
    
    if (writeData(data)) {
      console.log('✅ Section sauvegardée avec succès')
      res.json({ success: true })
    } else {
      throw new Error('Erreur lors de la sauvegarde')
    }
  } catch (error) {
    console.error('Erreur mise à jour section:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour de la section' })
  }
})

app.post('/api/sections/:userId', (req, res) => {
  try {
    const { userId } = req.params
    const sectionData = req.body
    
    const data = readData()
    const sectionId = `section-${Date.now()}`
    
    const newSection = {
      id: sectionId,
      user_id: parseInt(userId),
      ...sectionData,
      content: JSON.stringify(sectionData.content),
      created_at: new Date().toISOString()
    }
    
    data.sections.push(newSection)
    
    if (writeData(data)) {
      res.json({ success: true, id: sectionId })
    } else {
      throw new Error('Erreur lors de la sauvegarde')
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la section' })
  }
})

app.delete('/api/sections/:userId/:sectionId', (req, res) => {
  try {
    const { userId, sectionId } = req.params
    const data = readData()
    
    data.sections = data.sections.filter(s => !(s.id === sectionId && s.user_id == userId))
    
    if (writeData(data)) {
      res.json({ success: true })
    } else {
      throw new Error('Erreur lors de la sauvegarde')
    }
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

    const data = readData()
    
    // Mettre à jour l'ordre des sections
    sections.forEach(sectionUpdate => {
      const sectionIndex = data.sections.findIndex(s => s.id === sectionUpdate.id)
      if (sectionIndex !== -1) {
        data.sections[sectionIndex].section_order = sectionUpdate.order
        data.sections[sectionIndex].updated_at = new Date().toISOString()
      }
    })
    
    if (writeData(data)) {
      res.json({ success: true, message: 'Ordre des sections mis à jour avec succès' })
    } else {
      throw new Error('Erreur lors de la sauvegarde')
    }
  } catch (error) {
    console.error('Erreur lors de la réorganisation des sections:', error)
    res.status(500).json({ success: false, error: 'Erreur lors de la réorganisation des sections' })
  }
})

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || req.body.userId || req.params.userId
    
    if (!userId) {
      return res.status(401).json({ success: false, error: 'ID utilisateur requis' })
    }
    
    const data = readData()
    const user = data.users.find(u => u.id == userId)
    
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
    
    const data = readData()
    const userIndex = data.users.findIndex(u => u.id == userId)
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' })
    }
    
    const user = data.users[userIndex]
    const isCurrentPasswordValid = bcrypt.compareSync(currentPassword, user.password_hash)
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ success: false, error: 'Mot de passe actuel incorrect' })
    }
    
    // Hasher le nouveau mot de passe
    const newPasswordHash = bcrypt.hashSync(newPassword, 10)
    
    // Mettre à jour le mot de passe
    data.users[userIndex].password_hash = newPasswordHash
    data.users[userIndex].updated_at = new Date().toISOString()
    
    if (writeData(data)) {
      res.json({ success: true, message: 'Mot de passe modifié avec succès' })
    } else {
      res.status(500).json({ success: false, error: 'Erreur lors de la modification du mot de passe' })
    }
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// Configuration multer pour l'upload de fichiers
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

// Routes d'upload
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

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// En production, servir les fichiers statiques du frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')))
  
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Route API non trouvée' })
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
}

// Initialiser les données au démarrage
try {
  initDatabase()
  console.log('✅ Données initialisées avec succès')
} catch (error) {
  console.error('❌ ERREUR CRITIQUE lors de l\'initialisation:', error)
  console.error('⚠️ Le serveur va démarrer malgré l\'erreur d\'initialisation')
}

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`)
  console.log(`Mode: ${process.env.NODE_ENV || 'development'}`)
  console.log('=== SERVEUR PRÊT ===')
})