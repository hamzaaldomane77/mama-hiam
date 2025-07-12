import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const orderData = location.state?.orderData;

  // تسجيل للتشخيص
  console.log('OrderSuccessPage - location.state:', location.state);
  console.log('OrderSuccessPage - orderData:', orderData);

  // إذا لم تكن هناك بيانات طلب، توجيه للصفحة الرئيسية بعد تأخير
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!orderData) {
        console.log('No order data found, redirecting to home...');
        navigate('/', { replace: true });
      }
    }, 1000); // انتظار ثانية واحدة

    return () => clearTimeout(timer);
  }, [orderData, navigate]);

  // عرض loading أثناء التحقق من البيانات
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">جاري تحضير تفاصيل الطلب...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 text-white rounded-full mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6m0 0l6 6m-6-6v12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-700 mb-2">لم يتم العثور على تفاصيل الطلب</h1>
          <p className="text-gray-600 mb-4">قد تكون هناك مشكلة في تحميل بيانات الطلب</p>
          <Link
            to="/"
            className="bg-primary-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 text-white rounded-full mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">تم إرسال طلبك بنجاح!</h1>
          <p className="text-gray-600">سيتم التواصل معك قريباً لتأكيد الطلب</p>
        </motion.div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-dark-blue mb-4">معلومات الطلب</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">رقم الطلب:</span>
                <span className="text-primary-orange font-bold">#{orderData.number || 'غير متوفر'}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">تاريخ الطلب:</span>
                <span className="text-gray-600">{formatDate(orderData.created_at)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">اسم العميل:</span>
                <span className="text-gray-600">{orderData.customer_name || 'غير متوفر'}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">رقم الهاتف:</span>
                <span className="text-gray-600">{orderData.customer_phone || 'غير متوفر'}</span>
              </div>
              
              <div className="py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">العنوان:</span>
                <p className="text-gray-600 mt-1">{orderData.customer_address || 'غير متوفر'}</p>
              </div>
              
              {orderData.notes && (
                <div className="py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">ملاحظات:</span>
                  <p className="text-gray-600 mt-1">{orderData.notes}</p>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2 pt-4">
                <span className="text-xl font-bold text-dark-blue">الإجمالي:</span>
                <span className="text-2xl font-bold text-primary-orange">{orderData.total_price || 0} ر.س</span>
              </div>
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-dark-blue mb-4">تفاصيل المنتجات</h2>
            
            <div className="space-y-4">
              {orderData.items && orderData.items.length > 0 ? (
                orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex-1">
                      <h3 className="font-semibold text-dark-blue">{item.product_name || 'منتج غير محدد'}</h3>
                      <p className="text-gray-600">الكمية: {item.qty || 0}</p>
                      <p className="text-gray-600">سعر القطعة: {item.unit_price || 0} ر.س</p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-primary-orange">{item.line_total || 0} ر.س</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center py-4">لا توجد منتجات في هذا الطلب</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-8 space-y-4"
        >
          
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-primary-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              العودة للصفحة الرئيسية
            </Link>
            
            <Link
              to="/products"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              متابعة التسوق
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default OrderSuccessPage; 