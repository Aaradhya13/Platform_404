import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const TranslationTest = () => {
  const { currentLanguage, translate, toggleLanguage } = useTranslation();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Translation Test</h2>
      <p className="mb-2">Current Language: {currentLanguage}</p>
      
      <div className="space-y-2 mb-4">
        <p>{translate('Home')}</p>
        <p>{translate('Route Map')}</p>
        <p>{translate('Service Status')}</p>
        <p>{translate('Metro Transit')}</p>
      </div>
      
      <button 
        onClick={toggleLanguage}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Toggle Language
      </button>
    </div>
  );
};

export default TranslationTest;
