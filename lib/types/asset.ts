export type Platform = 'youtube' | 'instagram' | 'tiktok';

export type AssetTag = 'Motion' | 'Typography' | 'Color' | 'Sound design';

export interface Asset {
  id: string;
  url: string;
  normalizedUrl: string;
  platform: Platform;
  tags: AssetTag[];
  createdAt: number;
}

export interface PreviewResponse {
  url: string;
  platform: Platform;
  existing_asset: Asset | null;
}

export interface AssetCreateResponse {
  asset: Asset;
  created: boolean;
}
