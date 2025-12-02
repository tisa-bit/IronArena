/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import SearchFilterBar from "@/components/common/SearchFilterBar";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { useDateFilter } from "@/hooks/useDateFilter";
import { fetchUserLogs } from "@/services/userServices"; // dedicated API for user logs
import { CrudPageLayout } from "@/components/common/CrudPageLayout";
import { Log } from "@/types/types";

const LogsPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    totalPages: 1,
    limit: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  const limit = 5;

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedSearch(searchTerm, 600);

  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    showDateFilter,
    toggleDateFilter,
  } = useDateFilter();

  const loadData = async (page = 1) => {
    try {
      setLoading(true);

      const query: any = {
        page,
        limit,
        search: debouncedSearch || "",
      };

      if (startDate) query.startDate = startDate.toISOString();
      if (endDate) query.endDate = endDate.toISOString();

      const res = await fetchUserLogs(query);

      setLogs(Array.isArray(res?.logs) ? res.logs : []);
      setMeta({
        ...res.meta,
        page,
        limit,
      });
    } catch (err) {
      console.error("Error loading logs:", err);
      setLogs([]);
      setMeta({ page: 1, totalPages: 1, limit, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
  }, [debouncedSearch, startDate, endDate]);

  // ---------------------------
  // Table Column Definitions
  // ---------------------------
  const columns = [
    {
      label: "No.",
      render: (_: any, i: number) => i + 1 + (meta.page - 1) * meta.limit,
    },
    { label: "Remarks", render: (row: any) => row.readableMessage || "-" },
    {
      label: "Date",
      render: (row: any) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="p-6 flex flex-col gap-5">
      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        showDateFilter={showDateFilter}
        toggleDateFilter={toggleDateFilter}
        loadData={() => loadData(1)}
      />

      <CrudPageLayout
        data={logs}
        columns={columns}
        loading={loading}
        meta={meta}
        onPageChange={loadData}
      />
    </div>
  );
};

export default LogsPage;
