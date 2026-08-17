import { useCallback, useEffect, useState } from 'react';
import { disablePush, enablePush, getPushSubscription, isPushSupported } from '../utils/push.js';

export function usePushNotifications() {
  const [supported] = useState(isPushSupported);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supported) return;
    getPushSubscription()
      .then((subscription) => setEnabled(Boolean(subscription) && Notification.permission === 'granted'))
      .catch(() => setEnabled(false));
  }, [supported]);

  const toggle = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setError('');

    try {
      if (enabled) {
        await disablePush();
        setEnabled(false);
      } else {
        await enablePush();
        setEnabled(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }, [enabled, busy]);

  return { supported, enabled, busy, error, toggle };
}
