import { escapeRegex } from './escapeRegex.js';
import { getDateRangeFilter } from './dateRange.js';

export function buildItemFilterQuery({ search, status, dateFilter }) {
  const query = {};

  if (status) query.status = status;
  if (search) query.name = { $regex: escapeRegex(search), $options: 'i' };

  const dateRange = getDateRangeFilter(dateFilter);
  if (dateRange) query.requestedAt = dateRange;

  return query;
}
