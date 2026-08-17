import { useCallback, useEffect, useRef, useState } from 'react';
import { adminApi } from '../api/admin.api.js';
import { itemsApi } from '../api/items.api.js';
import { usersApi } from '../api/users.api.js';

const emptyStats = { users: 0, items: 0, categories: 0 };
const LIMIT = 20;

export function useAdminData({ search = '', status = '', dateFilter = 'all' } = {}) {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [itemsPagination, setItemsPagination] = useState({ page: 1, hasMore: false, total: 0 });
  const [stats, setStats] = useState(emptyStats);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const itemFilters = { search, status, dateFilter };
  const itemFiltersRef = useRef(itemFilters);
  itemFiltersRef.current = itemFilters;

  const refresh = useCallback(async () => {
    setLoading(true);
    const [usersData, itemsData, allUsersData, statsData] = await Promise.all([
      adminApi.listUsers(),
      adminApi.listItems({ ...itemFiltersRef.current, page: 1, limit: LIMIT }),
      usersApi.list(),
      adminApi.stats()
    ]);
    setUsers(usersData.users);
    setItems(itemsData.items);
    setItemsPagination(itemsData.pagination);
    setAllUsers(allUsersData.users);
    setStats(statsData.stats);
    setLoading(false);
  }, [search, status, dateFilter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const loadMoreItems = useCallback(async () => {
    if (!itemsPagination.hasMore || loadingMore) return;
    setLoadingMore(true);
    const data = await adminApi.listItems({ ...itemFiltersRef.current, page: itemsPagination.page + 1, limit: LIMIT });
    setItems((current) => [...current, ...data.items]);
    setItemsPagination(data.pagination);
    setLoadingMore(false);
  }, [itemsPagination, loadingMore]);

  const createUser = useCallback(
    async (payload) => {
      await adminApi.createUser(payload);
      await refresh();
    },
    [refresh]
  );

  const updateUser = useCallback(
    async (id, payload) => {
      await adminApi.updateUser(id, payload);
      await refresh();
    },
    [refresh]
  );

  const removeUser = useCallback(
    async (id) => {
      await adminApi.removeUser(id);
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

  return {
    users,
    allUsers,
    items,
    itemsPagination,
    stats,
    loading,
    loadingMore,
    refresh,
    loadMoreItems,
    createUser,
    updateUser,
    removeUser,
    updateItem,
    deleteItem
  };
}
