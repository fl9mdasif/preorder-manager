'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import PreorderFilters from '@/components/PreorderFilters';
import SortDropdown from '@/components/SortDropdown';
import PreorderTable, { Preorder } from '@/components/PreorderTable';
import Pagination from '@/components/Pagination';

export default function PreordersListPage() {
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPreorders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/preorders?filter=${filter}&sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}`
      );
      if (res.ok) {
        const data = await res.json();
        setPreorders(data.preorders);
        setTotal(data.total);
      }
    } catch (err) {
      console.error('Error fetching preorders client-side:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filter, sortBy, order, page, limit]);

  useEffect(() => {
    fetchPreorders();
  }, [fetchPreorders]);

  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    try {
      // Optimistic update
      setPreorders((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: newStatus } : p))
      );

      const res = await fetch(`/api/preorders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (res.ok) {
        toast.success(`Preorder set to ${newStatus ? 'Active' : 'Inactive'}`);
      } else {
        // Rollback
        setPreorders((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isActive: !newStatus } : p))
        );
        toast.error('Failed to update preorder status');
      }
    } catch (err) {
      console.error(err);
      // Rollback
      setPreorders((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: !newStatus } : p))
      );
      toast.error('Failed to update preorder status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this preorder?')) return;
    try {
      const res = await fetch(`/api/preorders/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
        toast.success('Preorder deleted successfully');
        fetchPreorders();
      } else {
        toast.error('Failed to delete preorder');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete preorder');
    }
  };

  const handleSortChange = (newSortBy: string, newOrder: string) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    setPage(1);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Preorders</h1>
        <Link
          href="/preorders/new"
          className="px-4 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-900 transition-colors select-none cursor-pointer"
        >
          Create Preorder
        </Link>
      </div>

      {/* Main Container Card */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
        {/* Controls Section */}
        <div className="p-4 flex justify-between items-center border-b border-[#e5e7eb] bg-white gap-4 select-none">
          <PreorderFilters currentFilter={filter} onFilterChange={handleFilterChange} />
          <SortDropdown sortBy={sortBy} order={order} onSortChange={handleSortChange} />
        </div>

        {/* Table Section */}
        <PreorderTable
          preorders={preorders}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
          isLoading={isLoading}
        />

        {/* Pagination Section */}
        {!isLoading && preorders.length > 0 && (
          <Pagination
            page={page}
            limit={limit}
            total={total}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
