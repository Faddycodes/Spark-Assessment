'use client';

import { useState } from 'react';
import { PreviewResponse } from '@/lib/types/asset';
import { AssetTag } from '@/lib/types/asset';
import PlatformBadge from './PlatformBadge';
import LoadingSpinner from './LoadingSpinner';

interface AssetPreviewCardProps {
  preview: PreviewResponse;
  onSave: (url: string, tags: AssetTag[]) => Promise<void>;
  onCancel: () => void;
}

const AVAILABLE_TAGS: AssetTag[] = ['Motion', 'Typography', 'Color', 'Sound design'];

export default function AssetPreviewCard({ preview, onSave, onCancel }: AssetPreviewCardProps) {
  const [selectedTags, setSelectedTags] = useState<AssetTag[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleTag = (tag: AssetTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (selectedTags.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(preview.url, selectedTags);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Preview</h3>
        <PlatformBadge platform={preview.platform} />
      </div>

      <div className="text-sm text-gray-600 break-all">{preview.url}</div>

      {preview.existing_asset && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          This video is already in your library
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Tags (at least 1 required)
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full border transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={selectedTags.length === 0}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            Save to Library
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
