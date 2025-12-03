"use client";

import { useState, useEffect } from "react";
import { fetchUserResponse, User } from "@/types/types";
import { downloadPdf, getPdfResponse } from "@/services/adminServices";

import SearchFilterBar from "@/components/common/SearchFilterBar";
import { CrudPageLayout } from "@/components/common/CrudPageLayout";
import ActionButtons from "@/components/common/ActionButtons";
import Modal from "@/components/common/Modal";
import DeleteModal from "@/components/modal/DeleteModal";

import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { useDateFilter } from "@/hooks/useDateFilter";
import { useCrudPage } from "@/hooks/useCrudPage";

import { User as UserIcon } from "lucide-react";
import UsersForm from "@/components/form/UsersForm";
import { deleteUser, fetchUsers } from "@/services/userService";

const UserListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedSearch(searchTerm);
  const [showModal, setShowModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
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
    data: users,
    meta,
    loading,
    loadData,
    handleDelete,
    setMeta,
  } = useCrudPage<User>({
    fetchData: async (page, limit) => {
      const res: fetchUserResponse = await fetchUsers(
        debouncedSearch,
        startDate?.toISOString(),
        endDate?.toISOString(),
        page,
        limit
      );
      return { data: res.users, meta: res.meta };
    },
    deleteData: deleteUser,
  });

  useEffect(() => {
    loadData(1);
    setMeta((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, startDate, endDate]);

  const openAddModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
  };

  const openDeleteModal = (user: User) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeletingUser(null);
    setShowDeleteModal(false);
  };
  const confirmDelete = async () => {
    if (deletingUser) {
      await handleDelete(deletingUser.id);
      closeDeleteModal();
    }
  };

  const handleDownload = async (id: number) => {
    const res = await getPdfResponse(id);
    const pdfGeneration = await downloadPdf(res);
    console.log("pdf generation", pdfGeneration);
  };
  const columns = [
    {
      label: "No.",
      render: (_: any, i: number) => i + 1 + (meta.page - 1) * meta.limit,
    },
    {
      label: "Name",
      render: (row: User) => `${row.firstname} ${row.lastname}`,
    },
    { label: "Email", render: (row: User) => row.email },
    { label: "Transaction", render: (row: User) => row.subscriptionStatus },
    {
      label: "Company",
      render: (row: User) => row.companyname || "-",
    },
    {
      label: "Actions",
      render: (row: User) => (
        <ActionButtons
          viewPath={`/dashboard/admin/userList/${row.id}`}
          onDelete={() => openDeleteModal(row)}
          extraActions={
            <button
              onClick={() => handleDownload(row.id)}
              className="p-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Download
            </button>
          }
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-rose-100 rounded flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-rose-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Users</h1>
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
          addButton={{ label: "Invite User", onClick: openAddModal }}
        />
      </div>

      <CrudPageLayout
        data={users}
        columns={columns}
        loading={loading}
        meta={meta}
        onPageChange={loadData}
      >
        <Modal isOpen={showModal} onClose={closeModal}>
          <UsersForm
            onClose={closeModal}
            onSuccess={() => loadData(meta.page)}
          />
        </Modal>

        <DeleteModal
          isOpen={showDeleteModal}
          message={`Are you sure you want to delete "${deletingUser?.firstname}"?`}
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      </CrudPageLayout>
    </div>
  );
};

export default UserListPage;
