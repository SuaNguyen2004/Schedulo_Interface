import React, { useState } from 'react';
import { Room, ShiftRegistration, User } from '../types';
import { 
  CalendarRange, 
  Users, 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Phone,
  ShieldCheck,
  UserCheck2
} from 'lucide-react';

interface MasterCalendarViewProps {
  shifts: ShiftRegistration[];
  rooms: Room[];
  users: User[];
  onNavigateToCtvManagement: () => void;
}

interface ShiftDetailModalData {
  dateStr: string;
  formattedDate: string;
  shiftName: string;
  timeSlot: string;
  roomName: string;
  totalRegistered: number;
  maxCapacity: number;
  isFull: boolean;
  registeredCtvs: Array<{
    id: string;
    fullName: string;
    phone: string;
    workGroup: string;
    role: 'leader' | 'member';
    declaredContent: string;
    avatar?: string;
  }>;
}

export const MasterCalendarView: React.FC<MasterCalendarViewProps> = ({
  shifts,
  rooms,
  users,
  onNavigateToCtvManagement
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('Tháng 8, 2026');
  const [activeModalShift, setActiveModalShift] = useState<ShiftDetailModalData | null>(null);

  // Default rooms if list is empty
  const roomList = rooms.length > 0 ? rooms : [
    { id: 'r1', name: 'Phòng Lab 101', location: 'Tầng 1', capacity: 10, status: 'active' },
    { id: 'r2', name: 'Hội trường Beta', location: 'Tầng 3', capacity: 15, status: 'active' },
    { id: 'r3', name: 'Phòng Kỹ thuật 202', location: 'Tầng 2', capacity: 8, status: 'active' }
  ];

  // Calendar setup for August 2026
  // August 1st 2026 is Saturday (5 lead empty days: Mon, Tue, Wed, Thu, Fri)
  const leadEmptyDays = 5; 
  const totalDaysInAug = 31;

  // Mock list of registered CTVs for the side-sheet modal
  const sampleCtvList = [
    {
      id: 'ctv-1',
      fullName: 'Nguyễn Văn An',
      phone: '0901 234 567',
      workGroup: 'Đội Kỹ Thuật AI',
      role: 'leader' as const,
      declaredContent: 'Trực máy, hỗ trợ cài đặt môi trường PyTorch & GPU cho lớp thực hành AI.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    },
    {
      id: 'ctv-2',
      fullName: 'Trần Thị Bình',
      phone: '0912 345 678',
      workGroup: 'Đội Kiểm Thử Hardware',
      role: 'member' as const,
      declaredContent: 'Kiểm tra bảo trì hệ thống cáp mạng, máy tính phòng Lab 101.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
    },
    {
      id: 'ctv-3',
      fullName: 'Lê Hoàng Cường',
      phone: '0988 777 666',
      workGroup: 'Đội Hỗ Trợ Đào Tạo',
      role: 'member' as const,
      declaredContent: 'Điểm danh sinh viên, phát tài liệu hướng dẫn bài tập thực hành.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
    },
    {
      id: 'ctv-4',
      fullName: 'Phạm Minh Đức',
      phone: '0933 222 111',
      workGroup: 'Đội Kỹ Thuật AI',
      role: 'member' as const,
      declaredContent: 'Hỗ trợ debug lỗi biên dịch mô hình cho sinh viên trong ca.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      id: 'ctv-5',
      fullName: 'Vũ Thị Ngọc',
      phone: '0977 123 456',
      workGroup: 'Đội Quản Lý Phòng Máy',
      role: 'member' as const,
      declaredContent: 'Tổng vệ sinh thiết bị, niêm phong phòng máy cuối giờ làm.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    }
  ];

  const handleOpenShiftModal = (dayNum: number, shiftType: 'morning' | 'afternoon') => {
    const dayFormatted = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const dateStr = `2026-08-${dayFormatted}`;
    const formattedDate = `${dayFormatted}/08/2026`;
    
    const selectedRoomObj = roomList.find(r => r.id === selectedRoomId) || roomList[0];
    const roomName = selectedRoomId === 'all' ? 'Phòng Lab 101' : selectedRoomObj.name;

    if (shiftType === 'morning') {
      setActiveModalShift({
        dateStr,
        formattedDate,
        shiftName: 'Ca Sáng',
        timeSlot: '08:00 - 12:00',
        roomName,
        totalRegistered: 8,
        maxCapacity: 10,
        isFull: false,
        registeredCtvs: sampleCtvList
      });
    } else {
      setActiveModalShift({
        dateStr,
        formattedDate,
        shiftName: 'Ca Chiều',
        timeSlot: '13:30 - 17:30',
        roomName,
        totalRegistered: 10,
        maxCapacity: 10,
        isFull: true,
        registeredCtvs: [
          ...sampleCtvList,
          {
            id: 'ctv-6',
            fullName: 'Đặng Quốc Huy',
            phone: '0944 555 666',
            workGroup: 'Đội Kỹ Thuật AI',
            role: 'member',
            declaredContent: 'Hỗ trợ cài đặt phần mềm mô phỏng hệ thống.',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
          },
          {
            id: 'ctv-7',
            fullName: 'Ngô Mỹ Linh',
            phone: '0966 888 999',
            workGroup: 'Đội Quản Lý Phòng Máy',
            role: 'member',
            declaredContent: 'Bàn giao chìa khóa phòng và ghi sổ nhật ký trực.',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
          }
        ]
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Header Bar */}
      <div className="mb-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold text-indigo-600 uppercase tracking-wider mb-1">
            <CalendarRange className="w-4 h-4 inline" />
            <span>Highlights UC-2.2 • Quản trị viên</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sơ đồ Lịch trình Tổng hợp Toàn hệ thống
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Theo dõi điều phối ca làm việc, công suất phòng máy và danh sách CTV toàn đơn vị.
          </p>
        </div>

        {/* Controls Bar: Month Switcher, Room Dropdown, Today Button */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Month Switcher */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button className="p-1.5 rounded-xl hover:bg-white text-slate-600 hover:shadow-xs transition-all cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-extrabold text-slate-800 whitespace-nowrap">
              &lt; {selectedMonth} &gt;
            </span>
            <button className="p-1.5 rounded-xl hover:bg-white text-slate-600 hover:shadow-xs transition-all cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Room Filter Dropdown */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-300 px-3 py-2 rounded-2xl text-xs font-bold text-slate-800">
            <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả các phòng</option>
              <option value="r1">Phòng Lab 101</option>
              <option value="r2">Hội trường Beta</option>
              <option value="r3">Phòng Kỹ thuật 202</option>
            </select>
          </div>

          {/* Today Button */}
          <button
            onClick={() => setSelectedMonth('Tháng 8, 2026')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all cursor-pointer"
          >
            Hôm nay
          </button>
        </div>

      </div>

      {/* Main Monthly Calendar Grid (7 Columns: Monday to Sunday) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200 text-center py-3.5 text-xs font-black text-slate-600 uppercase tracking-wider">
          <div>Thứ 2</div>
          <div>Thứ 3</div>
          <div>Thứ 4</div>
          <div>Thứ 5</div>
          <div>Thứ 6</div>
          <div>Thứ 7</div>
          <div className="text-red-600">Chủ Nhật</div>
        </div>

        {/* Calendar Cells Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-200/80">
          
          {/* Empty Lead Cells (Mon to Fri before August 1st) */}
          {Array.from({ length: leadEmptyDays }).map((_, idx) => (
            <div key={`empty-${idx}`} className="min-h-[125px] p-2 bg-slate-50/40 text-slate-300 text-xs font-bold p-3">
              <span className="text-slate-300">{27 + idx}</span>
            </div>
          ))}

          {/* August 1 to August 31 */}
          {Array.from({ length: totalDaysInAug }, (_, i) => i + 1).map((dayNum) => {
            const isToday = dayNum === 3; // 03/08/2026 is today
            
            return (
              <div
                key={`aug-${dayNum}`}
                className={`min-h-[125px] p-2.5 bg-white transition-colors flex flex-col justify-between hover:bg-slate-50/80 ${
                  isToday ? 'bg-indigo-50/30' : ''
                }`}
              >
                {/* Date Header */}
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-black ${
                    isToday 
                      ? 'bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-xs' 
                      : 'text-slate-800'
                  }`}>
                    {dayNum < 10 ? `0${dayNum}` : dayNum}
                  </span>
                  {isToday && (
                    <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                      Hôm nay
                    </span>
                  )}
                </div>

                {/* Stacked Shift Badges */}
                <div className="space-y-1.5 my-auto">
                  
                  {/* Ca Sáng (Indigo Badge) */}
                  <div
                    onClick={() => handleOpenShiftModal(dayNum, 'morning')}
                    className="p-1.5 rounded-xl bg-indigo-50 border border-indigo-200/90 text-indigo-900 cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-all shadow-2xs group"
                  >
                    <div className="flex items-center justify-between text-[10px] font-extrabold leading-tight">
                      <span className="truncate">Ca Sáng (08:00 - 12:00)</span>
                    </div>
                    <div className="mt-0.5 text-[10px] font-black text-indigo-700 flex items-center justify-between">
                      <span>8/10 CTV</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] underline">Chi tiết</span>
                    </div>
                  </div>

                  {/* Ca Chiều (Teal/Emerald Badge - Đã đầy) */}
                  <div
                    onClick={() => handleOpenShiftModal(dayNum, 'afternoon')}
                    className="p-1.5 rounded-xl bg-teal-50 border border-teal-200/90 text-teal-950 cursor-pointer hover:bg-teal-100 hover:border-teal-300 transition-all shadow-2xs group"
                  >
                    <div className="flex items-center justify-between text-[10px] font-extrabold leading-tight">
                      <span className="truncate">Ca Chiều (13:30 - 17:30)</span>
                    </div>
                    <div className="mt-0.5 text-[10px] font-black text-teal-800 flex items-center justify-between">
                      <span className="bg-teal-200/80 text-teal-900 px-1 rounded text-[9px]">10/10 CTV (Đã đầy)</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] underline">Chi tiết</span>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* Side-Sheet Modal: Details & Registered CTV Data Table */}
      {activeModalShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-slate-200 flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              
              {/* Modal Top Info */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                      Ngày: {activeModalShift.formattedDate}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                      activeModalShift.isFull 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {activeModalShift.isFull ? 'Đã đầy đủ chỉ tiêu' : 'Đang tiếp nhận đăng ký'}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">
                    Chi tiết phân công ca làm: {activeModalShift.shiftName} ({activeModalShift.timeSlot})
                  </h2>
                  <p className="text-xs font-extrabold text-slate-500 mt-0.5 flex items-center space-x-2">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600 inline" />
                    <span>Địa điểm: {activeModalShift.roomName}</span>
                    <span>•</span>
                    <Users className="w-3.5 h-3.5 text-indigo-600 inline" />
                    <span>Sức chứa: {activeModalShift.totalRegistered}/{activeModalShift.maxCapacity} CTV</span>
                  </p>
                </div>

                <button
                  onClick={() => setActiveModalShift(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-2xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Data Table of Registered CTVs */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Danh sách Cộng tác viên đã đăng ký ({activeModalShift.registeredCtvs.length})</span>
                  </h3>
                  <span className="text-[11px] font-bold text-slate-500 italic">
                    Cập nhật thời gian thực
                  </span>
                </div>

                <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Họ tên CTV</th>
                        <th className="py-3 px-4">Số điện thoại</th>
                        <th className="py-3 px-4">Nhóm công tác</th>
                        <th className="py-3 px-4">Vai trò</th>
                        <th className="py-3 px-4">Nội dung công việc dự kiến</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                      {activeModalShift.registeredCtvs.map((ctv) => (
                        <tr key={ctv.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Họ tên CTV */}
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2.5">
                              <img
                                src={ctv.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                                alt={ctv.fullName}
                                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                              />
                              <div>
                                <p className="font-extrabold text-slate-900">{ctv.fullName}</p>
                              </div>
                            </div>
                          </td>

                          {/* Số điện thoại */}
                          <td className="py-3 px-4 font-semibold text-slate-600 whitespace-nowrap">
                            <div className="flex items-center space-x-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{ctv.phone}</span>
                            </div>
                          </td>

                          {/* Nhóm công tác */}
                          <td className="py-3 px-4 font-bold text-indigo-900 whitespace-nowrap">
                            <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200/80 rounded-lg text-[11px]">
                              {ctv.workGroup}
                            </span>
                          </td>

                          {/* Vai trò */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            {ctv.role === 'leader' ? (
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center space-x-1 shadow-2xs">
                                <ShieldCheck className="w-3 h-3 text-amber-600" />
                                <span>TRƯỞNG NHÓM</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 inline-flex items-center space-x-1">
                                <UserCheck2 className="w-3 h-3 text-slate-400" />
                                <span>THÀNH VIÊN</span>
                              </span>
                            )}
                          </td>

                          {/* Nội dung công việc dự kiến */}
                          <td className="py-3 px-4 text-slate-700 font-medium leading-relaxed max-w-xs">
                            {ctv.declaredContent}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedMonth('Tháng 8, 2026')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl transition-colors cursor-pointer"
              >
                In / Xuất file PDF
              </button>
              <button
                onClick={() => setActiveModalShift(null)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

