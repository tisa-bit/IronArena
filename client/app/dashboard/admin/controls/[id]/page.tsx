"use client";

import Card from "@/components/common/Cards";
import { fetchControlsById } from "@/services/controlsService";

import { Controls } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ControlsDetails = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [control, setControl] = useState<Controls | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const loadControl = async () => {
      setLoading(true);
      const res = await fetchControlsById(id);
      setControl(res);
      setLoading(false);
    };

    loadControl();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading control details...
      </div>
    );

  if (!control)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Control not found
      </div>
    );

  return (
    <div className="p-6">
      <Card title="Control Details" onClose={() => router.back()}>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong className="text-gray-800">Control Number:</strong>{" "}
            {control.controlnumber}
          </p>
          <p>
            <strong className="text-gray-800">Description:</strong>{" "}
            {control.description}
          </p>
          {control.tips && (
            <p>
              <strong className="text-gray-800">Tips:</strong> {control.tips}
            </p>
          )}
          {control.controlmapping && (
            <p>
              <strong className="text-gray-800">Control Mapping:</strong>{" "}
              {control.controlmapping}
            </p>
          )}
          <p>
            <strong className="text-gray-800">Media Link:</strong>{" "}
            <a
              href={control.mediaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-500 hover:underline"
            >
              {control.mediaLink}
            </a>
          </p>
          <p>
            <strong className="text-gray-800">Category:</strong>{" "}
            {control.category?.categoryname}
          </p>
          <p>
            <strong className="text-gray-800">Attachment Required:</strong>{" "}
            {control.attachmentRequired ? (
              <span className="text-green-600 font-semibold">Yes</span>
            ) : (
              <span className="text-red-600 font-semibold">No</span>
            )}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ControlsDetails;
