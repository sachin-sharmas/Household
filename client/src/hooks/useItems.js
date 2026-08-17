import { useCallback, useEffect, useRef, useState } from 'react';
import { itemsApi } from '../api/items.api.js';

const emptyStats = { total: 0, pending: 0, purchased: 0, delivered: 0, requestedByMe: 0, assignedToMe: 0 };
const LIMIT = 20;

export function useItems({ scope = 'all', search = '', status = '', dateFilter = 'all' } = {}) {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [pagination, setPagination] = useState({ page: 1, hasMore: false, total: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const filters = { scope, search, status, dateFilter };
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const refresh = useCallback(async () => {
    setLoading(true);
    const [listData, statsData] = await Promise.all([
      itemsApi.list({ ...filtersRef.current, page: 1, limit: LIMIT }),
      itemsApi.stats(filtersRef.current.scope)
    ]);
    setItems(listData.items);
    setPagination(listData.pagination);
    setStats(statsData.stats);
    setLoading(false);
  }, [scope, search, status, dateFilter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const loadMore = useCallback(async () => {
    if (!pagination.hasMore || loadingMore) return;
    setLoadingMore(true);
    const data = await itemsApi.list({ ...filtersRef.current, page: pagination.page + 1, limit: LIMIT });
    setItems((current) => [...current, ...data.items]);
    setPagination(data.pagination);
    setLoadingMore(false);
  }, [pagination, loadingMore]);

  const createItem = useCallback(
    async (payload) => {
      await itemsApi.create(payload);
      await refresh();
    },
    [refresh]
  );

  const updateItem = useCallback(
    async (id, payload) => {
      await itemsApi.update(id, payload);
      await refresh();
    },
    [refresh]
  );

  const deleteItem = useCallback(
    async (id) => {
      await itemsApi.remove(id);
      await refresh();
    },
    [refresh]
  );

  return { items, stats, pagination, loading, loadingMore, refresh, loadMore, createItem, updateItem, deleteItem };
}
