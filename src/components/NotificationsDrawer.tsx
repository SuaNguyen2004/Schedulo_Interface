import React from 'react';
import { X, Bell, CheckCircle2, Calendar, ShieldAlert } from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onClearAll
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: 'Đăng ký ca làm được phê duyệt',
      message: 'Ca Sáng ngày 04/08/2026 tại Phòng Lab 101 của bạn đã được duyệt.',
      time: '10 phút trước',
      type: 'success'
    },
    {
      id: 'n2',
      title: 'Nhắc nhở ca làm tiếp theo',
      message: 'Ca Chiều 05/08 sẽ diễn ra sau 14 giờ nữa. Vui lòng chuẩn bị.',
      time: '1 giờ trước',
      type: 'info'
    },
    {
      id: 'n3',
      title: 'Mời tham gia Nhóm chuyên môn',
      message: 'Bạn đã được thêm vào Đội Phân Tích Dữ Liệu bởi Nguyễn Văn A.',
      time: '3 giờ trước',
      type: 'info'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-sm w-full h-full max-h-[85vh] p-5 shadow-2xl border border-slate-200 flex flex-col justify-between">
        
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Thông báo của bạn
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{n.title}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {n.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center space-x-2">
          <button
            onClick={onClearAll}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Đã đọc tất cả
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
