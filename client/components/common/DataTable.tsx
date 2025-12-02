"use client";

import React from "react";

type Column<T> = {
  label: string;
  render: (row: T, index: number) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  className?: string;
};

export const DataTable = <T,>({
  data,
  columns,
  className,
}: DataTableProps<T>) => {
  return (
    <div
      className={`overflow-x-auto bg-white rounded-lg shadow-sm ${className || ""}`}
    >
      <table className="min-w-full">
        <thead className="bg-rose-50 border-b border-rose-100">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-6 py-3 text-left font-medium text-gray-700"
              >
                {col.label}
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
