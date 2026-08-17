const COLOR_STYLES = {
  emerald: { icon: 'bg-emerald-100 text-emerald-700', active: 'border-emerald-400 ring-2 ring-emerald-100 bg-emerald-50' },
  sky: { icon: 'bg-sky-100 text-sky-700', active: 'border-sky-400 ring-2 ring-sky-100 bg-sky-50' },
  amber: { icon: 'bg-amber-100 text-amber-700', active: 'border-amber-400 ring-2 ring-amber-100 bg-amber-50' },
  violet: { icon: 'bg-violet-100 text-violet-700', active: 'border-violet-400 ring-2 ring-violet-100 bg-violet-50' }
};

export default function StatCard({ icon: Icon, label, value, color = 'emerald', onClick, active = false }) {
  const Tag = onClick ? 'button' : 'div';
  const styles = COLOR_STYLES[color];

  return (
    <Tag
      onClick={onClick}
      className={`grid gap-2 rounded-lg border bg-white p-3 text-left shadow-sm sm:gap-3 sm:p-5 ${
        active ? styles.active : 'border-gray-200'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <span className={`grid h-8 w-8 place-items-center rounded-lg sm:h-10 sm:w-10 ${styles.icon}`}>
        <Icon size={16} className="sm:hidden" />
        <Icon size={20} className="hidden sm:block" />
      </span>
      <div>
        <span className="block text-xs font-bold text-gray-500 sm:text-sm">{label}</span>
        <strong className="font-display text-xl sm:text-3xl">{value}</strong>
      </div>
    </Tag>
  );
}
