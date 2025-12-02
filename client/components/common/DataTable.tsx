"use client";

import React from "react";

type Column<T> = {
  label: string;
  field?: string;
  render: (row: T, index: number) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  className?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
};

export const DataTable = <T,>({
  data,
  columns,
  className,
  sortField,
  sortOrder,
  onSort,
}: DataTableProps<T>) => {
  return (
    <div
      className={`overflow-x-auto bg-white rounded-lg shadow-sm ${className || ""}`}
    >
      <table className="min-w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.label}
                className={`cursor-pointer select-none ${col.field ? "" : "pointer-events-none"}`}
                onClick={() => {
                  if (!col.field) return;
                  onSort?.(col.field);
                }}
              >
                <div className="flex items-center  text-black gap-1">
                  {col.label}
                  {sortField === col.field && (
                    <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {columns.map((col, j) => (
                  <td key={j} className="px-6 py-4 text-gray-700">
                    {col.render(row, i)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
