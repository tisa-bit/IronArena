/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import SearchFilterBar from "@/components/common/SearchFilterBar";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { useDateFilter } from "@/hooks/useDateFilter";
import { fetchLogs } from "@/services/userServices";
import { fetchUsers } from "@/services/adminServices";
import { CrudPageLayout } from "@/components/common/CrudPageLayout";
import { Log, User } from "@/types/types";

const LogsPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [users, setUsers] = useState<User[]>([]);
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

  const [userFilter, setUserFilter] = useState("");

  const isAdmin =
    typeof window !== "undefined" && localStorage.getItem("role") === "Admin";

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
        .then((res) => setUsers(res?.data || []))
        .catch(() => setUsers([]));
    }
  }, [isAdmin]);

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
      if (isAdmin && userFilter) query.userId = userFilter;

      const res = await fetchLogs(query);

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
  }, [debouncedSearch, startDate, endDate, userFilter]);

  // ---------------------------
  // Table Column Definitions
  // ---------------------------
  const columns = [
    {
      label: "No.",
      render: (_: any, i: number) => i + 1 + (meta.page - 1) * meta.limit,
    },
    {
      label: "User",
      render: (row: any) =>
        row.user ? (
          <span className="font-medium text-gray-800">
            {row.user.firstname} {row.user.lastname}
          </span>
        ) : (
          "-"
        ),
    },
    {
      label: "Remarks",
      render: (row: any) =>
        row.readableMessage ? <span>{row.readableMessage}</span> : "-",
    },

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

      {isAdmin && (
        <select
          value={userFilter}
          onChange={(e) => {
            setUserFilter(e.target.value);
          }}
          className="border p-2 rounded-lg w-64"
        >
          <option value="">All Users</option>
          {users.map((u: any) => (
            <option key={u.id} value={u.id}>
              {u.firstname} {u.lastname}
            </option>
          ))}
        </select>
      )}

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
