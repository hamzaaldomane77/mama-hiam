import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

function GlobalLoader({ message = 'جاري تحميل متجر ماما هيام...' }) {
  useEffect(() => {
    // التأكد من التمرير إلى الأعلى عند ظهور الـ loader
    window.scrollTo(0, 0);
    
    // منع التمرير أثناء التحميل
    document.body.classList.add('loading');
    
    return () => {
      // إعادة تعيين الخصائص عند إزالة الـ loader
      document.body.classList.remove('loading');
    };
  }, []);
  
    return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center" data-testid="global-loader">
      <div className="text-center relative">
        {/* شعار متحرك */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <img 
            src="/logo.png" 
            alt="Mama Hieam" 
            className="h-20 w-auto mx-auto drop-shadow-lg"
          />
        </motion.div>

        {/* نص التحميل */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6"
        >
          <h2 className="text-2xl font-bold text-dark-blue mb-2">
            مرحباً بك في ماما هيام
          </h2>
          <p className="text-gray-600 text-center">
            {message}
          </p>
        </motion.div>

        {/* خلفية متدرجة */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-pink-50/20 to-yellow-50/30 -z-10 rounded-2xl" />
      </div>
    </div>
  );
}

export default GlobalLoader; 