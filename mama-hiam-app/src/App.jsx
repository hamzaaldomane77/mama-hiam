import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/Home/HomePage';
import ProductsPage from './pages/products/productsPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import OffersPage from './pages/offers/OffersPage';
import FeaturedProductsPage from './pages/featured-products/FeaturedProductsPage';
import BranchesPage from './pages/branches/BranchesPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrderSuccessPage from './pages/checkout/OrderSuccessPage';
import CartPanel from './components/CartPanel';
import ScrollToTop from './components/ScrollToTop';
import GlobalLoader from './components/GlobalLoader';
import SiteSettings from './components/SiteSettings';
import { useLoading } from './context/LoadingContext';
import './App.css';

// Placeholder components for missing pages

function App() {
  const [initialLoading, setInitialLoading] = useState(true);
  const { isLoading, loadingMessage } = useLoading();

  useEffect(() => {
    // منع التمرير أثناء التحميل الأولي
    document.body.classList.add('loading');
    document.body.style.overflow = 'hidden';
    // التمرير الفوري إلى أعلى الصفحة قبل التحميل
    window.scrollTo(0, 0);
    
    // محاكاة تحميل التطبيق
    const loadApp = async () => {
      try {
        // يمكنك هنا إضافة أي عمليات تحميل أساسية
        // مثل تحميل إعدادات التطبيق، بيانات المستخدم، إلخ
        
        // محاكاة تحميل لمدة 4 ثواني لتغطية تحميل الهوم بيج
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // التمرير الفوري إلى أعلى الصفحة عند انتهاء التحميل
        window.scrollTo(0, 0);
        
        // إعادة تفعيل التمرير
        document.body.classList.remove('loading');
        document.body.style.overflow = 'auto';
        
        setInitialLoading(false);
        
        // تأكيد إضافي للتمرير بعد انتهاء التحميل
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
        
        // تأكيد إضافي بعد تأخير أطول
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 300);
      } catch (error) {
        console.error('Error loading app:', error);
        // حتى في حالة الخطأ، نخفي اللودر ونعيد التمرير
        // التمرير الفوري إلى أعلى الصفحة عند انتهاء التحميل
        window.scrollTo(0, 0);
        
        document.body.classList.remove('loading');
        document.body.style.overflow = 'auto';
        
        setInitialLoading(false);
        
        // تأكيد إضافي للتمرير بعد انتهاء التحميل
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
        
        // تأكيد إضافي بعد تأخير أطول
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 300);
      }
    };

    loadApp();

    // تنظيف عند unmount
    return () => {
      document.body.classList.remove('loading');
      document.body.style.overflow = 'auto';
      // التأكد من التمرير إلى الأعلى عند الخروج
      window.scrollTo(0, 0);
    };
  }, []);

  // عرض Global Loader أثناء التحميل الأولي أو عند استخدام LoadingContext
  if (initialLoading) {
    return <GlobalLoader />;
  }

  return (
    <div className="App">
      {/* تحميل إعدادات الموقع */}
      <SiteSettings />
      
      {/* Global Loader من LoadingContext */}
      {isLoading && <GlobalLoader message={loadingMessage} />}
      
      <ScrollToTop />
      <Routes>
        {/* المسار الرئيسي يستخدم MainLayout */}
        <Route path="/" element={<MainLayout />}>
          {/* الصفحة الرئيسية التي تظهر عند الدخول للمسار الرئيسي */}
          <Route index element={<HomePage />} />
            
          {/* مسار صفحة الأصناف */}
          <Route path="products" element={<ProductsPage />} />
          
          {/* مسار المنتج المفرد */}
          <Route path="products/:id" element={<ProductDetailPage />} />
          
          {/* مسار الأصناف - يعرض صفحة الأصناف الجديدة */}
          <Route path="categories" element={<CategoriesPage />} />
          
          {/* مسار العروض والتخفيضات */}
          <Route path="offers" element={<OffersPage />} />
          
          {/* مسار المنتجات المميزة */}
          <Route path="featured-products" element={<FeaturedProductsPage />} />
          
          {/* مسار الفروع */}
          <Route path="branches" element={<BranchesPage />} />
          
          {/* مسار إتمام الطلب */}
          <Route path="checkout" element={<CheckoutPage />} />
          
          {/* مسار تأكيد الطلب */}
          <Route path="order-success" element={<OrderSuccessPage />} />
          
          {/* المسارات الأخرى */}

          
          {/* يمكنك إضافة مسار لصفحة "غير موجود" (404) */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
        
        {/* يمكنك إضافة مسارات لا تستخدم MainLayout هنا إذا لزم الأمر */}
      </Routes>
        
        {/* لوحة السلة */}
        <CartPanel />
        
        {/* إعدادات التوست */}
        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={4000}
          expand={true}
          theme="light"
        />
    </div>
  );
}

export default App;
