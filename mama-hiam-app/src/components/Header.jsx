import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CartIcon from './CartIcon';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-4 bg-white border-b border-amber-100 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center group">
            <img src="/logo.png" alt="Mama Hieam Logo" className="h-12 w-auto drop-shadow-md transition-transform group-hover:scale-105" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-4 space-x-reverse">
          <li><Link to="/" className="text-amber-800 hover:text-primary-orange transition-colors">الرئيسية</Link></li>
          <li><Link to="/categories" className="text-amber-800 hover:text-primary-orange transition-colors">الأصناف</Link></li>
          <li><Link to="/products" className="text-amber-800 hover:text-primary-orange transition-colors">المنتجات</Link></li>
          <li><Link to="/branches" className="text-amber-800 hover:text-primary-orange transition-colors">أفرعنا</Link></li>

        </ul>

        {/* أيقونة سلة التسوق */}
        <div className="hidden md:block">
          <CartIcon />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <CartIcon />
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className=" focus:outline-none ml-2 text-primary-orange transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg pb-4 border-b border-amber-100">
          <ul className="flex flex-col items-center space-y-4 mt-4">
            <li><Link to="/" className="text-amber-800 hover:text-primary-orange block py-2 transition-colors" onClick={() => setIsMenuOpen(false)}>الرئيسية</Link></li>
            <li><Link to="/categories" className="text-amber-800 hover:text-primary-orange block py-2 transition-colors" onClick={() => setIsMenuOpen(false)}>الأصناف</Link></li>
            <li><Link to="/products" className="text-amber-800 hover:text-primary-orange block py-2 transition-colors" onClick={() => setIsMenuOpen(false)}>المنتجات</Link></li>
            <li><Link to="/branches" className="text-amber-800 hover:text-primary-orange block py-2 transition-colors" onClick={() => setIsMenuOpen(false)}>أفرعنا</Link></li>

          </ul>
        </div>
      )}
    </header>
  );
}

export default Header; 