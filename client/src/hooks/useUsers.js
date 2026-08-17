import { useCallback, useEffect, useState } from 'react';
import { usersApi } from '../api/users.api.js';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await usersApi.list();
    setUsers(data.users);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  return { users, loading, refresh };
}
