import { useEffect, useState } from 'react';
import { ITEM_CATEGORIES, ITEM_STATUS_LABELS, ITEM_STATUSES, QUANTITY_SUGGESTIONS } from '../../constants/items.js';
import { useAuth } from '../../context/AuthContext.jsx';

const emptyItem = {
  name: '',
  category: ITEM_CATEGORIES[0],
  customCategory: '',
  quantity: '',
  assignedTo: '',
  notes: '',
  status: 'pending'
};

const fieldClasses =
  'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-3 text-base text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500';
const labelClasses = 'grid gap-2 text-sm font-bold text-gray-700';

function toFormState(editingItem) {
  if (!editingItem) {
    return { ...emptyItem };
  }

  const isKnownCategory = ITEM_CATEGORIES.includes(editingItem.category) && editingItem.category !== 'Other';

  return {
    name: editingItem.name,
    category: isKnownCategory ? editingItem.category : 'Other',
    customCategory: isKnownCategory ? '' : editingItem.category,
    quantity: editingItem.quantity,
    assignedTo: editingItem.assignedTo?._id || editingItem.assignedTo || '',
    notes: editingItem.notes || '',
    status: editingItem.status || 'pending'
  };
}

export default function ItemForm({ users, editingItem, onSubmit, onCancel }) {
  const { user: currentUser } = useAuth();
  const [form, setForm] = useState(() => toFormState(editingItem));

  useEffect(() => {
    setForm(toFormState(editingItem));
  }, [editingItem]);

  const requestedByName = editingItem ? editingItem.requestedBy?.name || 'Unknown' : currentUser?.name || '';

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onSubmit({
      name: form.name,
      category: form.category === 'Other' ? form.customCategory.trim() : form.category,
      quantity: form.quantity,
      assignedTo: form.assignedTo,
      notes: form.notes,
      status: form.status
    });
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <label className={labelClasses}>
        Item name
        <input
          className={fieldClasses}
          value={form.name}
          onChange={(event) => update('name', event.target.value)}
          placeholder="e.g. Milk, Tomato, Rice"
          required
        />
      </label>
      <label className={labelClasses}>
        Category
        <select
          className={fieldClasses}
          value={form.category}
          onChange={(event) => update('category', event.target.value)}
          required
        >
          {ITEM_CATEGORIES.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
      {form.category === 'Other' && (
        <label className={labelClasses}>
          Custom category
          <input
            className={fieldClasses}
            value={form.customCategory}
            onChange={(event) => update('customCategory', event.target.value)}
            required
          />
        </label>
      )}
      <label className={labelClasses}>
        Quantity
        <input
          className={fieldClasses}
          value={form.quantity}
          onChange={(event) => update('quantity', event.target.value)}
          placeholder="e.g. 2 Packets, 500 gm, 1 Bottle"
          list="quantity-suggestions"
          autoComplete="off"
          required
        />
        <datalist id="quantity-suggestions">
          {QUANTITY_SUGGESTIONS.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClasses}>
          Requested by
          <input className={fieldClasses} value={requestedByName} disabled readOnly />
        </label>
        <label className={labelClasses}>
          Bring by (assign to)
          <select
            className={fieldClasses}
            value={form.assignedTo}
            onChange={(event) => update('assignedTo', event.target.value)}
            required
          >
            <option value="">Select person</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </label>
      </div>
      <label className={labelClasses}>
        Status
        <select
          className={fieldClasses}
          value={form.status}
          onChange={(event) => update('status', event.target.value)}
          required
        >
          {ITEM_STATUSES.map((status) => (
            <option key={status} value={status}>{ITEM_STATUS_LABELS[status]}</option>
          ))}
        </select>
      </label>
      <label className={labelClasses}>
        Notes
        <textarea
          className={fieldClasses}
          value={form.notes}
          onChange={(event) => update('notes', event.target.value)}
          placeholder='Optional, e.g. "Only Amul", "Fresh vegetables"'
          rows="3"
        />
      </label>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 font-extrabold text-gray-900 hover:bg-gray-50"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-600 px-4 font-extrabold text-white hover:bg-emerald-700"
        >
          {editingItem ? 'Save item' : 'Add item'}
        </button>
      </div>
    </form>
  );
}
