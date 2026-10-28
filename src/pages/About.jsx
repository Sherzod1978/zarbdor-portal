const seasonStyles = {
    autumn: { 
      name: 'Kuz', 
      bgGradient: 'from-amber-100 via-orange-100 to-amber-200', 
      heroBg: 'from-amber-600 to-orange-700',
      accentColor: 'text-amber-950', 
      particle: '🍁' 
    },
    winter: { 
      name: 'Qish', 
      bgGradient: 'from-slate-100 via-sky-100 to-blue-200', 
      heroBg: 'from-sky-600 to-blue-800',
      accentColor: 'text-sky-950', 
      particle: '❄'
    },
    spring: { 
      name: 'Bahor', 
      bgGradient: 'from-emerald-100 via-pink-100 to-teal-100', 
      heroBg: 'from-emerald-600 to-teal-700',
      accentColor: 'text-emerald-950', 
      particle: '🌸'
    },
    summer: { 
      name: 'Yoz', 
      bgGradient: 'from-yellow-100 via-amber-100 to-orange-200', 
      heroBg: 'from-amber-500 to-yellow-600',
      accentColor: 'text-amber-950',
      particle: ' '
    }
  };

  const current = seasonStyles[season];