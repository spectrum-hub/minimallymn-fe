export interface LiveStream {
  id: number;
  title: string;
  host: string;
  viewers: number;
  thumbnail: string;
  isLive?: boolean;
  scheduledFor?: string;
}