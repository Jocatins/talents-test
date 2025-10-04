import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  FileText,
  Calendar,
  User,
  Trash2,
  Eye,
  Edit3,
} from "lucide-react";
import type { AppDispatch, RootState } from "./store/store";
import { fetchKnowledgeEntries, deleteKnowledgeEntry } from "./store/thunk";
import CustomButton from "./components/CustomButton";
import FormDialog from "./components/FormDialog";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { entries, loading, error, deleteLoading } = useSelector(
    (state: RootState) => state.knowledge
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateEntry = (formData: any) => {
    console.log("Creating entry with:", formData);
  };

  // Delete handler function
  const handleDeleteEntry = async (id: string) => {
    try {
      await dispatch(deleteKnowledgeEntry(id)).unwrap();
      console.log("Entry deleted successfully");
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  // Quick delete with confirmation
  const handleQuickDelete = (id: string, title: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    ) {
      handleDeleteEntry(id);
    }
  };

  useEffect(() => {
    dispatch(fetchKnowledgeEntries());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Show loading state
  if (loading && entries.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3182CE] mx-auto mb-4"></div>
              <p className="text-[#718096]">Loading knowledge entries...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-2">Error</div>
              <p className="text-[#718096]">{error}</p>
              <button
                onClick={() => dispatch(fetchKnowledgeEntries())}
                className="mt-4 bg-[#3182CE] text-white px-4 py-2 rounded-lg hover:bg-[#2C5AA0] transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#F8FAFC] p-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h1 className="text-[32px] font-semibold text-[#1A202C] leading-[38px] tracking-[-0.02em] mb-2">
                  Knowledge Base
                </h1>
                <p className="text-[#718096] text-[16px] leading-[24px]">
                  Manage and organize your technical team
                </p>
              </div>

              <CustomButton
                label="Create New Technician"
                icon={<Plus size={20} />}
                onClick={() => navigate("/create")}
              />
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px] mb-8">
            <div className="bg-white rounded-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)] border border-[#E2E8F0] p-[24px]">
              <div className="flex items-center gap-[16px]">
                <div className="bg-[#EBF8FF] p-[12px] rounded-[8px]">
                  <FileText size={24} className="text-[#3182CE]" />
                </div>
                <div>
                  <p className="text-[30px] font-semibold text-[#1A202C] leading-[36px]">
                    {entries.length}
                  </p>
                  <p className="text-[#718096] text-[14px] leading-[20px]">
                    Total Entries
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)] border border-[#E2E8F0] p-[24px]">
              <div className="flex items-center gap-[16px]">
                <div className="bg-[#F0FFF4] p-[12px] rounded-[8px]">
                  <FileText size={24} className="text-[#38A169]" />
                </div>
                <div>
                  <p className="text-[30px] font-semibold text-[#1A202C] leading-[36px]">
                    {entries.filter((e) => e.status === "certified").length}
                  </p>
                  <p className="text-[#718096] text-[14px] leading-[20px]">
                    Certified
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)] border border-[#E2E8F0] p-[24px]">
              <div className="flex items-center gap-[16px]">
                <div className="bg-[#FFFAF0] p-[12px] rounded-[8px]">
                  <FileText size={24} className="text-[#DD6B20]" />
                </div>
                <div>
                  <p className="text-[30px] font-semibold text-[#1A202C] leading-[36px]">
                    {entries.filter((e) => e.status === "training").length}
                  </p>
                  <p className="text-[#718096] text-[14px] leading-[20px]">
                    trainings
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Knowledge Entries List */}
          <div className="bg-white rounded-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)] border border-[#E2E8F0] overflow-hidden">
            <div className="p-[24px] border-b border-[#E2E8F0]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[16px]">
                <h2 className="text-[18px] font-semibold text-[#1A202C] leading-[28px]">
                  Technicians Available
                  <span className="text-[#718096] font-normal ml-[8px]">
                    ({entries.length})
                  </span>
                </h2>

                <div className="flex items-center gap-[8px] text-[14px] text-[#718096] leading-[20px]">
                  <span>Showing all {entries.length} entries</span>
                </div>
              </div>
            </div>

            {/* Entries List */}
            <div className="divide-y divide-[#F7FAFC]">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-[24px] hover:bg-[#F7FAFC] transition-all duration-200 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-[24px]">
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-[8px] mb-[12px]">
                        <span
                          className={`px-[12px] py-[4px] rounded-[6px] text-[12px] font-medium leading-[16px] border ${
                            entry.status === "certified"
                              ? "bg-[#F0FFF4] text-[#276749] border-[#C6F6D5]"
                              : "bg-[#FFFAF0] text-[#C05621] border-[#FEEBC8]"
                          }`}
                        >
                          {entry.status.charAt(0).toUpperCase() +
                            entry.status.slice(1)}
                        </span>
                        <span
                          className={`px-[12px] py-[4px] rounded-[6px] text-[12px] font-medium leading-[16px] ${
                            entry.category === "Development"
                              ? "bg-[#EBF8FF] text-[#2C5AA0]"
                              : entry.category === "Design"
                              ? "bg-[#FAF5FF] text-[#6B46C1]"
                              : "bg-[#FFFAF0] text-[#C05621]"
                          }`}
                        >
                          {entry.category}
                        </span>
                        <span className="text-[14px] text-[#718096] leading-[20px]">
                          {entry.prodTime}
                        </span>
                      </div>

                      <h3 className="font-semibold text-[#1A202C] text-[18px] leading-[28px] mb-[8px] group-hover:text-[#2D3748] transition-colors">
                        {entry.title}
                      </h3>

                      <p className="text-[#718096] text-[14px] leading-[20px] mb-[16px]">
                        {entry.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-[24px] text-[14px] text-[#718096] leading-[20px]">
                        <div className="flex items-center gap-[8px]">
                          <User size={16} className="text-[#A0AEC0]" />
                          <span className="text-[14px] text-[#718096] leading-[20px]">
                            {entry.techName}
                          </span>
                        </div>
                        <div className="flex items-center gap-[8px]">
                          <Calendar size={16} className="text-[#A0AEC0]" />
                          <span>{formatDate(entry.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-[8px]">
                          <Eye size={16} className="text-[#A0AEC0]" />
                          {/* <span>{entry.views.toLocaleString()} views</span> */}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-[12px] lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button
                        className="flex items-center gap-[8px] px-[16px] py-[8px] text-[14px] leading-[20px] bg-[#3182CE] text-white rounded-[6px] hover:bg-[#2C5AA0] transition-colors font-medium"
                        onClick={() => navigate(`/edit/${entry.id}`)}
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleQuickDelete(entry.id, entry.title)}
                        disabled={deleteLoading}
                        className="flex items-center justify-center w-[40px] h-[40px] border border-[#E2E8F0] rounded-[6px] hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50"
                      >
                        <Trash2
                          size={16}
                          className="text-[#718096] hover:text-red-500 transition-colors"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {entries.length === 0 && (
              <div className="p-[64px] text-center">
                <FileText
                  className="mx-auto text-[#E2E8F0] mb-[16px]"
                  size={48}
                />
                <h3 className="text-[18px] font-semibold text-[#1A202C] leading-[28px] mb-[8px]">
                  No entries found
                </h3>
                <p className="text-[#718096] text-[14px] leading-[20px] mb-[24px] max-w-sm mx-auto">
                  Get started by creating your first knowledge entry
                </p>
                <CustomButton
                  label="Create New Entry"
                  icon={<Plus size={20} />}
                  onClick={() => navigate("/create")}
                />
              </div>
            )}
          </div>
        </div>
        <FormDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateEntry}
        />
      </div>
    </>
  );
};

export default Dashboard;
