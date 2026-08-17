import EmptyState from '../common/EmptyState.jsx';
import InlineLoader from '../common/InlineLoader.jsx';
import ItemCard from './ItemCard.jsx';
import ItemListRow from './ItemListRow.jsx';

export default function ItemListSection({
  loading,
  items,
  pagination,
  loadingMore,
  onLoadMore,
  onEdit,
  onDelete,
  onComplete,
  hasFilters,
  emptyMessage,
  onAddItem
}) {
  if (loading) return <InlineLoader />;

  if (!items.length) {
    return <EmptyState hasFilters={hasFilters} message={emptyMessage} onAddItem={onAddItem} />;
  }

  return (
    <>
      <section className="grid gap-3 sm:hidden">
        {items.map((item) => (
          <ItemListRow
            key={item._id}
            item={item}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item._id)}
            onComplete={onComplete}
          />
        ))}
      </section>
      <section className="hidden grid-cols-1 gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ItemCard
            key={item._id}
            item={item}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item._id)}
            onComplete={onComplete}
          />
        ))}
      </section>
      {pagination?.hasMore && (
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 font-extrabold text-gray-900 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
          onClick={onLoadMore}
          disabled={loadingMore}
        >
          {loadingMore ? 'Loading...' : `Load more (${pagination.total - items.length} left)`}
        </button>
      )}
    </>
  );
}
