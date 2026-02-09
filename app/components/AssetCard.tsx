import { Asset } from '@/lib/types/asset';
import PlatformBadge from './PlatformBadge';

interface AssetCardProps {
  asset: Asset;
}

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

export default function AssetCard({ asset }: AssetCardProps) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <PlatformBadge platform={asset.platform} />
        <span className="text-xs text-gray-500">{getRelativeTime(asset.createdAt)}</span>
      </div>

      <div className="text-sm text-gray-600 break-all line-clamp-2">{asset.url}</div>

      <div className="flex flex-wrap gap-2">
        {asset.tags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-800 border border-blue-200 rounded-full px-3 py-1 text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
