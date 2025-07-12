import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useLoading } from '../../context/LoadingContext';
import { createOrder } from '../../services/api';

function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  // إذا كانت السلة فارغة ولم يتم إكمال الطلب، توجيه المستخدم للصفحة الرئيسية
  useEffect(() => {
    if (cartItems.length === 0 && !orderCompleted) {
      navigate('/');
    }
  }, [cartItems.length, orderCompleted, navigate]);

  // دالة للحصول على صورة آمنة
  const getItemImage = (item) => {
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      return item.images[0];
    }
    // صورة افتراضية في حالة عدم وجود صورة
    return '/logo.png';
  };

  // معالجة تغيير البيانات في الفورم
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // إزالة الخطأ عند التعديل
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'رقم الهاتف يجب أن يكون 10 أرقام';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'العنوان مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إرسال الطلب
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    showLoading('جاري إرسال الطلب...');

    try {
      // تحضير بيانات الطلب
      const orderData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
        items: cartItems.map(item => ({
          shop_product_id: item.id,
          qty: item.quantity
        }))
      };

      console.log('Sending order data:', orderData);

      // إرسال الطلب
      const response = await createOrder(orderData);
      
      console.log('Order response:', response);
      console.log('Order response data:', response.data);

      // تحديد أن الطلب تم إكماله قبل مسح السلة
      setOrderCompleted(true);
      
      // مسح السلة
      clearCart();
      
      // إخفاء الودينغ قبل التوجيه
      hideLoading();

      // التوجيه لصفحة تأكيد الطلب
      console.log('Navigating to order-success with data:', response.data);
      navigate('/order-success', { 
        state: { orderData: response.data },
        replace: true
      });

    } catch (error) {
      console.error('Error submitting order:', error);
      alert(error.message || 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
      hideLoading();
    } finally {
      setIsSubmitting(false);
    }
  };

  // إذا كانت السلة فارغة ولم يتم إكمال الطلب، لا تعرض الصفحة
  if (cartItems.length === 0 && !orderCompleted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-orange/10 to-cream-beige/20 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-dark-blue mb-2">إتمام الطلب</h1>
          <p className="text-gray-600">أدخل بياناتك لإتمام عملية الشراء</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-dark-blue mb-4">ملخص الطلب</h2>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <img 
                      src={getItemImage(item)} 
                      alt={item.name || 'منتج'} 
                      className="w-16 h-16 object-cover rounded-md"
                      onError={(e) => {
                        e.target.src = '/logo.png';
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-dark-blue">{item.name || 'منتج غير محدد'}</h3>
                      <p className="text-gray-600">الكمية: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-primary-orange">{((item.price || 0) * (item.quantity || 1))} ر.س</p>
                    <p className="text-sm text-gray-500">{item.price || 0} ر.س × {item.quantity || 1}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-dark-blue">الإجمالي:</span>
                <span className="text-2xl font-bold text-primary-orange">{getCartTotal()} ر.س</span>
              </div>
            </div>
          </motion.div>

          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-dark-blue mb-6">بيانات التوصيل</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="أدخل اسمك الكامل"
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0999999999"
                  disabled={isSubmitting}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="أدخل عنوانك التفصيلي"
                  disabled={isSubmitting}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات إضافية
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
                  placeholder="أي ملاحظات إضافية (اختياري)"
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg font-bold text-white transition-all duration-300 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-orange hover:bg-orange-600 transform hover:scale-105'
                }`}
              >
                {isSubmitting ? 'جاري إرسال الطلب...' : `إرسال الطلب (${getCartTotal()} ر.س)`}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage; 