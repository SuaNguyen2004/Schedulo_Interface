import React, { useState } from "react";
import { RegistrationRequest } from "../../types";
import { RejectReasonModal } from "../Modals/RejectReasonModal";

interface RequestsScreenProps {
  requests: RegistrationRequest[];
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string, reason?: string) => void;
  onViewRequestDetail: (req: RegistrationRequest) => void;
}

export const RequestsScreen: React.FC<RequestsScreenProps> = ({
  requests,
  onApproveRequest,
  onRejectRequest,
  onViewRequestDetail,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rejectingRequest, setRejectingRequest] = useState<RegistrationRequest | null>(null);
  const itemsPerPage = 10;

  // Filter requests (only show pending 'Chờ duyệt' requests)
  const filteredRequests = requests.filter((req) => {
    const isPending = !req.status || req.status === "Chờ duyệt";
    const matchesSearch =
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.phone.includes(searchTerm);

    return isPending && matchesSearch;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const handleResetFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1b1e] tracking-tight">Yêu cầu đăng ký</h2>
          <p className="text-sm text-[#44474e] mt-1">
            Tổng số <span className="font-semibold text-[#1a1b1e]">{requests.length}</span> yêu cầu
            đăng ký
          </p>
        </div>
      </div>

      {/* Toolbar Section */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search */}
          <div className="md:col-span-10 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#44474e]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo họ tên, email, sđt..."
              className="w-full pl-10 pr-4 py-2 h-[40px] border border-[#E2E8F0] rounded text-sm bg-white text-[#1a1b1e] focus:border-[#1b365d] focus:ring-1 focus:ring-[#1b365d] outline-none"
            />
          </div>

          {/* Reset Action */}
          <div className="md:col-span-2 flex items-center justify-end">
            <button
              onClick={handleResetFilters}
              className="text-[#44474e] hover:text-[#1b365d] font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              <span>Đặt lại</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="py-3 px-4 text-xs font-semibold text-[#44474e] uppercase tracking-wider w-16">
                  STT
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#44474e] uppercase tracking-wider">
                  Họ và tên
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#44474e] uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#44474e] uppercase tracking-wider">
                  Ngày gửi
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#44474e] uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#74777f] text-sm">
                    Không tìm thấy yêu cầu đăng ký phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                currentItems.map((req, index) => (
                  <tr
                    key={req.id}
                    className="hover:bg-[#f4f3f7] transition-colors group cursor-default"
                  >
                    <td className="py-3.5 px-4 text-sm text-[#44474e]">{startIndex + index + 1}</td>
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => onViewRequestDetail(req)}
                        className="inline-flex items-center gap-3 cursor-pointer group/name transition-colors"
                        title="Bấm để xem chi tiết hồ sơ đăng ký CTV"
                      >
                        <div className="w-9 h-9 rounded-full bg-[#aec7f7] text-[#2e476f] flex items-center justify-center font-bold text-xs shrink-0 group-hover/name:ring-2 group-hover/name:ring-[#1b365d]/20">
                          {req.initials || req.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#1b365d] group-hover/name:underline">
                            {req.name}
                          </div>
                          <div className="text-xs text-[#44474e]">{req.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-[#1a1b1e] font-medium">{req.phone}</td>
                    <td className="py-3.5 px-4 text-sm text-[#44474e]">{req.submittedAt}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        {req.status === "Chờ duyệt" && (
                          <>
                            <button
                              onClick={() => onApproveRequest(req.id)}
                              className="p-1.5 text-[#16A34A] hover:bg-[#c7ecc7] rounded transition-colors cursor-pointer"
                              title="Duyệt hồ sơ"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                check_circle
                              </span>
                            </button>
                            <button
                              onClick={() => setRejectingRequest(req)}
                              className="p-1.5 text-[#DC2626] hover:bg-[#ffdad6] rounded transition-colors cursor-pointer"
                              title="Từ chối hồ sơ (Nhập lý do)"
                            >
                              <span className="material-symbols-outlined text-[20px]">cancel</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-[#E2E8F0] bg-white">
          <div className="text-sm text-[#44474e]">
            Hiển thị{" "}
            <span className="font-semibold text-[#1a1b1e]">
              {filteredRequests.length > 0 ? startIndex + 1 : 0}
            </span>{" "}
            đến{" "}
            <span className="font-semibold text-[#1a1b1e]">
              {Math.min(startIndex + itemsPerPage, filteredRequests.length)}
            </span>{" "}
            trong <span className="font-semibold text-[#1a1b1e]">{filteredRequests.length}</span>{" "}
            yêu cầu
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="w-8 h-8 flex items-center justify-center rounded border border-[#E2E8F0] text-[#44474e] hover:bg-[#f4f3f7] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 flex items-center justify-center rounded text-xs font-semibold transition-colors cursor-pointer ${
                  currentPage === pageNum
                    ? "bg-[#1b365d] text-white"
                    : "border border-[#E2E8F0] text-[#44474e] hover:bg-[#f4f3f7]"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="w-8 h-8 flex items-center justify-center rounded border border-[#E2E8F0] text-[#44474e] hover:bg-[#f4f3f7] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reject Reason Modal */}
      {rejectingRequest && (
        <RejectReasonModal
          request={rejectingRequest}
          onClose={() => setRejectingRequest(null)}
          onConfirmReject={(id, reason) => {
            onRejectRequest(id, reason);
            setRejectingRequest(null);
          }}
        />
      )}
    </div>
  );
};
