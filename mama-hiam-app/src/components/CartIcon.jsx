import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

function CartIcon() {
  const { getCartCount, toggleCart } = useCart();
  const cartCount = getCartCount();

  return (
    <div className="relative">
      <button
        onClick={toggleCart}
        className="relative flex items-center justify-center w-10 h-10 p-2  text-primary-orange focus:outline-none transition-colors duration-200"
        aria-label="عرض سلة التسوق"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </button>

      {cartCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-primary-orange text-white text-xs font-bold"
        >
          {cartCount > 9 ? '9+' : cartCount}
        </motion.div>
      )}
    </div>
  );
}

export default CartIcon; 