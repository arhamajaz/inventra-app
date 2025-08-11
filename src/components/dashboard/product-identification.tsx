'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getProductIdentification } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, Wand2, Zap } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { products } from '@/lib/mock-data';

export function ProductIdentification() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [identification, setIdentification] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIdentification(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select an image to identify.',
      });
      return;
    }
    setIsLoading(true);
    setIdentification(null);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async (e) => {
      try {
        const photoDataUri = e.target?.result as string;
        const result = await getProductIdentification({ photoDataUri });

        if ('error' in result && result.error) {
          throw new Error(result.error);
        }
        setIdentification(result);
        const identifiedProduct = products.find(p => p.id === result.productId);
        toast({
          title: 'Product Identified',
          description: `Identified as ${identifiedProduct?.name || result.productName}.`,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({
          variant: 'destructive',
          title: 'Identification Failed',
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="text-primary" />
          <span>Product Identification</span>
        </CardTitle>
        <CardDescription>
          Identify products by uploading an image.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="relative flex justify-center items-center border-2 border-dashed border-muted-foreground/50 rounded-lg p-4 h-48 cursor-pointer hover:bg-muted/50"
          onClick={() => fileInputRef.current?.click()}
        >
          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />
          {previewUrl ? (
            <Image src={previewUrl} alt="Product preview" layout="fill" objectFit="contain" className="rounded-md" />
          ) : (
            <div className="text-center text-muted-foreground">
              <Upload className="mx-auto h-8 w-8" />
              <p>Click or drag to upload an image</p>
            </div>
          )}
        </div>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}
        {identification && (
          <div className="rounded-md border bg-muted/50 p-4 space-y-2">
            <h4 className="font-semibold">Identification Results:</h4>
            <p className="text-sm">
              <span className="font-medium">Product:</span>{' '}
              <span className="text-primary font-bold">
                {products.find(p => p.id === identification.productId)?.name || identification.productName}
              </span>
            </p>
             <p className="text-sm">
              <span className="font-medium">Confidence:</span>{' '}
              <span className="text-primary font-bold">
                {(identification.confidence * 100).toFixed(0)}%
              </span>
            </p>
            <p className="text-sm"><span className="font-medium">Reasoning:</span> {identification.reasoning}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleIdentify} disabled={!selectedFile || isLoading} className="w-full">
          <Zap className="mr-2 h-4 w-4" />
          {isLoading ? 'Identifying...' : 'Identify Product'}
        </Button>
      </CardFooter>
    </Card>
  );
}
