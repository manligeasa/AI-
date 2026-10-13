import { useCallback, useEffect, useRef, useState } from 'react';
import { loadData, saveData } from './localStore';

/**
 * 화면에서 쓰는 데이터 훅(재사용 기능 묶음).
 * 바꾸면 화면이 즉시 갱신되고, 같은 내용이 JSON 파일에도 저장된다.
 */
export function useLocalData() {
  const [data, setData] = useState(null);
  const latest = useRef(null);

  useEffect(() => {
    loadData().then((loaded) => {
      latest.current = loaded;
      setData(loaded);
    });
  }, []);

  const update = useCallback((change) => {
    const next = change(latest.current);
    latest.current = next;
    setData(next);
    saveData(next).catch(() => {});
  }, []);

  const addHistory = useCallback(
    (entry) =>
      update((d) => ({
        ...d,
        history: [{ id: String(Date.now()), createdAt: new Date().toISOString(), favorite: false, ...entry }, ...d.history],
      })),
    [update],
  );

  const toggleFavorite = useCallback(
    (id) =>
      update((d) => ({
        ...d,
        history: d.history.map((h) => (h.id === id ? { ...h, favorite: !h.favorite } : h)),
      })),
    [update],
  );

  const removeHistory = useCallback(
    (id) => update((d) => ({ ...d, history: d.history.filter((h) => h.id !== id) })),
    [update],
  );

  return { data, loading: data === null, addHistory, toggleFavorite, removeHistory };
}
