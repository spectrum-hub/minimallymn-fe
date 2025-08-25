import { Play, Users } from 'lucide-react';
import { LiveStream } from './types';

interface LiveStreamCardProps {
  readonly stream: LiveStream;
}

export function LiveStreamCard({ stream }: LiveStreamCardProps) {
  return (
    <div className="relative h-[280px] rounded-lg overflow-hidden group">
      <img
        src={stream.thumbnail}
        alt={stream.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="absolute top-3 left-3">
          {stream.isLive ? (
            <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">LIVE</span>
            </div>
          ) : (
            <div className="bg-gray-800/80 px-3 py-1 rounded-full">
              <span className="text-white text-sm">{stream.scheduledFor}</span>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold mb-1 line-clamp-1">{stream.title}</h3>
          <p className="text-gray-300 text-sm mb-2">{stream.host}</p>
          
          <div className="flex items-center space-x-2 text-gray-300 text-sm">
            <Users className="w-4 h-4" />
            <span>{stream.viewers.toLocaleString()}</span>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 text-white fill-current" />
          </div>
        </div>
      </div>
    </div>
  );
}