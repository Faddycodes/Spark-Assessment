import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AssetCreateSchema } from '@/lib/validation/schemas';
import { detectPlatform, normalizeUrl } from '@/lib/validation/url-validator';
import { createAsset, findByNormalizedUrl, getAllAssets } from '@/lib/db/operations';
import { AssetCreateResponse } from '@/lib/types/asset';

export async function GET() {
  try {
    const assets = getAllAssets();

    return NextResponse.json({ assets });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { url, tags } = AssetCreateSchema.parse(body);

    const platform = detectPlatform(url);

    if (!platform) {
      return NextResponse.json(
        { error: 'We support YouTube, Instagram, and TikTok' },
        { status: 422 }
      );
    }

    const normalizedUrl = normalizeUrl(url, platform);

    const existingAsset = findByNormalizedUrl(normalizedUrl);

    if (existingAsset) {
      const response: AssetCreateResponse = {
        asset: existingAsset,
        created: false,
      };
      return NextResponse.json(response);
    }

    const id = crypto.randomUUID();

    const newAsset = createAsset({
      id,
      url,
      normalizedUrl,
      platform,
      tags,
    });

    const response: AssetCreateResponse = {
      asset: newAsset,
      created: true,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues;
      const firstError = issues && issues.length > 0 ? issues[0] : null;
      return NextResponse.json(
        { error: firstError?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
