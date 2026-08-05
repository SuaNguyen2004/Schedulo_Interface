import React from "react";
import { ActiveTab, User } from "../types";
import {
  Calendar,
  Users,
  Settings,
  Bell,
  PlusCircle,
  Shield,
  UserCheck,
  Clock,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  PanelLeft,
  Menu,
} from "lucide-react";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  allUsers: User[];
  unreadNotifications: number;
  onOpenNotifications: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  allUsers,
  unreadNotifications,
  onOpenNotifications,
  isSidebarOpen = true,
  onToggleSidebar,
}) => {
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo, Toggle Button & Brand */}
          <div className="flex items-center space-x-3">
            {/* Toggle Sidebar Button */}
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border border-slate-200/80 flex items-center justify-center shrink-0"
                title={isSidebarOpen ? "Ẩn / Thu gọn Menu Sidebar" : "Hiển thị Menu Sidebar"}
              >
                <PanelLeft
                  className={`w-5 h-5 transition-transform duration-200 ${!isSidebarOpen ? "text-indigo-600" : ""}`}
                />
              </button>
            )}

            <div
              onClick={() => setActiveTab("ctv_dashboard")}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">calendar_month</span>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Schedulo
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600 -mt-1">
                  Portal Cộng tác viên
                </span>
              </div>
            </div>

            {/* Quick Navigation Pills for Top Bar */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-slate-200">
              <button
                onClick={() => setActiveTab("ctv_dashboard")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  activeTab === "ctv_dashboard"
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Tổng quan</span>
              </button>

              <button
                onClick={() => setActiveTab("my_schedule")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  activeTab === "my_schedule"
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Lịch cá nhân</span>
              </button>

              <button
                onClick={() => setActiveTab("my_teams")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  activeTab === "my_teams"
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Nhóm chuyên môn</span>
              </button>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            {/* Action Button: Đăng ký ca mới */}
            <button
              onClick={() => setActiveTab("register_shift")}
              className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-600/30 transition-all hover:shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng ký ca mới</span>
            </button>

            {/* Notification Bell Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Thông báo"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Switch Account/Role Dropdown (Demo Switcher) */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-2.5 p-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200/80 cursor-pointer"
              >
                <img
                  src={
                    currentUser.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                  }
                  alt={currentUser.fullName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] font-medium text-slate-500 flex items-center space-x-1">
                    {currentUser.role === "admin" ? (
                      <span className="text-purple-600 font-semibold flex items-center space-x-0.5">
                        <Shield className="w-3 h-3 inline" /> Admin Schedulo
                      </span>
                    ) : (
                      <span className="text-blue-600 font-semibold flex items-center space-x-0.5">
                        <UserCheck className="w-3 h-3 inline" /> CTV Chuyên môn
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Chuyển đổi tài khoản demo
                    </p>
                  </div>

                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        user.id === currentUser.id
                          ? "bg-blue-50/70 font-bold text-blue-700"
                          : "text-slate-700"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={user.avatar}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold">{user.fullName}</p>
                          <p className="text-[10px] text-slate-500">
                            {user.role === "admin" ? "Quản trị viên" : "CTV Chuyên môn"}
                          </p>
                        </div>
                      </div>
                      {user.id === currentUser.id && (
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      )}
                    </button>
                  ))}

                  <div className="border-t border-slate-100 mt-2 pt-1">
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        setActiveTab("profile_settings");
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-500" />
                      <span>Cài đặt hồ sơ</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        setActiveTab("auth_sign_in");
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
