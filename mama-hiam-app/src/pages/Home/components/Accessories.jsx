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
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative w-full h-40 mb-3 overflow-hidden rounded-t-xl">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
          
          {/* شارة مميز */}
          <div className="absolute top-2 right-2">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              ⭐ مميز
            </span>
          </div>
          
          {/* شارة إضافية للمنتج الجديد */}
          {product.new_collection && (
            <div className="absolute top-2 left-2">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                جديد
              </span>
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="px-3 pb-3">
          <h3 className="text-lg font-semibold text-dark-blue mb-2 line-clamp-2">{product.name}</h3>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-primary-orange">{product.price} ر.س</span>
            {product.old_price && (
              <span className="text-sm text-gray-500 line-through">{product.old_price} ر.س</span>
            )}
          </div>
        </div>
      </Link>
      
      {/* زر إضافة للسلة خارج الـ Link */}
      <div className="px-3 pb-3">
        <button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`w-full font-bold py-2 px-4 rounded-lg transition-colors duration-200 ${
            isAdded 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-primary-orange hover:bg-orange-600 text-white'
          }`}
        >
          {isAdded ? (
            <span className="flex items-center justify-center gap-1">
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

// --- Featured Products Section Component ---
function FeaturedProducts() {
  const [productsToShow, setProductsToShow] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setError(null);
        
        const response = await fetchFeaturedProductsFromAPI();
        
        console.log('🔄 Featured Products API Response:', response.data);
        
        if (response.data && response.data.length > 0) {
          // تصفية المنتجات للتأكد من أنها مميزة فقط
          const featuredProducts = response.data.filter(product => product.featured === true);
          
          console.log('✅ Filtered Featured Products:', featuredProducts);
          
          if (featuredProducts.length > 0) {
            // أخذ أول 6 منتجات من المنتجات المميزة
            setProductsToShow(featuredProducts.slice(0, FEATURED_PRODUCTS_TO_SHOW));
          } else {
            console.log('⚠️ No featured products found after filtering');
            setProductsToShow([]);
          }
        } else {
          console.log('⚠️ No products in API response');
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
      <section className="py-12 bg-gradient-to-br from-light-orange/10 via-cream-beige/20 to-white">
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

  if (productsToShow.length === 0) {
    return null; // لا نعرض القسم إذا لم تكن هناك منتجات مميزة
  }

  return (
    <section className="py-12 bg-gradient-to-br from-light-orange/10 via-cream-beige/20 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-primary-orange mb-8">المنتجات المميزة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productsToShow.map((product, index) => (
            <FeaturedProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Button Container */}
        <div className="text-center mt-10">
          <Link 
            to="/featured-products"
            className="bg-gradient-to-r from-light-orange to-primary-orange hover:from-primary-orange hover:to-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 inline-block transform hover:scale-105"
          >
            ⭐ عرض جميع المنتجات المميزة
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts; 