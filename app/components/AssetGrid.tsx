import { Asset } from '@/lib/types/asset';
import AssetCard from './AssetCard';

interface AssetGridProps {
  assets: Asset[];
}

export default function AssetGrid({ assets }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No assets saved yet. Submit a video URL above to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} />
      ))}
    </div>
  );
}
