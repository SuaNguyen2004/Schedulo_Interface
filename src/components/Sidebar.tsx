import React from "react";
import { ActiveTab, User } from "../types";
import {
  LayoutDashboard,
  CalendarPlus,
  Calendar,
  Users,
  UserCog,
  CalendarRange,
  ShieldCheck,
  Sliders,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User;
  pendingCtvCount?: number;
  isOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  pendingCtvCount = 18,
  isOpen = true,
  onToggleSidebar,
}) => {
  const section1Items = [
    {
      id: "ctv_dashboard" as ActiveTab,
      label: "Lịch trình của tôi",
      icon: LayoutDashboard,
      code: "UC-3.2",
    },
    {
      id: "register_shift" as ActiveTab,
      label: "Đăng ký ca làm việc",
      icon: CalendarPlus,
      code: "UC-3.1",
    },
    {
      id: "my_schedule" as ActiveTab,
      label: "Lịch làm việc cá nhân",
      icon: Calendar,
      code: "UC-3.2",
    },
    {
      id: "my_teams" as ActiveTab,
      label: "Nhóm chuyên môn",
      icon: Users,
      code: "UC-3.4",
    },
    {
      id: "profile_settings" as ActiveTab,
      label: "Cài đặt hồ sơ",
      icon: UserCog,
      code: "UC-1.4",
    },
  ];

  const section2Items = [
    {
      id: "master_calendar" as ActiveTab,
      label: "Lịch tổng hợp tháng",
      icon: CalendarRange,
    },
    {
      id: "ctv_management" as ActiveTab,
      label: "Duyệt hồ sơ CTV",
      icon: ShieldCheck,
      badge: "18",
      badgeColor: "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black",
    },
    {
      id: "system_config" as ActiveTab,
      label: "Cấu hình phòng & khung ca",
      icon: Sliders,
    },
  ];

  return (
    <aside
      className={`${isOpen ? "w-64" : "w-16"} bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800/80 select-none transition-all duration-300`}
    >
      {/* Sidebar Header: Toggle Control (Duplicate logo removed) */}
      <div className="px-3 py-3 border-b border-slate-800/80 flex items-center justify-between">
        {isOpen ? (
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2">
            MENU CHỨC NĂNG
          </span>
        ) : (
          <span className="text-[10px] font-black text-indigo-400 mx-auto">MENU</span>
        )}
        {onToggleSidebar && isOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Thu gọn Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 py-4 px-2 space-y-5 overflow-y-auto">
        {/* SECTION 1: CÁ NHÂN & CA LÀM */}
        <div>
          {isOpen && (
            <div className="px-2 mb-2">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                CÁ NHÂN & CA LÀM
              </h3>
            </div>
          )}
          <div className="space-y-1">
            {section1Items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={!isOpen ? item.label : undefined}
                  className={`w-full flex items-center ${
                    isOpen ? "justify-between px-3 py-2.5" : "justify-center p-2.5"
                  } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`}
                    />
                    {isOpen && <span className="truncate">{item.label}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: QUẢN TRỊ & ĐIỀU PHỐI (ADMIN) */}
        <div>
          {isOpen && (
            <div className="px-2 mb-2 flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                QUẢN TRỊ & ĐIỀU PHỐI (ADMIN)
              </h3>
            </div>
          )}
          <div className="space-y-1">
            {section2Items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={!isOpen ? item.label : undefined}
                  className={`w-full flex items-center ${
                    isOpen ? "justify-between px-3 py-2.5" : "justify-center p-2.5 relative"
                  } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-indigo-400"}`}
                    />
                    {isOpen && <span className="truncate">{item.label}</span>}
                  </div>

                  {isOpen && item.badge && (
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {!isOpen && item.badge && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Avatar Info */}
      <div
        className={`py-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center ${
          isOpen ? "px-4 space-x-3" : "px-2 justify-center"
        }`}
      >
        <img
          src={
            currentUser.avatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
          }
          alt={currentUser.fullName}
          className="w-8 h-8 rounded-2xl object-cover ring-2 ring-indigo-500/40 shrink-0"
        />
        {isOpen && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-extrabold text-white truncate">
              {currentUser.fullName || "Quản Trị Viên Schedulo"}
            </p>
            <p className="text-[10px] font-bold text-slate-400 truncate">
              {currentUser.email || "admin@schedulo.com"}
            </p>
          </div>
        )}
      </div>

      {/* Footer Items: Help Center & Logout */}
      <div className="p-2 border-t border-slate-800/80 bg-slate-950/80 space-y-1">
        <button
          onClick={() => {
            alert("Trung tâm trợ giúp Schedulo: Hotline 1900 8888 | Email: support@schedulo.vn");
          }}
          title={!isOpen ? "Trung tâm trợ giúp" : undefined}
          className={`w-full flex items-center ${
            isOpen ? "space-x-3 px-3 py-2" : "justify-center p-2"
          } rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer`}
        >
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
          {isOpen && <span>Trung tâm trợ giúp</span>}
        </button>

        <button
          onClick={() => setActiveTab("auth_sign_in")}
          title={!isOpen ? "Đăng xuất" : undefined}
          className={`w-full flex items-center ${
            isOpen ? "space-x-3 px-3 py-2" : "justify-center p-2"
          } rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer`}
        >
          <LogOut className="w-4 h-4 text-red-400 shrink-0" />
          {isOpen && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};
