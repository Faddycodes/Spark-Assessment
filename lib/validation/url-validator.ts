import { Platform } from '../types/asset';

const PLATFORM_PATTERNS = {
  youtube: [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]+)/,
  ],
  instagram: [
    /instagram\.com\/p\/([a-zA-Z0-9_-]+)/,
    /instagram\.com\/reel\/([a-zA-Z0-9_-]+)/,
    /instagram\.com\/tv\/([a-zA-Z0-9_-]+)/,
  ],
  tiktok: [
    /tiktok\.com\/@[^/]+\/video\/(\d+)/,
    /tiktok\.com\/v\/(\d+)/,
    /vm\.tiktok\.com\/([a-zA-Z0-9]+)/,
  ],
};

export function detectPlatform(url: string): Platform | null {
  for (const [platform, patterns] of Object.entries(PLATFORM_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(url)) {
        return platform as Platform;
      }
    }
  }
  return null;
}

export function normalizeUrl(url: string, platform: Platform): string {
  const patterns = PLATFORM_PATTERNS[platform];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      const videoId = match[1];

      switch (platform) {
        case 'youtube':
          return `https://www.youtube.com/watch?v=${videoId}`;
        case 'instagram':
          return `https://www.instagram.com/p/${videoId}`;
        case 'tiktok':
          return `https://www.tiktok.com/video/${videoId}`;
      }
    }
  }

  return url;
}
