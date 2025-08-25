import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const secondarySlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&h=400',
    title: 'Sport Collection',
    price: '$299',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=400',
    title: 'New Arrivals',
    price: '$199',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&h=400',
    title: 'Limited Edition',
    price: '$399',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&h=400',
    title: 'Exclusive Series',
    price: '$499',
  }
];

export function SecondarySlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesToShow = 3;

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + slidesToShow >= secondarySlides.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? secondarySlides.length - slidesToShow : prev - 1
    );
  };

  return (
    <div className="relative h-[30vh] bg-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 h-full py-8">
        <div className="relative h-full">
          <div
            className="flex transition-transform duration-500 h-full"
            style={{ transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)` }}
          >
            {secondarySlides.map((slide) => (
              <div
                key={slide.id}
                className="min-w-[33.333%] px-2 h-full"
              >
                <div className="relative h-full rounded-lg overflow-hidden group">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-semibold">{slide.title}</h3>
                      <p className="text-lg">{slide.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}