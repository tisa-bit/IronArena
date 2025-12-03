import { useState } from "react";

export const useDateFilter = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDateFilter, setShowDateFilter] = useState(false);

  const toggleDateFilter = () => setShowDateFilter(prev => !prev);

  const applyDateFilter = () => {
    setShowDateFilter(false);
    return { startDate, endDate }; 
  };

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    showDateFilter,
    toggleDateFilter,
    applyDateFilter,
  };
};
