
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface AddProductDialogProps {
  onOpenChange: (open: boolean) => void;
  productName?: string;
}

export function AddProductDialog({ onOpenChange, productName: initialProductName }: AddProductDialogProps) {
  const { toast } = useToast();
  const [productName, setProductName] = React.useState(initialProductName || '');

  React.useEffect(() => {
    if(initialProductName) {
        setProductName(initialProductName);
    }
  }, [initialProductName]);

  const handleSaveChanges = () => {
    // In a real application, you would handle the form submission here,
    // like sending the data to your server to create a new product.
    if (productName) {
         toast({
            title: 'Product Added!',
            description: `"${productName}" has been successfully added to your inventory.`,
         });
    }
    onOpenChange(false); // Close the dialog
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
            <PlusCircle />
            <span>Add New Product</span>
        </DialogTitle>
        <DialogDescription>
          Fill in the details below to add a new product to your inventory.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" placeholder="e.g., Organic Honey" className="col-span-3" value={productName} onChange={(e) => setProductName(e.target.value)} />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">
            Category
          </Label>
           <Select>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="FMCG">FMCG</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Personal Care">Personal Care</SelectItem>
                    <SelectItem value="Household">Household</SelectItem>
                    <SelectItem value="Grocery">Grocery</SelectItem>
                    <SelectItem value="Dairy">Dairy</SelectItem>
                </SelectContent>
            </Select>
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="stock" className="text-right">
            Stock
          </Label>
          <Input id="stock" type="number" placeholder="e.g., 500" className="col-span-3" />
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
            Price
          </Label>
          <Input id="price" type="number" placeholder="e.g., 150.00" className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" onClick={handleSaveChanges}>Save Product</Button>
      </DialogFooter>
    </DialogContent>
  );
}
