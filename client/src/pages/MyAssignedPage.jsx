import { CheckCircle2, Clock, Plus, UserCheck } from 'lucide-react';
import { useState } from 'react';
import AppShell from '../components/layout/AppShell.jsx';
import Modal from '../components/common/Modal.jsx';
import StatCard from '../components/common/StatCard.jsx';
import ItemFilterToolbar from '../components/items/ItemFilterToolbar.jsx';
import ItemListSection from '../components/items/ItemListSection.jsx';
import ItemForm from '../components/items/ItemForm.jsx';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
import { useItems } from '../hooks/useItems.js';
import { useUsers } from '../hooks/useUsers.js';

export default function MyAssignedPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const debouncedSearch = useDebouncedValue(search);

  const { items, stats, pagination, loading, loadingMore, createItem, updateItem, deleteItem, loadMore } = useItems({
    scope: 'assigned',
    search: debouncedSearch,
    status: statusFilter,
    dateFilter
  });
  const { users } = useUsers();
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  function toggleStatusFilter(value) {
    setStatusFilter((current) => (current === value ? '' : value));
  }

  function openAddForm() {
    setEditingItem(null);
    setShowForm(true);
  }

  function openEditForm(item) {
    setEditingItem(item);
    setShowForm(true);
  }

  function closeForm() {
    setEditingItem(null);
    setShowForm(false);
  }

  async function saveItem(payload) {
    setError('');
    try {
      if (editingItem) {
        await updateItem(editingItem._id, payload);
      } else {
        await createItem(payload);
      }
      closeForm();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(itemId) {
    if (!confirm('Delete this item?')) return;
    await deleteItem(itemId);
  }

  async function handleComplete(itemId) {
    await updateItem(itemId, { status: 'delivered' });
  }

  return (
    <AppShell
      title="My Assigned"
      subtitle="Things you've been asked to bring."
      headerAction={
        <button
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-emerald-600 pl-3 pr-3.5 text-xs font-extrabold text-white"
          onClick={openAddForm}
        >
          <Plus size={14} /> Add Item
        </button>
      }
    >
      <section className="grid grid-cols-3 gap-2 sm:gap-4">
        <StatCard
          icon={UserCheck}
          label="Assigned to me"
          value={stats.total}
          color="violet"
          active={statusFilter === ''}
          onClick={() => setStatusFilter('')}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.delivered}
          color="emerald"
          active={statusFilter === 'delivered'}
          onClick={() => toggleStatusFilter('delivered')}
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={stats.pending}
          color="amber"
          active={statusFilter === 'pending'}
          onClick={() => toggleStatusFilter('pending')}
        />
      </section>

      <ItemFilterToolbar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search items assigned to you"
        onAddItem={openAddForm}
      />

      <Modal isOpen={showForm} onClose={closeForm} title={editingItem ? 'Edit item' : 'Add item'}>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-red-800">{error}</div>
        )}
        <ItemForm users={users} editingItem={editingItem} onSubmit={saveItem} onCancel={closeForm} />
      </Modal>

      <ItemListSection
        loading={loading}
        items={items}
        pagination={pagination}
        loadingMore={loadingMore}
        onLoadMore={loadMore}
        onEdit={openEditForm}
        onDelete={handleDelete}
        onComplete={handleComplete}
        hasFilters={Boolean(search) || Boolean(statusFilter) || dateFilter !== 'all'}
        emptyMessage='Nothing assigned to you yet. Click "Add Item" to create one.'
        onAddItem={openAddForm}
      />
    </AppShell>
  );
}
