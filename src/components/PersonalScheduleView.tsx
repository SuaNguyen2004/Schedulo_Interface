import React, { useState } from "react";
import { ShiftRegistration, User } from "../types";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Building2,
  X,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Trash2,
  Users,
  Info,
  CalendarDays,
} from "lucide-react";

interface PersonalScheduleViewProps {
  shifts: ShiftRegistration[];
  currentUser: User;
  onNavigateToRegister: () => void;
  onCancelShift: (shiftId: string, reason: string) => void;
}

export const PersonalScheduleView: React.FC<PersonalScheduleViewProps> = ({
  shifts,
  currentUser,
  onNavigateToRegister,
  onCancelShift,
}) => {
  // Selected Shift Detail Modal
  const [selectedShift, setSelectedShift] = useState<ShiftRegistration | null>(null);

  // Cancel Confirmation Modal State
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>("");

  // Weekly Date Navigation Mock (Tuần 32: 03/08 - 09/08/2026)
  const weekDays = [
    { dateStr: "2026-08-03", dayLabel: "Thứ 2", shortDate: "03/08" },
    { dateStr: "2026-08-04", dayLabel: "Thứ 3", shortDate: "04/08" },
    { dateStr: "2026-08-05", dayLabel: "Thứ 4", shortDate: "05/08" },
    { dateStr: "2026-08-06", dayLabel: "Thứ 5", shortDate: "06/08" },
    { dateStr: "2026-08-07", dayLabel: "Thứ 6", shortDate: "07/08" },
    { dateStr: "2026-08-08", dayLabel: "Thứ 7", shortDate: "08/08" },
    { dateStr: "2026-08-09", dayLabel: "CN", shortDate: "09/08" },
  ];

  const shiftRows = [
    { id: "s1", name: "Ca Sáng", timeSlot: "08:00 - 12:00" },
    { id: "s2", name: "Ca Chiều", timeSlot: "13:30 - 17:30" },
  ];

  // Filter shifts belonging to current user
  const myShifts = shifts.filter(
    (s) =>
      s.userId === currentUser.id ||
      (s.teamMembers && s.teamMembers.includes(currentUser.fullName)),
  );

  const handleConfirmCancel = () => {
    if (selectedShift) {
      onCancelShift(selectedShift.id, cancelReason);
      setShowCancelModal(false);
      setSelectedShift(null);
      setCancelReason("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold text-indigo-600 uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4 inline" />
            <span>Thời khóa biểu cá nhân</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Lịch làm việc cá nhân
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Theo dõi, quản lý và điều chỉnh các ca làm việc đã đăng ký trong tuần.
          </p>
        </div>

        {/* Week Navigator & CTA */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button className="p-1.5 rounded-xl hover:bg-white text-slate-600 hover:shadow-xs transition-all cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-extrabold text-slate-800">
              Tuần 32: 03/08 - 09/08/2026
            </span>
            <button className="p-1.5 rounded-xl hover:bg-white text-slate-600 hover:shadow-xs transition-all cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onNavigateToRegister}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng ký ca mới</span>
          </button>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider w-36 border-r border-slate-200">
                  Khung ca
                </th>
                {weekDays.map((day) => {
                  const isToday = day.dateStr === "2026-08-04"; // Demo active day
                  return (
                    <th
                      key={day.dateStr}
                      className={`p-3 text-center border-r border-slate-200 last:border-r-0 ${
                        isToday ? "bg-indigo-50/80 text-indigo-950" : ""
                      }`}
                    >
                      <span className="block text-xs font-extrabold">{day.dayLabel}</span>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-0.5 ${
                          isToday ? "bg-indigo-600 text-white" : "text-slate-500"
                        }`}
                      >
                        {day.shortDate}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {shiftRows.map((shiftRow) => (
                <tr key={shiftRow.id} className="hover:bg-slate-50/30 transition-colors">
                  {/* Row Header */}
                  <td className="p-4 border-r border-slate-200 bg-slate-50/50">
                    <span className="block text-xs font-black text-slate-900">{shiftRow.name}</span>
                    <span className="inline-block px-2.5 py-0.5 mt-1.5 rounded-lg text-[10px] font-bold bg-indigo-100/70 text-indigo-900">
                      {shiftRow.timeSlot}
                    </span>
                  </td>

                  {/* Day Cells */}
                  {weekDays.map((day) => {
                    // Find shifts matching day & shift time
                    const cellShifts = myShifts.filter(
                      (s) =>
                        s.date === day.dateStr &&
                        s.shiftName === shiftRow.name &&
                        s.status !== "cancelled",
                    );

                    return (
                      <td
                        key={day.dateStr}
                        className="p-2.5 border-r border-slate-200 last:border-r-0 align-top min-h-[140px] h-36 hover:bg-slate-50/60 transition-colors"
                      >
                        {cellShifts.length > 0 ? (
                          <div className="space-y-2">
                            {cellShifts.map((shift) => {
                              const isPastShift = shift.date < "2026-08-04";
                              const isGreenTeam = shift.isTeamRegistration && !isPastShift;

                              return (
                                <div
                                  key={shift.id}
                                  onClick={() => setSelectedShift(shift)}
                                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all hover:scale-[1.02] shadow-xs ${
                                    shift.status === "in_progress"
                                      ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400/40"
                                      : isGreenTeam
                                        ? "bg-emerald-50/90 border-emerald-300 hover:border-emerald-400 hover:shadow-md"
                                        : shift.status === "approved" || isPastShift
                                          ? "bg-indigo-50/90 border-indigo-200 hover:border-indigo-400 hover:shadow-md"
                                          : "bg-slate-100 border-slate-300"
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span
                                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                                        isGreenTeam
                                          ? "text-emerald-900 bg-white/90 border-emerald-200"
                                          : "text-indigo-900 bg-white/90 border-indigo-200/80"
                                      }`}
                                    >
                                      {shift.roomName}
                                    </span>
                                    {shift.status === "in_progress" && (
                                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                                    )}
                                  </div>

                                  <p className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                                    {shift.taskDescription}
                                  </p>

                                  {shift.isTeamRegistration && (
                                    <div
                                      className={`mt-2 text-[10px] font-bold flex items-center space-x-1 px-2 py-0.5 rounded-md inline-flex ${
                                        isGreenTeam
                                          ? "text-emerald-800 bg-emerald-100/90 border border-emerald-200"
                                          : "text-indigo-800 bg-indigo-100/80 border border-indigo-200/80"
                                      }`}
                                    >
                                      <Users
                                        className={`w-3 h-3 inline ${isGreenTeam ? "text-emerald-700" : "text-indigo-600"}`}
                                      />
                                      <span>Đi nhóm ({shift.teamMembers?.length || 2} người)</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div
                            onClick={onNavigateToRegister}
                            className="h-full border-2 border-dashed border-slate-200/60 rounded-2xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex items-center justify-center cursor-pointer group p-2 text-center"
                          >
                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 flex items-center space-x-1">
                              <Plus className="w-3.5 h-3.5 inline" />
                              <span>Đăng ký</span>
                            </span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-medium">
          <div className="flex items-center space-x-5">
            <span className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-md bg-indigo-100 border border-indigo-300"></span>
              <span className="font-bold text-slate-700">Ca đã đăng ký</span>
            </span>
            <span className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-md bg-amber-100 border border-amber-300"></span>
              <span className="font-bold text-slate-700">Ca đang diễn ra</span>
            </span>
            <span className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-md bg-emerald-100 border border-emerald-300"></span>
              <span className="font-bold text-slate-700">Đăng ký theo Nhóm</span>
            </span>
          </div>

          <p className="text-[11px] text-slate-500 italic font-medium">
            *Nhấp vào thẻ ca làm việc để xem chi tiết hoặc thực hiện hủy ca.
          </p>
        </div>
      </div>

      {/* Shift Detail Side Sheet / Modal */}
      {selectedShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-7 shadow-2xl border border-slate-200 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-black text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
                    Mã ca: {selectedShift.id}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">Chi tiết ca làm việc</h3>
                </div>
                <button
                  onClick={() => setSelectedShift(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Trạng thái ca:</span>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã đăng ký thành công</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Phòng làm việc:</span>
                    <span className="text-xs font-extrabold text-slate-900 flex items-center space-x-1.5">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      <span>{selectedShift.roomName}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Thời gian & Ca:</span>
                    <span className="text-xs font-extrabold text-slate-900 flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span>
                        {selectedShift.date} ({selectedShift.shiftName}: {selectedShift.timeSlot})
                      </span>
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                    Nội dung công việc dự kiến khai báo
                  </h4>
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 leading-relaxed shadow-xs">
                    {selectedShift.taskDescription ||
                      "Hỗ trợ công tác chuyên môn và kỹ thuật phòng máy."}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                    Đồng nghiệp / Thành viên nhóm cùng làm ca này
                  </h4>
                  <div className="space-y-2">
                    {(
                      selectedShift.teamMembers || [
                        currentUser.fullName,
                        "Trần Thị B (Đội Kỹ Thuật)",
                        "Lê Văn C (Đội Kỹ Thuật)",
                      ]
                    ).map((member, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-[10px]">
                            {member.charAt(0)}
                          </div>
                          <span>{member}</span>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          Cùng ca
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/80 space-y-2.5">
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs rounded-2xl transition-colors flex items-center justify-center space-x-2 cursor-pointer border border-red-200"
              >
                <Trash2 className="w-4 h-4" />
                <span>HỦY CA LÀM VIỆC</span>
              </button>

              <button
                onClick={() => setSelectedShift(null)}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelModal && selectedShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Xác nhận Hủy Ca Làm Việc</h3>
                <p className="text-xs font-semibold text-slate-500">
                  Ca: {selectedShift.shiftName} - {selectedShift.date}
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] font-bold text-amber-900 flex items-start space-x-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Lưu ý: Yêu cầu hủy ca phải được thực hiện trước ít nhất 2 tiếng so với giờ bắt đầu
                ca làm.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nhập lý do hủy ca làm việc (bắt buộc) *
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ví dụ: Có lịch đột xuất tại trường học / Sự cố cá nhân..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-xs text-slate-800 placeholder-slate-400"
                required
              ></textarea>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={handleConfirmCancel}
                disabled={!cancelReason.trim()}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Xác nhận Hủy Ca
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
