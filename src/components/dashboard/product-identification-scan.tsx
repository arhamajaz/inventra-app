
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductIdentificationScanProps {
  onImageCaptured: (file: File, dataUrl: string) => void;
}

export function ProductIdentificationScan({ onImageCaptured }: ProductIdentificationScanProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState(true);
  const { toast } = useToast();
  const proxyImageUrl = '/api/image-proxy';

  React.useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [toast]);


  const handleCapture = async () => {
    // This is a simulation. In a real app, you would capture a frame from the video stream.
    // For this example, we'll fetch a placeholder image and convert it to a File object.
    const response = await fetch(proxyImageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'scanned-product.png', { type: 'image/png' });

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageCaptured(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-64 bg-black rounded-lg overflow-hidden">
       {hasCameraPermission && <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover" autoPlay muted playsInline />}
       <div className="absolute inset-0 bg-black/30" />
      
      {!hasCameraPermission && (
          <div className="absolute top-4 left-4 right-4 z-20">
            <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                    Please allow camera access to use this feature.
                </AlertDescription>
            </Alert>
        </div>
      )}

      <div className="z-10 flex items-center justify-center">
        <Button onClick={handleCapture} size="lg" className="rounded-full h-16 w-16 p-0 border-4 border-white bg-primary/50 hover:bg-primary/70" disabled={!hasCameraPermission}>
          <Camera className="h-8 w-8 text-white" />
        </Button>
      </div>
    </div>
  );
}
