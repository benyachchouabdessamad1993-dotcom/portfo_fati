// ... existing code ...

const handlePasswordChange = async (data) => {
  try {
    const response = await fetch('/api/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user?.id // Ajouter l'ID utilisateur dans les headers
      },
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        userId: user?.id
      })
    })

    const result = await response.json()
    
    if (result.success) {
      toast.success('Mot de passe modifié avec succès!')
      resetPasswordForm()
    } else {
      toast.error(result.error || 'Erreur lors du changement de mot de passe')
    }
  } catch (error) {
    toast.error('Erreur de connexion')
  }
}

// ... existing code ...