export function formatDateTime(value) {
  if (!value) return '';

  return new Date(value).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit'
  });
}
