type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  disabled?: boolean;
};

const Pagination = ({
  page,
  totalPages,
  onChange,
  disabled,
}: PaginationProps) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={disabled || page === 1}
        className={`px-3 py-1 rounded ${
          disabled || page === 1
            ? "bg-gray-200 cursor-not-allowed text-black"
            : "bg-gray-400 text-black"
        }`}
      >
        Prev
      </button>
      <span className="px-3 py-1 text-black">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={disabled || page === totalPages}
        className={`px-3 py-1 rounded ${
          disabled || page === totalPages
            ? "bg-gray-200 cursor-not-allowed text-black"
            : "bg-gray-400 text-black"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
