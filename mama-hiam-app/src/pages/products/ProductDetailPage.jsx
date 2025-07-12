import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useLoading } from "../../context/LoadingContext";
import { fetchProductById } from "../../services/api";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToCartWithQuantity, cartItems } = useCart();
  const { showLoading, hideLoading } = useLoading();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // جلب بيانات المنتج عند تحميل المكون
  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductById(id);
      
      if (data && data.data) {
        setProduct(data.data);
      } else {
        setError('المنتج غير موجود');
      }
    } catch (err) {
      console.error('Error loading product:', err);
      setError('حدث خطأ في تحميل المنتج. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // التحقق من وجود المنتج في السلة
  const isInCart = (productId) => {
    return cartItems.some((item) => item.id === productId);
  };

  // إضافة المنتج إلى السلة
  const handleAddToCart = () => {
    if (!product) return;
    
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images?.[0] || '/logo.png'
    };
    
    // إضافة المنتج للسلة بالكمية المحددة
    addToCartWithQuantity(cartProduct, quantity);
    
    // إعادة تعيين الكمية إلى 1 بعد الإضافة
    setQuantity(1);
  };

  // إتمام الطلب المباشر
  const handleDirectCheckout = () => {
    if (!product) return;
    
    showLoading("جاري التحضير لإتمام الطلب...");
    
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images?.[0] || '/logo.png'
    };
    
    // إضافة المنتج للسلة بالكمية المحددة
    addToCartWithQuantity(cartProduct, quantity);
    
    // الانتقال إلى صفحة الطلب
    setTimeout(() => {
      hideLoading();
      navigate('/checkout');
    }, 1500);
  };

  // مكون التحميل
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-orange"></div>
    </div>
  );

  // عرض الخطأ
  if (error) {
    return (
      <div className="relative bg-gradient-to-br from-cream-beige via-orange-50 to-amber-50 min-h-[60vh]">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-orange-100">
            <svg
              className="w-16 h-16 mx-auto text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-dark-blue mb-4">{error}</h3>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => loadProduct()}
                className="bg-primary-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                إعادة المحاولة
              </button>
              <Link 
                to="/products" 
                className="bg-dark-blue text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                العودة للمنتجات
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // عرض التحميل
  if (loading) {
    return <LoadingSpinner />;
  }

  // إذا لم يتم العثور على المنتج
  if (!product) {
    return (
      <div className="relative bg-gradient-to-br from-cream-beige via-orange-50 to-amber-50 min-h-[60vh]">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-orange-100">
            <h3 className="text-xl font-semibold text-dark-blue mb-4">المنتج غير موجود</h3>
            <Link 
              to="/products" 
              className="bg-primary-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              العودة للمنتجات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasDiscount = product.old_price && parseFloat(product.old_price) > parseFloat(product.price);
  const discountPercentage = hasDiscount 
    ? Math.round(((parseFloat(product.old_price) - parseFloat(product.price)) / parseFloat(product.old_price)) * 100)
    : 0;

  return (
    <div className="relative">
      {/* خلفية أنيقة */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream-beige via-orange-50 to-amber-50"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-orange/10 via-transparent to-dark-blue/5"></div>

      {/* عناصر زخرفية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-primary-orange/20 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-dark-blue/15 blur-3xl"></div>
      </div>

      <div className="relative z-10 pb-8">
        {/* شريط التنقل العلوي */}
        <div className="container mx-auto px-4 pt-24 pb-8">
          <nav className="flex items-center gap-2 text-sm text-dark-blue/70 mb-8">
            <Link to="/" className="hover:text-primary-orange transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary-orange transition-colors">المنتجات</Link>
            <span>/</span>
            <span className="text-dark-blue font-medium">{product.name}</span>
          </nav>
        </div>

        <div className="container mx-auto px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[60vh]"
          >
            {/* قسم الصور */}
            <div className="space-y-4">
              {/* الصورة الرئيسية */}
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-100">
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={product.images?.[selectedImageIndex] || '/logo.png'}
                  alt={product.name}
                  className="w-full h-96 lg:h-[500px] object-cover"
                  onError={(e) => {
                    e.target.src = '/logo.png';
                  }}
                />
                
                {/* شارات المنتج */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {product.new_collection && (
                    <span className="bg-primary-orange text-white text-sm font-bold px-3 text-center py-1 rounded-full shadow-lg">
                      جديد
                    </span>
                  )}
                  {product.featured && (
                    <span className="bg-green-500 text-center text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                      مميز
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                      خصم {discountPercentage}%
                    </span>
                  )}
                </div>
              </div>

              {/* صور مصغرة */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-primary-orange shadow-lg' 
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - صورة ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/logo.png';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* معلومات المنتج */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* اسم المنتج */}
                <h1 className="text-3xl lg:text-4xl font-bold text-dark-blue mb-4 leading-tight">
                  {product.name}
                </h1>

                {/* الفئات */}
                {product.categories && product.categories.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {product.categories.map((category, index) => (
                        <span key={index} className="bg-gradient-to-r from-orange-100 to-orange-50 text-dark-blue text-sm font-semibold px-3 py-1 rounded-full">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* السعر */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-4xl font-bold text-dark-blue">
                      {parseFloat(product.price).toFixed(2)} <span className="text-lg">ل.س</span>
                    </span>
                    {hasDiscount && (
                      <span className="text-xl text-gray-500 line-through">
                        {parseFloat(product.old_price).toFixed(2)} ل.س
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <p className="text-green-600 font-medium">
                      وفّر {(parseFloat(product.old_price) - parseFloat(product.price)).toFixed(2)} ل.س
                    </p>
                  )}
                </div>

                {/* الوصف */}
                {product.description && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-dark-blue mb-3">الوصف</h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-orange-50/50 rounded-lg p-4 border border-orange-100">
                      {product.description}
                    </div>
                  </div>
                )}

                {/* الكمية وإضافة للسلة */}
                <div className="space-y-6">
                  {/* اختيار الكمية */}
                  <div>
                    <label className="block text-sm font-medium text-dark-blue mb-2">
                      الكمية
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border-2 border-primary-orange/20 text-primary-orange hover:bg-primary-orange hover:text-white transition-all flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-16 h-10 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center font-bold text-dark-blue">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-lg border-2 border-primary-orange/20 text-primary-orange hover:bg-primary-orange hover:text-white transition-all flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* أزرار الإجراءات */}
                  <div className="flex flex-col gap-4">
                    {/* زر إتمام الطلب المباشر */}
                    <button
                      onClick={handleDirectCheckout}
                      className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      إتمام الطلب مباشرة
                    </button>
                    
                    {/* الأزرار الأخرى */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleAddToCart}
                        className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl ${
                          isInCart(product.id)
                            ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                            : "bg-gradient-to-r from-primary-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                        }`}
                      >
                        {isInCart(product.id) ? (
                          <>
                            <span className="mr-2">✓</span> في السلة
                          </>
                        ) : (
                          "أضف للسلة"
                        )}
                      </button>
                      
                      <Link
                        to="/products"
                        className="flex-1 sm:flex-initial py-4 px-6 rounded-xl font-bold text-lg border-2 border-dark-blue text-dark-blue hover:bg-dark-blue hover:text-white transition-all text-center"
                      >
                        تصفح المزيد
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage; 