"use client";

import { Search } from "lucide-react";
import DateFilter from "./DateFilter";

type Props = {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  showDateFilter: boolean;

  toggleDateFilter: () => void;
  loadData: (
    page?: number,
    limit?: number,
    start?: Date | null,
    end?: Date | null
  ) => void;
  addButton?: { label: string; onClick: () => void };
};

const SearchFilterBar = ({
  searchTerm,
  setSearchTerm,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  showDateFilter,
  toggleDateFilter,
  loadData,
  addButton,
}: Props) => {
  return (
    <div className="flex items-center gap-3 relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black w-64 text-black"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
      </div>

      <button
        onClick={toggleDateFilter}
        className="py-2 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
      >
        Filter
      </button>

      {showDateFilter && (
        <DateFilter
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onApply={() => {
            loadData(1); // reload first page with updated dates
          }}
        />
      )}

      {addButton && (
        <button
          onClick={addButton.onClick}
          className="flex items-center gap-2 px-4 py-2 bg-rose-400 text-white rounded-lg hover:bg-rose-600"
        >
          {addButton.label}
        </button>
      )}
    </div>
  );
};

export default SearchFilterBar;
