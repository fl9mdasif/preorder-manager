
interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, limit, total, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit) || 1;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-center gap-3.5 py-4 border-t border-[#e5e7eb]">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="w-7 h-7 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer border border-[#e5e7eb] bg-white flex items-center justify-center select-none"
      >
        <span className="text-gray-600 text-sm font-bold">‹</span>
      </button>
      
      <span className="text-xs font-semibold text-gray-800">
        Showing {start} to {end} from {total}
      </span>

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="w-7 h-7 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer border border-[#e5e7eb] bg-white flex items-center justify-center select-none"
      >
        <span className="text-gray-600 text-sm font-bold">›</span>
      </button>
    </div>
  );
}
