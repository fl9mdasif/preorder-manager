import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortDropdownProps {
  sortBy: string;
  order: string;
  onSortChange: (sortBy: string, order: string) => void;
}

export default function SortDropdown({ sortBy, order, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const sortFields = [
    { id: 'name', label: 'Name' },
    { id: 'createdAt', label: 'Created At' },
    { id: 'startsAt', label: 'Starts At' },
    { id: 'endsAt', label: 'Ends At' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 border border-[#e5e7eb] rounded-md hover:bg-gray-50 transition-colors cursor-pointer bg-white"
        aria-label="Sort preorders"
      >
        <ArrowUpDown className="w-4 h-4 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-[#e5e7eb] rounded-lg shadow-lg z-50 py-1.5 text-xs text-gray-800">
          <div className="px-4 py-1.5 text-gray-400 font-semibold select-none">
            Sort by
          </div>
          
          <div className="flex flex-col mb-1.5">
            {sortFields.map((field) => {
              const isSelected = sortBy === field.id;
              return (
                <button
                  key={field.id}
                  onClick={() => {
                    onSortChange(field.id, order);
                  }}
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 transition-colors text-left cursor-pointer w-full"
                >
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-black' : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-black" />
                    )}
                  </div>
                  <span className={isSelected ? 'font-medium text-black' : 'text-gray-700'}>
                    {field.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-gray-100 my-1"></div>

          <div className="flex flex-col px-1">
            <button
              onClick={() => {
                onSortChange(sortBy, 'asc');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-left transition-colors cursor-pointer w-full ${
                order === 'asc' ? 'bg-[#eaeaea] text-black font-semibold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>↑</span>
              <span>Ascending</span>
            </button>
            <button
              onClick={() => {
                onSortChange(sortBy, 'desc');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-left transition-colors cursor-pointer w-full ${
                order === 'desc' ? 'bg-[#eaeaea] text-black font-semibold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>↓</span>
              <span>Descending</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
