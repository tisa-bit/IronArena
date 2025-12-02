"use client";

import { useState } from "react";
import ReactDOM from "react-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DateFilterProps = {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  onApply: () => void;
};

const DateFilter = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onApply,
}: DateFilterProps) => {
  return ReactDOM.createPortal(
    <div className="absolute top-20 right-8 bg-white border rounded-lg shadow-lg p-4 z-50 w-72">
      <label className="text-sm font-medium">From</label>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        className="w-full py-2 px-3 border rounded-lg"
        placeholderText="Select start date"
      />

      <label className="text-sm font-medium mt-2">To</label>
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        className="w-full py-2 px-3 border rounded-lg text-black"
        placeholderText="Select end date"
      />

      <button
        onClick={() => {
          onApply();
        }}
        className="mt-2 py-2 px-4 bg-rose-400 text-white rounded-lg hover:bg-rose-600"
      >
        Apply Filter
      </button>
    </div>,
    document.body
  );
};

export default DateFilter;
