import React, { useState } from 'react';
import { ShiftSlot, UserAccount } from '../../types';

interface SummaryScheduleScreenProps {
  shifts: ShiftSlot[];
  accounts: UserAccount[];
  onViewAccountDetail?: (account: UserAccount) => void;
  onShowToast?: (msg: string) => void;
  currentUser?: UserAccount;
  userRole?: 'Admin' | 'Cộng tác viên';
}

export const SummaryScheduleScreen: React.FC<SummaryScheduleScreenProps> = ({
  shifts,
  accounts,
  onViewAccountDetail,
  onShowToast,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [shiftTypeFilter, setShiftTypeFilter] = useState<'all' | 'morning' | 'afternoon'>('all');
  const [ctvStatuses, setCtvStatuses] = useState<Record<string, 'Đi làm' | 'Nghỉ'>>({});
  const [selectedShiftDetail, setSelectedShiftDetail] = useState<{
    dayName: string;
    dateStr: string;
    shiftName: string;
    ctvList: Array<{ id: string; name: string; avatar?: string; initials?: string; phone?: string; cctvCode?: string }>;
  } | null>(null);

  // Calculate day of week and info for selected date
  const getSelectedDateInfo = () => {
    if (!selectedDate) return null;
    const d = new Date(selectedDate + 'T00:00:00');
    if (isNaN(d.getTime())) return null;

    const dayOfWeek = d.getDay(); // 0: CN, 1: T2, 2: T3, 3: T4, 4: T5, 5: T6, 6: T7
    const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const name = dayNames[dayOfWeek];

    // dayIndex for daysConfig (T2=0, T3=1, T4=2, T5=3, T6=4)
    const dayIndex = dayOfWeek >= 1 && dayOfWeek <= 5 ? dayOfWeek - 1 : -1;
    const dateFormatted = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

    return {
      dayOfWeek,
      dayName: name,
      dayIndex,
      dateFormatted,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    };
  };

  const selectedDateInfo = getSelectedDateInfo();

  // Days from Monday (dayIndex 0) to Friday (dayIndex 4)
  const daysConfig = [
    { dayIndex: 0, dayName: 'Thứ 2', dateStr: '06/07' },
    { dayIndex: 1, dayName: 'Thứ 3', dateStr: '07/07' },
    { dayIndex: 2, dayName: 'Thứ 4', dateStr: '08/07' },
    { dayIndex: 3, dayName: 'Thứ 5', dateStr: '09/07' },
    { dayIndex: 4, dayName: 'Thứ 6', dateStr: '10/07' },
  ];

  // Filtered days list depending on date filter
  const displayedDays = selectedDateInfo && !selectedDateInfo.isWeekend
    ? daysConfig.filter((d) => d.dayIndex === selectedDateInfo.dayIndex)
    : daysConfig;

  // Helper to get shifts for a day and shiftType
  const getShiftsForDayAndType = (dayIndex: number, type: 'morning' | 'afternoon') => {
    return shifts.filter(
      (s) => s.dayIndex === dayIndex && s.shiftType === type
    );
  };

  // Helper to get all assigned CTVs for a day & shiftType
  const getAssignedCTVs = (dayIndex: number, type: 'morning' | 'afternoon') => {
    const matchedShifts = getShiftsForDayAndType(dayIndex, type);
    return matchedShifts.flatMap((s) => s.assignedCTVs || []);
  };

  // Get list of CTVs registered for today (or selected date)
  const getTodayCTVList = () => {
    let dayIndex = 0;
    let dayLabel = 'Hôm nay';

    if (selectedDateInfo) {
      if (selectedDateInfo.isWeekend || selectedDateInfo.dayIndex === -1) {
        return { dayLabel: `${selectedDateInfo.dayName} (${selectedDateInfo.dateFormatted})`, isWeekend: true, list: [] };
      }
      dayIndex = selectedDateInfo.dayIndex;
      dayLabel = `Ngày ${selectedDateInfo.dateFormatted} (${selectedDateInfo.dayName})`;
    } else {
      const now = new Date();
      const dow = now.getDay();
      if (dow >= 1 && dow <= 5) {
        dayIndex = dow - 1;
        const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'];
        dayLabel = `Hôm nay (${days[dayIndex]})`;
      } else {
        dayLabel = 'Thứ 2 (Đầu tuần)';
        dayIndex = 0;
      }
    }

    const dayObj = daysConfig.find((d) => d.dayIndex === dayIndex) || daysConfig[0];
    const morningList = getAssignedCTVs(dayIndex, 'morning');
    const afternoonList = getAssignedCTVs(dayIndex, 'afternoon');

    type TodayCTVItem = {
      ctv: { id: string; name: string; avatar?: string; initials?: string; phone?: string; cctvCode?: string };
      shifts: ('Ca Sáng' | 'Ca Chiều')[];
      dayName: string;
    };

    const map = new Map<string, TodayCTVItem>();

    morningList.forEach((ctv) => {
      map.set(ctv.id, {
        ctv,
        shifts: ['Ca Sáng'],
        dayName: dayObj.dayName,
      });
    });

    afternoonList.forEach((ctv) => {
      if (map.has(ctv.id)) {
        map.get(ctv.id)!.shifts.push('Ca Chiều');
      } else {
        map.set(ctv.id, {
          ctv,
          shifts: ['Ca Chiều'],
          dayName: dayObj.dayName,
        });
      }
    });

    return {
      dayLabel,
      isWeekend: false,
      list: Array.from(map.values()),
    };
  };

  const todayData = getTodayCTVList();

  // Helper to get total unique CTVs working on a specific day
  const getDayTotalCTVs = (dayIndex: number) => {
    const morningList = getAssignedCTVs(dayIndex, 'morning');
    const afternoonList = getAssignedCTVs(dayIndex, 'afternoon');

    const uniqueMap = new Map<string, string>();
    morningList.forEach((c) => uniqueMap.set(c.id, c.name));
    afternoonList.forEach((c) => uniqueMap.set(c.id, c.name));

    return {
      count: uniqueMap.size,
      morningCount: morningList.length,
      afternoonCount: afternoonList.length,
    };
  };

  // Overall Statistics across T2 - T6
  let totalUniqueCTVs = new Set<string>();
  let totalMorningCTVsCount = 0;
  let totalAfternoonCTVsCount = 0;
  let maxDay = { name: 'Thứ 2', count: 0 };

  daysConfig.forEach((day) => {
    const m = getAssignedCTVs(day.dayIndex, 'morning');
    const a = getAssignedCTVs(day.dayIndex, 'afternoon');

    m.forEach((c) => totalUniqueCTVs.add(c.id));
    a.forEach((c) => totalUniqueCTVs.add(c.id));

    totalMorningCTVsCount += m.length;
    totalAfternoonCTVsCount += a.length;

    const dayTotal = getDayTotalCTVs(day.dayIndex).count;
    if (dayTotal > maxDay.count) {
      maxDay = { name: day.dayName, count: dayTotal };
    }
  });

  const handleCTVClick = (ctv: { id: string; name: string; avatar?: string; initials?: string; phone?: string; cctvCode?: string }) => {
    if (!onViewAccountDetail) return;
    const matched = accounts.find((a) => a.id === ctv.id || a.name.toLowerCase() === ctv.name.toLowerCase());
    if (matched) {
      onViewAccountDetail(matched);
    } else {
      onViewAccountDetail({
        id: ctv.id,
        stt: 1,
        name: ctv.name,
        email: `${ctv.id}@company.vn`,
        phone: ctv.phone || '090 123 4567',
        role: 'Cộng tác viên',
        status: 'Kích hoạt',
        registerDate: '01/01/2023',
        initials: ctv.initials || ctv.name.substring(0, 2).toUpperCase(),
        avatar: ctv.avatar,
        cctvCode: ctv.cctvCode || `CTV-2023-${ctv.id}`,
        joinDate: '15/01/2023',
        shiftsCompleted: 12,
        rating: 5.0,
      });
    }
  };

  const handleExport = () => {
    if (onShowToast) {
      onShowToast('Đã xuất báo cáo lịch làm việc tổng hợp (Thứ 2 - Thứ 6) thành công!');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#25262b] p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#3b3d45] shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1b1e] dark:text-slate-100">
            Lịch làm việc tổng hợp
          </h2>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#3b3d45] hover:bg-slate-50 dark:hover:bg-[#2c2d33] text-sm font-semibold text-[#1a1b1e] dark:text-slate-200 transition-colors shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>Xuất lịch làm việc</span>
          </button>
        </div>
      </div>



      {/* Danh sách CTV đăng ký hôm nay */}
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
            Tổng số: <strong className="text-slate-800 dark:text-slate-200">{todayData.list.length}</strong> Cộng tác viên
          </span>
        </div>

        {todayData.isWeekend ? (
          <div className="text-center py-6 text-slate-400">
            <span className="material-symbols-outlined text-[32px] block mb-1 opacity-50">event_busy</span>
            <p className="text-sm">Hôm nay là cuối tuần - Không có lịch đăng ký ca</p>
          </div>
        ) : todayData.list.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            <span className="material-symbols-outlined text-[32px] block mb-1 opacity-50">person_off</span>
            <p className="text-sm font-medium">Chưa có CTV nào đăng ký hôm nay</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayData.list.map(({ ctv, shifts, dayName }) => {
              const primaryShift = shifts[0];
              const statusKey = `${dayName}_${primaryShift}_${ctv.id}`;
              const status = ctvStatuses[statusKey] || 'Đi làm';

              return (
                <div
                  key={ctv.id}
                  onClick={() => handleCTVClick(ctv)}
                  className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#1f2023] border border-slate-200/80 dark:border-slate-800 hover:border-accent hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
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

                    {/* Information: Tên, Ca (Sáng/Chiều), Tình trạng (Đi làm/Nghỉ) */}
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors truncate">
                        {ctv.name}
                      </h4>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {/* Tình trạng (Đi làm/Nghỉ) */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                            status === 'Đi làm'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              status === 'Đi làm' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <span className="whitespace-nowrap">{status}</span>
                        </span>

                        {/* Ca (Sáng/Chiều) */}
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold whitespace-nowrap shrink-0 ${
                            shifts.length > 1
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                              : shifts[0] === 'Ca Sáng'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300'
                          }`}
                        >
                          <span className="whitespace-nowrap">Ca: {shifts.map((s) => s.replace('Ca ', '')).join(', ')}</span>
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

      {/* Date Filter Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#25262b] p-4 rounded-xl border border-[#E2E8F0] dark:border-[#3b3d45]">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">
                calendar_today
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#1f2023] border border-[#E2E8F0] dark:border-[#3b3d45] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent text-[#1a1b1e] dark:text-slate-200 cursor-pointer font-medium"
              />
            </div>
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate('')}
                className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-[#1f2023] dark:hover:bg-[#2c2d33] border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                title="Xem tất cả các ngày"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Tất cả</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Ca */}
            <div className="flex bg-slate-100 dark:bg-[#1f2023] p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setShiftTypeFilter('all')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  shiftTypeFilter === 'all'
                    ? 'bg-white dark:bg-[#2b2c32] text-accent shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Tất cả ca
              </button>
              <button
                type="button"
                onClick={() => setShiftTypeFilter('morning')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  shiftTypeFilter === 'morning'
                    ? 'bg-white dark:bg-[#2b2c32] text-amber-600 dark:text-amber-400 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Ca Sáng
              </button>
              <button
                type="button"
                onClick={() => setShiftTypeFilter('afternoon')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  shiftTypeFilter === 'afternoon'
                    ? 'bg-white dark:bg-[#2b2c32] text-purple-600 dark:text-purple-400 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Ca Chiều
              </button>
            </div>
          </div>
        </div>

        {/* Selected Date Result Information Banner */}
        {selectedDateInfo && (
          <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-accent font-bold flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">event</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>Ngày {selectedDateInfo.dateFormatted}</span>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-accent text-white text-xs font-bold">
                    {selectedDateInfo.dayName}
                  </span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {selectedDateInfo.isWeekend ? (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">
                      {selectedDateInfo.dayName} là ngày nghỉ - Không có ca làm việc chính thức.
                    </span>
                  ) : (
                    <span>
                      Lịch làm việc của <strong>{selectedDateInfo.dayName}</strong> ({selectedDateInfo.dateFormatted}):
                    </span>
                  )}
                </p>
              </div>
            </div>

            {!selectedDateInfo.isWeekend && selectedDateInfo.dayIndex !== -1 && (
              <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800">
                  Ca Sáng: {getAssignedCTVs(selectedDateInfo.dayIndex, 'morning').length} CTV
                </span>
                <span className="px-2.5 py-1 bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 rounded-lg border border-purple-200 dark:border-purple-800">
                  Ca Chiều: {getAssignedCTVs(selectedDateInfo.dayIndex, 'afternoon').length} CTV
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Schedule Column Grid */}
      <div className={`grid grid-cols-1 ${displayedDays.length > 1 ? 'md:grid-cols-3 lg:grid-cols-5' : 'max-w-md mx-auto'} gap-4`}>
          {displayedDays.map((day) => {
            const dayStats = getDayTotalCTVs(day.dayIndex);
            const morningCTVs = getAssignedCTVs(day.dayIndex, 'morning');
            const afternoonCTVs = getAssignedCTVs(day.dayIndex, 'afternoon');

            const showMorning = shiftTypeFilter === 'all' || shiftTypeFilter === 'morning';
            const showAfternoon = shiftTypeFilter === 'all' || shiftTypeFilter === 'afternoon';

            return (
              <div
                key={day.dayIndex}
                className="bg-white dark:bg-[#25262b] border border-[#E2E8F0] dark:border-[#3b3d45] rounded-xl flex flex-col overflow-hidden shadow-2xs"
              >
                {/* Column Day Header */}
                <div className="p-3.5 bg-slate-50 dark:bg-[#1f2023] border-b border-[#E2E8F0] dark:border-[#3b3d45]">
                  <h3 className="font-bold text-sm text-[#1a1b1e] dark:text-slate-100">
                    {day.dayName}
                  </h3>
                </div>

                {/* Day Shifts Content */}
                <div className="p-3.5 space-y-3 flex-1">
                  {/* CA SÁNG */}
                  {showMorning && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedShiftDetail({
                          dayName: day.dayName,
                          dateStr: day.dateStr,
                          shiftName: 'Ca Sáng',
                          ctvList: morningCTVs,
                        })
                      }
                      className="w-full p-3.5 rounded-xl bg-amber-50 hover:bg-amber-100/90 dark:bg-amber-950/30 dark:hover:bg-amber-950/60 border border-amber-200/80 dark:border-amber-900/40 text-left transition-all cursor-pointer shadow-2xs group flex items-center justify-between"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                          <span className="material-symbols-outlined text-[18px]">wb_sunny</span>
                          <span>Ca Sáng</span>
                        </div>
                        <div className="pl-6">
                          <span className="inline-block font-bold bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-md text-[11px]">
                            {morningCTVs.length} CTV
                          </span>
                        </div>
                      </div>
                    </button>
                  )}

                  {/* CA CHIỀU */}
                  {showAfternoon && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedShiftDetail({
                          dayName: day.dayName,
                          dateStr: day.dateStr,
                          shiftName: 'Ca Chiều',
                          ctvList: afternoonCTVs,
                        })
                      }
                      className="w-full p-3.5 rounded-xl bg-purple-50 hover:bg-purple-100/90 dark:bg-purple-950/30 dark:hover:bg-purple-950/60 border border-purple-200/80 dark:border-purple-900/40 text-left transition-all cursor-pointer shadow-2xs group flex items-center justify-between"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800 dark:text-purple-300">
                          <span className="material-symbols-outlined text-[18px]">wb_twilight</span>
                          <span>Ca Chiều</span>
                        </div>
                        <div className="pl-6">
                          <span className="inline-block font-bold bg-purple-200/80 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 px-2 py-0.5 rounded-md text-[11px]">
                            {afternoonCTVs.length} CTV
                          </span>
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      {/* Modal CTV List for Selected Shift */}
      {selectedShiftDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#25262b] rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#1f2023] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-accent mb-0.5">
                  <span className="material-symbols-outlined text-[16px]">group</span>
                  <span>DANH SÁCH CỘNG TÁC VIÊN</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedShiftDetail.shiftName} - {selectedShiftDetail.dayName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedShiftDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body - CTV List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">
                <span>Tổng số: <strong className="text-slate-800 dark:text-slate-200">{selectedShiftDetail.ctvList.length}</strong> Cộng tác viên</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px]">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  <span>Đã duyệt</span>
                </span>
              </div>

              {selectedShiftDetail.ctvList.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <span className="material-symbols-outlined text-[36px] block mb-1 opacity-50">person_off</span>
                  <p className="text-sm font-medium">Chưa có CTV nào đăng ký đi làm ca này</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedShiftDetail.ctvList.map((ctv) => {
                    const statusKey = `${selectedShiftDetail.dayName}_${selectedShiftDetail.shiftName}_${ctv.id}`;
                    const status = ctvStatuses[statusKey] || 'Đi làm';

                    return (
                      <div
                        key={ctv.id}
                        onClick={() => {
                          handleCTVClick(ctv);
                          setSelectedShiftDetail(null);
                        }}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-[#1f2023] border border-slate-200/70 dark:border-slate-800 hover:border-accent hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {ctv.avatar ? (
                            <img
                              src={ctv.avatar}
                              alt={ctv.name}
                              className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-accent transition-all"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#1b365d] text-white font-bold text-sm flex items-center justify-center shrink-0 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-accent transition-all">
                              {ctv.initials || ctv.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors truncate">
                              {ctv.name}
                            </h4>
                            <div className="mt-0.5">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                                  status === 'Đi làm'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    status === 'Đi làm' ? 'bg-emerald-500' : 'bg-rose-500'
                                  }`}
                                />
                                <span>{status}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span className="material-symbols-outlined text-slate-400 group-hover:text-accent text-[20px] transition-colors">
                            chevron_right
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-50 dark:bg-[#1f2023] border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedShiftDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-colors cursor-pointer"
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
