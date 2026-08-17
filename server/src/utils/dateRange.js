function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function getDateRangeFilter(filter) {
  if (!filter || filter === 'all') return null;

  const now = new Date();

  if (filter === 'today') {
    return { $gte: startOfDay(now), $lte: endOfDay(now) };
  }

  if (filter === 'yesterday') {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return { $gte: startOfDay(yesterday), $lte: endOfDay(yesterday) };
  }

  if (filter === 'twoDaysAgo') {
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);
    return { $gte: startOfDay(twoDaysAgo), $lte: endOfDay(twoDaysAgo) };
  }

  if (filter === 'week') {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return { $gte: weekAgo, $lte: now };
  }

  if (filter === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { $gte: start, $lte: end };
  }

  return null;
}
