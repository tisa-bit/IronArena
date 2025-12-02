"use client";
import Card from "@/components/common/Cards";
import { fetchControlsById } from "@/services/controlsService";
import { submitAnswers } from "@/services/userServices";
import { Controls } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ControlsDetails = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [control, setControl] = useState<Controls | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const loadControl = async () => {
      const res = await fetchControlsById(id);
      setControl(res);
    };

    loadControl();
  }, [id]);

  if (!control) return <p>Control not found</p>;

  const handleStatusChange = (selected: string) => {
    setStatus(selected);
    setReason("");
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!status) return setError("Select an answer");
    if (status === "IMPLEMENTED" && control?.attachmentRequired && !file)
      return setError("Upload the PDF file");
    if (status !== "IMPLEMENTED" && reason.trim() === "")
      return setError("Explain the reason");

    const formData = new FormData();
    formData.append("controlId", control!.id.toString());
    formData.append("status", status!);
    if (file) formData.append("attachment", file);
    if (reason) formData.append("reason", reason);

    try {
      await submitAnswers(formData);
      setSuccess("Submitted successfully!");
      setStatus(null);
      setReason("");
      setFile(null);
      router.back();
    } catch (err) {
      console.error(err);
      setError("Failed to submit. Please try again.");
    }
  };

  return (
    <Card title="Control Details" onClose={() => router.back()}>
      <div className="space-y-2 mb-4">
        <p>
          <strong className="text-black">
            Control Number: {control.controlnumber}
          </strong>
        </p>
        <p>
          <strong className="text-black">
            Description:{control.description}
          </strong>{" "}
        </p>
        {control.tips && (
          <p>
            <strong className="text-black">Tips: {control?.tips}</strong>
          </p>
        )}
        {control.controlmapping && (
          <p>
            <strong className="text-black">
              Control Mapping: {control.controlmapping}
            </strong>{" "}
          </p>
        )}
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => handleStatusChange("IMPLEMENTED")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Implemented
        </button>
        <button
          onClick={() => handleStatusChange("NOT_IMPLEMENTED")}
          className="px-4 py-2 bg-rose-300 text-white rounded hover:bg-rose-500"
        >
          Not implemented
        </button>
        <button
          onClick={() => handleStatusChange("NOT_APPLICABLE")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Not applicable
        </button>
      </div>

      <div className="mb-4">
        {status === "IMPLEMENTED" && control.attachmentRequired && (
          <div className="flex flex-col mb-2">
            <label className="mb-1 font-medium text-black">Upload PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="border p-2 rounded text-black focus:border-black"
            />
          </div>
        )}

        {(status === "NOT_IMPLEMENTED" || status === "NOT_APPLICABLE") && (
          <div className="flex flex-col mb-2">
            <label className="mb-1 font-medium text-black">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason"
              className="border p-2 rounded resize-none text-black"
            />
          </div>
        )}
      </div>

      {status && (
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-rose-300 text-white rounded hover:bg-rose-500"
        >
          Submit
        </button>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </Card>
  );
};

export default ControlsDetails;
