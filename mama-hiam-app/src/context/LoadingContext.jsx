import React, { createContext, useContext, useState } from 'react';

// إنشاء Context
const LoadingContext = createContext();

// Hook مخصص لاستخدام LoadingContext
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// Provider المكون
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('جاري التحميل...');

  // دالة لإظهار الـ Loader
  const showLoading = (message = 'جاري التحميل...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  // دالة لإخفاء الـ Loader
  const hideLoading = () => {
    setIsLoading(false);
    setLoadingMessage('جاري التحميل...');
  };

  const value = {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}; 