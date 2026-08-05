import React, { useState } from 'react';
import { User, AccountStatus } from '../types';
import { 
  UserCheck, 
  Search, 
  Download, 
  Eye, 
  Check, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Unlock, 
  CreditCard, 
  Phone, 
  Mail, 
  Calendar, 
  X, 
  ZoomIn, 
  ShieldCheck, 
  AlertTriangle,
  FileCheck,
  CheckSquare,
  Square,
  FileSpreadsheet
} from 'lucide-react';

interface CTVManagementViewProps {
  users: User[];
  onUpdateStatus: (userId: string, newStatus: AccountStatus) => void;
}

export const CTVManagementView: React.FC<CTVManagementViewProps> = ({
  users,
  onUpdateStatus
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'active' | 'locked'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selection state for STT / Checkbox column
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Verification Side-Drawer State
  const [selectedCtv, setSelectedCtv] = useState<User | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Rejection Reason Modal State
  const [rejectModalUser, setRejectModalUser] = useState<User | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Base list of CTVs from users prop
  const rawCtvList = users.filter(u => u.role === 'collaborator');

  // Supplementary realistic mock CTVs to populate full enterprise list
  const extraCtvList: User[] = [
    {
      id: 'ctv-ex-1',
      username: 'vo.minh.tri',
      fullName: 'Võ Minh Trí',
      email: 'tri.vo@schedulo.com',
      phone: '0908 112 233',
      cccd: '079201004561',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      role: 'collaborator',
      status: 'pending',
      registeredDate: '03/08/2026',
      dob: '14/02/1997',
      address: 'Quận 1, TP. Hồ Chí Minh',
      teamName: 'Đội Kỹ Thuật AI',
      phoneVerified: true,
      cccdVerified: false,
      idCardFront: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
      idCardBack: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600'
    },
    {
      id: 'ctv-ex-2',
      username: 'dang.hoang.yen',
      fullName: 'Đặng Hoàng Yến',
      email: 'yen.dang@schedulo.com',
      phone: '0938 445 566',
      cccd: '001198003412',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'collaborator',
      status: 'pending',
      registeredDate: '02/08/2026',
      dob: '25/09/1999',
      address: 'Quận Cầu Giấy, Hà Nội',
      teamName: 'Đội Kiểm Thử Hardware',
      phoneVerified: true,
      cccdVerified: false,
      idCardFront: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
      idCardBack: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600'
    },
    {
      id: 'ctv-ex-3',
      username: 'bui.thanh.nam',
      fullName: 'Bùi Thành Nam',
      email: 'nam.bui@schedulo.com',
      phone: '0912 889 900',
      cccd: '036095001122',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'collaborator',
      status: 'active',
      registeredDate: '28/07/2026',
      dob: '10/11/1995',
      address: 'Quận Hải Châu, Đà Nẵng',
      teamName: 'Đội Phân Tích Dữ Liệu',
      phoneVerified: true,
      cccdVerified: true,
      idCardFront: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
      idCardBack: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600'
    },
    {
      id: 'ctv-ex-4',
      username: 'ngo.truong.giang',
      fullName: 'Ngô Trường Giang',
      email: 'giang.ngo@schedulo.com',
      phone: '0977 334 455',
      cccd: '025093008877',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      role: 'collaborator',
      status: 'locked',
      registeredDate: '15/07/2026',
      dob: '08/04/1993',
      address: 'Quận Nam Từ Liêm, Hà Nội',
      teamName: 'Đội Hỗ Trợ Đào Tạo',
      phoneVerified: true,
      cccdVerified: true,
      idCardFront: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
      idCardBack: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600'
    }
  ];

  // Combine raw list with unique extras
  const combinedCtvList = [...rawCtvList];
  extraCtvList.forEach(extra => {
    if (!combinedCtvList.some(u => u.id === extra.id)) {
      combinedCtvList.push(extra);
    }
  });

  // Calculate stats
  const pendingCount = 18;
  const activeCount = 139;
  const lockedCount = 3;
  const totalCount = 160;

  // Filter CTV list
  const filteredUsers = combinedCtvList.filter(u => {
    const matchesFilter = activeFilter === 'all' || u.status === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      u.fullName.toLowerCase().includes(q) ||
      u.cccd.includes(q) ||
      u.phone.includes(q) ||
      u.email.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUsers.map(u => u.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Excel Export Handler
  const handleExportExcel = () => {
    const headers = 'STT,Họ và tên,Số CCCD,Số điện thoại,Email,Trạng thái,Ngày đăng ký\n';
    const rows = filteredUsers
      .map(
        (u, i) =>
          `${i + 1},"${u.fullName}","${u.cccd}","${u.phone}","${u.email}",${
            u.status === 'pending' ? 'Chờ phê duyệt' : u.status === 'active' ? 'Đang hoạt động' : 'Tạm khóa'
          },"${u.registeredDate}"`
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Danh_Sach_CTV_Dinh_Danh_Schedulo.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file danh sách CTV thành công!');
  };

  // Action Handlers
  const handleApproveCtv = (user: User) => {
    onUpdateStatus(user.id, 'active');
    user.status = 'active';
    user.cccdVerified = true;
    showToast(`Đã phê duyệt kích hoạt tài khoản CTV ${user.fullName}`);
    if (selectedCtv?.id === user.id) {
      setSelectedCtv(null);
    }
  };

  const handleConfirmRejection = () => {
    if (!rejectModalUser) return;
    onUpdateStatus(rejectModalUser.id, 'locked');
    rejectModalUser.status = 'locked';
    showToast(`Đã từ chối hồ sơ CTV ${rejectModalUser.fullName}. Lý do: ${rejectReason || 'Không hợp lệ'}`);
    setRejectModalUser(null);
    setRejectReason('');
    if (selectedCtv?.id === rejectModalUser.id) {
      setSelectedCtv(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center space-x-2 animate-in slide-in-from-top-4 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="mb-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-amber-600 uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4 inline" />
            <span>Highlights UC-1.3 • Quản trị viên</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản lý & Phê duyệt Định danh CTV
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Thẩm định giấy tờ CCCD, đối soát thông tin liên hệ và phân quyền tài khoản cộng tác viên.
          </p>
        </div>

        {/* Top Controls: Search Input & Export Button */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search Box */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, CCCD, Phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Export Excel Button */}
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Excel</span>
          </button>
        </div>

      </div>

      {/* Filter Tabs Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-3 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* All Filter */}
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center space-x-2 ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Tất cả</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeFilter === 'all' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-800'
            }`}>
              ({totalCount})
            </span>
          </button>

          {/* Pending Approval (Amber Badge) */}
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center space-x-2 ${
              activeFilter === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100/80 border border-amber-200'
            }`}
          >
            <span>Chờ phê duyệt</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-900 text-amber-100 animate-pulse">
              ({pendingCount})
            </span>
          </button>

          {/* Active (Green Badge) */}
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center space-x-2 ${
              activeFilter === 'active'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100/80 border border-emerald-200'
            }`}
          >
            <span>Đang hoạt động</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-800 text-emerald-100">
              ({activeCount})
            </span>
          </button>

          {/* Locked (Red Badge) */}
          <button
            onClick={() => setActiveFilter('locked')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center space-x-2 ${
              activeFilter === 'locked'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-rose-50 text-rose-900 hover:bg-rose-100/80 border border-rose-200'
            }`}
          >
            <span>Tạm khóa</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-900 text-rose-100">
              ({lockedCount})
            </span>
          </button>

        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                
                {/* 1. STT / Checkbox */}
                <th className="py-4 px-4 text-center w-16">
                  <div className="flex items-center justify-center space-x-1.5">
                    <button
                      onClick={handleSelectAll}
                      className="text-slate-400 hover:text-indigo-600 cursor-pointer"
                      title="Chọn tất cả"
                    >
                      {selectedIds.length > 0 && selectedIds.length === filteredUsers.length ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                    <span>STT</span>
                  </div>
                </th>

                {/* 2. Họ và tên */}
                <th className="py-4 px-6">Họ và tên</th>

                {/* 3. Số CCCD */}
                <th className="py-4 px-6">Số CCCD</th>

                {/* 4. SĐT & Email */}
                <th className="py-4 px-6">Số điện thoại & Email</th>

                {/* 5. Ngày đăng ký */}
                <th className="py-4 px-6">Ngày đăng ký</th>

                {/* 6. Trạng thái */}
                <th className="py-4 px-6">Trạng thái</th>

                {/* 7. Thao tác */}
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                    Không tìm thấy dữ liệu hồ sơ CTV phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => {
                  const isSelected = selectedIds.includes(user.id);

                  return (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      
                      {/* 1. STT / Checkbox */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleToggleSelect(user.id)}
                            className="text-slate-400 hover:text-indigo-600 cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                          <span className="font-extrabold text-slate-400 text-[11px]">
                            {idx + 1}
                          </span>
                        </div>
                      </td>

                      {/* 2. Họ và tên (Avatar + Name) */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt=""
                            className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-extrabold text-slate-900 text-xs">{user.fullName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">@{user.username} • {user.teamName || 'CTV Mới'}</p>
                          </div>
                        </div>
                      </td>

                      {/* 3. Số CCCD (Bold text for identity verification) */}
                      <td className="py-4 px-6">
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-100 rounded-xl border border-slate-200">
                          <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="font-mono font-black text-slate-900 tracking-wider">
                            {user.cccd}
                          </span>
                        </div>
                      </td>

                      {/* 4. Số điện thoại & Email */}
                      <td className="py-4 px-6 text-slate-700">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{user.phone}</span>
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium flex items-center space-x-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{user.email}</span>
                          </p>
                        </div>
                      </td>

                      {/* 5. Ngày đăng ký */}
                      <td className="py-4 px-6 font-semibold text-slate-500 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{user.registeredDate}</span>
                        </div>
                      </td>

                      {/* 6. Trạng thái (Color Badges: Amber, Emerald, Rose) */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {user.status === 'pending' && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center space-x-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Chờ phê duyệt</span>
                          </span>
                        )}
                        {user.status === 'active' && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center space-x-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Đang hoạt động</span>
                          </span>
                        )}
                        {user.status === 'locked' && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300 inline-flex items-center space-x-1">
                            <Lock className="w-3 h-3 text-rose-600" />
                            <span>Tạm khóa</span>
                          </span>
                        )}
                      </td>

                      {/* 7. Thao tác (Eye Icon, Check Icon, Lock Icon) */}
                      <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                        
                        {/* Eye Icon - View ID */}
                        <button
                          onClick={() => setSelectedCtv(user)}
                          className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center"
                          title="View ID (Eye Icon)"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Check Icon - Approve */}
                        {user.status !== 'active' && (
                          <button
                            onClick={() => handleApproveCtv(user)}
                            className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all cursor-pointer inline-flex items-center justify-center shadow-2xs"
                            title="Approve (Check Icon)"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        {/* Lock Icon - Lock */}
                        {user.status === 'active' && (
                          <button
                            onClick={() => {
                              setRejectModalUser(user);
                              setRejectReason('Tài khoản bị tạm khóa bởi Quản trị viên');
                            }}
                            className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center"
                            title="Lock (Lock Icon)"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        )}

                        {user.status === 'locked' && (
                          <button
                            onClick={() => handleApproveCtv(user)}
                            className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center"
                            title="Unlock (Lock Icon)"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        )}

                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-Drawer Overlay (When clicking Eye Icon / View ID) */}
      {selectedCtv && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full h-full max-h-[92vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-slate-200 flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <FileCheck className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Hồ sơ CTV Identity Record
                    </h3>
                    <p className="text-[11px] font-extrabold text-slate-400">
                      Mã CTV: {selectedCtv.id}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCtv(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-2xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-2xl flex items-center justify-between text-xs font-black ${
                selectedCtv.status === 'pending'
                  ? 'bg-amber-100 text-amber-950 border border-amber-300'
                  : selectedCtv.status === 'active'
                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                  : 'bg-rose-100 text-rose-950 border border-rose-300'
              }`}>
                <span>TRẠNG THÁI HỒ SƠ:</span>
                <span className="uppercase px-2.5 py-1 bg-white/80 rounded-xl shadow-2xs">
                  {selectedCtv.status === 'pending' ? 'Chờ thẩm định & kích hoạt' : selectedCtv.status === 'active' ? 'Đã duyệt hoạt động' : 'Đang bị tạm khóa'}
                </span>
              </div>

              {/* CTV Info Block */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <img
                    src={selectedCtv.avatar}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/20 shrink-0"
                  />
                  <div>
                    <h4 className="text-base font-black text-slate-900">{selectedCtv.fullName}</h4>
                    <p className="text-xs font-bold text-indigo-600 mt-0.5">@{selectedCtv.username} • {selectedCtv.teamName || 'CTV Mới'}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Ngày đăng ký: {selectedCtv.registeredDate}</p>
                  </div>
                </div>

                {/* Identity Particulars */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-0.5">
                      CCCD Number
                    </span>
                    <span className="font-mono font-black text-slate-900 text-sm">
                      {selectedCtv.cccd}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-0.5">
                      Phone Number
                    </span>
                    <span className="font-extrabold text-slate-800">
                      {selectedCtv.phone}
                    </span>
                  </div>

                  <div className="col-span-2 pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-0.5">
                      Email Address
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedCtv.email}
                    </span>
                  </div>
                </div>

                {/* CCCD Image Previews */}
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span>CCCD Image Preview</span>
                    <span className="text-[10px] font-extrabold text-indigo-600">Bấm ảnh để phóng to</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Front Side */}
                    <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3">
                      <img
                        src={selectedCtv.idCardFront || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600'}
                        alt="Mặt trước CCCD"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => setZoomedImage(selectedCtv.idCardFront || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600')}
                          className="p-2 bg-white/95 text-slate-900 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer shadow-md"
                        >
                          <ZoomIn className="w-4 h-4 text-indigo-600" />
                          <span>Xem ảnh lớn</span>
                        </button>
                      </div>
                      <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
                        Mặt trước CCCD
                      </span>
                    </div>

                    {/* Back Side */}
                    <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3">
                      <img
                        src={selectedCtv.idCardBack || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600'}
                        alt="Mặt sau CCCD"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => setZoomedImage(selectedCtv.idCardBack || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600')}
                          className="p-2 bg-white/95 text-slate-900 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer shadow-md"
                        >
                          <ZoomIn className="w-4 h-4 text-indigo-600" />
                          <span>Xem ảnh lớn</span>
                        </button>
                      </div>
                      <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
                        Mặt sau CCCD
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* Action Buttons in Drawer */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center space-x-3">
                {/* Phê duyệt kích hoạt (Green Button) */}
                <button
                  onClick={() => handleApproveCtv(selectedCtv)}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-xs rounded-2xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Phê duyệt kích hoạt</span>
                </button>

                {/* Từ chối hồ sơ (Red Button - Opens Reason Modal) */}
                <button
                  onClick={() => {
                    setRejectModalUser(selectedCtv);
                    setRejectReason('Ảnh CCCD mờ, không rõ thông tin số định danh.');
                  }}
                  className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-xs rounded-2xl shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Từ chối hồ sơ</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedCtv(null)}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Reason Modal for Rejection */}
      {rejectModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-rose-600">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-black text-slate-900">
                  Từ chối hồ sơ CTV
                </h3>
              </div>
              <button
                onClick={() => setRejectModalUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Vui lòng chọn hoặc nhập lý do từ chối phê duyệt hồ sơ của CTV <strong className="text-slate-900 font-black">{rejectModalUser.fullName}</strong>:
            </p>

            {/* Quick Reason Chips */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-slate-500 uppercase">Gợi ý lý do nhanh:</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Ảnh CCCD bị mờ/mất góc',
                  'Thông tin không khớp CCCD',
                  'Số điện thoại không hợp lệ',
                  'Ảnh chụp không chính chủ'
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setRejectReason(chip)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 rounded-xl text-[11px] font-extrabold text-slate-700 border border-slate-200/80 transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason Textarea */}
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                Chi tiết lý do từ chối:
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Nhập lý do cụ thể..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            {/* Modal Controls */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => setRejectModalUser(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmRejection}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                Xác nhận từ chối
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div 
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-3xl w-full">
            <img src={zoomedImage} alt="Large preview" className="w-full h-auto rounded-3xl shadow-2xl border-2 border-white/20" />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-10 right-0 text-white font-extrabold text-xs bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-md"
            >
              Đóng (ESC)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
