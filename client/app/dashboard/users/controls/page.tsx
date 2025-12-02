"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchCategories, fetchControls } from "@/services/userServices";
import { progress } from "@/services/userServices";
import { Category, Controls } from "@/types/types";

import Card from "@/components/common/Cards";
import Modal from "@/components/common/Modal";
import FormButton from "@/components/common/FormButton";
import StatsSummary from "@/components/common/StatsSummary";
import AnswerForm from "@/components/form/AnswerForm";
import { Eye } from "lucide-react";

const ControlPage = () => {
  const router = useRouter();

  // --- Data States ---
  const [controls, setControls] = useState<Controls[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [loading, setLoading] = useState(true);

  // --- Stats ---
  const [stats, setStats] = useState({
    implemented: 0,
    notImplemented: 0,
    notApplicable: 0,
    total: 0,
  });

  // --- Play Mode States ---
  const [playMode, setPlayMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- Fetch Controls & Categories ---
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const data = await fetchControls(selectedCategory);
        const categoryRes = await fetchCategories();
        setControls(data);
        setCategories(categoryRes.categories);
      } catch (err) {
        console.error("Failed to fetch controls or categories", err);
      }
      setLoading(false);
    };
    loadAll();
  }, [selectedCategory]);

  // --- Fetch Stats using progress API ---
  const fetchStats = async () => {
    try {
      const storedUser = localStorage.getItem("users");
      if (!storedUser) return;

      const userData = JSON.parse(storedUser);
      const progressRes = await progress(userData.id);

      const implemented = progressRes.data.implemented || 0;
      const notImplemented = progressRes.data.not_implemented || 0;
      const notApplicable = progressRes.data.not_applicable || 0;
      const total = implemented + notImplemented + notApplicable;

      setStats({ implemented, notImplemented, notApplicable, total });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <p>Loading controls...</p>;

  return (
    <div className="w-full h-full flex flex-col justify-start gap-6">
      {/* --- Stats Summary --- */}
      <StatsSummary
        counts={{
          total: stats.total,
          implemented: stats.implemented,
          notImplemented: stats.notImplemented,
          notApplicable: stats.notApplicable,
        }}
      />

      {/* --- Filter Section --- */}
      <Card title="Filter">
        <label className="text-sm font-semibold text-black rounded-sm">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value ? Number(e.target.value) : "")
          }
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-black bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.categoryname}
            </option>
          ))}
        </select>
      </Card>

      {/* --- Play Mode Button --- */}
      {!playMode && controls.length > 0 && (
        <FormButton onClick={() => setPlayMode(true)} className="mt-4">
          Play Controls
        </FormButton>
      )}

      {/* --- Play Modal --- */}
      <Modal isOpen={playMode} onClose={() => setPlayMode(false)}>
        {controls[currentIndex] ? (
          <>
            <p className="text-sm text-gray-600 mb-2">
              Control {currentIndex + 1} of {controls.length}
            </p>

            <p className="font-bold text-black mb-4">
              #
              {controls[currentIndex].controlnumber ||
                controls[currentIndex].id}{" "}
              — {controls[currentIndex].description}
            </p>

            <AnswerForm
              control={controls[currentIndex]}
              onPrev={() => setCurrentIndex((prev) => prev - 1)}
              onNext={() => setCurrentIndex((prev) => prev + 1)}
              isFirst={currentIndex === 0}
              isLast={currentIndex === controls.length - 1}
              refreshStats={fetchStats} // refresh stats after each submission
            />
          </>
        ) : (
          <p>No control available</p>
        )}
      </Modal>

      {/* --- List View Using Cards --- */}
      <div className="flex flex-col gap-4 mt-6 max-h-[70vh] overflow-y-auto pr-2">
        {controls.map((control) => {
          const status = control.answers?.[0]?.status || "Not Submitted";

          return (
            <Card key={control.id}>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-semibold">
                  #{control.controlnumber || control.id}
                </span>

                <button
                  onClick={() =>
                    router.push(`/dashboard/users/controls/${control.id}`)
                  }
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Eye className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <p className="text-gray-900 text-[15px] font-medium mt-2">
                {control.description}
              </p>

              <p className="text-sm text-gray-700 mt-1">
                <span className="font-semibold">Category: </span>
                {control.category?.categoryname}
              </p>

              <span
                className={`mt-3 px-3 py-1 text-xs font-bold rounded-full w-fit
                  ${status === "IMPLEMENTED" && "bg-green-100 text-green-600"}
                  ${status === "NOT_IMPLEMENTED" && "bg-rose-100 text-red-500"}
                  ${status === "NOT_APPLICABLE" && "bg-orange-100 text-orange-500"}
                  ${status === "Not Submitted" && "bg-gray-200 text-gray-500"}`}
              >
                Submission: {status}
              </span>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ControlPage;
