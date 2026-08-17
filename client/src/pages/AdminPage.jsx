import { Boxes, Pencil, RefreshCw, Search, Tag, Trash2, UserPlus, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import AppShell from '../components/layout/AppShell.jsx';
import InlineLoader from '../components/common/InlineLoader.jsx';
import Modal from '../components/common/Modal.jsx';
import StatCard from '../components/common/StatCard.jsx';
import UserForm from '../components/admin/UserForm.jsx';
import ItemFilterToolbar from '../components/items/ItemFilterToolbar.jsx';
import ItemListSection from '../components/items/ItemListSection.jsx';
import ItemForm from '../components/items/ItemForm.jsx';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
import { useAdminData } from '../hooks/useAdminData.js';

export default function AdminPage() {
  const [tab, setTab] = useState('users');
  const [editingItem, setEditingItem] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userError, setUserError] = useState('');

  const [userSearch, setUserSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const debouncedItemSearch = useDebouncedValue(itemSearch);

  const {
    users,
    allUsers,
    items,
    itemsPagination,
    stats,
    loading,
    loadingMore,
    createUser,
    updateUser,
    removeUser,
    updateItem,
    deleteItem,
    loadMoreItems
  } = useAdminData({ search: debouncedItemSearch, status: statusFilter, dateFilter });

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return users;
    return users.filter(
      (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    );
  }, [users, userSearch]);

  function openEditUser(user) {
    setUserError('');
    setEditingUser(user);
  }

  async function handleRemoveUser(user) {
    if (!confirm(`Remove ${user.name} and all their requested items?`)) return;
    await removeUser(user._id);
  }

  async function handleCreateUser(payload) {
    setUserError('');
    try {
      await createUser(payload);
      setShowUserForm(false);
    } catch (err) {
      setUserError(err.message);
    }
  }

  async function handleUpdateUser(payload) {
    setUserError('');
    try {
      await updateUser(editingUser._id, payload);
      setEditingUser(null);
    } catch (err) {
      setUserError(err.message);
    }
  }

  function openEditItem(item) {
    setEditingItem(item);
  }

  async function saveItem(payload) {
    await updateItem(editingItem._id, payload);
    setEditingItem(null);
  }

  async function handleDeleteItem(itemId) {
    if (!confirm('Delete this item?')) return;
    await deleteItem(itemId);
  }

  async function handleComplete(itemId) {
    await updateItem(itemId, { status: 'delivered' });
  }

  const tabButtonClasses = (active) =>
    `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 font-extrabold ${
      active ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-900'
    }`;

  return (
    <AppShell title="Admin Panel" subtitle="Manage every user and grocery item from a dedicated admin page.">
      <section className="grid grid-cols-3 gap-2 sm:gap-4">
        <StatCard icon={Users} label="Users" value={stats.users} color="violet" />
        <StatCard icon={Boxes} label="Items" value={stats.items} color="emerald" />
        <StatCard icon={Tag} label="Categories" value={stats.categories} color="sky" />
      </section>

      <section className="flex flex-wrap gap-2.5">
        <button className={tabButtonClasses(tab === 'users')} onClick={() => setTab('users')}>
          <Users size={18} /> Users
        </button>
        <button className={tabButtonClasses(tab === 'items')} onClick={() => setTab('items')}>
          <RefreshCw size={18} /> All items
        </button>
      </section>

      <Modal isOpen={Boolean(editingItem)} onClose={() => setEditingItem(null)} title="Edit item as admin">
        {editingItem && (
          <ItemForm users={allUsers} editingItem={editingItem} onSubmit={saveItem} onCancel={() => setEditingItem(null)} />
        )}
      </Modal>

      <Modal isOpen={showUserForm} onClose={() => setShowUserForm(false)} title="Add user">
        {userError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-red-800">{userError}</div>
        )}
        <UserForm onSubmit={handleCreateUser} onCancel={() => setShowUserForm(false)} />
      </Modal>

      <Modal isOpen={Boolean(editingUser)} onClose={() => setEditingUser(null)} title="Edit user">
        {userError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-red-800">{userError}</div>
        )}
        {editingUser && (
          <UserForm editingUser={editingUser} onSubmit={handleUpdateUser} onCancel={() => setEditingUser(null)} />
        )}
      </Modal>

      {loading ? (
        <InlineLoader />
      ) : tab === 'users' ? (
        <section className="grid gap-3">
          <div className="flex items-center gap-3">
            <div className="flex min-h-11 flex-1 items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3">
              <Search size={18} className="shrink-0 text-gray-500" />
              <input
                className="w-full border-0 py-2.5 text-base outline-none"
                placeholder="Search by name or email"
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
              />
            </div>
            <button
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 font-extrabold text-white hover:bg-emerald-700"
              onClick={() => {
                setUserError('');
                setShowUserForm(true);
              }}
            >
              <UserPlus size={18} /> <span className="hidden sm:inline">Add user</span>
            </button>
          </div>

          {filteredUsers.length ? (
            <>
              {/* Mobile: card list */}
              <div className="grid gap-3 md:hidden">
                {filteredUsers.map((user) => (
                  <div key={user._id} className="grid gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <strong className="block truncate">{user.name}</strong>
                        <span className="block truncate text-sm text-gray-500">{user.email}</span>
                      </div>
                      <span className="w-fit shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-extrabold uppercase text-emerald-700">
                        {user.role}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Phone: {user.phone || 'Not set'} &middot; Requested items: {user.itemCount}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 font-extrabold text-gray-900"
                        onClick={() => openEditUser(user)}
                      >
                        <Pencil size={16} /> Edit
                      </button>
                      {user.role !== 'admin' && (
                        <button
                          className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 font-extrabold text-red-600"
                          onClick={() => handleRemoveUser(user)}
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: table */}
              <div className="hidden overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm md:block">
                <table className="w-full min-w-180 border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b border-gray-200 p-4 text-left text-xs font-bold uppercase text-gray-500">Name</th>
                      <th className="border-b border-gray-200 p-4 text-left text-xs font-bold uppercase text-gray-500">Email</th>
                      <th className="border-b border-gray-200 p-4 text-left text-xs font-bold uppercase text-gray-500">Phone</th>
                      <th className="border-b border-gray-200 p-4 text-left text-xs font-bold uppercase text-gray-500">Role</th>
                      <th className="border-b border-gray-200 p-4 text-left text-xs font-bold uppercase text-gray-500">Requested</th>
                      <th className="border-b border-gray-200 p-4 text-left text-xs font-bold uppercase text-gray-500"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td className="border-b border-gray-200 p-4">{user.name}</td>
                        <td className="border-b border-gray-200 p-4">{user.email}</td>
                        <td className="border-b border-gray-200 p-4">{user.phone || 'Not set'}</td>
                        <td className="border-b border-gray-200 p-4">
                          <span className="w-fit rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-extrabold uppercase text-emerald-700">
                            {user.role}
                          </span>
                        </td>
                        <td className="border-b border-gray-200 p-4">{user.itemCount}</td>
                        <td className="border-b border-gray-200 p-4">
                          <div className="flex gap-2">
                            <button
                              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 font-extrabold text-gray-900 hover:bg-gray-50"
                              onClick={() => openEditUser(user)}
                            >
                              <Pencil size={16} /> Edit
                            </button>
                            {user.role !== 'admin' && (
                              <button
                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 font-extrabold text-red-600 hover:bg-red-100"
                                onClick={() => handleRemoveUser(user)}
                              >
                                <Trash2 size={16} /> Remove
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
              No users match your search.
            </div>
          )}
        </section>
      ) : (
        <>
          <ItemFilterToolbar
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            search={itemSearch}
            onSearchChange={setItemSearch}
            searchPlaceholder="Search all items"
          />

          <ItemListSection
            loading={false}
            items={items}
            pagination={itemsPagination}
            loadingMore={loadingMore}
            onLoadMore={loadMoreItems}
            onEdit={openEditItem}
            onDelete={handleDeleteItem}
            onComplete={handleComplete}
            hasFilters={Boolean(itemSearch) || Boolean(statusFilter) || dateFilter !== 'all'}
            emptyMessage="No items yet."
          />
        </>
      )}
    </AppShell>
  );
}
