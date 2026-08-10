import React, { useState } from "react";
import { RegistrationRequest } from "../../types";

interface RejectReasonModalProps {
  request: RegistrationRequest | null;
  onClose: () => void;
  onConfirmReject: (id: string, reason: string) => void;
}

const QUICK_REASONS = [
  "Ảnh CCCD bị mờ / không rõ thông tin",
  "Thông tin đăng ký không khớp với CCCD",
  "Hồ sơ chưa đủ thông tin / Không đạt yêu cầu",
  "Số điện thoại hoặc Email không chính xác",
  "Ảnh CCCD hết hạn hoặc không hợp lệ",
];

export const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  request,
  onClose,
  onConfirmReject,
}) => {
  const [reason, setReason] = useState("Ảnh CCCD bị mờ / không rõ thông tin");

  if (!request) return null;

  const handleSelectQuickReason = (r: string) => {
    setReason(r);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirmReject(request.id, reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0] bg-[#FFF5F5]">
          <div className="flex items-center gap-2 text-[#93000a]">
            <span className="material-symbols-outlined text-[22px]">cancel</span>
            <h3 className="text-base font-bold">Từ chối Hồ sơ Đăng ký</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500">Đang xem xét hồ sơ của: </span>
            <span className="font-bold text-slate-800">{request.name}</span>
            <span className="text-slate-400 block text-[11px] mt-0.5">
              {request.email} • {request.phone}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Gợi ý lý do từ chối nhanh:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_REASONS.map((r, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuickReason(r)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border text-left transition-all cursor-pointer ${
                    reason === r
                      ? "bg-red-50 text-red-700 border-red-300 font-semibold shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Chi tiết lý do gửi phản hồi email <span className="text-red-500">*</span>:
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập cụ thể lý do để thông báo cho ứng viên..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-slate-800 resize-none"
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-xl flex items-start gap-2 text-[11px] text-blue-800">
            <span className="material-symbols-outlined text-[16px] text-blue-600 mt-0.5">mail</span>
            <span>
              Hệ thống sẽ tự động gửi email phản hồi thông báo lý do đến{" "}
              <strong className="font-semibold">{request.email}</strong>.
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={!reason.trim()}
              className="px-4 py-2 bg-[#DC2626] hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Xác nhận từ chối</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
