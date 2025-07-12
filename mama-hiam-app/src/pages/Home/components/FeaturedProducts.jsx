import React from 'react';

function FeaturedProducts() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-primary-orange mb-6">منتجات مميزة</h2>
        {/* هنا سيتم عرض المنتجات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* أمثلة مؤقتة */}
          <div className="border p-4 rounded bg-cream-beige">منتج 1</div>
          <div className="border p-4 rounded bg-cream-beige">منتج 2</div>
          <div className="border p-4 rounded bg-cream-beige">منتج 3</div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts; 