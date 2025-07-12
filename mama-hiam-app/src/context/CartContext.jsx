import React, { createContext, useState, useEffect, useContext } from 'react';

// إنشاء سياق سلة التسوق
export const CartContext = createContext();

// التحقق من توفر localStorage في المتصفح
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// دالة للتحقق من انتهاء صلاحية السلة
const isCartExpired = (timestamp) => {
  if (!timestamp) return true;
  const now = new Date().getTime();
  const cartTime = new Date(timestamp).getTime();
  const hoursDiff = (now - cartTime) / (1000 * 60 * 60);
  return hoursDiff >= 12; // انتهاء الصلاحية بعد 12 ساعة
};

// مزود سياق سلة التسوق
export const CartProvider = ({ children }) => {
  // حالة سلة التسوق
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [storageAvailable] = useState(isLocalStorageAvailable());
  
  // استدعاء بيانات السلة من التخزين المحلي عند تحميل المكون
  useEffect(() => {
    if (storageAvailable) {
      try {
        const storedCart = localStorage.getItem('mamaHiamCart');
        const cartTimestamp = localStorage.getItem('mamaHiamCartTimestamp');
        
        // التحقق من انتهاء صلاحية السلة
        if (isCartExpired(cartTimestamp)) {
          // إذا انتهت صلاحية السلة، قم بتفريغها
          localStorage.removeItem('mamaHiamCart');
          localStorage.removeItem('mamaHiamCartTimestamp');
          setCartItems([]);
        } else if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
          }
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, [storageAvailable]);
  
  // حفظ بيانات السلة في التخزين المحلي عند تغييرها
  useEffect(() => {
    if (storageAvailable && cartItems.length > 0) {
      try {
        localStorage.setItem('mamaHiamCart', JSON.stringify(cartItems));
        // حفظ وقت آخر تحديث للسلة
        localStorage.setItem('mamaHiamCartTimestamp', new Date().toISOString());
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cartItems, storageAvailable]);
  
  // إضافة منتج إلى السلة
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // التحقق مما إذا كان المنتج موجود بالفعل في السلة
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex > -1) {
        // إذا كان المنتج موجودًا بالفعل، قم بزيادة الكمية
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // إذا لم يكن المنتج موجودًا، أضفه بكمية 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // إضافة منتج إلى السلة مع كمية محددة
  const addToCartWithQuantity = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // التحقق مما إذا كان المنتج موجود بالفعل في السلة
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex > -1) {
        // إذا كان المنتج موجودًا بالفعل، قم بزيادة الكمية
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // إذا لم يكن المنتج موجودًا، أضفه بالكمية المحددة
        return [...prevItems, { ...product, quantity: quantity }];
      }
    });
  };
  
  // إزالة منتج من السلة
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  // تغيير كمية منتج في السلة
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  // تفريغ السلة
  const clearCart = () => {
    setCartItems([]);
    if (storageAvailable) {
      try {
        localStorage.removeItem('mamaHiamCart');
        localStorage.removeItem('mamaHiamCartTimestamp');
      } catch (error) {
        console.error('Error clearing cart from localStorage:', error);
      }
    }
  };
  
  // حساب إجمالي عدد العناصر في السلة
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  // حساب المبلغ الإجمالي للسلة
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  // دالة إضافية بنفس الاسم المتوقع في بعض المكونات
  const getTotalPrice = () => {
    return getCartTotal();
  };
  
  // فتح وإغلاق لوحة السلة
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };
  
  // توفير وظائف وحالة السلة للمكونات الفرعية
  const cartContextValue = {
    cartItems,
    cart: cartItems, // alias للتوافق مع المكونات التي تتوقع cart
    isCartOpen,
    addToCart,
    addToCartWithQuantity,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    getTotalPrice, // إضافة دالة إضافية للتوافق
    toggleCart,
    setIsCartOpen,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};

// دالة مساعدة للوصول إلى سياق السلة
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 