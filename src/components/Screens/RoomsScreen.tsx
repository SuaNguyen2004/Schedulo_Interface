import React, { useState } from "react";
import { WorkRoom, RoomStatus } from "../../types";

interface RoomsScreenProps {
  rooms: WorkRoom[];
  onAddRoom: (room: { name: string; descriptionAndLocation: string; status: RoomStatus }) => void;
  onUpdateRoom: (room: WorkRoom) => void;
  onDeleteRoom: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onShowToast?: (msg: string) => void;
}

export const RoomsScreen: React.FC<RoomsScreenProps> = ({
  rooms,
  onAddRoom,
  onUpdateRoom,
  onDeleteRoom,
  onToggleStatus,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Tất cả" | "Hoạt động" | "Bảo trì">("Tất cả");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<WorkRoom | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<WorkRoom | null>(null);

  // Form inputs
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formStatus, setFormStatus] = useState<RoomStatus>("Hoạt động");

  const openAddModal = () => {
    setEditingRoom(null);
    setFormName("");
    setFormDesc("");
    setFormStatus("Hoạt động");
    setIsModalOpen(true);
  };

  const openEditModal = (room: WorkRoom) => {
    setEditingRoom(room);
    setFormName(room.name);
    setFormDesc(room.descriptionAndLocation);
    setFormStatus(room.status);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDesc.trim()) {
      if (onShowToast) onShowToast("Vui lòng điền đầy đủ Tên phòng và Mô tả & vị trí");
      return;
    }

    if (editingRoom) {
      onUpdateRoom({
        ...editingRoom,
        name: formName.trim(),
        descriptionAndLocation: formDesc.trim(),
        status: formStatus,
      });
      if (onShowToast) onShowToast(`Đã cập nhật thông tin ${formName.trim()}`);
    } else {
      onAddRoom({
        name: formName.trim(),
        descriptionAndLocation: formDesc.trim(),
        status: formStatus,
      });
      if (onShowToast) onShowToast(`Đã thêm phòng làm việc mới "${formName.trim()}"`);
    }

    setIsModalOpen(false);
  };

  // Filtered list
  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.descriptionAndLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "Tất cả" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#25262b] p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#3b3d45] shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1b1e] dark:text-slate-100 tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-accent text-[28px]">meeting_room</span>
            <span>Quản lý phòng làm việc</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Danh sách và trạng thái các phòng phục vụ công tác và tiếp dân của CTV
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Thêm phòng làm việc</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#25262b] border border-[#E2E8F0] dark:border-[#3b3d45] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên phòng, vị trí, chức năng..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#1f2023] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-accent"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(["Tất cả", "Hoạt động", "Bảo trì"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? "bg-accent text-white shadow-2xs"
                  : "bg-slate-100 dark:bg-[#1f2023] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-[#25262b] border border-[#E2E8F0] dark:border-[#3b3d45] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#1f2023] border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Tên phòng</th>
                <th className="py-3.5 px-5">Mô tả & vị trí</th>
                <th className="py-3.5 px-5">Trạng thái</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <span className="material-symbols-outlined text-[40px] block opacity-40 mb-1">
                      meeting_room
                    </span>
                    <p className="text-sm font-semibold">Không tìm thấy phòng làm việc phù hợp</p>
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr
                    key={room.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-[#1f2023]/60 transition-colors"
                  >
                    {/* Tên phòng */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-accent dark:text-blue-300 flex items-center justify-center font-bold shrink-0 border border-blue-100 dark:border-blue-900/60">
                          <span className="material-symbols-outlined text-[20px]">door_open</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm block">
                            {room.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Mô tả & vị trí */}
                    <td className="py-4 px-5">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-lg font-medium">
                        {room.descriptionAndLocation}
                      </p>
                    </td>

                    {/* Trạng thái */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      {room.status === "Hoạt động" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Hoạt động</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span>Bảo trì</span>
                        </span>
                      )}
                    </td>

                    {/* Thao tác (Chỉnh sửa & Bảo trì / Mở hoạt động) */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button (Pencil Icon) */}
                        <button
                          type="button"
                          onClick={() => openEditModal(room)}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                          title="Chỉnh sửa thông tin phòng"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>

                        {/* Delete Button (Trash Icon) */}
                        <button
                          type="button"
                          onClick={() => setDeletingRoom(room)}
                          className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 transition-colors cursor-pointer border border-rose-200/60 dark:border-rose-900/40"
                          title="Xóa phòng làm việc"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>

                        {/* Toggle Maintenance / Active Button */}
                        <button
                          type="button"
                          onClick={() => onToggleStatus(room.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            room.status === "Hoạt động"
                              ? "bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:hover:bg-amber-900/80 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60"
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/80 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/60"
                          }`}
                          title={
                            room.status === "Hoạt động"
                              ? "Chuyển sang trạng thái Bảo trì"
                              : "Chuyển sang trạng thái Hoạt động"
                          }
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {room.status === "Hoạt động" ? "build" : "check_circle"}
                          </span>
                          <span>{room.status === "Hoạt động" ? "Bảo trì" : "Mở hoạt động"}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Room */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#25262b] rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-50 dark:bg-[#1f2023] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-[20px]">
                  meeting_room
                </span>
                <span>{editingRoom ? "Chỉnh sửa phòng làm việc" : "Thêm phòng làm việc mới"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tên phòng <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Phòng 302 - Tòa A"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#1f2023] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mô tả & Vị trí <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Mô tả chức năng, bộ phận làm việc và vị trí tầng/tòa nhà..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#1f2023] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Trạng thái
                </label>
                <div className="flex items-center gap-3 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === "Hoạt động"}
                      onChange={() => setFormStatus("Hoạt động")}
                      className="accent-accent cursor-pointer"
                    />
                    <span>Hoạt động</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === "Bảo trì"}
                      onChange={() => setFormStatus("Bảo trì")}
                      className="accent-accent cursor-pointer"
                    />
                    <span>Bảo trì</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-accent hover:bg-accent/90 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  {editingRoom ? "Lưu thay đổi" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirm Delete Room */}
      {deletingRoom && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#25262b] rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm overflow-hidden shadow-2xl p-5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">delete_forever</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Xác nhận xóa phòng làm việc?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Bạn có chắc chắn muốn xóa phòng{" "}
                <strong className="text-slate-800 dark:text-slate-200">
                  "{deletingRoom.name}"
                </strong>
                ? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingRoom(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteRoom(deletingRoom.id);
                  if (onShowToast) onShowToast(`Đã xóa phòng "${deletingRoom.name}" thành công`);
                  setDeletingRoom(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
