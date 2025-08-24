import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getApiUrl, safeJsonParse } from '../utils/api'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté (session locale)
    const savedUser = localStorage.getItem('portfolio_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem('portfolio_user')
      }
    }
  }, [])

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      console.log('=== TENTATIVE DE CONNEXION FRONTEND ===')
      console.log('Email:', email)
      console.log('Password length:', password?.length)
      
      // Validation côté client
      if (!email || !password) {
        throw new Error('Email et mot de passe requis')
      }

      if (password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères')
      }

      // Appel API pour l'authentification
      const apiUrl = getApiUrl('/api/auth/signin')
      console.log('URL API utilisée:', apiUrl)
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      console.log('Réponse serveur status:', response.status)
      console.log('Réponse serveur ok:', response.ok)
      
      const result = await response.json()
      console.log('Réponse serveur:', result)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      // Sauvegarder la session
      const userData = {
        id: result.user.id,
        email: result.user.email,
        loginTime: new Date().toISOString()
      }
      
      localStorage.setItem('portfolio_user', JSON.stringify(userData))
      setUser(userData)
      
      toast.success('Connexion réussie!')
      return { data: userData, error: null }
      
    } catch (error) {
      let errorMessage = 'Erreur de connexion'
      
      if (error.message.includes('Utilisateur non trouvé')) {
        errorMessage = 'Adresse email non reconnue'
      } else if (error.message.includes('Mot de passe incorrect')) {
        errorMessage = 'Mot de passe incorrect'
      } else if (error.message.includes('requis')) {
        errorMessage = error.message
      } else if (error.message.includes('6 caractères')) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      // Supprimer la session locale
      localStorage.removeItem('portfolio_user')
      setUser(null)
      
      toast.success('Déconnexion réussie!')
    } catch (error) {
      toast.error('Erreur lors de la déconnexion')
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}