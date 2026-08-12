import React, { useState } from "react";
import { ShiftSlot, UserAccount, AssignedCTV } from "../../types";

interface SummaryScheduleScreenProps {
  shifts: ShiftSlot[];
  accounts: UserAccount[];
  onViewAccountDetail?: (account: UserAccount) => void;
  onShowToast?: (msg: string) => void;
  currentUser?: UserAccount;
  userRole?: "Admin" | "Cộng tác viên";
}

// Default room assignments generator
const DEFAULT_ROOMS = [
  "Phòng 302 - Tòa A (Bộ phận Tiếp nhận hồ sơ)",
  "Phòng 105 - Tòa B (Tổ Kỹ thuật & Hạ tầng)",
  "Phòng Tổng đài - Tòa C (Chăm sóc Khách hàng)",
  "Phòng 204 - Tòa A (Bộ phận Nhập liệu & Báo cáo)",
  "Phòng Trực ban - Tòa A (Hướng dẫn Thủ tục & Phân luồng)",
];

// Default task contents generator
const DEFAULT_TASKS = [
  "Hỗ trợ hướng dẫn người dân nộp hồ sơ, kiểm tra tính hợp lệ của tài liệu và tiếp nhận giấy tờ.",
  "Trực hệ thống tổng đài, giải đáp thắc mắc của khách hàng và chuyển giao thông tin phản ánh.",
  "Kiểm tra hạ tầng kỹ thuật máy tính, cấu hình mạng và hỗ trợ thiết bị cho các phòng ban.",
  "Nhập liệu danh sách báo cáo tổng hợp ca trực, rà soát dữ liệu và lưu trữ hồ sơ điện tử.",
  "Phối hợp điều phối phân luồng, hướng dẫn khách hàng tại khu vực sảnh chờ tiếp dân.",
];

