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
      {/* Swiper Component */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        effect="fade"
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="absolute inset-0 w-full h-[500px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative">
            {/* Background Image */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.imageUrl})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-40" />

            {/* Centered Content Container */}
            <div className="relative z-10 h-full text-white flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-shadow-lg">{slide.title}</h1>
              <p className="text-xl md:text-2xl text-shadow max-w-2xl mb-8">{slide.paragraph}</p>
              <Link
                to="/products"
                className="bg-primary-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
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