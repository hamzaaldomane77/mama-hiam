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
      className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col sm:flex-row items-center p-3 transition-shadow duration-300 hover:shadow-xl"
    >
      {/* Image Section */}
      <div className="w-full sm:w-1/3 flex-shrink-0 mb-3 sm:mb-0 sm:mr-4 rtl:sm:ml-4 rtl:sm:mr-0">
        <img src={product.images[0]} alt={product.name} className="w-full h-32 object-cover rounded-md" />
      </div>

      {/* Text Content Section */}
      <div className="flex-grow text-center sm:text-right rtl:sm:text-left">
        <h3 className="text-lg font-semibold text-dark-blue mb-1">{product.name}</h3>
        <div className="flex items-center justify-center sm:justify-start space-x-2 space-x-reverse mb-2">
          <p className="text-gray-500 line-through text-sm">{product.old_price} ر.س</p>
          <p className="text-xl font-bold text-brick-red">{product.price} ر.س</p>
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`mt-2 text-white text-sm font-medium py-1 px-4 rounded-full transition duration-300 ${
            isAdded 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-light-orange hover:bg-primary-orange'
          }`}
        >
          {isAdded ? (
            <span className="flex items-center gap-1">
              <span>تم الإضافة</span>
              <span className="text-xs">✓</span>
            </span>
          ) : (
            'أضف للسلة'
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
      <section className="py-12 bg-gradient-to-br from-cream-beige/30 via-white to-light-orange/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary-orange hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg shadow transition duration-300"
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
    <section className="py-12 bg-gradient-to-br from-cream-beige/30 via-white to-light-orange/20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-primary-orange mb-8">تخفيضات خاصة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {productsToShow.map((product, index) => (
            <DiscountCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Button Container */}
        <div className="text-center mt-10">
          <Link 
            to="/offers"
            className="bg-brick-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 text-center inline-block transform hover:scale-105"
          >
            عرض جميع العروض
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Discounts; 