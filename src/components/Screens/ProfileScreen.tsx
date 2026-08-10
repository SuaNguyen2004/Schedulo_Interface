import React, { useState, useRef } from 'react';
import { UserAccount } from '../../types';

interface ProfileScreenProps {
  user: UserAccount;
  onOpenEditProfile: () => void;
  onOpenChangePassword: () => void;
  onUpdateAvatar?: (newAvatarUrl: string) => void;
  onUpdateCccdFront?: (url: string) => void;
  onUpdateCccdBack?: (url: string) => void;
  isAdminViewing?: boolean;
  onBack?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onOpenEditProfile,
  onOpenChangePassword,
  onUpdateAvatar,
  onUpdateCccdFront,
  onUpdateCccdBack,
  isAdminViewing = false,
  onBack
}) => {
  const [previewModal, setPreviewModal] = useState<{ title: string; url: string; side: 'avatar' | 'front' | 'back' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cccdFrontInputRef = useRef<HTMLInputElement>(null);
  const cccdBackInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string' && onUpdateAvatar) {
          onUpdateAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleDeleteAvatar = () => {
    if (onUpdateAvatar) {
      onUpdateAvatar('');
    }
  };

  const handleCccdFrontSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string' && onUpdateCccdFront) {
          onUpdateCccdFront(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleDeleteCccdFront = () => {
    if (onUpdateCccdFront) {
      onUpdateCccdFront('');
    }
  };

  const handleCccdBackSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string' && onUpdateCccdBack) {
          onUpdateCccdBack(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleDeleteCccdBack = () => {
    if (onUpdateCccdBack) {
      onUpdateCccdBack('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isAdminViewing && onBack && (
            <button
              onClick={onBack}
              className="p-1.5 text-[#44474e] hover:text-[#002046] hover:bg-[#efedf1] rounded-lg transition-colors cursor-pointer"
              title="Quay lại"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          )}
          <h2 className="text-2xl font-bold text-[#1a1b1e] tracking-tight">
            Thông tin tài khoản
          </h2>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 cols): Profile Card */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-[#25262b] border border-[#E2E8F0] dark:border-[#3b3d45] rounded-2xl p-6 shadow-xs flex flex-col items-center text-center relative">
            
            {/* Interactive Avatar Container */}
            <div
              className="relative mb-4 group cursor-pointer"
              onClick={() => {
                if (user.avatar) {
                  setPreviewModal({ title: 'Ảnh đại diện', url: user.avatar, side: 'avatar' });
                } else {
                  fileInputRef.current?.click();
                }
              }}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-[#1a1b1e] shadow-md transition-all group-hover:brightness-90"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-[#1b365d] text-white flex items-center justify-center text-3xl font-bold border-4 border-white dark:border-[#1a1b1e] shadow-md transition-all group-hover:brightness-90">
                  {user.initials || user.name.slice(0, 2).toUpperCase()}
                </div>
              )}

              {/* Edit Camera Badge */}
              <div className="absolute bottom-0 right-0 bg-accent hover:opacity-90 text-white p-2 rounded-full border-2 border-white dark:border-[#1a1b1e] shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            <h3 className="text-xl font-bold text-[#1a1b1e] dark:text-white">{user.name}</h3>

            {/* Hidden inputs for CCCD front and back */}
            <input
              type="file"
              ref={cccdFrontInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleCccdFrontSelect}
            />
            <input
              type="file"
              ref={cccdBackInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleCccdBackSelect}
            />

            {/* CCCD Photos Section */}
            <div className="w-full mt-5 pt-4 border-t border-[#E2E8F0] dark:border-[#3b3d45] text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#1b365d] dark:text-[#87a0cd] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                  <span>Ảnh chụp CCCD</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {/* CCCD Mặt trước */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    Mặt trước
                  </span>

                  {user.cccdFront ? (
                    <div
                      onClick={() => setPreviewModal({ title: 'CCCD - Mặt trước', url: user.cccdFront!, side: 'front' })}
                      className="relative group rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a1b1e] overflow-hidden h-28 cursor-pointer shadow-2xs"
                    >
                      <img
                        src={user.cccdFront}
                        alt="CCCD Mặt trước"
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => cccdFrontInputRef.current?.click()}
                      className="h-28 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-[#1a1b1e]/60 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:border-blue-400 transition-all cursor-pointer flex flex-col items-center justify-center p-2 text-center group/empty"
                    >
                      <span className="material-symbols-outlined text-slate-400 group-hover/empty:text-blue-500 text-[24px] mb-1 transition-colors">
                        add_a_photo
                      </span>
                      <span className="text-xs font-medium text-slate-400 dark:text-slate-500 group-hover/empty:text-blue-500 transition-colors">
                        Tải ảnh lên
                      </span>
                    </div>
                  )}
                </div>

                {/* CCCD Mặt sau */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    Mặt sau
                  </span>

                  {user.cccdBack ? (
                    <div
                      onClick={() => setPreviewModal({ title: 'CCCD - Mặt sau', url: user.cccdBack!, side: 'back' })}
                      className="relative group rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a1b1e] overflow-hidden h-28 cursor-pointer shadow-2xs"
                    >
                      <img
                        src={user.cccdBack}
                        alt="CCCD Mặt sau"
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => cccdBackInputRef.current?.click()}
                      className="h-28 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-[#1a1b1e]/60 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:border-blue-400 transition-all cursor-pointer flex flex-col items-center justify-center p-2 text-center group/empty"
                    >
                      <span className="material-symbols-outlined text-slate-400 group-hover/empty:text-blue-500 text-[24px] mb-1 transition-colors">
                        add_a_photo
                      </span>
                      <span className="text-xs font-medium text-slate-400 dark:text-slate-500 group-hover/empty:text-blue-500 transition-colors">
                        Tải ảnh lên
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): Detail Info Frame */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
            {/* Header & Actions */}
            <div className="bg-[#F8FAFC] px-6 py-4 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-base text-[#1a1b1e] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#002046]">badge</span>
                <span>Thông tin chi tiết</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenChangePassword}
                  className="px-3 py-1.5 border border-accent text-accent font-semibold text-xs rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                  <span>Đổi mật khẩu</span>
                </button>
                <button
                  onClick={onOpenEditProfile}
                  className="px-3 py-1.5 bg-accent text-white font-semibold text-xs rounded hover:opacity-90 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>Chỉnh sửa thông tin</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Nhóm 1: Thông tin cá nhân */}
              <div>
                <h4 className="text-xs font-bold text-[#002046] uppercase tracking-wider mb-4 pb-2 border-b border-[#E2E8F0]">
                  Thông tin cá nhân
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#74777f] mb-1">
                      Họ và tên
                    </label>
                    <p className="text-sm font-semibold text-[#1a1b1e]">{user.name}</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#74777f] mb-1">
                      Ngày sinh
                    </label>
                    <p className="text-sm font-semibold text-[#1a1b1e]">
                      {user.dob || '15/08/1998'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#74777f] mb-1">
                      Email
                    </label>
                    <p className="text-sm font-semibold text-[#1a1b1e]">{user.email}</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#74777f] mb-1">
                      Số điện thoại
                    </label>
                    <p className="text-sm font-semibold text-[#1a1b1e]">{user.phone}</p>
                  </div>
                </div>
              </div>

              {/* Nhóm 2: Thông tin tài khoản */}
              <div>
                <h4 className="text-xs font-bold text-[#002046] uppercase tracking-wider mb-4 pb-2 border-b border-[#E2E8F0]">
                  Thông tin tài khoản
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#74777f] mb-1">
                      Vai trò
                    </label>
                    <p className="text-sm font-semibold text-[#1a1b1e]">{user.role}</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#74777f] mb-1">
                      Trạng thái
                    </label>
                    <p className="text-sm font-semibold text-[#1a1b1e]">{user.status}</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#74777f] mb-1">
                      Ngày đăng ký
                    </label>
                    <p className="text-sm font-semibold text-[#1a1b1e]">
                      {user.joinDate || '01/12/2023'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CCCD Image Preview Lightbox Modal */}
      {previewModal && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setPreviewModal(null)}
        >
          <div
            className="bg-white dark:bg-[#25262b] rounded-2xl max-w-2xl w-full p-5 border border-slate-200 dark:border-slate-700 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">
                  {previewModal.side === 'avatar' ? 'account_circle' : 'badge'}
                </span>
                <span>{previewModal.title}</span>
              </h3>
              <button
                onClick={() => setPreviewModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="overflow-hidden rounded-xl bg-slate-100 dark:bg-black/40 flex items-center justify-center max-h-[60vh] p-3 min-h-[220px]">
              <img
                src={previewModal.url}
                alt={previewModal.title}
                className="max-h-[55vh] w-auto object-contain rounded-lg shadow-md"
              />
            </div>

            {/* Action Buttons strictly below the image */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-700 mt-3">
              <button
                type="button"
                onClick={() => {
                  const side = previewModal.side;
                  setPreviewModal(null);
                  if (side === 'avatar') {
                    fileInputRef.current?.click();
                  } else if (side === 'front') {
                    cccdFrontInputRef.current?.click();
                  } else {
                    cccdBackInputRef.current?.click();
                  }
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Thay đổi ảnh"
              >
                <span className="material-symbols-outlined text-[16px]">file_upload</span>
                <span>Thay đổi</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const side = previewModal.side;
                  setPreviewModal(null);
                  if (side === 'avatar') {
                    handleDeleteAvatar();
                  } else if (side === 'front') {
                    handleDeleteCccdFront();
                  } else {
                    handleDeleteCccdBack();
                  }
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Xóa ảnh"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>Xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;

