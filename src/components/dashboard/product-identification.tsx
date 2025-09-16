
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Camera } from 'lucide-react';
import type { IdentifyProductOutput } from '@/ai/flows/product-identification';
import { ProductIdentificationIdle } from './product-identification-idle';
import { ProductIdentificationScan } from './product-identification-scan';
import { ProductIdentificationResult } from './product-identification-result';
import { getProductIdentification } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

type IdentificationState = 'idle' | 'scanning' | 'uploading' | 'processing' | 'identified';

export function ProductIdentification() {
  const [currentState, setCurrentState] = React.useState<IdentificationState>('idle');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [identificationResult, setIdentificationResult] = React.useState<IdentifyProductOutput | null>(null);
  const { toast } = useToast();
  const [isAddProductOpen, setIsAddProductOpen] = React.useState(false);

  const handleImageAvailable = (file: File, dataUrl: string) => {
    setSelectedFile(file);
    setPreviewUrl(dataUrl);
    handleIdentify(dataUrl);
  };

  const handleIdentify = async (photoDataUri: string) => {
    setCurrentState('processing');
    try {
      const result = await getProductIdentification({ photoDataUri });

      if ('error' in result && result.error) {
        throw new Error(result.error);
      }
      setIdentificationResult(result);
      setCurrentState('identified');
      toast({
        title: 'Product Identified',
        description: `Identified as ${result.productName}.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Identification Failed',
        description: message,
      });
      handleReset();
    }
  };

  const handleReset = () => {
    setCurrentState('idle');
    setSelectedFile(null);
    setPreviewUrl(null);
    setIdentificationResult(null);
    setIsAddProductOpen(false);
  };

  const renderContent = () => {
    switch (currentState) {
      case 'scanning':
        return <ProductIdentificationScan onImageCaptured={handleImageAvailable} />;
      case 'processing':
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-2">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Analyzing image...</p>
            </div>
        );
      case 'identified':
        if (!identificationResult || !previewUrl) {
            handleReset();
            return null;
        }
        return (
            <ProductIdentificationResult 
                result={identificationResult} 
                previewUrl={previewUrl}
                onRetry={handleReset}
                onAddDialogChange={setIsAddProductOpen}
                isAddDialogOpen={isAddProductOpen}
            />
        );
      case 'idle':
      default:
        return (
          <ProductIdentificationIdle
            onScan={() => setCurrentState('scanning')}
            onUpload={handleImageAvailable}
          />
        );
    }
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <Camera className="text-primary" />
            <span>Product Identification</span>
            </CardTitle>
            <CardDescription>
            Identify products by scanning or uploading an image.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {renderContent()}
        </CardContent>
    </Card>
  );
}
