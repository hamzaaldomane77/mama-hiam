import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fetchBranches } from '../../services/api';

// مكون كارد الفرع
function BranchCard({ branch, index }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // تأثير الظهور التدريجي
  const entryVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: index * 0.2 }
    }
  };

  // فتح الخريطة في نافذة جديدة
  const openMap = () => {
    if (branch.map_url) {
      window.open(branch.map_url, '_blank');
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={entryVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover={{
        scale: 1.02,
        y: -5,
        boxShadow: "0px 15px 25px rgba(0,0,0,0.1)"
      }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:border-primary-orange/30 transition-all duration-300"
    >
      <div className="p-6">
        {/* Header مع أيقونة الفرع */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-orange to-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-dark-blue">{branch.name}</h3>
             
            </div>
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>

        {/* معلومات الفرع */}
        <div className="space-y-3 mb-6">
          {/* العنوان */}
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="w-5 h-5 text-primary-orange mt-1">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">العنوان</p>
              <p className="text-gray-600">{branch.address}</p>
            </div>
          </div>

          {/* رقم الهاتف */}
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="w-5 h-5 text-primary-orange mt-1">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">رقم الهاتف</p>
              <p className="text-gray-600" dir="ltr">{branch.phone}</p>
            </div>
          </div>
        </div>

        {/* أزرار التفاعل */}
        <div className="flex space-x-3 space-x-reverse">
          {/* زر عرض الموقع */}
          <button
            onClick={openMap}
            className="flex-1 bg-gradient-to-r from-primary-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 space-x-reverse"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
            </svg>
            <span>عرض الموقع</span>
          </button>

          {/* زر الاتصال */}
          <button
            onClick={() => window.open(`tel:${branch.phone}`, '_self')}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// مكون الصفحة الرئيسي
function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب الفروع عند تحميل الصفحة
  useEffect(() => {
    const loadBranches = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchBranches();
        
        console.log('🏢 Branches API Response:', response);
        
        if (response.data && response.data.length > 0) {
          setBranches(response.data);
        } else {
          setBranches([]);
        }
      } catch (err) {
        console.error('Error loading branches:', err);
        setError('فشل في تحميل الفروع. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    loadBranches();
  }, []);

  // تأثير الظهور للعنوان
  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-yellow/30 to-cream-beige/50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-dark-blue mb-4">
            أفرعنا
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-orange to-orange-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            نحن متواجدون في عدة مواقع لخدمتك بأفضل شكل ممكن. اختر الفرع الأقرب إليك
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin inline-block w-12 h-12 border-4 border-primary-orange border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600 text-lg">جاري تحميل الفروع...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 mb-6 text-lg">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}

        {/* Branches Grid */}
        {!loading && !error && branches.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {branches.map((branch, index) => (
              <BranchCard key={branch.id} branch={branch} index={index} />
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && branches.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg">لا توجد فروع متاحة حالياً</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BranchesPage; 