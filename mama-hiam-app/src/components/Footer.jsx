import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-br from-white via-cream-beige to-light-orange/20 text-dark-blue mt-auto border-t border-primary-orange/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* قسم اللوغو والوصف */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="Mama Hieam Logo" className="h-12 w-auto drop-shadow-md" />
            </div>
            <p className="text-dark-blue/80 text-sm leading-relaxed">
              ماما هيام - متجرك المتخصص في ألبسة الأطفال عالية الجودة. نوفر أجمل الملابس والأزياء الأنيقة لأطفالك من جميع الأعمار، بأفضل الأسعار ومع ضمان الجودة والراحة.
            </p>
          </div>

          {/* قسم الروابط السريعة */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4 text-primary-orange">الروابط السريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-dark-blue/70 hover:text-primary-orange transition-colors duration-200 text-sm">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-dark-blue/70 hover:text-primary-orange transition-colors duration-200 text-sm">
                  التصنيفات
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-dark-blue/70 hover:text-primary-orange transition-colors duration-200 text-sm">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link to="/branches" className="text-dark-blue/70 hover:text-primary-orange transition-colors duration-200 text-sm">
                  أفرعنا
                </Link>
              </li>
            </ul>
          </div>

          {/* قسم الخدمات */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4 text-primary-orange">الخدمات</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/offers" className="text-dark-blue/70 hover:text-primary-orange transition-colors duration-200 text-sm">
                  العروض والتخفيضات
                </Link>
              </li>
              <li>
                <Link to="/featured-products" className="text-dark-blue/70 hover:text-primary-orange transition-colors duration-200 text-sm">
                  المنتجات المميزة
                </Link>
              </li>
             
            </ul>
          </div>

          {/* قسم التواصل الاجتماعي */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4 text-primary-orange">تابعنا على</h3>
            <div className="flex space-x-4 space-x-reverse mb-4">
              {/* واتساب */}
              <a
                href="https://wa.me/966999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-md"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                </svg>
              </a>

              {/* فيسبوك */}
              <a
                href="https://facebook.com/mamahieam"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-md"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* انستقرام */}
              <a
                href="https://instagram.com/mamahieam"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-md"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM15.156 7.987c.132-.132.322-.132.454 0l.706.706c.132.132.132.322 0 .454l-.706.706c-.132.132-.322.132-.454 0l-.706-.706c-.132-.132-.132-.322 0-.454l.706-.706zM12.017 7.155c2.673 0 4.832 2.159 4.832 4.832 0 2.673-2.159 4.832-4.832 4.832-2.673 0-4.832-2.159-4.832-4.832 0-2.673 2.159-4.832 4.832-4.832zM12.017 14.644c1.45 0 2.657-1.207 2.657-2.657S13.467 9.33 12.017 9.33c-1.45 0-2.657 1.207-2.657 2.657s1.207 2.657 2.657 2.657z"/>
                </svg>
              </a>
            </div>
            
            {/* معلومات الاتصال */}
            <div className="space-y-2">
              <p className="text-dark-blue/70 text-sm">
                <span className="font-semibold text-primary-orange">الهاتف:</span> 966999999999+
              </p>
              <p className="text-dark-blue/70 text-sm">
                <span className="font-semibold text-primary-orange">البريد:</span> info@mamahieam.com
              </p>
            </div>
          </div>
        </div>

        {/* خط الفاصل */}
        <div className="border-t border-primary-orange/30 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-dark-blue/70 text-sm mb-4 md:mb-0">
              &copy; {currentYear} ماما هيام. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 