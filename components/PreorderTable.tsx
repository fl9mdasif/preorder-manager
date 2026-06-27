
import Link from 'next/link';
import { Pencil, Trash2, Check } from 'lucide-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Switch from '@radix-ui/react-switch';

export interface Preorder {
  id: string;
  name: string;
  products: number;
  preorderWhen: string;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PreorderTableProps {
  preorders: Preorder[];
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

export default function PreorderTable({
  preorders,
  selectedIds,
  onSelectionChange,
  onToggleStatus,
  onDelete,
  isLoading,
}: PreorderTableProps) {
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const hoursStr = String(hours).padStart(2, '0');
    
    return `${month} ${day}, ${year} ${hoursStr}:${minutes} ${ampm}`;
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      onSelectionChange(preorders.map((p) => p.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean | 'indeterminate') => {
    if (checked === true) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const isAllSelected =
    preorders.length > 0 && selectedIds.length === preorders.length;
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < preorders.length;

  if (isLoading) {
    return (
      <div className="w-full flex flex-col justify-center items-center py-20 bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        <p className="text-xs text-gray-500 mt-4 font-semibold">Loading preorders...</p>
      </div>
    );
  }

  if (preorders.length === 0) {
    return (
      <div className="w-full text-center py-20 bg-white">
        <p className="text-sm font-semibold text-gray-500">No preorders found</p>
        <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or create a new preorder.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs select-none">
        <thead>
          <tr className="border-b border-[#e5e7eb] bg-white">
            <th className="py-3 px-4 w-12">
              <Checkbox.Root
                checked={isSomeSelected ? 'indeterminate' : isAllSelected}
                onCheckedChange={handleSelectAll}
                className="flex items-center justify-center rounded border border-[#c5c7cb] w-4 h-4 bg-white"
              >
                <Checkbox.Indicator className="text-white bg-black w-full h-full flex items-center justify-center rounded-[3px]">
                  <Check className="w-3 h-3 stroke-3" />
                </Checkbox.Indicator>
              </Checkbox.Root>
            </th>
            <th className="py-3 px-4 font-semibold text-gray-800">Name</th>
            <th className="py-3 px-4 font-semibold text-gray-800">Products</th>
            <th className="py-3 px-4 font-semibold text-gray-800">Preorder when</th>
            <th className="py-3 px-4 font-semibold text-gray-800">Starts at</th>
            <th className="py-3 px-4 font-semibold text-gray-800">Ends at</th>
            <th className="py-3 px-4 font-semibold text-gray-800 text-center w-20">Status</th>
            <th className="py-3 px-4 font-semibold text-gray-800 text-center w-24">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e5e7eb] bg-white">
          {preorders.map((preorder) => {
            const isSelected = selectedIds.includes(preorder.id);
            return (
              <tr
                key={preorder.id}
                className={`hover:bg-gray-50 transition-colors ${
                  isSelected ? 'bg-gray-50/50' : ''
                }`}
              >
                <td className="py-3.5 px-4 w-12">
                  <Checkbox.Root
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectRow(preorder.id, checked)}
                    className="flex items-center justify-center rounded border border-[#c5c7cb] w-4 h-4 bg-white"
                  >
                    <Checkbox.Indicator className="text-white bg-black w-full h-full flex items-center justify-center rounded-[3px]">
                      <Check className="w-3 h-3 stroke-3" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                </td>
                <td className="py-3.5 px-4 font-bold text-gray-900">{preorder.name}</td>
                <td className="py-3.5 px-4 text-gray-600 font-medium">{preorder.products}</td>
                <td className="py-3.5 px-4 text-gray-600 font-medium">{preorder.preorderWhen}</td>
                <td className="py-3.5 px-4 text-gray-600 font-medium">{formatDate(preorder.startsAt)}</td>
                <td className="py-3.5 px-4 text-gray-600 font-medium">{formatDate(preorder.endsAt)}</td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex justify-center items-center">
                    <Switch.Root
                      checked={preorder.isActive}
                      onCheckedChange={(checked) => onToggleStatus(preorder.id, checked)}
                    >
                      <Switch.Thumb />
                    </Switch.Root>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Link
                      href={`/preorders/${preorder.id}/edit`}
                      className="p-1 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => onDelete(preorder.id)}
                      className="p-1 border border-gray-200 rounded-md hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all text-gray-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
