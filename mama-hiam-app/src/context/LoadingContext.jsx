import React, { createContext, useContext, useState, useEffect } from 'react';

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

// مكون Loading مع الألوان الجديدة
const LoadingOverlay = ({ isLoading, message }) => {
  useEffect(() => {
    if (isLoading) {
      // منع التمرير أثناء التحميل
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      // إعادة تفعيل التمرير
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);
  
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
         style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
      
      {/* خلفية ملونة طفولية */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-pink-50/30 to-yellow-50/40"></div>
      
      {/* عناصر زخرفية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full blur-2xl animate-pulse" 
             style={{ backgroundColor: '#A7D8F0', opacity: 0.3 }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 rounded-full blur-2xl animate-pulse" 
             style={{ backgroundColor: '#FADADD', opacity: 0.4 }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-2xl animate-pulse" 
             style={{ backgroundColor: '#FFF4B1', opacity: 0.2 }}></div>
      </div>

      <div className="relative z-10 text-center p-8 rounded-2xl shadow-2xl border backdrop-blur-sm"
           style={{ backgroundColor: '#FFFFFF', borderColor: '#F5F5F5' }}>
        
        {/* Loading Spinner */}
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent"
               style={{ borderColor: '#E53935' }}>
          </div>
        </div>

        {/* Loading Message */}
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#E53935' }}>
          {message}
        </h2>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1 space-x-reverse">
          <div className="w-2 h-2 rounded-full animate-bounce" 
               style={{ backgroundColor: '#A7D8F0', animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full animate-bounce" 
               style={{ backgroundColor: '#FADADD', animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full animate-bounce" 
               style={{ backgroundColor: '#FFF4B1', animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
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
      <LoadingOverlay isLoading={isLoading} message={loadingMessage} />
    </LoadingContext.Provider>
  );
}; 