import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { fetchFeaturedProducts as fetchFeaturedProductsFromAPI } from '../../../services/api';

const FEATURED_PRODUCTS_TO_SHOW = 6;

// --- Featured Product Card Component ---
function FeaturedProductCard({ product, index }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const entryVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, delay: index * 0.1 }
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); // منع تنفيذ الـ Link
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    
    // إعادة تعيين حالة الزر بعد 2 ثانية
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <motion.div
      ref={ref}
      variants={entryVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      // Interactive hover animation using framer-motion's `whileHover` prop
      whileHover={{
        scale: 1.05, // Slightly enlarge
        y: -5,      // Lift up slightly
        boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" // Add more pronounced shadow
      }}
      transition={{ duration: 0.2 }} // Smooth hover transition
      className="rounded-xl shadow-lg overflow-hidden border border-gray-100"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative w-full h-40 mb-3 overflow-hidden rounded-t-xl">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
          
          {/* شارة مميز */}
          <div className="absolute top-2 right-2">
            <span className="text-[#e6403c] text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                  style={{ backgroundColor: '#FFF4B1' }}>
              ⭐ مميز
            </span>
          </div>
          
          {/* شارة إضافية للمنتج الجديد */}
          {product.new_collection && (
            <div className="absolute top-2 left-2">
              <span className="text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                    style={{ backgroundColor: '#B8E4C9' }}>
                جديد
              </span>
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="px-3 pb-3">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2" style={{ color: '#E53935' }}>{product.name}</h3>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold" style={{ color: '#E53935' }}>{product.price} ل.س</span>
            {product.old_price && (
              <span className="text-sm text-gray-500 line-through">{product.old_price} ل.س</span>
            )}
          </div>
        </div>
      </Link>
      
      {/* زر إضافة للسلة خارج الـ Link */}
      <div className="px-3 pb-3">
        <button
          onClick={handleAddToCart}
          disabled={isAdded}
                          className={`w-full font-bold py-2 px-4 rounded-full transition-colors duration-200 ${
            isAdded 
              ? 'text-white' 
              : 'text-white'
          }`}
          style={{ 
            backgroundColor: isAdded ? '#B8E4C9' : '#E53935'
          }}
        >
          {isAdded ? (
            <span className="flex items-center justify-center gap-1">
              <span>تم الإضافة</span>
              <span className="text-xs">✓</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              أضف للسلة
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// --- Featured Products Section Component ---
function FeaturedProducts() {
  const [productsToShow, setProductsToShow] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setError(null);
        
        const response = await fetchFeaturedProductsFromAPI();
        
        if (response.data && response.data.length > 0) {
          // تصفية المنتجات للتأكد من أنها مميزة فقط
          const featuredProducts = response.data.filter(product => product.featured === true);
          
          if (featuredProducts.length > 0) {
            // أخذ أول 6 منتجات من المنتجات المميزة
            setProductsToShow(featuredProducts.slice(0, FEATURED_PRODUCTS_TO_SHOW));
          } else {
            setProductsToShow([]);
          }
        } else {
          setProductsToShow([]);
        }
      } catch (err) {
        console.error('Error loading featured products:', err);
        setError('فشل في تحميل المنتجات المميزة. يرجى المحاولة مرة أخرى.');
      }
    };

    loadFeaturedProducts();
  }, []);

  if (error) {
    return (
      <section className="py-12 relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
        {/* خلفية ملونة طفولية */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/40 via-blue-50/30 to-green-50/40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <p className="mb-4" style={{ color: '#E53935' }}>{error}</p>
            <button 
              onClick={() => window.location.reload()}
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
    return null; // لا نعرض القسم إذا لم تكن هناك منتجات مميزة
  }

  return (
    <section className="py-12 relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* خلفية ملونة طفولية */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/40 via-blue-50/30 to-green-50/40"></div>
      
      {/* طبقة تدرج إضافية */}
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-50/30 via-transparent to-yellow-50/30"></div>
      
      {/* عناصر زخرفية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: '#FFF4B1', opacity: 0.4 }}></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full blur-3xl" style={{ backgroundColor: '#A7D8F0', opacity: 0.3 }}></div>
        <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: '#FADADD', opacity: 0.3 }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#E53935' }}>المنتجات المميزة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productsToShow.map((product, index) => (
            <FeaturedProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Button Container */}
        <div className="text-center mt-10">
          <Link 
            to="/featured-products"
                            className="text-white font-bold py-3 px-8 rounded-full transition-all duration-300 inline-block transform hover:scale-105"
            style={{ backgroundColor: '#E53935' }}
          >
            ⭐ عرض جميع المنتجات المميزة
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts; 