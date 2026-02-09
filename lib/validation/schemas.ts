import { z } from 'zod';

export const ASSET_TAGS = ['Motion', 'Typography', 'Color', 'Sound design'] as const;

export const PreviewRequestSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
});

export const AssetCreateSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  tags: z.array(z.enum(ASSET_TAGS)).min(1, 'Please select at least one tag'),
});
