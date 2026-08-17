import { Loader2 } from 'lucide-react';

export default function InlineLoader({ label = 'Loading items...' }) {
  return (
    <div className="grid place-items-center gap-3 rounded-lg border border-dashed border-gray-300 p-12 text-gray-500">
      <Loader2 className="animate-spin" size={28} />
      <span>{label}</span>
    </div>
  );
}
