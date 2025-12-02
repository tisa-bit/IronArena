
"use client";


import { Controls } from "@/types/types";
import Modal from "@/components/common/Modal";
import FormButton from "@/components/common/FormButton";
import FormInput from "@/components/common/FormInput";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  control: Controls | null;
  currentIndex: number;
  totalControls: number;
  selectedStatus: string | null;
  reason: string;
  file: File | null;
  error: string;
  success: string;
  onStatusChange: (status: string) => void;
  onReasonChange: (reason: string) => void;
  onFileChange: (file: File | null) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onSkip: () => void;
};

const ControlPlayModal = ({
  isOpen,
  onClose,
  control,
  currentIndex,
  totalControls,
  selectedStatus,
  reason,
  file,
  error,
  success,
  onStatusChange,
  onReasonChange,
  onFileChange,
  onPrev,
  onNext,
  onSubmit,
  onSkip,
}: Props) => {
  if (!control) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <p className="text-sm text-gray-600 mb-2">
        Control {currentIndex + 1} of {totalControls}
      </p>

      <p className="font-bold text-black mb-4">
        #{control.controlnumber || control.id} — {control.description}
      </p>

      <div className="flex gap-3 mb-4">
        <FormButton
          onClick={() => onStatusChange("IMPLEMENTED")}
          className="bg-green-500 hover:bg-green-600"
        >
          Implemented
        </FormButton>
        <FormButton
          onClick={() => onStatusChange("NOT_IMPLEMENTED")}
          className="bg-rose-500 hover:bg-rose-600"
        >
          Not Implemented
        </FormButton>
        <FormButton
          onClick={() => onStatusChange("NOT_APPLICABLE")}
          className="bg-gray-600 hover:bg-gray-700"
        >
          Not Applicable
        </FormButton>
      </div>

      {selectedStatus === "IMPLEMENTED" && control.attachmentRequired && (
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
          className="mb-3 text-black"
        />
      )}

      {(selectedStatus === "NOT_IMPLEMENTED" ||
        selectedStatus === "NOT_APPLICABLE") && (
        <FormInput
          name="reason"
          placeholder="Enter reason"
          type="text"
          register={() => {}}
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
        />
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      <div className="flex justify-end gap-3 mt-5">
        <FormButton
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="bg-gray-300 text-black"
        >
          Prev
        </FormButton>

        {currentIndex < totalControls - 1 ? (
          <FormButton
            onClick={onNext}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Next
          </FormButton>
        ) : (
          <FormButton
            onClick={onSubmit}
            className="bg-green-500 hover:bg-green-600"
          >
            Submit
          </FormButton>
        )}

        <FormButton
          onClick={onSkip}
          className="bg-yellow-400 hover:bg-yellow-500"
        >
          Skip
        </FormButton>
      </div>
    </Modal>
  );
};

export default ControlPlayModal;
