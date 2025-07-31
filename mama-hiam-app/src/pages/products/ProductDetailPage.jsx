import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useLoading } from "../../context/LoadingContext";
import { fetchProductById } from "../../services/api";
import { MinusIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
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
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [hasShownFirstAddToast, setHasShownFirstAddToast] = useState(false);

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

  // التعامل مع اختيار المقاسات
  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  // إضافة المنتج إلى السلة
  const handleAddToCart = () => {
    if (!product) return;
    
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images?.[0] || '/logo.png',
      sizes: selectedSizes.length > 0 ? selectedSizes : []
    };
    
    // إضافة المنتج للسلة بالكمية المحددة
    addToCartWithQuantity(cartProduct, quantity);
    
    // عرض توست النجاح
    toast.success('تم إضافة المنتج إلى السلة بنجاح! 🛒');
    
    // عرض توست نصيحة للمرة الأولى فقط
    if (!hasShownFirstAddToast) {
      setTimeout(() => {
        toast('ممتاز! لقد اخترت المقاسات المناسبة. هذا سيضمن لك تجربة شراء مثالية! 🎉', {
          duration: 6000,
          icon: '🎉',
        });
        setHasShownFirstAddToast(true);
      }, 1000);
    }
    
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
      image: product.images?.[0] || '/logo.png',
      sizes: selectedSizes.length > 0 ? selectedSizes : []
    };
    
    // إضافة المنتج للسلة بالكمية المحددة
    addToCartWithQuantity(cartProduct, quantity);
    
    // عرض توست النجاح
    toast.success('تم إضافة المنتج إلى السلة بنجاح! 🛒');
    
    // الانتقال إلى صفحة الطلب
    setTimeout(() => {
      hideLoading();
      navigate('/checkout');
    }, 1500);
  };

  // مكون التحميل
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2"
           style={{ borderColor: '#E53935' }}></div>
    </div>
  );

  // عرض الخطأ
  if (error) {
    return (
      <div className="relative min-h-[60vh] overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
        {/* خلفية ملونة طفولية */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/40 via-yellow-50/30 to-blue-50/40"></div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="text-center py-20 backdrop-blur-sm rounded-xl shadow-lg border"
               style={{ backgroundColor: '#FFFFFF', borderColor: '#F5F5F5' }}>
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: '#E53935' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#E53935' }}>{error}</h3>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => loadProduct()}
                className="text-white px-6 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: '#E53935' }}
              >
                إعادة المحاولة
              </button>
              <Link 
                to="/products" 
                className="text-white px-6 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: '#E53935' }}
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
      <div className="relative min-h-[60vh] overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
        {/* خلفية ملونة طفولية */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-pink-50/30 to-yellow-50/40"></div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="text-center py-20 backdrop-blur-sm rounded-xl shadow-lg border"
               style={{ backgroundColor: '#FFFFFF', borderColor: '#F5F5F5' }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#E53935' }}>المنتج غير موجود</h3>
            <Link 
              to="/products" 
              className="text-white px-6 py-2 rounded-lg transition-colors shadow-lg hover:shadow-xl"
              style={{ backgroundColor: '#E53935' }}
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
    <div className="relative" style={{ backgroundColor: '#FFFFFF' }}>
      {/* خلفية ملونة طفولية */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-pink-50/30 to-yellow-50/40"></div>
      
      {/* طبقة تدرج إضافية */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-50/30 via-transparent to-blue-50/30"></div>

      {/* عناصر زخرفية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#A7D8F0', opacity: 0.3 }}></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: '#FADADD', opacity: 0.4 }}></div>
      </div>

      <div className="relative z-10 pb-8">
        
        <div className="container mx-auto px-4 pt-24 pb-8">
          <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: '#E53935', opacity: 0.7 }}>
            <Link to="/" className="hover:opacity-80 transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link to="/products" className="hover:opacity-80 transition-colors">المنتجات</Link>
            <span>/</span>
            <span className="font-medium" style={{ color: '#E53935' }}>{product.name}</span>
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
              <div className="relative rounded-2xl shadow-lg overflow-hidden border"
                   style={{ backgroundColor: '#FFFFFF', borderColor: '#F5F5F5' }}>
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
                    <span className="text-white text-sm font-bold px-3 text-center py-1 rounded-full shadow-lg"
                          style={{ backgroundColor: '#B8E4C9' }}>
                      جديد
                    </span>
                  )}
                  {product.featured && (
                    <span className="text-center text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg"
                          style={{ backgroundColor: '#A7D8F0' }}>
                      مميز
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg"
                          style={{ backgroundColor: '#E53935' }}>
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
                          ? 'shadow-lg' 
                          : 'hover:border-orange-300'
                      }`}
                      style={{ 
                        borderColor: selectedImageIndex === index ? '#E53935' : '#F5F5F5'
                      }}
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
            <div className="backdrop-blur-sm rounded-2xl shadow-lg border p-8"
                 style={{ backgroundColor: '#FFFFFF', borderColor: '#F5F5F5' }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* اسم المنتج */}
                <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight"
                    style={{ color: '#E53935' }}>
                  {product.name}
                </h1>

                {/* الفئات */}
                {product.categories && product.categories.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {product.categories.map((category, index) => (
                        <span key={index} className="text-sm font-semibold px-3 py-1 rounded-full"
                              style={{ backgroundColor: '#F5F5F5', color: '#E53935' }}>
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* السعر */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-4xl font-bold" style={{ color: '#E53935' }}>
                      {parseFloat(product.price).toFixed(2)} <span className="text-lg">ل.س</span>
                    </span>
                    {hasDiscount && (
                      <span className="text-xl text-gray-500 line-through">
                        {parseFloat(product.old_price).toFixed(2)} ل.س
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <p className="font-medium" style={{ color: '#a7d8f9' }}>
                      وفّر {(parseFloat(product.old_price) - parseFloat(product.price)).toFixed(2)} ل.س
                    </p>
                  )}
                </div>

                {/* الوصف */}
                {product.description && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-3" style={{ color: '#E53935' }}>الوصف</h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line rounded-lg p-4 border"
                         style={{ backgroundColor: '#F5F5F5', borderColor: '#F5F5F5' }}>
                      {product.description}
                    </div>
                  </div>
                )}

                {/* الكمية وإضافة للسلة */}
                <div className="space-y-6">
                  {/* اختيار المقاسات */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-3" style={{ color: '#E53935' }}>
                        المقاسات المتوفرة : يمكنك اختيار أكثر من مقاس
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {product.sizes.map((size, index) => (
                          <label key={index} className="cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedSizes.includes(size)}
                              onChange={() => handleSizeToggle(size)}
                              className="hidden"
                            />
                            <div
                              className={`w-full p-3 rounded-lg border-2 text-center font-medium transition-all ${
                                selectedSizes.includes(size)
                                  ? 'text-white shadow-lg'
                                  : 'text-gray-700 hover:border-red-300'
                              }`}
                              style={{
                                backgroundColor: selectedSizes.includes(size) ? '#E53935' : '#F5F5F5',
                                borderColor: selectedSizes.includes(size) ? '#E53935' : '#F5F5F5'
                              }}
                            >
                              {size}
                            </div>
                          </label>
                        ))}
                      </div>
                      {selectedSizes.length > 0 && (
                        <p className="text-sm mt-2" style={{ color: '#E53935' }}>
                          المقاسات المختارة: {selectedSizes.join(' - ')}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* اختيار الكمية */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#E53935' }}>
                      الكمية
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border-2 border-[#E53935] flex items-center justify-center"
                     
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#fffff'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                      <MinusIcon />
                      </button>
                      <span className="w-16 h-10 border border-[#E53935] rounded-lg flex items-center justify-center font-bold"
               >
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-lg border-2 hover:text-white transition-all flex items-center justify-center"
                        style={{ 
                          borderColor: '#E53935', 
                          color: '#E53935',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#fffff'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                      <PlusIcon />
                      </button>
                    </div>
                  </div>

                  {/* أزرار الإجراءات */}
                  <div className="flex flex-col gap-4">
                    {/* زر إتمام الطلب المباشر */}
                    <button
                      onClick={handleDirectCheckout}
                      className="w-full py-4 px-6 rounded-xl font-bold text-lg text-red-800 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#B8E4C9' }}
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
                        className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all text-white flex items-center justify-center gap-2`}
                        style={{ 
                          backgroundColor: isInCart(product.id) ? '#0CD54D' : '#CD0808'
                        }}
                      >
                        {isInCart(product.id) ? (
                          <>
                            <span className="text-lg">✓</span> في السلة
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            أضف للسلة
                          </>
                        )}
                      </button>
                      
                      <Link
                        to="/products"
                        className="flex-1 sm:flex-initial py-4 px-6 rounded-xl font-bold text-lg border-2  transition-all text-center shadow-lg hover:shadow-xl"
                        style={{ 
                          borderColor: '#E53935', 
                          color: '#E53935',
                          backgroundColor: 'transparent'
                        }}
                      
                        
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