export const SummaryScheduleScreen: React.FC<SummaryScheduleScreenProps> = ({
  shifts,
  accounts,
  onViewAccountDetail,
  onShowToast,
}) => {
  // Month Switcher State (Default: Current real-time month & year)
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth()); // 0-indexed

  // Status tracker for today's CTV list
  const [ctvStatuses] = useState<Record<string, "Đi làm" | "Nghỉ">>({});

  // Side-Sheet Modal State for Shift Detail
  const [selectedShiftDetail, setSelectedShiftDetail] = useState<{
    dayName: string;
    dateFormatted: string;
    shiftName: "Ca Sáng" | "Ca Chiều";
    shiftTimeLabel: string;
    ctvList: Array<AssignedCTV & { roomDisplay: string; taskDisplay: string }>;
  } | null>(null);

  // Month Names Array
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const handleTodayMonth = () => {
    const todayObj = new Date();
    setSelectedYear(todayObj.getFullYear());
    setSelectedMonth(todayObj.getMonth());
  };

  // Helper to get shifts for a weekday (0=T2 to 4=T6) and shiftType
  const getShiftsForDayAndType = (dayIndex: number, type: "morning" | "afternoon") => {
    return shifts.filter((s) => s.dayIndex === dayIndex && s.shiftType === type);
  };

  const getAssignedCTVs = (dayIndex: number, type: "morning" | "afternoon") => {
    const matchedShifts = getShiftsForDayAndType(dayIndex, type);
    const rawList = matchedShifts.flatMap((s) => s.assignedCTVs || []);
    return rawList.filter((ctv) => {
      const acc = accounts.find(
        (a) => a.id === ctv.id || a.name.toLowerCase() === ctv.name.toLowerCase(),
      );
      return !acc || acc.role !== "Admin";
    });
  };

  // Calculate Month Calendar Weeks & Days (Mon-Fri)
  const getMonthCalendarWeeks = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const weeks: Array<
      Array<{
        dayNumber: number;
        dayIndex: number; // 0 for T2 to 4 for T6
        dayName: string;
        dateFormatted: string;
        dateShort: string;
        isToday: boolean;
        isValid: boolean;
      } | null>
    > = [];

    let currentWeek: Array<{
      dayNumber: number;
      dayIndex: number;
      dayName: string;
      dateFormatted: string;
      dateShort: string;
      isToday: boolean;
      isValid: boolean;
    } | null> = [null, null, null, null, null]; // Mon, Tue, Wed, Thu, Fri

    const dayNames = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"];

    const realToday = new Date();
    const realTodayYear = realToday.getFullYear();
    const realTodayMonth = realToday.getMonth();
    const realTodayDate = realToday.getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(selectedYear, selectedMonth, d);
      const dow = dateObj.getDay(); // 0 = CN, 1 = T2, 2 = T3, 3 = T4, 4 = T5, 5 = T6, 6 = T7

      if (dow >= 1 && dow <= 5) {
        const dayIndex = dow - 1;
        const dateFormatted = `${String(d).padStart(2, "0")}/${String(selectedMonth + 1).padStart(2, "0")}/${selectedYear}`;
        const dateShort = `${String(d).padStart(2, "0")}/${String(selectedMonth + 1).padStart(2, "0")}`;
        const isToday =
          selectedYear === realTodayYear && selectedMonth === realTodayMonth && d === realTodayDate;

        currentWeek[dayIndex] = {
          dayNumber: d,
          dayIndex,
          dayName: dayNames[dayIndex],
          dateFormatted,
          dateShort,
          isToday,
          isValid: true,
        };

        // If Friday (dayIndex === 4) or last day of month, push week
        if (dayIndex === 4 || d === daysInMonth) {
          weeks.push([...currentWeek]);
          currentWeek = [null, null, null, null, null];
        }
      }
    }

    // Clean up empty weeks
    return weeks.filter((w) => w.some((cell) => cell !== null));
  };

  const calendarWeeks = getMonthCalendarWeeks();

  // Get CTV list for Today's quick view (dynamic based on current real-time date)
  const getTodayCTVList = () => {
    const todayObj = new Date();
    const dayOfWeek = (todayObj.getDay() + 6) % 7; // 0: T2 ... 6: CN
    const dayIndex = Math.min(Math.max(0, dayOfWeek), 4); // Mon-Fri (0..4)
    const dayNamesList = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
    const dayNameStr = dayNamesList[dayOfWeek] || "Thứ 2";
    const dateStr = `${String(todayObj.getDate()).padStart(2, "0")}/${String(todayObj.getMonth() + 1).padStart(2, "0")}/${todayObj.getFullYear()}`;
    const dayLabel = `Hôm nay (${dayNameStr} - ${dateStr})`;

    const morningList = getAssignedCTVs(dayIndex, "morning");
    const afternoonList = getAssignedCTVs(dayIndex, "afternoon");

    type TodayCTVItem = {
      ctv: AssignedCTV;
      shifts: ("Ca Sáng" | "Ca Chiều")[];
      dayName: string;
    };

    const map = new Map<string, TodayCTVItem>();

    morningList.forEach((ctv) => {
      map.set(ctv.id, {
        ctv,
        shifts: ["Ca Sáng"],
        dayName: dayNameStr,
      });
    });

    afternoonList.forEach((ctv) => {
      if (map.has(ctv.id)) {
        map.get(ctv.id)!.shifts.push("Ca Chiều");
      } else {
        map.set(ctv.id, {
          ctv,
          shifts: ["Ca Chiều"],
          dayName: dayNameStr,
        });
      }
    });

    return {
      dayLabel,
      list: Array.from(map.values()),
    };
  };

  const todayData = getTodayCTVList();

  const handleCTVClick = (ctv: AssignedCTV) => {
    if (!onViewAccountDetail) return;
    const matched = accounts.find(
      (a) => a.id === ctv.id || a.name.toLowerCase() === ctv.name.toLowerCase(),
    );
    if (matched) {
      onViewAccountDetail(matched);
    } else {
      onViewAccountDetail({
        id: ctv.id,
        stt: 1,
        name: ctv.name,
        email: `${ctv.id}@company.vn`,
        phone: ctv.phone || "090 123 4567",
        role: "Cộng tác viên",
        status: "Kích hoạt",
        registerDate: "01/01/2023",
        initials: ctv.initials || ctv.name.substring(0, 2).toUpperCase(),
        avatar: ctv.avatar,
        cctvCode: ctv.cctvCode || `CTV-2023-${ctv.id}`,
        joinDate: "15/01/2023",
        shiftsCompleted: 12,
        rating: 5.0,
      });
    }
  };

  const handleOpenShiftDetail = (
    dayName: string,
    dateFormatted: string,
    shiftName: "Ca Sáng" | "Ca Chiều",
    dayIndex: number,
  ) => {
    const rawList = getAssignedCTVs(dayIndex, shiftName === "Ca Sáng" ? "morning" : "afternoon");

    // Enrich CTVs with room and taskContent
    const enrichedList = rawList.map((ctv, idx) => {
      const roomDisplay = ctv.room || DEFAULT_ROOMS[idx % DEFAULT_ROOMS.length];
      const taskDisplay = ctv.taskContent || DEFAULT_TASKS[idx % DEFAULT_TASKS.length];
      return {
        ...ctv,
        roomDisplay,
        taskDisplay,
      };
    });

    setSelectedShiftDetail({
      dayName,
      dateFormatted,
      shiftName,
      shiftTimeLabel: shiftName === "Ca Sáng" ? "08:00 - 12:00" : "13:30 - 17:30",
      ctvList: enrichedList,
    });
  };

  const handleExport = () => {
    if (onShowToast) {
      onShowToast(
        `Đã xuất báo cáo lịch làm việc ${monthNames[selectedMonth]}, ${selectedYear} thành công!`,
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#25262b] p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#3b3d45] shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1b1e] dark:text-slate-100 tracking-tight">
            Lịch làm việc tổng hợp
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quản lý và theo dõi phân công lịch làm việc CTV theo tháng
          </p>
        </div>

        {/* Month Switcher Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-[#1f2023] p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#2c2d33] text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center justify-center"
              title="Tháng trước"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>

            <span className="px-3 text-xs font-bold text-slate-800 dark:text-slate-100 min-w-[110px] text-center">
              {monthNames[selectedMonth]}, {selectedYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#2c2d33] text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center justify-center"
              title="Tháng sau"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleTodayMonth}
            className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-accent dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">today</span>
            <span>Hôm nay</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#3b3d45] hover:bg-slate-50 dark:hover:bg-[#2c2d33] text-xs font-bold text-[#1a1b1e] dark:text-slate-200 transition-colors shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Xuất lịch làm việc</span>
          </button>
        </div>
      </div>

      {/* Danh sách CTV đăng ký hôm nay (Giữ nguyên khối trên cùng) */}
      <div className="bg-white dark:bg-[#25262b] border border-[#E2E8F0] dark:border-[#3b3d45] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">badge</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 flex-wrap">
                <span>Danh sách CTV đăng ký hôm nay</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  {todayData.dayLabel}
                </span>
              </h3>
            </div>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Tổng số:{" "}
            <strong className="text-slate-800 dark:text-slate-200">{todayData.list.length}</strong>{" "}
            Cộng tác viên
          </span>
        </div>

        {todayData.list.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            <span className="material-symbols-outlined text-[32px] block mb-1 opacity-50">
              person_off
            </span>
            <p className="text-sm font-medium">Chưa có CTV nào đăng ký hôm nay</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayData.list.map(({ ctv, shifts, dayName }) => {
              const primaryShift = shifts[0];
              const statusKey = `${dayName}_${primaryShift}_${ctv.id}`;
              const status = ctvStatuses[statusKey] || "Đi làm";

              return (
                <div
                  key={ctv.id}
                  onClick={() => handleCTVClick(ctv)}
                  className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#1f2023] border border-slate-200/80 dark:border-slate-800 hover:border-accent hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {ctv.avatar ? (
                      <img
                        src={ctv.avatar}
                        alt={ctv.name}
                        className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-accent transition-all"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#1b365d] text-white font-bold text-sm flex items-center justify-center shrink-0 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-accent transition-all">
                        {ctv.initials || ctv.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors truncate">
                        {ctv.name}
                      </h4>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                            status === "Đi làm"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              status === "Đi làm" ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          <span className="whitespace-nowrap">{status}</span>
                        </span>

                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold whitespace-nowrap shrink-0 ${
                            shifts.length > 1
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300"
                              : shifts[0] === "Ca Sáng"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300"
                                : "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300"
                          }`}
                        >
                          <span className="whitespace-nowrap">
                            Ca: {shifts.map((s) => s.replace("Ca ", "")).join(", ")}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Master Monthly Calendar Grid (5 Cột Mon - Fri) */}
      <div className="bg-white dark:bg-[#25262b] border border-[#E2E8F0] dark:border-[#3b3d45] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-accent text-[22px]">
              calendar_month
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Lịch Tháng tổng thể - {monthNames[selectedMonth]}, {selectedYear}
            </h3>
          </div>
        </div>

        {/* Grid Table Container */}
        <div className="overflow-x-auto">
          <div className="min-w-[850px]">
            {/* Header Columns (Mon to Fri) */}
            <div className="grid grid-cols-5 gap-3 mb-3 text-center">
              {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"].map((dayHeader, idx) => (
                <div
                  key={idx}
                  className="py-2.5 px-3 bg-slate-100 dark:bg-[#1f2023] rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-wider border border-slate-200/80 dark:border-slate-800"
                >
                  {dayHeader}
                </div>
              ))}
            </div>

            {/* Calendar Weeks Rows */}
            <div className="space-y-3">
              {calendarWeeks.map((week, weekIdx) => (
                <div key={weekIdx} className="grid grid-cols-5 gap-3">
                  {week.map((cell, colIdx) => {
                    if (!cell) {
                      return (
                        <div
                          key={colIdx}
                          className="min-h-[110px] bg-slate-50/50 dark:bg-[#1f2023]/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800/60 opacity-40"
                        />
                      );
                    }

                    const morningCTVs = getAssignedCTVs(cell.dayIndex, "morning");
                    const afternoonCTVs = getAssignedCTVs(cell.dayIndex, "afternoon");

                    return (
                      <div
                        key={colIdx}
                        className={`min-h-[110px] p-3 rounded-xl border transition-all flex flex-col justify-between ${
                          cell.isToday
                            ? "border-blue-700 bg-blue-50/40 ring-2 ring-blue-700/20 dark:border-blue-500 dark:bg-blue-950/20"
                            : "bg-white dark:bg-[#222327] border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        {/* Day Cell Header */}
                        <div className="flex items-center justify-center border-b border-slate-100 dark:border-slate-800/80 pb-1.5 mb-2">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <span>{cell.dateShort}</span>
                            {cell.isToday && (
                              <span className="rounded bg-blue-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                Hôm nay
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Shift Action Buttons inside Day Cell */}
                        <div className="space-y-1.5">
                          {/* Ca Sáng Button */}
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenShiftDetail(
                                cell.dayName,
                                cell.dateFormatted,
                                "Ca Sáng",
                                cell.dayIndex,
                              )
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/80 border border-amber-200/80 dark:border-amber-900/40 flex items-center justify-between text-left transition-all cursor-pointer group"
                            title="Bấm xem danh sách CTV ca sáng"
                          >
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 dark:text-amber-300">
                              <span className="material-symbols-outlined text-[15px]">
                                wb_sunny
                              </span>
                              <span>Ca Sáng</span>
                            </div>
                            <span className="text-[10px] font-bold bg-amber-200/80 dark:bg-amber-900/70 text-amber-900 dark:text-amber-200 px-1.5 py-0.2 rounded group-hover:scale-105 transition-transform">
                              {morningCTVs.length} CTV
                            </span>
                          </button>

                          {/* Ca Chiều Button */}
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenShiftDetail(
                                cell.dayName,
                                cell.dateFormatted,
                                "Ca Chiều",
                                cell.dayIndex,
                              )
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-950/80 border border-purple-200/80 dark:border-purple-900/40 flex items-center justify-between text-left transition-all cursor-pointer group"
                            title="Bấm xem danh sách CTV ca chiều"
                          >
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-800 dark:text-purple-300">
                              <span className="material-symbols-outlined text-[15px]">
                                wb_twilight
                              </span>
                              <span>Ca Chiều</span>
                            </div>
                            <span className="text-[10px] font-bold bg-purple-200/80 dark:bg-purple-900/70 text-purple-900 dark:text-purple-200 px-1.5 py-0.2 rounded group-hover:scale-105 transition-transform">
                              {afternoonCTVs.length} CTV
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Side-Sheet / Modal "Chi tiết ca làm việc" */}
      {selectedShiftDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#25262b] rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#1f2023] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-accent mb-1">
                  <span className="material-symbols-outlined text-[18px]">event_note</span>
                  <span>CHI TIẾT CA LÀM VIỆC</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedShiftDetail.shiftName} - {selectedShiftDetail.dayName} (
                  {selectedShiftDetail.dateFormatted})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Khung giờ:{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    {selectedShiftDetail.shiftTimeLabel}
                  </strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedShiftDetail(null)}
                className="w-9 h-9 rounded-full bg-slate-200/60 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body: Table Layout */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between bg-blue-50/80 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-100 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 font-medium">
                <span>Danh sách CTV đã được phê duyệt phân công ca</span>
                <span className="font-bold bg-blue-100 dark:bg-blue-900 text-accent dark:text-blue-200 px-2.5 py-0.5 rounded-lg">
                  Tổng số: {selectedShiftDetail.ctvList.length} CTV
                </span>
              </div>

              {selectedShiftDetail.ctvList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <span className="material-symbols-outlined text-[44px] block opacity-40">
                    group_off
                  </span>
                  <p className="text-sm font-semibold">Chưa có CTV nào đăng ký ca làm việc này</p>
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[720px]">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-[#1f2023] border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          <th className="py-3.5 px-4">Họ tên CTV</th>
                          <th className="py-3.5 px-4">Số điện thoại</th>
                          <th className="py-3.5 px-4">Phòng làm việc</th>
                          <th className="py-3.5 px-4">Nội dung công việc dự kiến</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                        {selectedShiftDetail.ctvList.map((ctv, idx) => (
                          <tr
                            key={ctv.id || idx}
                            className="hover:bg-slate-50/80 dark:hover:bg-[#1f2023]/60 transition-colors"
                          >
                            {/* Họ tên CTV */}
                            <td className="py-3.5 px-4">
                              <div
                                onClick={() => {
                                  handleCTVClick(ctv);
                                  setSelectedShiftDetail(null);
                                }}
                                className="inline-flex items-center gap-3 cursor-pointer group"
                                title="Bấm xem chi tiết thông tin CTV"
                              >
                                {ctv.avatar ? (
                                  <img
                                    src={ctv.avatar}
                                    alt={ctv.name}
                                    className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-accent transition-all"
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-[#1b365d] text-white font-bold text-xs flex items-center justify-center shrink-0 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-accent transition-all">
                                    {ctv.initials || ctv.name.substring(0, 2).toUpperCase()}
                                  </div>
                                )}
                                <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
                                  {ctv.name}
                                </span>
                              </div>
                            </td>

                            {/* Số điện thoại */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                                <span className="material-symbols-outlined text-[15px] text-slate-400">
                                  call
                                </span>
                                <span>{ctv.phone || "090 123 4567"}</span>
                              </div>
                            </td>

                            {/* Phòng làm việc */}
                            <td className="py-3.5 px-4">
                              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 font-semibold rounded-lg border border-blue-100 dark:border-blue-900/60 inline-block text-[11px]">
                                {ctv.roomDisplay}
                              </span>
                            </td>

                            {/* Nội dung công việc */}
                            <td className="py-3.5 px-4">
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-md">
                                {ctv.taskDisplay}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-[#1f2023] border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedShiftDetail(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
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
