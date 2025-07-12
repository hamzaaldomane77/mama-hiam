import axios from 'axios';

// Base URL للـ API
const BASE_URL = 'https://backend.mama-hieam.shop/api/v1';

// إنشاء instance من axios مع الإعدادات الأساسية
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  timeout: 10000 // 10 ثواني timeout
});

// Interceptor للتعامل مع الاستجابات والأخطاء
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // يمكن إضافة معالجة أخطاء مخصصة هنا
    if (error.response?.status === 404) {
      console.error('المورد غير موجود');
    } else if (error.response?.status >= 500) {
      console.error('خطأ في الخادم');
    } else if (error.code === 'ECONNABORTED') {
      console.error('انتهت مهلة الاتصال');
    }
    
    return Promise.reject(error);
  }
);

// ================================
// APIs الخاصة بالشرائح (Sliders)
// ================================

/**
 * جلب جميع الشرائح
 */
export const fetchSliders = async () => {
  try {
    const response = await apiClient.get('/sliders');
    return response.data;
  } catch (error) {
    console.error('Error fetching sliders:', error);
    throw error;
  }
};

// ================================
// APIs الخاصة بالمنتجات (Products)
// ================================

/**
 * جلب جميع المنتجات مع إمكانية التصفح
 * @param {number} page - رقم الصفحة
 * @param {number} perPage - عدد المنتجات في الصفحة الواحدة
 */
export const fetchProducts = async (page = 1, perPage = 12) => {
  try {
    const response = await apiClient.get('/products', {
      params: { page, per_page: perPage }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * جلب منتج واحد بواسطة ID
 * @param {number|string} id - معرف المنتج
 */
export const fetchProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * البحث في المنتجات
 * @param {string} searchTerm - كلمة البحث
 * @param {number} page - رقم الصفحة
 */
export const searchProducts = async (searchTerm, page = 1) => {
  try {
    const response = await apiClient.get('/products', {
      params: { 
        search: searchTerm,
        page
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * جلب المنتجات حسب الفئة
 * @param {string} category - اسم الفئة
 * @param {number} page - رقم الصفحة
 */
export const fetchProductsByCategory = async (category, page = 1) => {
  try {
    const response = await apiClient.get('/products', {
      params: { 
        category: category,
        page
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

/**
 * جلب المنتجات المميزة
 */
export const fetchFeaturedProducts = async () => {
  try {
    const response = await apiClient.get('/products', {
      params: { featured: true }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

/**
 * جلب المنتجات الجديدة
 */
export const fetchNewProducts = async () => {
  try {
    const response = await apiClient.get('/products', {
      params: { 
        new_collection: true,
        _t: Date.now() // إضافة timestamp لتجنب الـ cache
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching new products:', error);
    throw error;
  }
};

/**
 * جلب منتجات العروض والتخفيضات
 */
export const fetchOffersProducts = async () => {
  try {
    const response = await apiClient.get('/offers-products');
    return response.data;
  } catch (error) {
    console.error('Error fetching offers products:', error);
    throw error;
  }
};

/**
 * جلب المنتجات المميزة من الـ endpoint المخصص
 */
export const fetchFeaturedProductsFromAPI = async () => {
  try {
    const response = await apiClient.get('/featured-products', {
      params: { 
        _t: Date.now() // إضافة timestamp لتجنب الـ cache
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured products from API:', error);
    throw error;
  }
};

// ================================
// APIs المستقبلية (يمكن إضافتها لاحقاً)
// ================================

/**
 * جلب الفئات
 */
export const fetchCategories = async () => {
  try {
    const response = await apiClient.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * إرسال رسالة تواصل
 * @param {Object} contactData - بيانات الرسالة
 */
export const sendContactMessage = async (contactData) => {
  try {
    const response = await apiClient.post('/contact', contactData);
    return response.data;
  } catch (error) {
    console.error('Error sending contact message:', error);
    throw error;
  }
};

/**
 * الاشتراك في النشرة البريدية
 * @param {string} email - البريد الإلكتروني
 */
export const subscribeNewsletter = async (email) => {
  try {
    const response = await apiClient.post('/newsletter/subscribe', { email });
    return response.data;
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    throw error;
  }
};

/**
 * إرسال طلب جديد
 * @param {Object} orderData - بيانات الطلب
 * @param {string} orderData.name - اسم العميل
 * @param {string} orderData.phone - رقم الهاتف
 * @param {string} orderData.address - العنوان
 * @param {string} orderData.notes - ملاحظات إضافية
 * @param {Array} orderData.items - قائمة المنتجات
 */
export const createOrder = async (orderData) => {
  try {
    console.log('Creating order with data:', orderData);
    
    const response = await apiClient.post('/orders', orderData);
    
    console.log('Order created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    
    // معالجة أخطاء مخصصة
    if (error.response?.status === 400) {
      throw new Error('بيانات الطلب غير صحيحة. يرجى التحقق من البيانات المدخلة.');
    } else if (error.response?.status === 422) {
      throw new Error('خطأ في التحقق من البيانات. يرجى التأكد من صحة جميع الحقول.');
    } else if (error.response?.status >= 500) {
      throw new Error('خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.');
    }
    
    throw error;
  }
};

// ================================
// APIs الخاصة بالفروع (Branches)
// ================================

/**
 * جلب جميع الفروع
 */
export const fetchBranches = async () => {
  try {
    const response = await apiClient.get('/branchs', {
      params: { 
        _t: Date.now() // إضافة timestamp لتجنب الـ cache
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

// تصدير apiClient للاستخدام المباشر عند الحاجة
export { apiClient };

// تصدير BASE_URL للاستخدام في أماكن أخرى
export { BASE_URL }; 