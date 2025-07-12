import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen"> 
      <Header />
      <main className="flex-grow pt-20"> 
        {/* Outlet يعرض محتوى الصفحة الحالية */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout; 