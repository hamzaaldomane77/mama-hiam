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
        className="block bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer border border-gray-100"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="relative">
          <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
          
          {/* شارات المنتج */}
          {product.featured && (
            <div className="absolute top-2 right-2">
              <span className="text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                    style={{ backgroundColor: '#A7D8F0' }}>
                مميز
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2" style={{ color: '#E53935' }}>{product.name}</h3>
          <p className="font-bold text-xl" style={{ color: '#E53935' }}>{product.price} ل.س</p>
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
        
        if (response.data && response.data.length > 0) {
          // تصفية المنتجات للتأكد من أنها جديدة فقط
          const newProducts = response.data.filter(product => product.new_collection === true);
          
          if (newProducts.length > 0) {
            // أخذ أول 6 منتجات من المجموعة الجديدة
            setProductsToShow(newProducts.slice(0, PRODUCTS_TO_SHOW));
          } else {
            setProductsToShow([]);
          }
        } else {
          setProductsToShow([]);
        }
      } catch (err) {
        console.error('Error loading new products:', err);
        setError('فشل في تحميل المنتجات الجديدة. يرجى المحاولة مرة أخرى.');
      }
    };

    loadNewProducts();
  }, []);



  if (error) {
    return (
      <section className="py-12" style={{ backgroundColor: '#FFFFFF' }}>
        {/* خلفية ملونة طفولية */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-pink-50/30 to-yellow-50/30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <p className="mb-4" style={{ color: '#E53935' }}>{error}</p>
            <button 
              onClick={refreshProducts}
                                className="text-white font-bold py-2 px-6 rounded-lg transition duration-300"
              style={{ backgroundColor: '#E53935' }}
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
    <section className="py-12 relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* خلفية ملونة طفولية */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-pink-50/30 to-yellow-50/40"></div>
      
      {/* طبقة تدرج إضافية */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-50/30 via-transparent to-blue-50/30"></div>
      
      {/* عناصر زخرفية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: '#A7D8F0', opacity: 0.3 }}></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full blur-3xl" style={{ backgroundColor: '#FADADD', opacity: 0.4 }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#FFF4B1', opacity: 0.2 }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center mb-8">
          <h2 className="text-3xl font-bold text-center" style={{ color: '#E53935' }}>المجموعة الجديدة</h2>
          {/* زر تحديث مخفي للمطور */}
     
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-5">
          {productsToShow.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link 
            to="/products"
                            className="text-white font-bold py-3 px-8 rounded-full transition duration-300 inline-block transform hover:scale-105"
            style={{ backgroundColor: '#E53935' }}
          >
            عرض جميع المنتجات
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NewArrivals; 