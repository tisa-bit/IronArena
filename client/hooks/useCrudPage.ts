import { useState, useCallback } from "react";

export const useCrudPage = <T>({
  fetchData,
  deleteData,
  initialPage = 1,
  initialLimit = 5,
}: {
  fetchData: (page: number, limit: number) => Promise<{ data: T[]; meta: any }>;
  deleteData?: (id: number) => Promise<void>;
  initialPage?: number;
  initialLimit?: number;
}) => {
  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(
    async (page: number = initialPage, limit: number = initialLimit) => {
      setLoading(true);
      try {
        const res = await fetchData(page, limit);
        const { page: rPage = 1, actuallimit = limit, total = 0, totalPages = 1 } = res.meta ?? {};
        setData(res.data ?? []);
        setMeta({ page: rPage, limit: actuallimit, total, totalPages });
      } catch (err) {
        console.error("Error fetching data:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchData, initialPage, initialLimit]
  );

  const handleDelete = async (id: number) => {
    if (!deleteData) return;
    await deleteData(id);
    await loadData(1);
  };

  return {
    data,
    meta,
    loading,
    loadData,
    handleDelete,
    setData,
    setMeta,
  };
};
