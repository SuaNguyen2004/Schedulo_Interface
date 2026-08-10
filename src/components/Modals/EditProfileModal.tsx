import React, { useState } from 'react';
import { UserAccount } from '../../types';

interface EditProfileModalProps {
  isOpen: boolean;
  user: UserAccount;
  onClose: () => void;
  onSave: (updatedData: Partial<UserAccount>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave
}) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [dob, setDob] = useState(user.dob || '15/08/1990');
  const [gender, setGender] = useState(user.gender || 'Nam');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, phone, dob, gender });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h3 className="text-lg font-bold text-[#1a1b1e]">Chỉnh sửa thông tin cá nhân</h3>
          <button
            onClick={onClose}
            className="text-[#74777f] hover:text-[#1a1b1e] p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1a1b1e] mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-[#c4c6cf] rounded text-sm text-[#1a1b1e] focus:border-[#002046] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1a1b1e] mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-[#c4c6cf] rounded text-sm text-[#1a1b1e] focus:border-[#002046] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1b1e] mb-1">
                Ngày sinh
              </label>
              <input
                type="text"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="15/08/1990"
                className="w-full px-3 py-2 border border-[#c4c6cf] rounded text-sm text-[#1a1b1e] focus:border-[#002046] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1a1b1e] mb-1">
              Giới tính
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 border border-[#c4c6cf] rounded text-sm text-[#1a1b1e] focus:border-[#002046] outline-none"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E2E8F0] rounded text-xs font-semibold text-[#44474e] hover:bg-gray-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent hover:opacity-90 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
