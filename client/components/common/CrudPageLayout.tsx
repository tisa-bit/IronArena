// components/common/CrudPageLayout.tsx
"use client";

import { ReactNode } from "react";
import { DataTable } from "./DataTable";
import Pagination from "./Pagination";

interface CrudPageLayoutProps<T> {
  data: T[];
  columns: { label: string; render: (row: T, index?: number) => ReactNode }[];
  loading: boolean;
  meta: { page: number; totalPages: number; limit: number; total: number };
  onPageChange: (page: number) => void;
  children?: ReactNode;
}

export function CrudPageLayout<T>({
  data,
  columns,
  loading,
  meta,
  onPageChange,
  children,
}: CrudPageLayoutProps<T>) {
  return (
    <div>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <DataTable data={data} columns={columns} />
      )}

      <div className="flex justify-center mt-6">
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          onChange={onPageChange}
          disabled={data.length === 0 || meta.totalPages <= 1}
        />
      </div>


      {children}
    </div>
  );
}

