import { Platform } from '@/lib/types/asset';

interface PlatformBadgeProps {
  platform: Platform;
}

const PLATFORM_STYLES: Record<Platform, string> = {
  youtube: 'bg-red-600 text-white',
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  tiktok: 'bg-black text-white',
};

const PLATFORM_NAMES: Record<Platform, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  tiktok: 'TikTok',
};

export default function PlatformBadge({ platform }: PlatformBadgeProps) {
  return (
    <span className={`${PLATFORM_STYLES[platform]} px-3 py-1 rounded-full text-sm font-medium`}>
      {PLATFORM_NAMES[platform]}
    </span>
  );
}
