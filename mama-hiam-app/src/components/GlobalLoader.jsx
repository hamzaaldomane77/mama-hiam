import React from 'react';
import { motion } from 'framer-motion';

function GlobalLoader({ message = 'جاري تحميل الموقع...' }) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center" data-testid="global-loader">
      <div className="text-center">
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

        {/* أنيميشن اللودينغ */}
        <div className="relative mb-6">
          <motion.div
            className="w-16 h-16 border-4 border-primary-orange border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          
          {/* دوائر متحركة */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-8 h-8 bg-primary-orange rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>

        {/* نص التحميل */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-dark-blue mb-2">
            مرحباً بك في ماما هيام
          </h2>
          <p className="text-gray-600 mb-4">
            {message}
          </p>
          
          {/* نقاط متحركة */}
          <div className="flex items-center justify-center space-x-1 space-x-reverse">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary-orange rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* خلفية متدرجة */}
        <div className="absolute inset-0 bg-gradient-to-br from-light-yellow/20 to-cream-beige/30 -z-10" />
      </div>
    </div>
  );
}

export default GlobalLoader; 