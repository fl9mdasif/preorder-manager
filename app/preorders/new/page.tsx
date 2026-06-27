'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import PreorderForm from '@/components/PreorderForm';

export default function CreatePreorderPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/preorders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Preorder created successfully');
        router.push('/');
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to create preorder');
      }
    } catch (error) {
      console.error('Error creating preorder:', error);
      toast.error('An error occurred while creating the preorder');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PreorderForm
      title="Preorder details"
      onSubmit={handleSubmit}
      isSaving={isSaving}
    />
  );
}
