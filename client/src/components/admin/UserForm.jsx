import { useState } from 'react';

const fieldClasses =
  'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-3 text-base text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';
const labelClasses = 'grid gap-2 text-sm font-bold text-gray-700';

function toFormState(editingUser) {
  if (!editingUser) {
    return { name: '', email: '', phone: '', password: '', role: 'user' };
  }

  return {
    name: editingUser.name,
    email: editingUser.email,
    phone: editingUser.phone || '',
    password: '',
    role: editingUser.role
  };
}

export default function UserForm({ editingUser, onSubmit, onCancel }) {
  const isEditing = Boolean(editingUser);
  const [form, setForm] = useState(() => toFormState(editingUser));

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (isEditing && !form.password) {
      const { password, ...rest } = form;
      onSubmit(rest);
      return;
    }
    onSubmit(form);
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <label className={labelClasses}>
        Name
        <input className={fieldClasses} value={form.name} onChange={(event) => update('name', event.target.value)} required />
      </label>
      <label className={labelClasses}>
        Email
        <input
          className={fieldClasses}
          type="email"
          value={form.email}
          onChange={(event) => update('email', event.target.value)}
          required
        />
      </label>
      <label className={labelClasses}>
        Mobile number
        <input
          className={fieldClasses}
          type="tel"
          placeholder="+1 555 123 4567"
          value={form.phone}
          onChange={(event) => update('phone', event.target.value)}
        />
      </label>
      <label className={labelClasses}>
        Password {isEditing && <span className="font-normal text-gray-500">(leave blank to keep current password)</span>}
        <input
          className={fieldClasses}
          type="password"
          value={form.password}
          onChange={(event) => update('password', event.target.value)}
          minLength="6"
          required={!isEditing}
        />
      </label>
      <label className={labelClasses}>
        Role
        <select className={fieldClasses} value={form.role} onChange={(event) => update('role', event.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
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
          {isEditing ? 'Save user' : 'Create user'}
        </button>
      </div>
    </form>
  );
}
