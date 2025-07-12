import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';

// Placeholder testimonial data
const testimonialsData = [
  { id: 30, name: 'أم خالد', quote: 'جودة الملابس ممتازة والتصاميم رائعة لطفلي. خدمة العملاء متعاونة جداً.', imageUrl: 'https://loremflickr.com/150/150/woman,face?random=30', rating: 5 },
  { id: 31, name: 'أبو فارس', quote: 'وصلت الطلبية بسرعة والتغليف كان مرتب. الأسعار مناسبة مقارنة بالجودة.', imageUrl: 'https://loremflickr.com/150/150/man,face?random=31', rating: 4 },
  { id: 32, name: 'سارة .م', quote: 'أحببت نعومة الأقمشة على بشرة طفلتي الرضيعة. سأعود للشراء مرة أخرى بالتأكيد.', imageUrl: 'https://loremflickr.com/150/150/woman,profile?random=32', rating: 5 },
  { id: 33, name: 'محمد العلي', quote: 'الموقع سهل الاستخدام وتجربة الشراء كانت سلسة. تشكيلة الاكسسوارات جميلة.', imageUrl: 'https://loremflickr.com/150/150/man,profile?random=33', rating: 4 },
  { id: 34, name: 'نورة فهد', quote: 'المنتجات وصلت كما في الوصف تمامًا، والألوان زاهية وجميلة جدًا.', imageUrl: 'https://loremflickr.com/150/150/woman,happy?random=34', rating: 5 },
  { id: 35, name: 'عبدالله س.', quote: 'فكرة رائعة لهدايا المواليد، الجودة عالية والتصاميم مميزة.', imageUrl: 'https://loremflickr.com/150/150/man,casual?random=35', rating: 4 },
];

// --- New Testimonial Slide Layout ---
function TestimonialSlideContent({ testimonial }) {
  const contentVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.2 } }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-2 md:p-10 bg-gradient-to-br from-white to-cream-beige/50 border border-primary-orange/10 rounded-xl mx-auto max-w-4xl min-h-[280px] relative pb-6 shadow-lg">
        {/* Decorative Quote Icon - Moved right */}
        <svg className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-10 h-10 text-primary-orange/20 z-0" fill="currentColor" viewBox="0 0 32 32" ><path d="M14,12 H 8 V 8 H12 C 12,4.691 9.309,2 6,2 H 0 V 12 H 6 V 18 H 0 V 30 H 14 V 12 Z M 32,12 H 26 V 8 H 30 C 30,4.691 27.309,2 24,2 H 18 V 12 H 24 V 18 H 18 V 30 H 32 V 12 Z"></path></svg>
        
        {/* Text Content with Animation - Now on the left */}
        <motion.div 
            variants={contentVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="flex-grow text-right z-10 order-2 md:order-1 md:mr-8 rtl:md:ml-8 rtl:md:mr-0 "
        >
            <p className="text-xl md:text-2xl font-medium text-dark-blue leading-relaxed mb-4">{testimonial.quote}</p>
            <h4 className="font-bold text-xl text-primary-orange mb-1">- {testimonial.name}</h4>
            {/* Re-added Rating Stars */}
            {testimonial.rating && (
                <div className="flex justify-start mt-4">
                    {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-7 h-7 ${i < testimonial.rating ? 'text-light-orange'  : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                </div>
            )}
        </motion.div>

        {/* Image - Now on the right */}
        <div className="flex-shrink-0 mb-6 md:mb-0 order-1 md:order-2 z-10">
            <img
                src={testimonial.imageUrl}
                alt={testimonial.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary-orange/20 shadow-lg"
            />
        </div>

    </div>
  );
}

// --- Testimonials Section ---
function Testimonials() {
  return (
    <section className="py-10 pb-20  bg-gradient-to-br from-white via-light-orange/5 to-cream-beige/15">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-orange mb-12">شهادات نعتز بها</h2>
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          spaceBetween={30} 
          slidesPerView={1}
          effect="fade"
          fadeEffect={{
             crossFade: true
          }}
          loop={true}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          pagination={{ 
            clickable: true,
            el: '.testimonial-pagination' // تحديد عنصر مخصص للنقاط
          }}
          className="pb-12 testimonial-swiper-fade"
        >
          {testimonialsData.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <TestimonialSlideContent testimonial={testimonial} />
            </SwiperSlide>
          ))}
          {/* عنصر مخصص للنقاط في أسفل الكارد */}
         
        </Swiper>
      </div>
    </section>
  );
}

export default Testimonials; 