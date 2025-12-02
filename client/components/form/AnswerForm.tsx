"use client";

import { useState } from "react";
import FormButton from "@/components/common/FormButton";
import FormInput from "@/components/common/FormInput";
import { Controls } from "@/types/types";
import { submitAnswers } from "@/services/userServices";

type AnswerFormProps = {
  control: Controls;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  refreshStats: () => void; 
};

const AnswerForm = ({
  control,
  onPrev,
  onNext,
  isFirst,
  isLast,
  refreshStats,
}: AnswerFormProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!selectedStatus) return setError("Select an answer");
    if (selectedStatus === "IMPLEMENTED" && control.attachmentRequired && !file)
      return setError("Upload PDF file");
    if (selectedStatus !== "IMPLEMENTED" && reason.trim() === "")
      return setError("Enter reason");

    const formData = new FormData();
    formData.append("controlId", control.id.toString());
    formData.append("status", selectedStatus);
    if (file) formData.append("attachment", file);
    if (reason) formData.append("reason", reason);

    try {
      await submitAnswers(formData);
      setSuccess("Submitted successfully!");
      setError("");
      setSelectedStatus(null);
      setReason("");
      setFile(null);

      refreshStats(); // refresh stats in parent
      onNext(); // move to next control
    } catch (err) {
      console.error(err);
      setError("Submission failed. Try again.");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <FormButton
          onClick={() => setSelectedStatus("IMPLEMENTED")}
          className="bg-green-500 hover:bg-green-600"
        >
          Implemented
        </FormButton>
        <FormButton
          onClick={() => setSelectedStatus("NOT_IMPLEMENTED")}
          className="bg-rose-500 hover:bg-rose-600"
        >
          Not Implemented
        </FormButton>
        <FormButton
          onClick={() => setSelectedStatus("NOT_APPLICABLE")}
          className="bg-gray-600 hover:bg-gray-700"
        >
          Not Applicable
        </FormButton>
      </div>

      {selectedStatus === "IMPLEMENTED" && control.attachmentRequired && (
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-black"
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
          onChange={(e) => setReason(e.target.value)}
        />
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      <div className="flex justify-end gap-3 mt-3">
        <FormButton
          onClick={onPrev}
          disabled={isFirst}
          className="bg-gray-300 text-black"
        >
          Prev
        </FormButton>
        <FormButton
          onClick={handleSubmit}
          className={`bg-${isLast ? "green" : "blue"}-500 hover:bg-${isLast ? "green" : "blue"}-600`}
        >
          {isLast ? "Submit" : "Next"}
        </FormButton>
      </div>
    </div>
  );
};

export default AnswerForm;
