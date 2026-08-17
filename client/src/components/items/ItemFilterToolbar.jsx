import { Plus, Search } from 'lucide-react';
import { DATE_FILTERS, ITEM_STATUS_LABELS, ITEM_STATUSES } from '../../constants/items.js';

const selectClasses = 'min-h-11 rounded-lg border border-gray-200 bg-white px-3.5 text-base';

export default function ItemFilterToolbar({
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  search,
  onSearchChange,
  searchPlaceholder = 'Search items',
  onAddItem,
  addItemLabel = 'Add item'
}) {
  return (
    <>
      {/* Mobile: compact status + date filters */}
      <section className="grid grid-cols-2 gap-2 sm:hidden">
        <select className={selectClasses} value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)}>
          <option value="">All statuses</option>
          {ITEM_STATUSES.map((status) => (
            <option key={status} value={status}>{ITEM_STATUS_LABELS[status]}</option>
          ))}
        </select>
        <select className={selectClasses} value={dateFilter} onChange={(event) => onDateFilterChange(event.target.value)}>
          {DATE_FILTERS.map((entry) => (
            <option key={entry.value} value={entry.value}>{entry.label}</option>
          ))}
        </select>
      </section>

      {/* Desktop: status | search (center) | date filter | add item */}
      <section className="hidden items-center gap-3 sm:flex">
        <select
          className={`${selectClasses} w-44 shrink-0`}
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
        >
          <option value="">All statuses</option>
          {ITEM_STATUSES.map((status) => (
            <option key={status} value={status}>{ITEM_STATUS_LABELS[status]}</option>
          ))}
        </select>
        <div className="flex min-h-11 flex-1 items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3">
          <Search size={18} className="shrink-0 text-gray-500" />
          <input
            className="w-full border-0 py-2.5 text-base outline-none"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <select
          className={`${selectClasses} w-40 shrink-0`}
          value={dateFilter}
          onChange={(event) => onDateFilterChange(event.target.value)}
        >
          {DATE_FILTERS.map((entry) => (
            <option key={entry.value} value={entry.value}>{entry.label}</option>
          ))}
        </select>
        {onAddItem && (
          <button
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 font-extrabold text-white hover:bg-emerald-700"
            onClick={onAddItem}
          >
            <Plus size={18} /> {addItemLabel}
          </button>
        )}
      </section>
    </>
  );
}
