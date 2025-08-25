import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
    itemCount: '1.2K items'
  },
  {
    id: 2,
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050',
    itemCount: '3.4K items'
  },
  {
    id: 3,
    name: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a',
    itemCount: '2.8K items'
  },
  {
    id: 4,
    name: 'Beauty',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
    itemCount: '1.5K items'
  },
  {
    id: 5,
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
    itemCount: '950 items'
  }
];

export function CategorySection() {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Shop by Category</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex-none w-64 group cursor-pointer"
          >
            <div className="relative h-80 rounded-xl overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-300">{category.itemCount}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}