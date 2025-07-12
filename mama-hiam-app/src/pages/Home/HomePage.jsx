import React from 'react';
import HeroSection from './components/HeroSection';
import Testimonials from './components/Testimonials';
import FeaturedProducts from './components/Accessories';
import NewArrivals from './components/NewArrivals';
import Discounts from './components/Discounts';

function HomePage() {
  return (
    <div>
      <HeroSection />
      <NewArrivals />
      <Discounts />
      <FeaturedProducts />
      <Testimonials />
    </div>
  );
}

export default HomePage; 