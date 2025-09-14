import { useState, useEffect } from 'react';

// Translation dictionary
const translations = {
  en: {
    'Metro Transit': 'Metro Transit',
    'City Transport': 'City Transport',
    'Home': 'Home',
    'Route Map': 'Route Map',
    'Schedules': 'Schedules',
    'Tickets': 'Tickets',
    'Payments': 'Payments',
    'Stations': 'Stations',
    'Service Alerts': 'Service Alerts',
    'My Account': 'My Account',
    'Settings': 'Settings',
    'Help & Support': 'Help & Support',
    'Guest User': 'Guest User',
    'Not signed in': 'Not signed in',
    'Service Status': 'Service Status',
    'All lines operational': 'All lines operational',
    'Next Train': 'Next Train',
    'Downtown Line': 'Downtown Line',
    'minutes': 'minutes',
    'Quick Buy': 'Quick Buy',
    'Single journey ticket': 'Single journey ticket',
    'Quick Actions': 'Quick Actions',
    'Plan Journey': 'Plan Journey',
    'Live Times': 'Live Times',
    'Buy Tickets': 'Buy Tickets',
    'Find Stations': 'Find Stations',
    'Service Announcements': 'Service Announcements',
    'Weekend Schedule Change': 'Weekend Schedule Change',
    'Modified service hours this weekend due to maintenance work.': 'Modified service hours this weekend due to maintenance work.',
    'New Mobile App': 'New Mobile App',
    'Download our new mobile app for easier journey planning.': 'Download our new mobile app for easier journey planning.',
    'English': 'English',
    'Site Map': 'Site Map'
  },
  ml: {
    'Metro Transit': 'മെട്രോ ട്രാൻസിറ്റ്',
    'City Transport': 'സിറ്റി ട്രാൻസ്പോർട്ട്',
    'Home': 'ഹോം',
    'Route Map': 'റൂട്ട് മാപ്പ്',
    'Schedules': 'ഷെഡ്യൂളുകൾ',
    'Tickets': 'ടിക്കറ്റുകൾ',
    'Payments': 'പേയ്മെന്റുകൾ',
    'Stations': 'സ്റ്റേഷനുകൾ',
    'Service Alerts': 'സേവന അലേർട്ടുകൾ',
    'My Account': 'എന്റെ അക്കൗണ്ട്',
    'Settings': 'സെറ്റിംഗുകൾ',
    'Help & Support': 'സഹായവും പിന്തുണയും',
    'Guest User': 'അതിഥി ഉപയോക്താവ്',
    'Not signed in': 'സൈൻ ഇൻ ചെയ്തിട്ടില്ല',
    'Service Status': 'സേവന നില',
    'All lines operational': 'എല്ലാ ലൈനുകളും പ്രവർത്തനക്ഷമം',
    'Next Train': 'അടുത്ത ട്രെയിൻ',
    'Downtown Line': 'ഡൗൺടൗൺ ലൈൻ',
    'minutes': 'മിനിറ്റ്',
    'Quick Buy': 'പെട്ടെന്ന് വാങ്ങുക',
    'Single journey ticket': 'സിംഗിൾ ജേർണി ടിക്കറ്റ്',
    'Quick Actions': 'പെട്ടെന്നുള്ള പ്രവർത്തനങ്ങൾ',
    'Plan Journey': 'യാത്ര ആസൂത്രണം ചെയ്യുക',
    'Live Times': 'തത്സമയ സമയം',
    'Buy Tickets': 'ടിക്കറ്റുകൾ വാങ്ങുക',
    'Find Stations': 'സ്റ്റേഷനുകൾ കണ്ടെത്തുക',
    'Service Announcements': 'സേവന അറിയിപ്പുകൾ',
    'Weekend Schedule Change': 'വാരാന്ത്യ ഷെഡ്യൂൾ മാറ്റം',
    'Modified service hours this weekend due to maintenance work.': 'മെയിന്റനൻസ് ജോലികൾ കാരണം ഈ വാരാന്ത്യത്തിൽ സേവന സമയം മാറ്റി.',
    'New Mobile App': 'പുതിയ മൊബൈൽ ആപ്പ്',
    'Download our new mobile app for easier journey planning.': 'എളുപ്പമുള്ള യാത്രാ ആസൂത്രണത്തിനായി ഞങ്ങളുടെ പുതിയ മൊബൈൽ ആപ്പ് ഡൗൺലോഡ് ചെയ്യുക.',
    'English': 'ഇംഗ്ലീഷ്',
    'Site Map': 'സൈറ്റ് മാപ്പ്'
  }
};

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const translate = (key) => {
    return translations[currentLanguage]?.[key] || key;
  };

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'ml' : 'en');
  };

  return {
    currentLanguage,
    translate,
    toggleLanguage,
    setLanguage: setCurrentLanguage
  };
};
