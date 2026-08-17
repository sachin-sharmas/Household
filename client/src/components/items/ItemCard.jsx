import { CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { ITEM_STATUS_LABELS } from '../../constants/items.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatDateTime } from '../../utils/date.js';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  purchased: 'bg-sky-100 text-sky-700',
  delivered: 'bg-emerald-100 text-emerald-700'
};

export default function ItemCard({ item, onEdit, onDelete, onComplete }) {
  const { user: currentUser } = useAuth();
  const isOwner = currentUser?.id === item.requestedBy?._id;
  const isAdmin = currentUser?.role === 'admin';
  const canComplete = isOwner || isAdmin || currentUser?.id === item.assignedTo?._id;
  const canModify = isOwner || isAdmin;
  const isDelivered = item.status === 'delivered';

  return (
    <article className="relative grid gap-4 rounded-lg border border-gray-200 bg-white p-4.5 shadow-sm">
      <span className={`absolute right-4.5 top-4.5 w-fit rounded-full px-2.5 py-1 text-xs font-extrabold uppercase ${STATUS_STYLES[item.status]}`}>
        {ITEM_STATUS_LABELS[item.status]}
      </span>

      <div className="pr-28">
        <h3 className="text-xl font-extrabold md:text-2xl">{item.name}</h3>
        <p className="mt-1 text-gray-500">{item.notes || 'No notes added'}</p>
      </div>

      <div className="grid gap-1 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
          <p>
            <span className="font-bold text-sky-600">Added By : </span>{' '}
            <span className="text-gray-600">{item.requestedBy?.name || 'Unknown'}</span>
          </p>
          <span className="text-xs text-gray-400">{formatDateTime(item.requestedAt)}</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
          <p>
            <span className="font-bold text-violet-600">Assigned To : </span>{' '}
            <span className="text-gray-600">{item.assignedTo?.name || 'Unknown'}</span>
          </p>
          {isDelivered && <span className="text-xs text-gray-400">{formatDateTime(item.completedAt)}</span>}
        </div>
      </div>

      <strong className="font-extrabold">{item.quantity}</strong>

      <div className="flex items-center justify-between">
        {!isDelivered && (
          <button
            disabled={!canComplete}
            title={canComplete ? 'Mark this item as complete' : 'Only the requester, assignee, or an admin can mark this complete'}
            onClick={() => onComplete?.(item._id)}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
              canComplete
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'cursor-not-allowed bg-gray-100 text-gray-400'
            }`}
          >
            <CheckCircle2 size={12} /> Mark as complete
          </button>
        )}
        {canModify && (
          <div className="ml-auto flex gap-1">
            <button
              className="rounded-full p-2.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              title="Edit item"
              onClick={onEdit}
            >
              <Pencil size={18} />
            </button>
            <button
              className="rounded-full p-2.5 text-red-400 hover:bg-red-50 hover:text-red-600"
              title="Delete item"
              onClick={onDelete}
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
