import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPanel() {
  const { 
    cartItems, 
    isCartOpen, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    toggleCart, 
    setIsCartOpen 
  } = useCart();

  const navigate = useNavigate();

  // تأثيرات الحركة للوحة
  const panelVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        damping: 25,
        stiffness: 300
      } 
    },
    exit: { 
      y: '100%', 
      opacity: 0,
      transition: { 
        duration: 0.3,
        ease: 'easeInOut'
      } 
    }
  };

  // تأثيرات الحركة للغطاء
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 } 
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 } 
    }
  };

  // إتمام عملية الشراء
  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  // دالة للحصول على صورة آمنة
  const getItemImage = (item) => {
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      return item.images[0];
    }
    // صورة افتراضية في حالة عدم وجود صورة
    return '/logo.png';
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* طبقة الخلفية المعتمة */}
          <motion.div 
            className="fixed inset-0 bg-black/50 z-40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={toggleCart}
          />
          
          {/* لوحة السلة */}
          <motion.div 
            className="fixed bottom-0 left-0 right-0 bg-cream-beige rounded-t-3xl shadow-2xl p-5 z-50 max-h-[85vh] overflow-y-auto"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* رأس اللوحة */}
            <div className="flex justify-between items-center border-b border-amber-200 pb-4 mb-4">
              <h2 className="text-2xl font-bold text-amber-800">سلة التسوق</h2>
              <button 
                onClick={toggleCart}
                className="text-amber-800 hover:text-primary-orange"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* محتوى السلة */}
            <div className="space-y-4 mb-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-amber-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <p className="text-amber-700 text-lg">السلة فارغة</p>
                  <p className="text-amber-600 mt-2">أضف بعض المنتجات إلى سلتك!</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <motion.div 
                    key={item.cartId || item.id} 
                    className="flex items-center bg-white rounded-lg overflow-hidden shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img 
                      src={getItemImage(item)} 
                      alt={item.name || 'منتج'} 
                      className="h-20 w-20 object-cover" 
                      onError={(e) => {
                        e.target.src = '/logo.png';
                      }}
                    />
                    <div className="flex-1 px-4 py-2">
                      <h3 className="font-medium text-amber-800">{item.name || 'منتج غير محدد'}</h3>
                      <p className="text-amber-600">{item.price || 0} ل.س</p>
                      {item.sizes && item.sizes.length > 0 && (
                        <p className="text-xs text-amber-500">المقاسات: {item.sizes.join(', ')}</p>
                      )}
                    </div>
                    <div className="flex items-center p-2">
                      <button 
                        onClick={() => updateQuantity(item.cartId || item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 hover:bg-amber-200"
                      >
                        -
                      </button>
                      <span className="mx-2 w-6 text-center">{item.quantity || 1}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartId || item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 hover:bg-amber-200"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.cartId || item.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            {/* تذييل اللوحة مع المجموع وأزرار الإجراءات */}
            {cartItems.length > 0 && (
              <div className="border-t border-amber-200 pt-4">
                <div className="flex justify-between mb-4">
                  <span className="text-amber-800 font-medium">المجموع:</span>
                  <span className="text-lg font-bold text-amber-800">{getCartTotal()} ل.س</span>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={clearCart}
                    className="px-4 py-2 border border-amber-300 rounded-lg text-amber-700 hover:bg-amber-50 flex-1"
                  >
                    تفريغ السلة
                  </button>
                  <button 
                    onClick={handleCheckout}
                    className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 flex-1"
                  >
                    إتمام الطلب
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartPanel; 