
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';

interface PreorderFormProps {
  initialData?: {
    id?: string;
    name: string;
    products: number;
    preorderWhen: string;
    startsAt: string;
    endsAt: string | null;
    isActive: boolean;
  };
  onSubmit: (data: any) => Promise<void>;
  title: string;
  isSaving: boolean;
}

export default function PreorderForm({
  initialData,
  onSubmit,
  title,
  isSaving,
}: PreorderFormProps) {
  const toDatetimeLocal = (isoString: string | null | undefined) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [name, setName] = useState(initialData?.name || '');
  const [products, setProducts] = useState<number>(initialData?.products ?? 1);
  const [preorderWhen, setPreorderWhen] = useState(initialData?.preorderWhen || 'regardless-of-stock');
  const [startsAt, setStartsAt] = useState(toDatetimeLocal(initialData?.startsAt));
  const [endsAt, setEndsAt] = useState(toDatetimeLocal(initialData?.endsAt));
  const [isActive, setIsActive] = useState<boolean>(initialData?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!startsAt) {
      setError('Starts at date is required');
      return;
    }

    if (endsAt && new Date(endsAt) < new Date(startsAt)) {
      setError('Ends at date must be after starts at date');
      return;
    }

    onSubmit({
      name,
      products,
      preorderWhen,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: endsAt ? new Date(endsAt).toISOString() : null,
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Header Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-4 py-1.5 text-xs font-semibold text-gray-600 hover:text-black transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-150 text-red-600 rounded-lg text-xs font-medium">
          {error}
        </div>
      )}

      {/* Main card */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#e5e7eb] bg-white">
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-400 mt-1">These values appear in the preorders list.</p>
        </div>

        <div className="p-6 divide-y divide-[#f3f4f6]">
          {/* Name Field */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 py-5 first:pt-0">
            <div>
              <label htmlFor="name" className="text-xs font-bold text-gray-900">
                Name <span className="text-red-500">*</span>
              </label>
              <p className="text-[11px] text-gray-400 mt-1">A label to recognize this preorder by.</p>
            </div>
            <div className="flex items-center">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full md:max-w-md"
                placeholder="e.g. Multi variant 3"
              />
            </div>
          </div>

          {/* Products Field */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 py-5">
            <div>
              <label htmlFor="products" className="text-xs font-bold text-gray-900">
                Products
              </label>
              <p className="text-[11px] text-gray-400 mt-1">Number of products covered by this preorder.</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="products"
                type="number"
                min="1"
                value={products}
                onChange={(e) => setProducts(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-24 text-center"
              />
              <span className="text-xs text-gray-500 font-semibold select-none">product(s)</span>
            </div>
          </div>

          {/* Preorder When Field */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 py-5">
            <div>
              <label htmlFor="preorderWhen" className="text-xs font-bold text-gray-900">
                Preorder when
              </label>
              <p className="text-[11px] text-gray-400 mt-1">When customers are allowed to preorder.</p>
            </div>
            <div className="flex items-center">
              <select
                id="preorderWhen"
                value={preorderWhen}
                onChange={(e) => setPreorderWhen(e.target.value)}
                className="w-full md:max-w-md select-none pr-8 appearance-none bg-no-repeat bg-position-[right_12px_center]"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundSize: '1.25rem'
                }}
              >
                <option value="regardless-of-stock">regardless-of-stock</option>
                <option value="out-of-stock">out-of-stock</option>
              </select>
            </div>
          </div>

          {/* Starts At Field */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 py-5">
            <div>
              <label htmlFor="startsAt" className="text-xs font-bold text-gray-900">
                Starts at <span className="text-red-500">*</span>
              </label>
              <p className="text-[11px] text-gray-400 mt-1">When the preorder window opens.</p>
            </div>
            <div className="flex items-center">
              <input
                id="startsAt"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                required
                className="w-full md:max-w-md text-gray-700 bg-white cursor-pointer"
              />
            </div>
          </div>

          {/* Ends At Field */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 py-5">
            <div>
              <label htmlFor="endsAt" className="text-xs font-bold text-gray-900">
                Ends at
              </label>
              <p className="text-[11px] text-gray-400 mt-1">Leave empty for no end date.</p>
            </div>
            <div className="flex items-center">
              <input
                id="endsAt"
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full md:max-w-md text-gray-700 bg-white cursor-pointer"
              />
            </div>
          </div>

          {/* Status Field */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 py-5 last:pb-0">
            <div>
              <span className="text-xs font-bold text-gray-900">Status</span>
              <p className="text-[11px] text-gray-400 mt-1">Active preorders are visible to customers.</p>
            </div>
            <div className="flex items-center gap-2.5">
              <Switch.Root
                id="status"
                checked={isActive}
                onCheckedChange={setIsActive}
              >
                <Switch.Thumb />
              </Switch.Root>
              <label htmlFor="status" className="text-xs font-semibold text-gray-600 cursor-pointer select-none">
                Active
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions Replicated */}
      <div className="flex justify-end items-center gap-2 mt-6">
        <Link
          href="/"
          className="px-4 py-1.5 text-xs font-semibold text-gray-600 hover:text-black transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
        >
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

