import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useCart } from '../../context/CartContext';
import { fetchFeaturedProductsFromAPI } from '../../services/api';

// مكون ProductCard للمنتجات المميزة
function FeaturedProductCard({ product, index }) {
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
    
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
    >
      <div className="relative">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        
        <div className="absolute top-2 right-2">
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            ⭐ مميز
          </span>
        </div>

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.new_collection && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              جديد
            </span>
          )}
          {product.old_price && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              خصم
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-dark-blue mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-primary-orange">
            {product.price} ر.س
          </span>
          {product.old_price && (
            <span className="text-sm text-gray-500 line-through">
              {product.old_price} ر.س
            </span>
          )}
        </div>

        {product.categories && product.categories.length > 0 && (
          <div className="mb-3">
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              {product.categories[0]}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`flex-1 font-bold py-2 px-4 rounded-lg transition-colors duration-200 ${
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
          <Link
            to={`/products/${product.id}`}
            className="flex-1 bg-dark-blue hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-center"
          >
            عرض التفاصيل
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchFeaturedProductsFromAPI();
        
        if (response.data && response.data.length > 0) {
          const featuredProducts = response.data.filter(product => product.featured === true);
          setProducts(featuredProducts);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error loading featured products:', err);
        setError('فشل في تحميل المنتجات المميزة. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-beige">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin inline-block w-12 h-12 border-4 border-primary-orange border-t-transparent rounded-full"></div>
            <p className="mt-4 text-gray-600 text-lg">جاري تحميل المنتجات المميزة...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream-beige">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary-orange hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
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
    <div className="min-h-screen bg-cream-beige">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-dark-blue mb-4">
            <span className="text-yellow-500">⭐</span> المنتجات المميزة <span className="text-yellow-500">⭐</span>
          </h1>
          <p className="text-gray-600 text-lg">اكتشف أفضل منتجاتنا المختارة بعناية</p>
          
          <nav className="mt-4">
            <ol className="flex items-center justify-center space-x-2 space-x-reverse text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-primary-orange transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li className="text-gray-300">/</li>
              <li className="text-primary-orange font-medium">المنتجات المميزة</li>
            </ol>
          </nav>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            عدد المنتجات المميزة: <span className="font-semibold text-dark-blue">{products.length}</span>
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <FeaturedProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <div className="text-6xl text-gray-300 mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد منتجات مميزة</h3>
              <p className="text-gray-500 mb-4">عذراً، لا توجد منتجات مميزة متاحة حالياً.</p>
              <Link
                to="/products"
                className="inline-block bg-primary-orange hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
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

export default FeaturedProductsPage; 