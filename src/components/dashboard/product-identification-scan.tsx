
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface ProductIdentificationScanProps {
  onImageCaptured: (file: File, dataUrl: string) => void;
}

export function ProductIdentificationScan({ onImageCaptured }: ProductIdentificationScanProps) {
    const proxyImageUrl = '/api/image-proxy';

  const handleCapture = async () => {
    // This is a simulation. In a real app, you would use navigator.mediaDevices.
    // For this example, we'll fetch a placeholder image and convert it to a File object.
    const response = await fetch(proxyImageUrl);
    const blob = await response.blob();
    const file = new File([blob], "scanned-product.png", { type: "image/png" });

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageCaptured(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-48 bg-black rounded-lg">
      <div className="z-10 flex items-center justify-center">
        <Button onClick={handleCapture} size="lg" className="rounded-full h-16 w-16 p-0 border-4 border-white bg-primary/50 hover:bg-primary/70">
          <Camera className="h-8 w-8 text-white" />
        </Button>
      </div>
    </div>
  );
}
