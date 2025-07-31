import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useCart } from '../../context/CartContext';
import { fetchOffersProducts } from '../../services/api';

// مكون ProductCard للعروض
function OfferCard({ product, index }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1
      }
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

  const calculateDiscountPercentage = () => {
    if (product.old_price && product.price) {
      const oldPrice = parseFloat(product.old_price);
      const newPrice = parseFloat(product.price);
      return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    }
    return 0;
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#F5F5F5' }}
    >
      <div className="relative">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        
        {/* شارة التخفيض */}
        <div className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
             style={{ backgroundColor: '#E53935' }}>
          خصم {calculateDiscountPercentage()}%
        </div>

        {/* شارات إضافية */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.new_collection && (
            <span className="text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                  style={{ backgroundColor: '#B8E4C9' }}>
              جديد
            </span>
          )}
          {product.featured && (
            <span className="text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                  style={{ backgroundColor: '#A7D8F0' }}>
              مميز
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2"
            style={{ color: '#E53935' }}>
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold"
                style={{ color: '#E53935' }}>
            {product.price} ل.س
          </span>
          {product.old_price && (
            <span className="text-sm text-gray-500 line-through">
              {product.old_price} ل.س
            </span>
          )}
        </div>

        {product.categories && product.categories.length > 0 && (
          <div className="mb-3">
            <span className="text-xs px-2 py-1 rounded-full"
                  style={{ backgroundColor: '#F5F5F5', color: '#E53935' }}>
              {product.categories[0]}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
                              className={`flex-1 font-bold py-2 px-4 rounded-full transition-colors duration-200 text-white`}
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
          <Link
            to={`/products/${product.id}`}
                              className="flex-1 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200 text-center"
            style={{ backgroundColor: '#E53935' }}
          >
            عرض التفاصيل
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// مكون الصفحة الرئيسي
function OffersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchOffersProducts();
        setProducts(response.data);
      } catch (err) {
        console.error('Error loading offers:', err);
        setError('فشل في تحميل العروض. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
        {/* خلفية ملونة طفولية */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/40 via-yellow-50/30 to-blue-50/40"></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="text-center">
            <div className="animate-spin inline-block w-12 h-12 border-4 border-t-transparent rounded-full"
                 style={{ borderColor: '#E53935' }}></div>
            <p className="mt-4 text-lg" style={{ color: '#E53935' }}>جاري تحميل العروض...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
        {/* خلفية ملونة طفولية */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/40 via-yellow-50/30 to-blue-50/40"></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="text-center">
            <div className="border rounded-lg p-6 max-w-md mx-auto shadow-lg"
                 style={{ backgroundColor: '#FFFFFF', borderColor: '#F5F5F5' }}>
              <p className="mb-4" style={{ color: '#E53935' }}>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                                  className="text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                style={{ backgroundColor: '#E53935' }}
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* خلفية ملونة طفولية */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/40 via-yellow-50/30 to-blue-50/40"></div>
      
      {/* طبقة تدرج إضافية */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-50/30 via-transparent to-pink-50/30"></div>
      
      {/* عناصر زخرفية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: '#FADADD', opacity: 0.4 }}></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full blur-3xl" style={{ backgroundColor: '#FFF4B1', opacity: 0.3 }}></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: '#B8E4C9', opacity: 0.3 }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#E53935' }}>العروض والتخفيضات</h1>
          <p className="text-lg" style={{ color: '#E53935' }}>اكتشف أفضل العروض والتخفيضات المتاحة</p>
          
          {/* Breadcrumb */}
          <nav className="mt-4">
            <ol className="flex items-center justify-center space-x-2 space-x-reverse text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-primary-orange transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li className="text-gray-300">/</li>
              <li className="font-medium" style={{ color: '#E53935' }}>العروض</li>
            </ol>
          </nav>
        </div>

        {/* Products Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            عدد العروض المتاحة: <span className="font-semibold" style={{ color: '#E53935' }}>{products.length}</span>
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <OfferCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="rounded-lg shadow-lg p-8 max-w-md mx-auto border"
                 style={{ backgroundColor: '#FFFFFF', borderColor: '#F5F5F5' }}>
              <div className="text-6xl mb-4" style={{ color: '#E53935' }}>🏷️</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#E53935' }}>لا توجد عروض متاحة</h3>
              <p className="text-gray-500 mb-4">عذراً، لا توجد عروض متاحة حالياً.</p>
              <Link
                to="/products"
                                  className="inline-block text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                style={{ backgroundColor: '#E53935' }}
              >
                تصفح المنتجات
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OffersPage;