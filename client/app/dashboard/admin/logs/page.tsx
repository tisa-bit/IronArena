/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import SearchFilterBar from "@/components/common/SearchFilterBar";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { useDateFilter } from "@/hooks/useDateFilter";

import { fetchAdminLogs } from "@/services/adminServices";
import { CrudPageLayout } from "@/components/common/CrudPageLayout";
import { Log, User } from "@/types/types";
import { fetchUsers } from "@/services/userService";

const AdminLogsPage = () => {
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

  // Sorting
  const [sortField, setSortField] = useState<"createdAt" | "action" | "user">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch all users for filter
  useEffect(() => {
    fetchUsers()
      .then((res) => setUsers(res?.users || []))
      .catch(() => setUsers([]));
  }, []);

  const loadData = async (page = 1) => {
    try {
      setLoading(true);

      const query: any = {
        page,
        limit,
        search: debouncedSearch || "",
        sortField,
        sortOrder,
      };

      if (startDate) query.startDate = startDate.toISOString();
      if (endDate) query.endDate = endDate.toISOString();
      if (userFilter) query.userId = userFilter;

      const res = await fetchAdminLogs(query);

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
  }, [debouncedSearch, startDate, endDate, userFilter, sortField, sortOrder]);

  const handleSort = (field: "createdAt" | "action" | "user") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const columns = [
    {
      label: "No.",
      render: (_: any, i: number) => i + 1 + (meta.page - 1) * meta.limit,
    },
    {
      label: "User",
      field: "user",
      render: (row: any) =>
        row.user ? `${row.user.firstname} ${row.user.lastname}` : "-",
    },
    {
      label: "Remarks",
      field: "action",
      render: (row: any) => row.readableMessage || row.action || "-",
    },
    {
      label: "Date",
      field: "createdAt",
      render: (row: any) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Search & Date filter */}
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

      {/* User filter */}
      <select
        value={userFilter}
        onChange={(e) => setUserFilter(e.target.value)}
        className="border p-2 rounded-lg w-64"
      >
        <option value="">All Users</option>
        {users.map((u: any) => (
          <option key={u.id} value={u.id}>
            {u.firstname} {u.lastname}
          </option>
        ))}
      </select>

      {/* Logs Table */}
      <CrudPageLayout
        data={logs}
        columns={columns}
        loading={loading}
        meta={meta}
        onPageChange={loadData}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
      />
    </div>
  );
};

export default AdminLogsPage;
