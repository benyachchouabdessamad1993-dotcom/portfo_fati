// ... existing code ...

  // Fonction pour mettre à jour le profil
  const updateProfile = async (profileData) => {
    if (!user?.id) {
      setError('Utilisateur non connecté');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl(`/api/profile/${user.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }

      await loadPortfolioData();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour une section
  const updateSection = async (sectionId, sectionData) => {
    if (!user?.id) {
      setError('Utilisateur non connecté');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl(`/api/sections/${sectionId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la section');
      }

      await loadPortfolioData();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ajouter une section
  const addSection = async (sectionData) => {
    if (!user?.id) {
      setError('Utilisateur non connecté');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl(`/api/sections`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...sectionData, userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de la section');
      }

      const newSection = await response.json();
      setPortfolioData(prev => ({
        ...prev,
        sections: [...prev.sections, newSection]
      }));
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer une section
  const deleteSection = async (sectionId) => {
    if (!user?.id) {
      setError('Utilisateur non connecté');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl(`/api/sections/${sectionId}`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la section');
      }

      setPortfolioData(prev => ({
        ...prev,
        sections: prev.sections.filter(section => section.id !== sectionId)
      }));
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour réorganiser les sections
  const reorderSections = async (sections) => {
    if (!user?.id) {
      setError('Utilisateur non connecté');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl(`/api/sections/reorder`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sections, userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la réorganisation des sections');
      }

      setPortfolioData(prev => ({ ...prev, sections }));
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

// ... existing code ...

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
  };

// ... existing code ...