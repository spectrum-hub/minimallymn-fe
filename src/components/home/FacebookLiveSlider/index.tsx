import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Grid, Autoplay } from 'swiper/modules';
import { LiveStreamCard } from './LiveStreamCard';
import { liveStreams } from './data';

// Import Swiper styles

export function FacebookLiveSlider() {
  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Live Streams</h2>
      
      <Swiper
        modules={[Navigation, Pagination, Grid, Autoplay]}
        spaceBetween={16}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        grid={{
          rows: 2,
          fill: 'row'
        }}
        breakpoints={{
          // Mobile: 1 column
          0: {
            slidesPerView: 1,
            grid: { rows: 1 }
          },
          // Tablet: 2 columns
          768: {
            slidesPerView: 2,
            grid: { rows: 2 }
          },
          // Desktop: 3 columns
          1280: {
            slidesPerView: 3,
            grid: { rows: 2 }
          }
        }}
        className="h-[600px]"
      >
        {liveStreams.map((stream) => (
          <SwiperSlide key={stream.id}>
            <LiveStreamCard stream={stream} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}