import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type ActionButtonProps = {
  viewPath?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  extraActions?: React.ReactNode;
};
const ActionButtons = ({
  viewPath,
  onEdit,
  onDelete,
  extraActions,
}: ActionButtonProps) => {
  const router = useRouter();
  return (
    <div className="flex gap-2">
      {viewPath && (
        <button onClick={() => router.push(viewPath)} title="View">
          <Eye className="w-5 h-5 text-rose-300 hover:text-rose-700" />
        </button>
      )}
      {onEdit && (
        <button onClick={onEdit} title="Edit">
          <Pencil className="w-5 h-5 text-rose-300 hover:text-rose-700" />
        </button>
      )}
      {onDelete && (
        <button onClick={onDelete} title="Delete">
          <Trash2 className="w-5 h-5 text-rose-300 hover:text-red-700" />
        </button>
      )}
      {extraActions && <>{extraActions}</>}
    </div>
  );
};

export default ActionButtons;
