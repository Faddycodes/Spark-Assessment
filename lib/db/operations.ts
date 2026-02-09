import { getDatabase } from './connection';
import { Asset, AssetTag, Platform } from '../types/asset';

interface AssetRow {
  id: string;
  url: string;
  normalized_url: string;
  platform: Platform;
  tags: string;
  created_at: number;
}

function rowToAsset(row: AssetRow): Asset {
  return {
    id: row.id,
    url: row.url,
    normalizedUrl: row.normalized_url,
    platform: row.platform,
    tags: JSON.parse(row.tags) as AssetTag[],
    createdAt: row.created_at,
  };
}

export function createAsset(data: {
  id: string;
  url: string;
  normalizedUrl: string;
  platform: Platform;
  tags: AssetTag[];
}): Asset {
  const db = getDatabase();

  const stmt = db.prepare(`
    INSERT INTO assets (id, url, normalized_url, platform, tags, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const createdAt = Date.now();

  stmt.run(
    data.id,
    data.url,
    data.normalizedUrl,
    data.platform,
    JSON.stringify(data.tags),
    createdAt
  );

  return {
    id: data.id,
    url: data.url,
    normalizedUrl: data.normalizedUrl,
    platform: data.platform,
    tags: data.tags,
    createdAt,
  };
}

export function findByNormalizedUrl(normalizedUrl: string): Asset | null {
  const db = getDatabase();

  const stmt = db.prepare(`
    SELECT * FROM assets WHERE normalized_url = ?
  `);

  const row = stmt.get(normalizedUrl) as AssetRow | undefined;

  return row ? rowToAsset(row) : null;
}

export function getAllAssets(): Asset[] {
  const db = getDatabase();

  const stmt = db.prepare(`
    SELECT * FROM assets ORDER BY created_at DESC
  `);

  const rows = stmt.all() as AssetRow[];

  return rows.map(rowToAsset);
}
