import React, { useState } from 'react';
import { User } from '../types';
import { 
  User as UserIcon, 
  ShieldCheck, 
  Camera, 
  Lock, 
  Mail, 
  Phone, 
  CreditCard, 
  KeyRound, 
  CheckCircle2, 
  Save, 
  AlertCircle
} from 'lucide-react';

interface ProfileSettingsViewProps {
  currentUser: User;
  onUpdateProfile: (updated: Partial<User>) => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  currentUser,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Form States
  const [fullName, setFullName] = useState<string>(currentUser.fullName);
  const [phone, setPhone] = useState<string>(currentUser.phone);
  const [email, setEmail] = useState<string>(currentUser.email);
  const [avatar, setAvatar] = useState<string>(
    currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  );

  // Password States
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showSuccessToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      fullName,
      phone,
      email,
      avatar
    });
    showSuccessToast('Đã lưu thay đổi thông tin cá nhân thành công!');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không trùng khớp!');
      return;
    }
    showSuccessToast('Đã cập nhật mật khẩu mới thành công!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Password Strength Calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Chưa nhập', color: 'bg-slate-200' };
    if (pwd.length < 6) return { score: 1, label: 'Yếu', color: 'bg-red-500' };
    if (pwd.length < 10) return { score: 2, label: 'Trung bình', color: 'bg-amber-500' };
    return { score: 3, label: 'Mạnh', color: 'bg-emerald-500' };
  };

  const pwdStrength = getPasswordStrength(newPassword);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg font-bold text-xs flex items-center space-x-2 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Title */}
      <div className="mb-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Cài đặt hồ sơ
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Quản lý thông tin cá nhân, cập nhật liên hệ và thiết lập mật khẩu bảo mật của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Vertical Navigation Tabs */}
        <div className="md:col-span-1 space-y-1.5">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-2.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Thông tin cá nhân</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-2.5 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Bảo mật & Mật khẩu</span>
          </button>
        </div>

        {/* Right Tab Content Panel */}
        <div className="md:col-span-3 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          
          {/* TAB 1: Thông tin cá nhân */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              
              {/* Avatar Uploader Section */}
              <div className="flex items-center space-x-5 pb-6 border-b border-slate-100">
                <div className="relative">
                  <img
                    src={avatar}
                    alt={fullName}
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newUrl = prompt('Nhập URL hình ảnh avatar mới:', avatar);
                      if (newUrl) setAvatar(newUrl);
                    }}
                    className="absolute -bottom-1 -right-1 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md cursor-pointer transition-transform hover:scale-110"
                    title="Đổi ảnh đại diện"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900">{fullName}</h3>
                  <p className="text-xs text-slate-500 font-medium">{currentUser.username} • {currentUser.teamName || 'CTV Chuyên môn'}</p>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Đã xác thực định danh CCCD
                  </span>
                </div>
              </div>

              {/* Read-Only Identity Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    Tên đăng nhập (Read-only)
                  </label>
                  <input
                    type="text"
                    value={currentUser.username}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-200/70 border border-slate-300/80 rounded-xl text-xs font-bold text-slate-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    Số CCCD / CMND (Read-only)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={currentUser.cccd}
                      disabled
                      className="w-full px-3.5 py-2.5 bg-slate-200/70 border border-slate-300/80 rounded-xl text-xs font-bold text-slate-700 cursor-not-allowed pl-9"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên đầy đủ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Địa chỉ Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: Bảo mật & Mật khẩu */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900 mb-1">
                  Đổi mật khẩu tài khoản
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Mật khẩu mạnh nên chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ số và ký tự đặc biệt.
                </p>
              </div>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mật khẩu hiện tại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-2xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mật khẩu mới <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-2xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>

                  {/* Password Strength Meter */}
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-500">Độ mạnh mật khẩu:</span>
                        <span className="text-slate-800">{pwdStrength.label}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className={`h-full ${pwdStrength.color} transition-all duration-300`} style={{ width: `${(pwdStrength.score / 3) * 100}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-2xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  Cập nhật mật khẩu
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
