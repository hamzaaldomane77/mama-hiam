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
      
      // التحقق من أن الصفحة محملة بالكامل
      if (document.readyState === 'loading') {
        return;
      }
      
      // التمرير الفوري إلى أعلى الصفحة
      window.scrollTo(0, 0);
    };

    // تأخير قصير للتأكد من اكتمال العرض أولاً
    const scrollTimer = setTimeout(scrollToTop, 50);

    // تنظيف timer
    return () => clearTimeout(scrollTimer);
  }, [pathname]);

  return null;
}

export default ScrollToTop; 