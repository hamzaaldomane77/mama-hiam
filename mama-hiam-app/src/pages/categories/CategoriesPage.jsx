import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { fetchCategories } from "../../services/api";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب الفئات عند تحميل المكون
  useEffect(() => {
    loadCategories();
  }, []);

  // دالة جلب الفئات
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCategories();
      
      if (data && Array.isArray(data.data)) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('حدث خطأ في تحميل الأصناف. يرجى المحاولة مرة أخرى.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // تكوين تأثير لظهور البطاقات
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  // مكون التحميل
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-orange"></div>
    </div>
  );

  return (
    <div className="relative min-h-screen">
      {/* خلفية مبسطة وأنيقة */}
      <div className="fixed inset-0 bg-gradient-to-br from-cream-beige via-orange-50 to-amber-50"></div>
      
      {/* طبقة تدرج خفيفة */}
      <div className="fixed inset-0 bg-gradient-to-tr from-primary-orange/10 via-transparent to-dark-blue/5"></div>

      {/* عناصر زخرفية مبسطة */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-primary-orange/20 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-dark-blue/15 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-100/30 blur-3xl"></div>
      </div>

      {/* محتوى الصفحة */}
      <div className="relative z-10">
        <div className="container mx-auto py-24 px-4">
          {/* العنوان الرئيسي */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-center text-dark-blue mb-4">
              تصفح الأصناف
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary-orange to-transparent"></div>
            <p className="text-center text-dark-blue/70 mt-6 text-lg max-w-2xl mx-auto">
              اكتشف مجموعتنا المتنوعة من الأصناف المميزة المصممة خصيصاً لراحة وأناقة أطفالك
            </p>
          </motion.div>

          {/* عرض رسالة الخطأ */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl text-center shadow-lg"
            >
              <div className="flex items-center justify-center mb-2">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
              <button 
                onClick={loadCategories}
                className="mt-3 bg-primary-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                إعادة المحاولة
              </button>
            </motion.div>
          )}

          {/* عرض التحميل أو الأصناف */}
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* عرض الأصناف */}
              <AnimatePresence>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 25px 50px -12px rgba(249, 115, 22, 0.25)",
                      }}
                      className="group relative rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link to={`/products?category=${encodeURIComponent(category.name)}`}>
                        {/* صورة الفئة */}
                        <div className="relative overflow-hidden">
                          <motion.img
                            src={category.image_url || 'https://placehold.co/400x300/FFEED9/333333?text=صورة+الصنف'}
                            alt={category.name}
                            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/400x300/FFEED9/333333?text=صورة+الصنف';
                            }}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          />
                          
                          {/* تدرج شفاف فوق الصورة */}
                          <div className="absolute inset-0 bg-gradient-to-t from-dark-blue/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* أيقونة السهم */}
                          <div className="absolute bottom-4 left-4 w-10 h-10 bg-primary-orange/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>

                        {/* محتوى الفئة */}
                        <div className="p-6">
                          <motion.h3 
                            className="text-xl font-bold text-dark-blue group-hover:text-primary-orange transition-colors duration-300 mb-2"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {category.name}
                          </motion.h3>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-dark-blue/60 text-sm font-medium">
                              استكشف المجموعة
                            </span>
                            
                            <motion.div 
                              className="flex items-center text-primary-orange group-hover:text-orange-600 transition-colors"
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <span className="text-sm font-medium ml-1">تصفح</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                              </svg>
                            </motion.div>
                          </div>
                        </div>

                        {/* حد سفلي ملون */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-orange to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* رسالة عند عدم وجود أصناف */}
              {categories.length === 0 && !loading && !error && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100"
                >
                  <div className="max-w-md mx-auto">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                    >
                      <svg
                        className="w-20 h-20 mx-auto text-dark-blue/40 mb-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-dark-blue mb-3">
                      لا توجد أصناف متوفرة حالياً
                    </h3>
                    <p className="text-dark-blue/60 mb-6">
                      نعمل على إضافة المزيد من الأصناف الرائعة. تابعونا للحصول على أحدث المجموعات!
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button 
                        onClick={loadCategories}
                        className="bg-primary-orange text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                      >
                        إعادة التحديث
                      </button>
                      <Link 
                        to="/products" 
                        className="bg-white border-2 border-primary-orange text-primary-orange px-6 py-3 rounded-lg hover:bg-primary-orange hover:text-white transition-all font-medium"
                      >
                        تصفح جميع المنتجات
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* قسم إضافي - دعوة للعمل */}
              {categories.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="mt-12 text-center bg-gradient-to-r from-primary-orange/10 to-orange-100/50 rounded-2xl p-8 backdrop-blur-sm border border-orange-200"
                >
                  <h2 className="text-2xl lg:text-3xl font-bold text-dark-blue mb-4">
                    لم تجد ما تبحث عنه؟
                  </h2>
                  <p className="text-dark-blue/70 mb-6 max-w-2xl mx-auto">
                    تصفح جميع منتجاتنا أو استخدم البحث للعثور على ما تحتاجه بالضبط
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      to="/products" 
                      className="bg-primary-orange text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-lg hover:shadow-xl"
                    >
                      تصفح جميع المنتجات
                    </Link>
                    <Link 
                      to="/contact" 
                      className="bg-white border-2 border-primary-orange text-primary-orange px-8 py-3 rounded-lg hover:bg-primary-orange hover:text-white transition-all font-medium"
                    >
                      اتصل بنا
                    </Link>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage; 