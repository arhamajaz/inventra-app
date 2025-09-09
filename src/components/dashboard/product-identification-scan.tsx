
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface ProductIdentificationScanProps {
  onImageCaptured: (file: File, dataUrl: string) => void;
}

export function ProductIdentificationScan({ onImageCaptured }: ProductIdentificationScanProps) {
    const placeholderImage = 'https://i.ibb.co/L9t0bJ8/parle-g-original-biscuits-250g.png';

  const handleCapture = async () => {
    // This is a simulation. In a real app, you would use navigator.mediaDevices.
    // For this example, we'll fetch a placeholder image and convert it to a File object.
    const response = await fetch(placeholderImage);
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
      <Image 
        src={placeholderImage} 
        alt="Simulated camera feed" 
        layout="fill" 
        objectFit="cover" 
        className="opacity-50 rounded-lg"
        data-ai-hint="simulated camera"
      />
      <div className="absolute inset-0 border-4 border-dashed border-white/50 rounded-lg m-4"></div>
      <div className="z-10 absolute bottom-4">
        <Button onClick={handleCapture} size="lg" className="rounded-full h-16 w-16 p-0 border-4 border-white bg-primary/50 hover:bg-primary/70">
          <Camera className="h-8 w-8 text-white" />
        </Button>
      </div>
    </div>
  );
}
