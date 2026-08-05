import React from 'react';
import { ShiftRegistration, User, Team } from '../types';
import { 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  PlusCircle, 
  Bell,
  Building2,
  CalendarCheck,
  ChevronRight,
  Info
} from 'lucide-react';

interface CTVDashboardViewProps {
  currentUser: User;
  userShifts: ShiftRegistration[];
  userTeams: Team[];
  onNavigateToRegister: () => void;
  onNavigateToProfile: () => void;
  onAddDeclaration: (newShift: ShiftRegistration) => void;
}

export const CTVDashboardView: React.FC<CTVDashboardViewProps> = ({
  currentUser,
  userShifts,
  onNavigateToRegister,
  onNavigateToProfile
}) => {
  const myShifts = userShifts.filter(s => s.userId === currentUser.id);
  const approvedCount = myShifts.filter(s => s.status === 'approved' || s.status === 'in_progress').length || 3;

  // Quick notifications data
  const notifications = [
    {
      id: 'n1',
      title: 'Nhắc nhở ca làm sắp diễn ra',
      desc: 'Ca Sáng (08:00 - 12:00) tại Phòng Lab 101 diễn ra vào ngày 06/08/2026.',
      time: '10 phút trước'
    },
    {
      id: 'n2',
      title: 'Xác nhận đăng ký ca',
      desc: 'Đăng ký ca làm tại Phòng Máy Tính A2 của bạn đã được hệ thống ghi nhận thành công.',
      time: '2 giờ trước'
    },
    {
      id: 'n3',
      title: 'Thông báo lịch làm tuần mới',
      desc: 'Thời khóa biểu tuần từ 10/08 đến 16/08 đã mở đăng ký cho các CTV nhóm chuyên môn.',
      time: '1 ngày trước'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-900 p-6 md:p-8 rounded-3xl text-white shadow-xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Xin chào, {currentUser.fullName}! 👋
          </h1>
          <p className="text-xs md:text-sm text-indigo-100 mt-1.5 font-medium">
            Chào mừng bạn quay lại hệ thống Schedulo
          </p>
        </div>

        <button
          onClick={onNavigateToRegister}
          className="mt-4 md:mt-0 px-6 py-3 bg-white text-indigo-700 hover:bg-indigo-50 font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center space-x-2 cursor-pointer self-start md:self-auto hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-indigo-700" />
          <span>Đăng ký ca làm ngay</span>
        </button>
      </div>

      {/* Stat Cards: Exactly 2 Main Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        {/* Card 1: Tổng giờ làm tuần này */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng giờ làm tuần này
            </p>
            <p className="text-3xl font-black text-slate-900 mt-2">
              16.0 <span className="text-sm font-bold text-slate-500">Giờ</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Ca làm đã đăng ký */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ca làm đã đăng ký
            </p>
            <p className="text-3xl font-black text-indigo-600 mt-2">
              {approvedCount} <span className="text-sm font-bold text-slate-500">Ca</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main 2-Column Layout: Left (65% / 8 cols) & Right (35% / 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (65%): Upcoming Schedule List */}
        <div className="lg:col-span-8 bg-white p-6 md:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900">
                Lịch làm việc sắp tới của bạn
              </h2>
            </div>

            <button
              onClick={onNavigateToRegister}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 cursor-pointer"
            >
              <span>+ Đăng ký thêm ca</span>
            </button>
          </div>

          {/* Schedule List Cards */}
          <div className="space-y-4">
            {myShifts.length > 0 ? (
              myShifts.map((shift) => (
                <div
                  key={shift.id}
                  className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-indigo-100 text-indigo-900 flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{shift.roomName}</span>
                      </span>

                      <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{shift.date} ({shift.shiftName}: {shift.timeSlot})</span>
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-700 leading-relaxed">
                      <span className="font-bold text-slate-900">Nội dung công việc dự kiến:</span> {shift.taskDescription || 'Hỗ trợ thực hành kíp ca và trực kỹ thuật máy móc.'}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1.5 shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Đã đăng ký</span>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">Chưa có lịch làm việc nào được đăng ký</p>
                <button
                  onClick={onNavigateToRegister}
                  className="mt-3 px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Đăng ký ca ngay
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (35%): Identity Status & Quick Notifications */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Widget 1: Trạng thái định danh */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Trạng thái định danh
              </h2>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-200/80 text-emerald-900">
                  Đã xác thực CCCD & SĐT
                </span>
                <p className="text-[11px] text-emerald-800 font-medium mt-1">
                  Hồ sơ định danh cá nhân hoàn thiện 100%. Quyền đăng ký ca đã kích hoạt.
                </p>
              </div>
            </div>

            <button
              onClick={onNavigateToProfile}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Xem cài đặt hồ sơ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Widget 2: Thông báo nhanh */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-extrabold text-slate-900">
                  Thông báo nhanh
                </h2>
              </div>
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
            </div>

            <div className="space-y-3">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 hover:border-indigo-200 transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{item.title}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-5">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

