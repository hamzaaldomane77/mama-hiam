import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { fetchOffersProducts } from '../../../services/api';

const INITIAL_DISCOUNT_DISPLAY_COUNT = 4;

// --- Discount Card Component (Different Design) ---
function DiscountCard({ product, index }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2, 
  });

  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Simple fade-in animation for this card
  const variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, delay: index * 0.1 } // Stagger animation slightly
    }
  };

  const handleAddToCart = () => {
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
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="rounded-xl shadow-lg overflow-hidden flex flex-col sm:flex-row items-center p-4 transition-shadow duration-300 hover:shadow-xl border border-gray-100"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Image Section */}
      <div className="w-full sm:w-1/3 flex-shrink-0 mb-3 sm:mb-0 sm:mr-4 rtl:sm:ml-4 rtl:sm:mr-0">
        <img src={product.images[0]} alt={product.name} className="w-full h-32 object-cover rounded-lg" />
      </div>

      {/* Text Content Section */}
      <div className="flex-grow text-center sm:text-right rtl:sm:text-left">
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#E53935' }}>{product.name}</h3>
        <div className="flex items-center justify-center sm:justify-start space-x-2 space-x-reverse mb-3">
          <p className="text-gray-500 line-through text-sm">{product.old_price} ل.س</p>
          <p className="text-xl font-bold" style={{ color: '#E53935' }}>{product.price} ل.س</p>
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={isAdded}
                          className={`mt-2 text-white text-sm font-medium py-2 px-6 rounded-full transition duration-300 ${
            isAdded 
              ? 'hover:shadow-xl' 
              : 'hover:shadow-xl'
          }`}
          style={{ 
            backgroundColor: isAdded ? '#B8E4C9' : '#E53935'
          }}
        >
          {isAdded ? (
            <span className="flex items-center gap-1">
              <span>تم الإضافة</span>
              <span className="text-xs">✓</span>
            </span>
          ) : (
            <span className="flex items-center gap-1">
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

// --- Discounts Section Component ---
function Discounts() {
  const [productsToShow, setProductsToShow] = useState([]);
  const [allOffersProducts, setAllOffersProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOffersProducts = async () => {
      try {
        setError(null);
        
        const response = await fetchOffersProducts();
        setAllOffersProducts(response.data);
        // عرض 4 منتجات فقط
        setProductsToShow(response.data.slice(0, INITIAL_DISCOUNT_DISPLAY_COUNT));
      } catch (err) {
        console.error('Error loading offers products:', err);
        setError('فشل في تحميل منتجات العروض. يرجى المحاولة مرة أخرى.');
      }
    };

    loadOffersProducts();
  }, []);

  if (error) {
    return (
      <section className="py-12 relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
        {/* خلفية ملونة طفولية */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/40 via-yellow-50/30 to-green-50/40"></div>
        
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

  if (allOffersProducts.length === 0) {
    return null; // لا نعرض القسم إذا لم تكن هناك منتجات عروض
  }

  return (
    <section className="py-12 relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* خلفية ملونة طفولية */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/40 via-yellow-50/30 to-green-50/40"></div>
      
      {/* طبقة تدرج إضافية */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/30 via-transparent to-pink-50/30"></div>
      
      {/* عناصر زخرفية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-20 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: '#FADADD', opacity: 0.4 }}></div>
        <div className="absolute bottom-10 right-20 w-48 h-48 rounded-full blur-3xl" style={{ backgroundColor: '#FFF4B1', opacity: 0.3 }}></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: '#B8E4C9', opacity: 0.3 }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#E53935' }}>تخفيضات خاصة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {productsToShow.map((product, index) => (
            <DiscountCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Button Container */}
        <div className="text-center mt-10">
          <Link 
            to="/offers"
                            className="text-white font-bold py-3 px-8 rounded-full transition duration-300 text-center inline-block transform hover:scale-105"
            style={{ backgroundColor: '#E53935' }}
          >
            عرض جميع العروض
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Discounts; 