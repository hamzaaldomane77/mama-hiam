import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { fetchProducts, searchProducts, fetchProductsByCategory } from "../../services/api";
import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";

// تعريف الألوان - محدثة لتتناسق مع الموقع
const colors = {
  primary: "#f97316", // البرتقالي الأساسي (primary-orange)
  secondary: "#1e3a8a", // الأزرق الداكن (dark-blue)
  cream: "#f5f5dc", // البيج الكريمي
  white: "#FFFFFF",
};

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { addToCart, cartItems } = useCart();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // استخراج الفئة من URL إذا وجدت
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      setIsSearching(true); // نعتبر التصفية حسب الفئة كنوع من البحث
    } else {
      setSelectedCategory(null);
      setIsSearching(false);
    }
    setCurrentPage(1); // إعادة تعيين الصفحة الحالية عند تغيير الفئة
  }, [searchParams]);

  // جلب المنتجات عند تحميل المكون أو تغيير الصفحة أو الفئة
  useEffect(() => {
    if (selectedCategory) {
      loadProductsByCategory(selectedCategory, currentPage);
    } else {
      loadProducts(currentPage);
    }
  }, [currentPage, selectedCategory]);

  // دالة جلب المنتجات
  const loadProducts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts(page);
      
      if (data && Array.isArray(data.data)) {
        setProducts(data.data);
        setTotalPages(data.meta?.last_page || 1);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError('حدث خطأ في تحميل المنتجات. يرجى المحاولة مرة أخرى.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // دالة جلب المنتجات حسب الفئة
  const loadProductsByCategory = async (category, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductsByCategory(category, page);
      
      if (data && Array.isArray(data.data)) {
        setProducts(data.data);
        setTotalPages(data.meta?.last_page || 1);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error loading products by category:', err);
      setError('حدث خطأ في تحميل منتجات هذا الصنف. يرجى المحاولة مرة أخرى.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // معالجة البحث
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1);
    setSelectedCategory(null); // إزالة الفئة المحددة عند البحث
    
    // تنظيف URL من معاملات الفئة عند البحث
    if (searchParams.get('category')) {
      navigate('/products', { replace: true });
    }

    if (term.trim() === "") {
      setIsSearching(false);
      loadProducts(1);
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);
      const data = await searchProducts(term, 1);
      
      if (data && Array.isArray(data.data)) {
        setProducts(data.data);
        setTotalPages(data.meta?.last_page || 1);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error searching products:', err);
      setError('حدث خطأ في البحث. يرجى المحاولة مرة أخرى.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // الانتقال إلى صفحة محددة
  const goToPage = (pageNumber) => {
    if (pageNumber === currentPage) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // الانتقال إلى الصفحة التالية
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // الانتقال إلى الصفحة السابقة
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // التحقق من وجود المنتج في السلة
  const isInCart = (productId) => {
    return cartItems.some((item) => item.id === productId);
  };

  // إضافة المنتج إلى السلة مع تأثير حركي
  const handleAddToCart = (product) => {
    // تحويل البيانات إلى الشكل المتوقع في السلة
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images?.[0] || 'https://placehold.co/400x300/FFEED9/333333?text=صورة+غير+متوفرة'
    };
    addToCart(cartProduct);
  };

  // تكوين تأثير لظهور البطاقات
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // تكوين أرقام الصفحات للعرض
  const getPagination = () => {
    const pages = [];
    const maxPages = Math.min(totalPages, 5);
    let startPage = 1;

    if (totalPages > 5) {
      if (currentPage <= 3) {
        startPage = 1;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      } else {
        startPage = currentPage - 2;
      }
    }

    for (let i = 0; i < maxPages; i++) {
      if (startPage + i <= totalPages) {
        pages.push(startPage + i);
      }
    }

    return pages;
  };

  // مكون التحميل
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-orange"></div>
    </div>
  );

  return (
    <div className="relative min-h-screen">
      {/* خلفية مبسطة وأنيقة */}
      <div className="fixed inset-0 bg-gradient-to-br from-cream-beige via-orange-50 to-amber-50"></div>
      
      {/* طبقة تدرج خفيفة */}
      <div className="fixed inset-0 bg-gradient-to-tr from-primary-orange/10 via-transparent to-dark-blue/5"></div>

      {/* عناصر زخرفية مبسطة */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-primary-orange/20 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-dark-blue/15 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-100/30 blur-3xl"></div>
      </div>

      {/* محتوى الصفحة */}
      <div className="relative z-10">
        <div className="container mx-auto py-24 px-4">
          <div className="relative">
            <h1 className="text-4xl font-bold text-center mb-10 text-dark-blue">
              {selectedCategory ? `منتجات: ${selectedCategory}` : 'المنتجات'}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-primary-orange to-transparent"></div>
            </h1>
            {selectedCategory && (
              <div className="text-center mb-6">
                <Link 
                  to="/categories" 
                  className="inline-flex items-center text-primary-orange hover:text-orange-600 transition-colors font-medium"
                >
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  العودة إلى الأصناف
                </Link>
                <span className="mx-2 text-dark-blue/40">|</span>
                <Link 
                  to="/products" 
                  className="text-dark-blue/70 hover:text-primary-orange transition-colors"
                >
                  عرض جميع المنتجات
                </Link>
              </div>
            )}
          </div>

          {/* حقل البحث محسن */}
          <div className="mb-12 max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none z-10">
                <svg
                  className="w-5 h-5 text-primary-orange"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearch}
                className="block w-full p-4 ps-12 text-md border-2 border-primary-orange/20 rounded-xl bg-white/95 backdrop-blur-sm focus:ring-2 focus:ring-primary-orange focus:border-primary-orange focus:outline-none placeholder-dark-blue/60 text-dark-blue shadow-lg hover:border-primary-orange/40 transition-all duration-200"
                placeholder="ابحث عن المنتجات..."
              />
            </div>
          </div>

          {/* عرض رسالة الخطأ */}
          {error && (
            <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              {error}
              <button
                onClick={() => selectedCategory ? loadProductsByCategory(selectedCategory, currentPage) : loadProducts(currentPage)}
                className="ml-4 text-primary-orange hover:underline"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {/* عرض التحميل أو المنتجات */}
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
          {/* عرض المنتجات */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
                  {products.map((product) => (
                <motion.div
                  key={product.id}
                      className="group relative w-full rounded-xl shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm border border-orange-100 hover:shadow-xl transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.03,
                        boxShadow: "0 25px 50px -12px rgba(249, 115, 22, 0.25)",
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* محتوى البطاقة */}
                  <div className="relative">
                        <Link to={`/products/${product.id}`} className="block overflow-hidden rounded-t-xl">
                      <img
                        className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            src={product.images?.[0] || 'https://placehold.co/400x300/FFEED9/333333?text=صورة+غير+متوفرة'}
                        alt={product.name}
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/400x300/FFEED9/333333?text=صورة+غير+متوفرة';
                            }}
                      />
                      {/* تدرج شفاف فوق الصورة */}
                          <div className="absolute inset-0 bg-gradient-to-t from-dark-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                        
                        {/* شارات المنتج */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          {product.new_collection && (
                            <span className="bg-primary-orange text-white text-xs font-bold px-2 py-1 rounded">
                              جديد
                            </span>
                          )}
                          {product.featured && (
                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                              مميز
                            </span>
                          )}
                          {product.old_price && parseFloat(product.old_price) > parseFloat(product.price) && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              خصم
                            </span>
                          )}
                  </div>
                      </div>
                      
                      <div className="px-5 py-4">
                        <Link to={`/products/${product.id}`} className="block mb-2">
                          <h5 className="text-xl font-bold tracking-tight text-dark-blue hover:text-primary-orange transition-colors line-clamp-2">
                            {product.name}
                          </h5>
                        </Link>
                        
                        {/* الفئات */}
                        {product.categories && product.categories.length > 0 && (
                          <div className="mb-3">
                            <span className="bg-gradient-to-r from-orange-100 to-orange-50 text-dark-blue text-xs font-semibold px-2.5 py-0.5 rounded-md">
                              {product.categories[0]}
                      </span>
                    </div>
                        )}
                        
                    <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-dark-blue">
                              {parseFloat(product.price).toFixed(2)} {" "}
                              <span className="text-sm">ل.س</span>
                            </span>
                            {product.old_price && parseFloat(product.old_price) > parseFloat(product.price) && (
                              <span className="text-sm text-gray-500 line-through">
                                {parseFloat(product.old_price).toFixed(2)} ل.س
                      </span>
                            )}
                          </div>
                          
                      <button
                        onClick={() => handleAddToCart(product)}
                            className={`relative text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 shadow-lg hover:shadow-xl ${
                          isInCart(product.id)
                            ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-green-300"
                                : "bg-gradient-to-r from-primary-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:ring-orange-300"
                        }`}
                      >
                        {isInCart(product.id) ? (
                          <>
                            <span className="mr-1">✓</span> في السلة
                          </>
                        ) : (
                          "أضف للسلة"
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* رسالة عند عدم وجود نتائج */}
              {products.length === 0 && !loading && (
                <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-orange-100">
              <svg
                    className="w-16 h-16 mx-auto text-dark-blue mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
                  <h3 className="text-xl font-semibold text-dark-blue">
                    {selectedCategory 
                      ? `لا توجد منتجات في صنف "${selectedCategory}"` 
                      : isSearching 
                      ? 'لا توجد منتجات مطابقة للبحث' 
                      : 'لا توجد منتجات متوفرة حالياً'
                    }
              </h3>
                  <p className="text-primary-orange mt-2">
                    {selectedCategory 
                      ? 'جرب تصفح أصناف أخرى أو عرض جميع المنتجات'
                      : isSearching 
                      ? 'جرب كلمات بحث أخرى' 
                      : 'يرجى المحاولة مرة أخرى لاحقاً'
                    }
                  </p>
            </div>
          )}

          {/* التنقل بين الصفحات */}
              {totalPages > 1 && !loading && (
            <div className="mt-16 flex justify-center">
                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-orange-100 flex items-center">
                {/* زر الصفحة السابقة */}
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    currentPage === 1
                          ? "text-dark-blue/30 cursor-not-allowed"
                          : "text-primary-orange hover:bg-orange-50"
                  }`}
                  aria-label="الصفحة السابقة"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* أرقام الصفحات */}
                {getPagination().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`w-10 h-10 mx-1 rounded-full flex items-center justify-center transition-colors ${
                      currentPage === pageNumber
                            ? "bg-primary-orange text-white shadow-md"
                            : "text-dark-blue hover:bg-orange-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                {/* إذا كان هناك المزيد من الصفحات */}
                {totalPages > 5 &&
                  currentPage < totalPages - 2 &&
                  currentPage > 3 && (
                        <span className="mx-1 text-dark-blue">...</span>
                  )}

                {/* زر الصفحة التالية */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    currentPage === totalPages
                          ? "text-dark-blue/30 cursor-not-allowed"
                          : "text-primary-orange hover:bg-orange-50"
                  }`}
                  aria-label="الصفحة التالية"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
