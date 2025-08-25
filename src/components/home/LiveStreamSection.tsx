import { Play } from 'lucide-react';

export function LiveStreamSection() {
  return (
    <div className="h-[500px] bg-gray-900 rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-4">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center mx-auto animate-pulse">
              <Play className="w-8 h-8 fill-current" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Live Stream</h3>
          <p className="text-gray-300">Join our live product showcase</p>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">LIVE</span>
          </div>
          <div className="text-white">
            <p className="font-semibold">Product Showcase</p>
            <p className="text-sm text-gray-300">1.2K watching</p>
          </div>
        </div>
      </div>
    </div>
  );
}