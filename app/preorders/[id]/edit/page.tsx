/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import PreorderForm from '@/components/PreorderForm';

export default function EditPreorderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    async function fetchPreorder() {
      try {
        const res = await fetch(`/api/preorders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setInitialData(data);
        } else {
          toast.error('Preorder not found');
          router.push('/');
        }
      } catch (err) {
        console.error('Error fetching preorder:', err);
        toast.error('Failed to load preorder data');
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPreorder();
  }, [id, router]);

  const handleSubmit = async (formData: any) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/preorders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Preorder updated successfully');
        router.push('/');
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to update preorder');
      }
    } catch (error) {
      console.error('Error updating preorder:', error);
      toast.error('An error occurred while saving the preorder');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center py-20 bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        <p className="text-xs text-gray-500 mt-4 font-semibold">Loading preorder details...</p>
      </div>
    );
  }

  return (
    <PreorderForm
      title="Preorder details"
      initialData={initialData}
      onSubmit={handleSubmit}
      isSaving={isSaving}
    />
  );
}
