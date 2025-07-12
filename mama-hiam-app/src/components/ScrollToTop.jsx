import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // التمرير إلى أعلى الصفحة عند تغيير المسار
    const scrollToTop = () => {
      // التحقق من وجود الودينغ الجلوبال
      const globalLoader = document.querySelector('[data-testid="global-loader"]');
      
      // إذا كان الودينغ موجود، لا نقوم بالتمرير
      if (globalLoader) {
        return;
      }
      
      // التمرير الفوري إلى أعلى الصفحة
      window.scrollTo(0, 0);
    };

    // استدعاء فوري للتمرير
    scrollToTop();

    // تأخير إضافي للتأكد من اكتمال العرض
    const scrollTimer = setTimeout(scrollToTop, 100);

    // تنظيف timer
    return () => clearTimeout(scrollTimer);
  }, [pathname]);

  return null;
}

export default ScrollToTop; 