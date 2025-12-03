"use client";

import { useState, useEffect } from "react";
import { Folder } from "lucide-react";

import { Category, fetchCategoriesResponse } from "@/types/types";

import DeleteModal from "@/components/modal/DeleteModal";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { useDateFilter } from "@/hooks/useDateFilter";
import { useCrudPage } from "@/hooks/useCrudPage";
import SearchFilterBar from "@/components/common/SearchFilterBar";
import { CrudPageLayout } from "@/components/common/CrudPageLayout";
import ActionButtons from "@/components/common/ActionButtons";
import Modal from "@/components/common/Modal";
import CategoryForm from "@/components/form/CategoryForm";
import { deleteCategory, fetchCategories } from "@/services/categoryService";

const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedSearch(searchTerm);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    startDate,
    endDate,
    showDateFilter,
    toggleDateFilter,
    setStartDate,
    setEndDate,
  } = useDateFilter();

  const {
    data: categories,
    meta,
    loading,
    loadData,
    handleDelete,
    setMeta,
  } = useCrudPage<Category>({
    fetchData: async (page, limit) => {
      const res: fetchCategoriesResponse = await fetchCategories(
        debouncedSearch,
        startDate?.toISOString(),
        endDate?.toISOString(),
        page,
        limit
      );
      return { data: res.categories, meta: res.meta };
    },
    deleteData: deleteCategory,
  });
  useEffect(() => {
    loadData(1);
    setMeta((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, startDate, endDate]);

  const openAddModal = () => setShowModal(true);
  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };
  const closeModal = () => {
    setEditingCategory(null);
    setShowModal(false);
  };
  const openDeleteModal = (category: Category) => {
    setDeletingCategory(category);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeletingCategory(null);
    setShowDeleteModal(false);
  };
  const confirmDelete = async () => {
    if (deletingCategory) {
      await handleDelete(deletingCategory.id);
      closeDeleteModal();
    }
  };

  const columns = [
    {
      label: "No.",
      render: (_: any, i: number) => i + 1 + (meta.page - 1) * meta.limit,
    },
    { label: "Category Title", render: (row: Category) => row.categoryname },
    {
      label: "Total Controls",
      render: (row: Category) => row._count?.controls ?? 0,
    },
    {
      label: "Actions",
      render: (row: Category) => (
        <ActionButtons
          viewPath={`/dashboard/admin/categories/${row.id}`}
          onEdit={() => openEditModal(row)}
          onDelete={() => openDeleteModal(row)}
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-rose-100 rounded flex items-center justify-center">
            <Folder className="w-5 h-5 text-red-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Categories</h1>
        </div>

        <SearchFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          showDateFilter={showDateFilter}
          toggleDateFilter={toggleDateFilter}
          loadData={loadData}
          addButton={{ label: "Add Category", onClick: openAddModal }}
        />
      </div>

      <CrudPageLayout
        data={categories}
        columns={columns}
        loading={loading}
        meta={meta}
        onPageChange={loadData}
      >
        <Modal isOpen={showModal} onClose={closeModal}>
          <CategoryForm
            category={editingCategory}
            onClose={closeModal}
            onSuccess={() => loadData(meta.page)}
          />
        </Modal>

        <DeleteModal
          isOpen={showDeleteModal}
          message={`Are you sure you want to delete "${deletingCategory?.categoryname}"?`}
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      </CrudPageLayout>
    </div>
  );
};

export default CategoriesPage;
