"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Category } from "@/types/types";
import { fetchCategoryById } from "@/services/categoryService";


const CategoryDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const loadCategory = async () => {
      const res = await fetchCategoryById(id);
      setCategory(res);
    };
    loadCategory();
  }, [id]);

  if (!category)
    return (
      <p className="text-gray-700 text-center mt-10">Loading category...</p>
    );

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative">
       
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Category Details
        </h2>

        <div className="space-y-4 text-gray-700">
          <p>
            <strong>ID:</strong> {category.id}
          </p>
          <p>
            <strong>Name:</strong> {category.categoryname}
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="mt-6 w-full py-3 rounded-full text-white font-semibold bg-rose-500 hover:opacity-90 transition-all shadow-lg"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default CategoryDetailPage;
