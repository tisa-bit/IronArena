"use client";

import { useState, useEffect } from "react";
import { Box } from "lucide-react";


import { Controls, fetchControlResponse } from "@/types/types";

import ControlForm from "@/components/form/ControlForm";
import DeleteModal from "@/components/modal/DeleteModal";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { useDateFilter } from "@/hooks/useDateFilter";
import { useCrudPage } from "@/hooks/useCrudPage";

import SearchFilterBar from "@/components/common/SearchFilterBar";
import { CrudPageLayout } from "@/components/common/CrudPageLayout";
import ActionButtons from "@/components/common/ActionButtons";
import Modal from "@/components/common/Modal";
import "react-datepicker/dist/react-datepicker.css";
import { deleteControl, fetchControls } from "@/services/controlsService";

const ControlPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedSearch(searchTerm);

  const [editingControl, setEditingControl] = useState<Controls | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [deletingControl, setDeletingControl] = useState<Controls | null>(null);
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
    data: controls,
    meta,
    loading,
    loadData,
    handleDelete,
    setMeta,
  } = useCrudPage<Controls>({
    fetchData: async (page, limit) => {
      const res: fetchControlResponse = await fetchControls(
        debouncedSearch,
        startDate?.toISOString(),
        endDate?.toISOString(),
        page,
        limit
      );
      return { data: res.controls, meta: res.meta };
    },
    deleteData: deleteControl,
  });
  useEffect(() => {
    loadData(1);
    setMeta((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, startDate, endDate]);

  const openAddModal = () => setShowModal(true);
  const openEditModal = (control: Controls) => {
    setEditingControl(control);
    setShowModal(true);
  };
  const closeModal = () => {
    setEditingControl(null);
    setShowModal(false);
  };

  const openDeleteModal = (control: Controls) => {
    setDeletingControl(control);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeletingControl(null);
    setShowDeleteModal(false);
  };
  const confirmDelete = async () => {
    if (deletingControl) {
      await handleDelete(deletingControl.id);
      closeDeleteModal();
    }
  };

  const columns = [
    {
      label: "No.",
      render: (_: any, i: number) => i + 1 + (meta.page - 1) * meta.limit,
    },
    { label: "Control Title", render: (row: Controls) => row.description },
    {
      label: "Category",
      render: (row: Controls) => row.category?.categoryname ?? "-",
    },
    {
      label: "Actions",
      render: (row: Controls) => (
        <ActionButtons
          viewPath={`/dashboard/admin/controls/${row.id}`}
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
          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
            <Box className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Controls</h1>
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
          addButton={{ label: "Add Control", onClick: openAddModal }}
        />
      </div>

      <CrudPageLayout
        data={controls}
        columns={columns}
        loading={loading}
        meta={meta}
        onPageChange={loadData}
      >
        <Modal isOpen={showModal} onClose={closeModal}>
          <ControlForm
            control={editingControl}
            onClose={closeModal}
            onSuccess={() => loadData(meta.page)}
          />
        </Modal>

        <DeleteModal
          isOpen={showDeleteModal}
          message={`Are you sure you want to delete "${deletingControl?.description}"?`}
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      </CrudPageLayout>
    </div>
  );
};

export default ControlPage;
