import React, { useState } from "react";
import { Room, ShiftConfig } from "../types";
import {
  Building2,
  Clock,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Wrench,
  Info,
  X,
  SlidersHorizontal,
  Save,
  AlertTriangle,
  Sliders,
  Check,
  Calendar,
  Users,
} from "lucide-react";

interface SystemConfigViewProps {
  rooms: Room[];
  shiftConfigs: ShiftConfig[];
  onAddRoom: (newRoom: Room) => void;
  onUpdateRoomStatus: (roomId: string, status: "active" | "maintenance") => void;
  onAddShiftConfig: (newShift: ShiftConfig) => void;
}

export const SystemConfigView: React.FC<SystemConfigViewProps> = ({
  rooms,
  shiftConfigs,
  onAddRoom,
  onUpdateRoomStatus,
  onAddShiftConfig,
}) => {
  const [activeTab, setActiveTab] = useState<"rooms" | "shifts">("rooms");
  const [roomSearchQuery, setRoomSearchQuery] = useState<string>("");

  // Local state for rooms list so edits reflect dynamically
  const [roomsList, setRoomsList] = useState<Room[]>(rooms);
  // Local state for shift configs so time adjustments reflect dynamically (strictly filtering out Ca Tối)
  const [shiftsList, setShiftsList] = useState<ShiftConfig[]>(() =>
    shiftConfigs.filter(
      (s) => s.id !== "s3" && s.type !== "evening" && !s.name.toLowerCase().includes("tối"),
    ),
  );

  // Modals
  const [showAddRoomModal, setShowAddRoomModal] = useState<boolean>(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingShift, setEditingShift] = useState<ShiftConfig | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // New Room Form State
  const [newRoomName, setNewRoomName] = useState<string>("");
  const [newRoomCap, setNewRoomCap] = useState<number>(10);
  const [newRoomDesc, setNewRoomDesc] = useState<string>("");
  const [newRoomLoc, setNewRoomLoc] = useState<string>("Tầng 1 - Tòa A");

  // Edit Room Form State
  const [editRoomName, setEditRoomName] = useState<string>("");
  const [editRoomCap, setEditRoomCap] = useState<number>(10);
  const [editRoomDesc, setEditRoomDesc] = useState<string>("");
  const [editRoomLoc, setEditRoomLoc] = useState<string>("");

  // Shift Edit State
  const [editShiftStart, setEditShiftStart] = useState<string>("");
  const [editShiftEnd, setEditShiftEnd] = useState<string>("");
  const [editShiftMax, setEditShiftMax] = useState<number>(10);

  // Handle Add Room
  const handleAddRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName) return;

    const created: Room = {
      id: "r_" + Date.now(),
      name: newRoomName,
      capacity: newRoomCap,
      description: newRoomDesc || "Phòng làm việc mới với trang thiết bị chuẩn.",
      status: "active",
      location: newRoomLoc || "Tầng 1 - Tòa A",
    };

    onAddRoom(created);
    setRoomsList((prev) => [...prev, created]);
    setShowAddRoomModal(false);
    showToast(`Đã thêm phòng mới: "${newRoomName}"`);
    setNewRoomName("");
    setNewRoomDesc("");
    setNewRoomCap(10);
  };

  // Open Edit Room Modal
  const openEditRoomModal = (room: Room) => {
    setEditingRoom(room);
    setEditRoomName(room.name);
    setEditRoomCap(room.capacity);
    setEditRoomDesc(room.description || "");
    setEditRoomLoc(room.location || "Tầng 1 - Tòa A");
  };

  // Save Room Edit
  const handleSaveRoomEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    setRoomsList((prev) =>
      prev.map((r) =>
        r.id === editingRoom.id
          ? {
              ...r,
              name: editRoomName,
              capacity: editRoomCap,
              description: editRoomDesc,
              location: editRoomLoc,
            }
          : r,
      ),
    );

    showToast(`Đã cập nhật thông tin phòng "${editRoomName}"`);
    setEditingRoom(null);
  };

  // Toggle Room Status
  const handleToggleRoomStatus = (room: Room) => {
    const nextStatus = room.status === "active" ? "maintenance" : "active";
    onUpdateRoomStatus(room.id, nextStatus);
    setRoomsList((prev) => prev.map((r) => (r.id === room.id ? { ...r, status: nextStatus } : r)));
    showToast(
      `Đã chuyển trạng thái phòng ${room.name} sang ${nextStatus === "active" ? "Hoạt động" : "Bảo trì"}`,
    );
  };

  // Open Edit Shift Modal
  const openEditShiftModal = (shift: ShiftConfig) => {
    setEditingShift(shift);
    setEditShiftStart(shift.startTime);
    setEditShiftEnd(shift.endTime);
    setEditShiftMax(shift.maxCollaborators);
  };

  // Save Shift Time Adjustments
  const handleSaveShiftEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShift) return;

    setShiftsList((prev) =>
      prev.map((s) =>
        s.id === editingShift.id
          ? {
              ...s,
              startTime: editShiftStart,
              endTime: editShiftEnd,
              maxCollaborators: editShiftMax,
            }
          : s,
      ),
    );

    showToast(
      `Đã cập nhật khung giờ cho ${editingShift.name} (${editShiftStart} - ${editShiftEnd})`,
    );
    setEditingShift(null);
  };

  // Inline Quick Shift Time Change
  const handleQuickShiftTimeChange = (
    shiftId: string,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setShiftsList((prev) => prev.map((s) => (s.id === shiftId ? { ...s, [field]: value } : s)));
  };

  const filteredRooms = roomsList.filter(
    (r) =>
      r.name.toLowerCase().includes(roomSearchQuery.toLowerCase()) ||
      r.location?.toLowerCase().includes(roomSearchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(roomSearchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center space-x-2 animate-in slide-in-from-top-4 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Page Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-indigo-600 uppercase tracking-wider mb-1">
            <SlidersHorizontal className="w-4 h-4 inline" />
            <span>Highlights UC-2.1 • Quản trị hệ thống Schedulo</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Cấu hình Khung làm việc & Danh mục Phòng
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Thiết lập các tham số làm việc cố định cho hệ thống Schedulo
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex items-center p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("rooms")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === "rooms"
                ? "bg-white text-indigo-700 shadow-md shadow-indigo-600/10"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Danh mục Phòng/Khu vực ({roomsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("shifts")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === "shifts"
                ? "bg-white text-indigo-700 shadow-md shadow-indigo-600/10"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Cấu hình Khung ca làm việc ({shiftsList.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Danh mục Phòng/Khu vực */}
      {activeTab === "rooms" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Top Bar for Tab 1: Search & "+ Thêm phòng mới" Button */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={roomSearchQuery}
                onChange={(e) => setRoomSearchQuery(e.target.value)}
                placeholder="Tìm theo tên phòng, vị trí..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Top Right Button: "+ Thêm phòng mới" */}
            <button
              onClick={() => setShowAddRoomModal(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-xs rounded-2xl shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm phòng mới</span>
            </button>
          </div>

          {/* Rooms Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                  <th className="py-4 px-6">Tên phòng</th>
                  <th className="py-4 px-6">Sức chứa tối đa / ca</th>
                  <th className="py-4 px-6">Mô tả & Vị trí</th>
                  <th className="py-4 px-6">Trạng thái</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {filteredRooms.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">
                      Không tìm thấy phòng làm việc phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Room Name */}
                      <td className="py-4 px-6 font-extrabold text-slate-900">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 text-xs">{room.name}</p>
                            <span className="text-[10px] text-indigo-600 font-bold">
                              ID: {room.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Max Capacity per Shift */}
                      <td className="py-4 px-6">
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-100 rounded-xl border border-slate-200">
                          <Users className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="font-black text-slate-900">
                            {room.capacity} CTV / ca
                          </span>
                        </div>
                      </td>

                      {/* Location Description */}
                      <td className="py-4 px-6 text-slate-600 max-w-sm">
                        <p className="font-semibold text-slate-800 line-clamp-1">
                          {room.description}
                        </p>
                        <span className="text-[10px] text-slate-400 font-extrabold block mt-0.5">
                          📍 {room.location || "Tầng 1 - Tòa A"}
                        </span>
                      </td>

                      {/* Status Active/Maintenance */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {room.status === "active" ? (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 inline-flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Hoạt động</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center space-x-1">
                            <Wrench className="w-3 h-3 text-amber-600" />
                            <span>Bảo trì</span>
                          </span>
                        )}
                      </td>

                      {/* Edit Action */}
                      <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                        {/* Edit Button */}
                        <button
                          onClick={() => openEditRoomModal(room)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black rounded-xl transition-all cursor-pointer inline-flex items-center space-x-1 text-xs"
                          title="Chỉnh sửa thông tin phòng"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Chỉnh sửa</span>
                        </button>

                        {/* Toggle Active / Maintenance */}
                        <button
                          onClick={() => handleToggleRoomStatus(room)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            room.status === "active"
                              ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {room.status === "active" ? "Chuyển Bảo trì" : "Mở Hoạt động"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Cấu hình Khung ca làm việc */}
      {activeTab === "shifts" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900">Khung ca làm việc cố định</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Thời gian bắt đầu, kết thúc và sức chứa mặc định của từng khung ca cố định.
                </p>
              </div>

              <button
                onClick={() => {
                  const newShift: ShiftConfig = {
                    id: "s_" + Date.now(),
                    name: "Ca Bổ Sung",
                    startTime: "18:00",
                    endTime: "21:00",
                    type: "evening",
                    maxCollaborators: 8,
                  };
                  onAddShiftConfig(newShift);
                  setShiftsList((prev) => [...prev, newShift]);
                  showToast("Đã thêm khung ca bổ sung");
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm khung ca mới</span>
              </button>
            </div>

            {/* List of Fixed Shifts: "Ca Sáng (08:00 - 12:00)", "Ca Chiều (13:30 - 17:30)" */}
            <div className="space-y-4">
              {shiftsList.map((shift) => (
                <div
                  key={shift.id}
                  className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:border-indigo-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-base">
                          {shift.name}{" "}
                          <span className="text-xs font-bold text-slate-400">
                            ({shift.startTime} - {shift.endTime})
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Khung làm việc cố định hàng ngày
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-900 border border-indigo-200">
                        Sức chứa: {shift.maxCollaborators} CTV / ca
                      </span>
                      <button
                        onClick={() => openEditShiftModal(shift)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Chỉnh sửa</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Bạn có chắc chắn muốn xóa khung ca "${shift.name}"?`)) {
                            setShiftsList((prev) => prev.filter((s) => s.id !== shift.id));
                            showToast(`Đã xóa khung ca "${shift.name}"`);
                          }
                        }}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                        title="Xóa khung ca này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>

                  {/* Time Adjustment Controls */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                        Giờ bắt đầu:
                      </label>
                      <input
                        type="time"
                        value={shift.startTime}
                        onChange={(e) =>
                          handleQuickShiftTimeChange(shift.id, "startTime", e.target.value)
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                        Giờ kết thúc:
                      </label>
                      <input
                        type="time"
                        value={shift.endTime}
                        onChange={(e) =>
                          handleQuickShiftTimeChange(shift.id, "endTime", e.target.value)
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => showToast(`Đã lưu điều chỉnh khung giờ cho ${shift.name}!`)}
                        className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Lưu giờ ca</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Regulations Sidebar */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5 h-fit">
            <div className="flex items-center space-x-2 text-indigo-600 font-black text-xs uppercase tracking-wider">
              <Info className="w-4 h-4" />
              <span>Quy định vận hành ca Schedulo</span>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed font-medium">
              <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                <strong className="text-slate-900 font-black block mb-0.5">
                  1. Khoảng cách giữa 2 ca:
                </strong>
                <p className="text-slate-600 text-[11px]">
                  Tối thiểu 60 phút để làm sạch và kiểm định lại các thiết bị phòng máy.
                </p>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                <strong className="text-slate-900 font-black block mb-0.5">
                  2. Giới hạn ca/ngày:
                </strong>
                <p className="text-slate-600 text-[11px]">
                  Mỗi CTV được đăng ký tối đa 2 ca trong cùng 1 ngày để đảm bảo hiệu suất làm việc.
                </p>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                <strong className="text-slate-900 font-black block mb-0.5">
                  3. Thời gian hủy ca:
                </strong>
                <p className="text-slate-600 text-[11px]">
                  Phải thực hiện trước tối thiểu 2 tiếng để điều phối viên kịp duyệt đăng ký thay
                  thế.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form: "+ Thêm phòng mới" */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <h3 className="text-base font-black text-slate-900">+ Thêm phòng mới</h3>
              <button
                onClick={() => setShowAddRoomModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRoomSubmit} className="space-y-4">
              {/* Room Name Input */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Tên phòng (Room Name) *
                </label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Ví dụ: Phòng Lab 103, Phòng Họp B..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  required
                />
              </div>

              {/* Max Capacity Input */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Sức chứa (Capacity) *
                  </label>
                  <input
                    type="number"
                    value={newRoomCap}
                    onChange={(e) => setNewRoomCap(Number(e.target.value))}
                    min={1}
                    max={100}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Vị trí (Location)
                  </label>
                  <input
                    type="text"
                    value={newRoomLoc}
                    onChange={(e) => setNewRoomLoc(e.target.value)}
                    placeholder="Ví dụ: Tầng 2 - Tòa A"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Mô tả thiết bị & tính năng (Description)
                </label>
                <textarea
                  rows={3}
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  placeholder="Mô tả trang thiết bị, máy tính GPU, máy chiếu..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-xs rounded-2xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  Xác nhận Thêm phòng
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl transition-colors cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form: Edit Room */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <h3 className="text-base font-black text-slate-900">Chỉnh sửa thông tin phòng</h3>
              <button
                onClick={() => setEditingRoom(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoomEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Tên phòng *</label>
                <input
                  type="text"
                  value={editRoomName}
                  onChange={(e) => setEditRoomName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Sức chứa (CTV/ca)
                  </label>
                  <input
                    type="number"
                    value={editRoomCap}
                    onChange={(e) => setEditRoomCap(Number(e.target.value))}
                    min={1}
                    max={100}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Vị trí phòng
                  </label>
                  <input
                    type="text"
                    value={editRoomLoc}
                    onChange={(e) => setEditRoomLoc(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Mô tả & Thiết bị
                </label>
                <textarea
                  rows={3}
                  value={editRoomDesc}
                  onChange={(e) => setEditRoomDesc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  Lưu thay đổi
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl transition-colors cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form: Edit Shift */}
      {editingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <h3 className="text-base font-black text-slate-900">
                Cấu hình Khung ca: {editingShift.name}
              </h3>
              <button
                onClick={() => setEditingShift(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShiftEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Giờ bắt đầu
                  </label>
                  <input
                    type="time"
                    value={editShiftStart}
                    onChange={(e) => setEditShiftStart(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Giờ kết thúc
                  </label>
                  <input
                    type="time"
                    value={editShiftEnd}
                    onChange={(e) => setEditShiftEnd(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Sức chứa quy định (CTV / phòng / ca)
                </label>
                <input
                  type="number"
                  value={editShiftMax}
                  onChange={(e) => setEditShiftMax(Number(e.target.value))}
                  min={1}
                  max={50}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-800"
                  required
                />
              </div>

              <div className="pt-3 flex items-center space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  Cập nhật Khung ca
                </button>
                <button
                  type="button"
                  onClick={() => setEditingShift(null)}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl transition-colors cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
