import { Plus } from 'lucide-react';

export default function EmptyState({ hasFilters, message, onAddItem }) {
  if (hasFilters) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
        No items match your current filters.
      </div>
    );
  }

  return (
    <div className="grid justify-items-center gap-3 rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
      <p>{message}</p>
      {onAddItem && (
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 font-extrabold text-white hover:bg-emerald-700"
          onClick={onAddItem}
        >
          <Plus size={18} /> Add item
        </button>
      )}
    </div>
  );
}
