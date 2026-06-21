'use client';

import { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function MealScanner() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload and analyze
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/meal/analyze', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        // Reload meals list
        window.location.reload();
      } else {
        alert('Failed to analyze meal');
      }
    } catch (error) {
      console.error('Error uploading meal:', error);
      alert('Error analyzing meal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 text-center border-2 border-dashed hover:border-primary transition-colors cursor-pointer">
      <div className="space-y-4">
        <div className="text-4xl">📸</div>
        <div>
          <h3 className="text-lg font-semibold">Scan Your Meal</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a photo and AI will analyze the calories and macros
          </p>
        </div>

        {preview && (
          <div className="mt-4">
            <img src={preview} alt="Preview" className="w-full max-w-sm mx-auto rounded-lg" />
          </div>
        )}

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Analyzing...' : 'Upload Photo'}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </Card>
  );
}
