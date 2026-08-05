import React, { useState, useEffect } from "react";
import {
  ActiveTab,
  User,
  Room,
  ShiftConfig,
  ShiftRegistration,
  Team,
  AccountStatus,
  TeamMember,
} from "./types";
import {
  initialUsers,
  initialRooms,
  initialShiftConfigs,
  initialTeams,
  initialShifts,
} from "./data/initialData";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { RegisterShiftView } from "./components/RegisterShiftView";
import { PersonalScheduleView } from "./components/PersonalScheduleView";
import { TeamsView } from "./components/TeamsView";
import { ProfileSettingsView } from "./components/ProfileSettingsView";
import { SystemConfigView } from "./components/SystemConfigView";
import { CTVManagementView } from "./components/CTVManagementView";
import { MasterCalendarView } from "./components/MasterCalendarView";
import { CTVDashboardView } from "./components/CTVDashboardView";
import { AuthView } from "./components/AuthView";
import { NotificationsDrawer } from "./components/NotificationsDrawer";
import { CheckCircle2 } from "lucide-react";

export default function App() {
  // Application Active View Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>("ctv_dashboard");

  // Application Data States (with initial fallback)
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("schedulo_users");
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User>(users[0]);

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem("schedulo_rooms");
    return saved ? JSON.parse(saved) : initialRooms;
  });

  const [shiftConfigs, setShiftConfigs] = useState<ShiftConfig[]>(() => {
    const saved = localStorage.getItem("schedulo_shift_configs");
    const parsed = saved ? JSON.parse(saved) : initialShiftConfigs;
    return parsed.filter(
      (s: ShiftConfig) =>
        s.id !== "s3" && s.type !== "evening" && !s.name.toLowerCase().includes("tối"),
    );
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem("schedulo_teams");
    return saved ? JSON.parse(saved) : initialTeams;
  });

  const [shifts, setShifts] = useState<ShiftRegistration[]>(() => {
    const saved =
      localStorage.getItem("registeredShifts") || localStorage.getItem("schedulo_shifts");
    let parsed: ShiftRegistration[] = saved ? JSON.parse(saved) : initialShifts;
    // Normalize sr1 for Monday 03/08 to standard registered shift
    parsed = parsed.map((s) =>
      s.id === "sr1" || s.date === "2026-08-03" ? { ...s, isTeamRegistration: false } : s,
    );
    const hasWedGroupShift = parsed.some(
      (s) =>
        s.date === "2026-08-05" &&
        (s.shiftName === "Ca Chiều" || s.shiftId === "s2") &&
        s.isTeamRegistration &&
        s.status !== "cancelled",
    );
    if (!hasWedGroupShift) {
      const wedShift = initialShifts.find((s) => s.id === "sr6");
      if (wedShift) return [...parsed, wedShift];
    }
    return parsed;
  });

  // Notifications, Toast & UI States
  const [unreadNotifications, setUnreadNotifications] = useState<number>(3);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("schedulo_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("schedulo_rooms", JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem("schedulo_shift_configs", JSON.stringify(shiftConfigs));
  }, [shiftConfigs]);

  useEffect(() => {
    localStorage.setItem("schedulo_teams", JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem("schedulo_shifts", JSON.stringify(shifts));
    localStorage.setItem("registeredShifts", JSON.stringify(shifts));
  }, [shifts]);

  // Handler Actions
  const handleRegisterShift = (newShift: ShiftRegistration) => {
    setShifts((prev) => [newShift, ...prev]);
    showToast("Đăng ký lịch trình làm việc thành công!");
  };

  const handleCancelShift = (shiftId: string, reason: string) => {
    setShifts((prev) =>
      prev.map((s) => (s.id === shiftId ? { ...s, status: "cancelled", cancelReason: reason } : s)),
    );
  };

  const handleCreateTeam = (newTeam: Team) => {
    setTeams((prev) => [...prev, newTeam]);
  };

  const handleAddMemberToTeam = (teamId: string, newMember: TeamMember) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          if (t.members.some((m) => m.id === newMember.id)) return t;
          return {
            ...t,
            memberCount: t.members.length + 1,
            members: [...t.members, newMember],
          };
        }
        return t;
      }),
    );
  };

  const handleRemoveMemberFromTeam = (teamId: string, memberId: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const updatedMembers = t.members.filter((m) => m.id !== memberId);
          return {
            ...t,
            memberCount: updatedMembers.length,
            members: updatedMembers,
          };
        }
        return t;
      }),
    );
  };

  const handleUpdateProfile = (updatedFields: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedFields }));
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, ...updatedFields } : u)));
  };

  const handleUpdateUserStatus = (userId: string, newStatus: AccountStatus) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
  };

  const handleAddRoom = (newRoom: Room) => {
    setRooms((prev) => [...prev, newRoom]);
  };

  const handleUpdateRoomStatus = (roomId: string, status: "active" | "maintenance") => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, status } : r)));
  };

  const handleAddShiftConfig = (newShift: ShiftConfig) => {
    setShiftConfigs((prev) => [...prev, newShift]);
  };

  const handleSuccessAuthLogin = (user: User) => {
    setCurrentUser(user);
    if (!users.some((u) => u.id === user.id)) {
      setUsers((prev) => [...prev, user]);
    }
    setActiveTab("ctv_dashboard");
  };

  const pendingCtvCount = users.filter(
    (u) => u.role === "collaborator" && u.status === "pending",
  ).length;

  const isAuthPage = activeTab === "auth_sign_in" || activeTab === "auth_sign_up";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      {/* Top Header */}
      {!isAuthPage && (
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          allUsers={users}
          unreadNotifications={unreadNotifications}
          onOpenNotifications={() => setShowNotifications(true)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
      )}

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        {!isAuthPage && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            isOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          />
        )}

        {/* View Layout Router */}
        <main className="flex-1 overflow-y-auto pb-16">
          {activeTab === "ctv_dashboard" && (
            <CTVDashboardView
              currentUser={currentUser}
              userShifts={shifts}
              userTeams={teams}
              onNavigateToRegister={() => setActiveTab("register_shift")}
              onNavigateToProfile={() => setActiveTab("profile_settings")}
              onAddDeclaration={handleRegisterShift}
            />
          )}

          {activeTab === "register_shift" && (
            <RegisterShiftView
              rooms={rooms}
              shiftConfigs={shiftConfigs}
              currentUser={currentUser}
              userTeams={teams}
              onRegister={handleRegisterShift}
              onNavigateToSchedule={() => setActiveTab("my_schedule")}
            />
          )}

          {activeTab === "my_schedule" && (
            <PersonalScheduleView
              shifts={shifts}
              currentUser={currentUser}
              onNavigateToRegister={() => setActiveTab("register_shift")}
              onCancelShift={handleCancelShift}
            />
          )}

          {activeTab === "my_teams" && (
            <TeamsView
              teams={teams}
              currentUser={currentUser}
              allUsers={users}
              onCreateTeam={handleCreateTeam}
              onAddMemberToTeam={handleAddMemberToTeam}
              onRemoveMemberFromTeam={handleRemoveMemberFromTeam}
            />
          )}

          {activeTab === "profile_settings" && (
            <ProfileSettingsView currentUser={currentUser} onUpdateProfile={handleUpdateProfile} />
          )}

          {activeTab === "system_config" && (
            <SystemConfigView
              rooms={rooms}
              shiftConfigs={shiftConfigs}
              onAddRoom={handleAddRoom}
              onUpdateRoomStatus={handleUpdateRoomStatus}
              onAddShiftConfig={handleAddShiftConfig}
            />
          )}

          {activeTab === "ctv_management" && (
            <CTVManagementView users={users} onUpdateStatus={handleUpdateUserStatus} />
          )}

          {activeTab === "master_calendar" && (
            <MasterCalendarView
              shifts={shifts}
              rooms={rooms}
              users={users}
              onNavigateToCtvManagement={() => setActiveTab("ctv_management")}
            />
          )}

          {(activeTab === "auth_sign_in" || activeTab === "auth_sign_up") && (
            <AuthView
              mode={activeTab === "auth_sign_in" ? "sign_in" : "sign_up"}
              onSuccessLogin={handleSuccessAuthLogin}
              onSwitchMode={(mode) =>
                setActiveTab(mode === "sign_in" ? "auth_sign_in" : "auth_sign_up")
              }
              allUsers={users}
            />
          )}
        </main>
      </div>

      {/* Notifications Side Drawer */}
      <NotificationsDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onClearAll={() => {
          setUnreadNotifications(0);
          setShowNotifications(false);
        }}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-bold border border-slate-800 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
