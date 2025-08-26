
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, PackagePlus, Zap } from 'lucide-react';
import { processFeedback } from '@/app/actions';

export function FeedbackCard() {
  const [feedback, setFeedback] = React.useState('');
  const [productRequest, setProductRequest] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (type: 'feedback' | 'request') => {
    setIsSubmitting(true);
    try {
      let response;
      if (type === 'feedback') {
        if (!feedback) throw new Error('Feedback cannot be empty.');
        response = await processFeedback({ feedback });
      } else {
        if (!productRequest) throw new Error('Product request cannot be empty.');
        response = await processFeedback({ productRequest });
      }

      if ('error' in response) {
        throw new Error(response.error);
      }

      toast({
        title: response.title,
        description: response.message,
      });

      // Clear the input after successful submission
      if (type === 'feedback') {
        setFeedback('');
      } else {
        setProductRequest('');
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <MessageSquare className="text-primary"/>
            <span>Feedback & Requests</span>
        </CardTitle>
        <CardDescription>
          Share your thoughts or request a new product.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="feedback" className="text-sm font-medium">Your Feedback</label>
          <Textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What's on your mind?"
            disabled={isSubmitting}
            className="mt-1"
          />
           <Button onClick={() => handleSubmit('feedback')} disabled={isSubmitting || !feedback} className="w-full mt-2">
              <Zap className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
        </div>
         <div className="border-t pt-4">
           <label htmlFor="productRequest" className="text-sm font-medium">Request a Product</label>
          <Input
            id="productRequest"
            value={productRequest}
            onChange={(e) => setProductRequest(e.target.value)}
            placeholder="e.g., Organic Honey (500g)"
            disabled={isSubmitting}
            className="mt-1"
          />
           <Button onClick={() => handleSubmit('request')} disabled={isSubmitting || !productRequest} className="w-full mt-2">
                <PackagePlus className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Request Product'}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
