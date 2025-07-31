import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { fetchSliders } from '../../../services/api';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

function HeroSection() {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    let isMounted = true;
    fetchSliders()
      .then(data => {
        if (isMounted && Array.isArray(data.data) && data.data.length > 0) {
          setSlides(
            data.data.map(item => ({
              imageUrl: item.image,
              title: item.title,
              paragraph: item.description || ''
            }))
          );
        }
      })
      .catch(() => {
        // لا تعرض أي شيء إذا فشل الطلب
      });
    return () => { isMounted = false; };
  }, []);

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden">
      {/* خلفية ملونة طفولية */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-pink-50"></div>
      
      {/* طبقة تدرج إضافية */}
      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-50/60 via-transparent to-green-50/60"></div>
      
      {/* عناصر زخرفية طفولية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-pink-200/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-yellow-100/30 blur-3xl"></div>
      </div>

      {/* Swiper Component */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={slides.length > 1}
        effect="fade"
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="relative z-10 w-full h-[500px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative">
            {/* Background Image */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.imageUrl})` }}
            />

            {/* Overlay مع تدرج ملون */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

            {/* Centered Content Container */}
            <div className="relative z-10 h-full text-white flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-shadow-lg drop-shadow-2xl">{slide.title}</h1>
              <p className="text-xl md:text-2xl text-shadow max-w-2xl mb-8 drop-shadow-lg">{slide.paragraph}</p>
              <Link
                to="/products"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105"
                style={{ backgroundColor: '#E53935' }}
              >
                تسوق الآن
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroSection; 