import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { PreviewRequestSchema } from '@/lib/validation/schemas';
import { detectPlatform, normalizeUrl } from '@/lib/validation/url-validator';
import { findByNormalizedUrl } from '@/lib/db/operations';
import { PreviewResponse } from '@/lib/types/asset';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { url } = PreviewRequestSchema.parse(body);

    const platform = detectPlatform(url);

    if (!platform) {
      return NextResponse.json(
        { error: 'We support YouTube, Instagram, and TikTok' },
        { status: 422 }
      );
    }

    const normalizedUrl = normalizeUrl(url, platform);

    const existingAsset = findByNormalizedUrl(normalizedUrl);

    const response: PreviewResponse = {
      url,
      platform,
      existing_asset: existingAsset,
    };

    return NextResponse.json(response);
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
