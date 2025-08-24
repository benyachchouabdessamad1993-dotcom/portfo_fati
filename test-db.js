import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('=== TEST DE LA BASE DE DONNÉES ===')

try {
  const dbPath = path.join(__dirname, 'portfolio.db')
  console.log('Chemin de la base:', dbPath)
  
  const db = new Database(dbPath)
  console.log('✅ Base de données ouverte')
  
  // Vérifier les tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
  console.log('Tables existantes:', tables.map(t => t.name))
  
  // Vérifier les utilisateurs
  const users = db.prepare('SELECT * FROM users').all()
  console.log('Utilisateurs dans la base:', users.length)
  
  if (users.length > 0) {
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}`)
      console.log(`- Password hash: ${user.password_hash ? 'EXISTE' : 'MANQUANT'}`)
      
      // Tester le mot de passe
      if (user.password_hash) {
        const testPassword = 'admin123'
        const isValid = bcrypt.compareSync(testPassword, user.password_hash)
        console.log(`- Test mot de passe "${testPassword}": ${isValid ? '✅ VALIDE' : '❌ INVALIDE'}`)
      }
    })
  } else {
    console.log('❌ Aucun utilisateur trouvé')
  }
  
  // Vérifier les profils
  const profiles = db.prepare('SELECT * FROM profiles').all()
  console.log('Profils dans la base:', profiles.length)
  
  db.close()
  console.log('✅ Test terminé')
  
} catch (error) {
  console.error('❌ Erreur lors du test:', error.message)
  console.error('Stack:', error.stack)
}