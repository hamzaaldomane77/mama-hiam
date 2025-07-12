import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { fetchNewProducts } from '../../../services/api';

const PRODUCTS_TO_SHOW = 6;

// --- Product Card Component ---
function ProductCard({ product, index }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const variants = {
    hidden: { 
      opacity: 0, 
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      <Link
        to={`/products/${product.id}`}
        className="block bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
      >
        <div className="relative">
          <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
          
          {/* شارات المنتج */}
          {product.featured && (
            <div className="absolute top-2 right-2">
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                مميز
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-dark-blue mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-primary-orange font-bold text-xl">{product.price} ر.س</p>
        </div>
      </Link>
    </motion.div>
  );
}

function NewArrivals() {
  const [productsToShow, setProductsToShow] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNewProducts = async () => {
      try {
        setError(null);
        
        // جلب المنتجات الجديدة فقط (new_collection: true)
        const response = await fetchNewProducts();
        
        console.log('🔄 New Products API Response:', response.data);
        
        if (response.data && response.data.length > 0) {
          // تصفية المنتجات للتأكد من أنها جديدة فقط
          const newProducts = response.data.filter(product => product.new_collection === true);
          
          console.log('✅ Filtered New Products:', newProducts);
          
          if (newProducts.length > 0) {
            // أخذ أول 6 منتجات من المجموعة الجديدة
            setProductsToShow(newProducts.slice(0, PRODUCTS_TO_SHOW));
          } else {
            console.log('⚠️ No new products found after filtering');
            setProductsToShow([]);
          }
        } else {
          console.log('⚠️ No products in API response');
          setProductsToShow([]);
        }
      } catch (err) {
        console.error('Error loading new products:', err);
        setError('فشل في تحميل المنتجات الجديدة. يرجى المحاولة مرة أخرى.');
      }
    };

    loadNewProducts();
  }, []);

  // دالة لإعادة تحميل المنتجات
  const refreshProducts = async () => {
    setError(null);
    
    try {
      const response = await fetchNewProducts();
      
      console.log('🔄 Refresh - New Products API Response:', response.data);
      
      if (response.data && response.data.length > 0) {
        // تصفية المنتجات للتأكد من أنها جديدة فقط
        const newProducts = response.data.filter(product => product.new_collection === true);
        
        console.log('✅ Refresh - Filtered New Products:', newProducts);
        
        if (newProducts.length > 0) {
          setProductsToShow(newProducts.slice(0, PRODUCTS_TO_SHOW));
        } else {
          console.log('⚠️ Refresh - No new products found after filtering');
          setProductsToShow([]);
        }
      } else {
        console.log('⚠️ Refresh - No products in API response');
        setProductsToShow([]);
      }
    } catch (err) {
      console.error('Error refreshing new products:', err);
      setError('فشل في تحديث المنتجات الجديدة. يرجى المحاولة مرة أخرى.');
    }
  };

  if (error) {
    return (
      <section className="py-12 bg-gradient-to-br from-white via-light-orange/10 to-cream-beige/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={refreshProducts}
              className="bg-primary-orange hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg shadow transition duration-300"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (productsToShow.length === 0) {
    return null; // لا نعرض القسم إذا لم تكن هناك منتجات
  }

  return (
    <section className="py-12 bg-gradient-to-br from-white via-light-orange/10 to-cream-beige/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <h2 className="text-3xl font-bold text-center text-primary-orange">المجموعة الجديدة</h2>
          {/* زر تحديث مخفي للمطور */}
          <button 
            onClick={refreshProducts}
            className="mr-4 p-1 text-gray-400 hover:text-primary-orange transition-colors opacity-30 hover:opacity-100"
            title="تحديث المنتجات"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-5">
          {productsToShow.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link 
            to="/products"
            className="bg-primary-orange hover:opacity-90 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 inline-block transform hover:scale-105"
          >
            عرض جميع المنتجات
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NewArrivals; 