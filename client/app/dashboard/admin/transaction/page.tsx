"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine } from "lucide-react";

import SearchFilterBar from "@/components/common/SearchFilterBar";
import { CrudPageLayout } from "@/components/common/CrudPageLayout";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { useDateFilter } from "@/hooks/useDateFilter";
import { fetchTransactions } from "@/services/plansService";
import { fetchUsers } from "@/services/adminServices";
import { Transaction, User } from "@/types/types";

import DropdownFilter from "@/components/common/FilterDropdown";

const TransactionPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    totalPages: 1,
    limit: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState<number | "">("");

  const [isAdmin, setIsAdmin] = useState(false);

  const debouncedSearch = useDebouncedSearch(searchTerm, 600);
  const limit = 5;

  const {
    startDate,
    endDate,
    showDateFilter,
    toggleDateFilter,
    setStartDate,
    setEndDate,
  } = useDateFilter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("users");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const adminCheck = parsedUser.role?.toLowerCase() === "admin";
        setIsAdmin(adminCheck);

        if (adminCheck) {
          fetchUsers().then((res) => setUsers(res?.users || []));
        }
      }
    }
  }, []);

  const loadData = async (page = 1) => {
    try {
      setLoading(true);

      const params = {
        search: debouncedSearch || "",
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        page,
        limit,
        ...(isAdmin && userFilter ? { userId: Number(userFilter) } : {}),
      };

      const res = await fetchTransactions(params);

      setTransactions(res.transactions || []);
      setMeta({
        ...res.meta,
        page,
        limit,
      });
    } catch (err) {
      console.error("Error loading transactions:", err);
      setTransactions([]);
      setMeta({ page: 1, totalPages: 1, limit, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
  }, [debouncedSearch, startDate, endDate, userFilter, isAdmin]);

  const columns = [
    {
      label: "No.",
      render: (_: Transaction, i: number) =>
        i + 1 + (meta.page - 1) * meta.limit,
    },
    { label: "Name", render: (row: Transaction) => row.username },
    { label: "Plan", render: (row: Transaction) => row.planName },
    { label: "Amount", render: (row: Transaction) => `$${row.amount}` },
    { label: "Invoice No.", render: (row: Transaction) => row.invoiceNo },
    {
      label: "Date",
      render: (row: Transaction) => new Date(row.date).toLocaleString(),
    },
    {
      label: "Invoice PDF",
      render: (row: Transaction) =>
        row.invoicePdfUrl ? (
          <a
            href={row.invoicePdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-600 underline"
          >
            <ArrowDownToLine />
          </a>
        ) : (
          "-"
        ),
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
        <DropdownFilter
          items={users}
          valueKey="id"
          labelKey="firstname"
          selectedValue={userFilter}
          onChange={(value) => setUserFilter(Number(value))}
          placeholder="Select a user"
          className="w-full max-w-xs"
        />
      )}

      <CrudPageLayout
        data={transactions}
        columns={columns}
        loading={loading}
        meta={meta}
        onPageChange={loadData}
      />
    </div>
  );
};

export default TransactionPage;
