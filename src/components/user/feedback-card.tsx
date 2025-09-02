
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { FeedbackForm } from './feedback-form';


export function FeedbackCard() {
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
      <CardContent>
        <FeedbackForm />
      </CardContent>
    </Card>
  );
}
