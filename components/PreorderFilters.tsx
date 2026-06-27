
interface PreorderFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function PreorderFilters({ currentFilter, onFilterChange }: PreorderFiltersProps) {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
  ];

  return (
    <div className="flex gap-1">
      {tabs.map((tab) => {
        const isActive = currentFilter === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              isActive
                ? 'bg-[#eaeaea] text-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}