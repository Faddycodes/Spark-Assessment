'use client';

import { useState, useEffect } from 'react';
import { Asset, PreviewResponse, AssetTag } from '@/lib/types/asset';
import AssetSubmissionForm from './components/AssetSubmissionForm';
import AssetPreviewCard from './components/AssetPreviewCard';
import AssetGrid from './components/AssetGrid';
import ErrorMessage from './components/ErrorMessage';

export default function Home() {
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/assets');
      if (!response.ok) {
        throw new Error('Failed to fetch assets');
      }
      const data = await response.json();
      setAssets(data.assets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assets');
    }
  };

  const handlePreviewSubmit = async (url: string) => {
    setError(null);

    const response = await fetch('/api/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to preview URL');
    }

    setPreview(data);
  };

  const handleSave = async (url: string, tags: AssetTag[]) => {
    setError(null);

    const response = await fetch('/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, tags }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to save asset');
    }

    setPreview(null);
    await fetchAssets();
  };

  const handleCancel = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Spark - Video Asset Library</h1>
          <p className="text-gray-600 mt-2">Save and organize your favorite videos from YouTube, Instagram, and TikTok</p>
        </header>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <AssetSubmissionForm onSubmit={handlePreviewSubmit} />
          </div>

          {error && (
            <ErrorMessage message={error} />
          )}

          {preview && (
            <AssetPreviewCard
              preview={preview}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}

          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Library</h2>
            <AssetGrid assets={assets} />
          </div>
        </div>
      </div>
    </div>
  );
}
