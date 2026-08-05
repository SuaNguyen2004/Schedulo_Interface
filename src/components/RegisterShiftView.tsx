import React, { useState } from "react";
import { Room, ShiftConfig, ShiftRegistration, User, Team } from "../types";
import {
  Calendar as CalendarIcon,
  Clock,
  Building2,
  Users,
  ArrowRight,
  Info,
  Check,
  UserCheck,
  AlertCircle,
} from "lucide-react";

interface RegisterShiftViewProps {
  rooms: Room[];
  shiftConfigs: ShiftConfig[];
  currentUser: User;
  userTeams: Team[];
  onRegister: (newShift: ShiftRegistration) => void;
  onNavigateToSchedule: () => void;
}

export const RegisterShiftView: React.FC<RegisterShiftViewProps> = ({
  rooms,
  currentUser,
  userTeams,
  onRegister,
  onNavigateToSchedule,
}) => {
  // Form State
  const [selectedDate, setSelectedDate] = useState<string>("2026-08-05");
  const [selectedShiftId, setSelectedShiftId] = useState<string>("s1");
  const [selectedRoomId, setSelectedRoomId] = useState<string>("r1");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [isTeamRegistration, setIsTeamRegistration] = useState<boolean>(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([currentUser.fullName]);

  // Inline Toast Error State
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Available team members
  const currentTeam = userTeams.find((t) => t.id === currentUser.teamId) || userTeams[0];
  const teamMemberList = currentTeam
    ? currentTeam.members
    : [
        { id: "u1", fullName: "Nguyễn Văn A", phone: "+84 912 345 678", role: "leader" as const },
        { id: "u2", fullName: "Trần Thị B", phone: "+84 987 654 321", role: "member" as const },
        { id: "u3", fullName: "Lê Văn C", phone: "+84 903 112 233", role: "member" as const },
        { id: "u4", fullName: "Phạm Thị D", phone: "+84 918 888 999", role: "member" as const },
      ];

  const toggleTeamMember = (memberName: string) => {
    if (selectedTeamMembers.includes(memberName)) {
      if (selectedTeamMembers.length > 1) {
        setSelectedTeamMembers(selectedTeamMembers.filter((m) => m !== memberName));
      }
    } else {
      setSelectedTeamMembers([...selectedTeamMembers, memberName]);
    }
  };

  // Fixed 2 Shifts strictly per prompt requirement: Ca Sáng & Ca Chiều ONLY (No Evening Shift)
  const availableShifts = [
    {
      id: "s1",
      name: "Ca Sáng (08:00 - 12:00)",
      timeSlot: "08:00 - 12:00",
      maxCollaborators: 10,
      remainingSlots: 4,
      totalSlots: 10,
      badge: "Sức chứa còn lại: 4/10 chỗ",
    },
    {
      id: "s2",
      name: "Ca Chiều (13:30 - 17:30)",
      timeSlot: "13:30 - 17:30",
      maxCollaborators: 10,
      remainingSlots: 5,
      totalSlots: 10,
      badge: "Sức chứa còn lại: 5/10 chỗ",
    },
  ];

  const selectedShift = availableShifts.find((s) => s.id === selectedShiftId) || availableShifts[0];
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorToast(null);

    // 1. Validate inputs
    if (!selectedDate || selectedDate.trim() === "") {
      setErrorToast("Vui lòng chọn ngày đi làm!");
      return;
    }
    if (!selectedShiftId || !selectedShift) {
      setErrorToast("Vui lòng chọn ca làm việc (Ca Sáng hoặc Ca Chiều)!");
      return;
    }
    if (!selectedRoomId || !selectedRoom) {
      setErrorToast("Vui lòng chọn phòng làm việc!");
      return;
    }
    if (!taskDescription || taskDescription.trim() === "") {
      setErrorToast("Vui lòng nhập nội dung công việc dự kiến!");
      return;
    }

    // 2. Build payload
    const newRegistration: ShiftRegistration = {
      id: "sr_" + Date.now(),
      userId: currentUser.id,
      userName: currentUser.fullName,
      userPhone: currentUser.phone,
      date: selectedDate,
      shiftId: selectedShift.id,
      shiftName: selectedShift.id === "s1" ? "Ca Sáng" : "Ca Chiều",
      timeSlot: selectedShift.timeSlot,
      roomId: selectedRoom ? selectedRoom.id : "r1",
      roomName: selectedRoom ? selectedRoom.name : "Phòng Lab 101",
      taskDescription: taskDescription.trim(),
      isTeamRegistration: isTeamRegistration,
      teamMembers: isTeamRegistration ? selectedTeamMembers : [currentUser.fullName],
      status: "approved",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    // 3. Persist & Navigate
    onRegister(newRegistration);
    onNavigateToSchedule();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Title & Subtitle Banner - Clean Header UI */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Đăng ký ca làm việc</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Điền đầy đủ các thông tin theo 4 bước để hoàn tất việc đăng ký lịch làm việc trên
            Schedulo.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs font-bold text-indigo-700">
          <UserCheck className="w-4 h-4 text-indigo-600" />
          <span>CTV: {currentUser.fullName || "Nguyễn Văn A"}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bước 1: Chọn ngày đi làm */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-indigo-600/30">
              1
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Bước 1: Chọn ngày đi làm</h2>
              <p className="text-xs text-slate-500 font-medium">
                Chọn ngày đăng ký đi làm việc theo định dạng dd/mm/yyyy
              </p>
            </div>
          </div>

          <div className="max-w-md pt-2">
            <label className="block text-xs font-black text-slate-700 mb-2">
              Ngày đi làm (Date Picker) *
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setErrorToast(null);
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm font-bold text-slate-900 shadow-xs cursor-pointer"
                required
              />
              <CalendarIcon className="w-5 h-5 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center space-x-1 font-medium">
              <Info className="w-3.5 h-3.5 text-indigo-600 inline shrink-0" />
              <span>
                Định dạng hiển thị:{" "}
                <strong>
                  {selectedDate ? selectedDate.split("-").reverse().join("/") : "dd/mm/yyyy"}
                </strong>
              </span>
            </p>
          </div>
        </div>

        {/* Bước 2: Chọn ca làm việc */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-indigo-600/30">
              2
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Bước 2: Chọn ca làm việc</h2>
              <p className="text-xs text-slate-500 font-medium">
                Chỉ áp dụng 2 ca cố định quy định sẵn bởi hệ thống
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {availableShifts.map((shift) => {
              const isSelected = selectedShiftId === shift.id;
              return (
                <div
                  key={shift.id}
                  onClick={() => {
                    setSelectedShiftId(shift.id);
                    setErrorToast(null);
                  }}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/40 shadow-md ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold ${
                          isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Clock className="w-5 h-5" />
                      </div>
                      <span className="font-extrabold text-sm text-slate-900">{shift.name}</span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-black text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-xl">
                      {shift.badge}
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase">
                      Cố định
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bước 3: Chọn phòng làm việc */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-indigo-600/30">
              3
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Bước 3: Chọn phòng làm việc
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Chọn phòng máy/khu vực có sẵn sức chứa thích hợp
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {rooms.map((room) => {
              const isSelected = selectedRoomId === room.id;
              const isMaintenance = room.status === "maintenance";

              return (
                <div
                  key={room.id}
                  onClick={() => {
                    if (!isMaintenance) {
                      setSelectedRoomId(room.id);
                      setErrorToast(null);
                    }
                  }}
                  className={`p-4 rounded-3xl border-2 transition-all ${
                    isMaintenance
                      ? "border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed"
                      : isSelected
                        ? "border-indigo-600 bg-indigo-50/40 shadow-md ring-2 ring-indigo-500/20 cursor-pointer"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                      <Building2
                        className={`w-4 h-4 ${isSelected ? "text-indigo-600" : "text-slate-400"}`}
                      />
                      <span>{room.name}</span>
                    </span>

                    {isMaintenance ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                        Bảo trì
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Hoạt động
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-3 font-medium">
                    {room.description}
                  </p>

                  <div className="text-[11px] font-semibold text-slate-600 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500">
                      Vị trí:{" "}
                      <strong className="text-slate-800">{room.location || "Tầng 1"}</strong>
                    </span>
                    <span className="text-indigo-700 font-black bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                      Sức chứa: {room.capacity} CTV
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bước 4: Khai báo nội dung công việc dự kiến */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-indigo-600/30">
              4
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Bước 4: Khai báo nội dung công việc dự kiến
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Khai báo công việc cụ thể và tùy chọn đăng ký theo Nhóm chuyên môn
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-black text-slate-800 mb-2">
                Nội dung công việc dự kiến <span className="text-red-500">* (Bắt buộc)</span>
              </label>
              <textarea
                rows={4}
                value={taskDescription}
                onChange={(e) => {
                  setTaskDescription(e.target.value);
                  setErrorToast(null);
                }}
                placeholder="Nhập nội dung công việc chi tiết bạn hoặc nhóm sẽ thực hiện trong ca làm việc..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 shadow-xs"
                required
              ></textarea>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isTeamRegistration}
                  onChange={(e) => setIsTeamRegistration(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded-lg border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-extrabold text-slate-900">
                    Đăng ký cho Nhóm chuyên môn ({currentTeam?.name || "Đội Kỹ Thuật"})
                  </span>
                </div>
              </label>

              {isTeamRegistration && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 animate-in fade-in duration-150">
                  <p className="text-xs font-bold text-slate-700 mb-2">
                    Tích chọn các thành viên đi làm cùng trong ca này:
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {teamMemberList.map((member) => {
                      const isChecked = selectedTeamMembers.includes(member.fullName);
                      return (
                        <label
                          key={member.id}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? "bg-indigo-50/80 border-indigo-300 text-indigo-950 font-bold"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleTeamMember(member.fullName)}
                              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                            />
                            <span className="text-xs font-medium">{member.fullName}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-extrabold bg-slate-100 px-2.5 py-1 rounded-md">
                            {member.role === "leader" ? "Trưởng nhóm" : "Thành viên"}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Inline Toast Error if validation fails */}
        {errorToast && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorToast}</span>
          </div>
        )}

        {/* Action Button: "XÁC NHẬN ĐĂNG KÝ LỊCH" */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-3 cursor-pointer group"
          >
            <span>XÁC NHẬN ĐĂNG KÝ LỊCH</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
};
