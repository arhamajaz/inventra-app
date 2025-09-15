
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Upload } from 'lucide-react';

interface ProductIdentificationIdleProps {
  onScan: () => void;
  onUpload: (file: File, dataUrl: string) => void;
}

export function ProductIdentificationIdle({ onScan, onUpload }: ProductIdentificationIdleProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="grid grid-cols-2 gap-4 w-full">
        <Button variant="outline" className="flex-col h-24" onClick={onScan}>
          <Camera className="h-8 w-8 mb-2" />
          <span>Scan Product</span>
        </Button>
        <Button variant="outline" className="flex-col h-24" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-8 w-8 mb-2" />
          <span>Upload Image</span>
        </Button>
      </div>
      <Input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
