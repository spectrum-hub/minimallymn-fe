import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Users } from 'lucide-react';

const liveStreams = [
  {
    id: 1,
    title: "Spring Collection Preview",
    host: "Sarah's Fashion",
    viewers: 1234,
    thumbnail: "https://images.unsplash.com/photo-1445205170230-053b83016050",
    isLive: true
  },
  {
    id: 2,
    title: "New Electronics Showcase",
    host: "Tech Reviews",
    viewers: 856,
    thumbnail: "https://images.unsplash.com/photo-1498049794561-7780e7231661",
    isLive: true
  },
  {
    id: 3,
    title: "Beauty Tips & Tricks",
    host: "Beauty Studio",
    viewers: 2100,
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    scheduledFor: "Starting in 10 minutes"
  }
];

export function FacebookLiveSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % liveStreams.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % liveStreams.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + liveStreams.length) % liveStreams.length);

  return (
    <div className="relative h-[500px] bg-gray-900 rounded-xl overflow-hidden">
      <div
        className="flex h-full transition-transform duration-500"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {liveStreams.map((stream) => (
          <div key={stream.id} className="min-w-full h-full relative">
            <img
              src={stream.thumbnail}
              alt={stream.title}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
              {stream.isLive ? (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                  <span className="font-semibold">LIVE NOW</span>
                </div>
              ) : (
                <div className="mb-4 text-gray-300">{stream.scheduledFor}</div>
              )}
              
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
                <Play className="w-8 h-8 fill-current" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2">{stream.title}</h3>
              <p className="text-lg mb-4">{stream.host}</p>
              
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>{stream.viewers.toLocaleString()} watching</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {liveStreams.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}