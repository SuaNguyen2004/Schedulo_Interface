import React, { useState } from 'react';
import { Team, TeamMember, User } from '../types';
import { 
  Users, 
  Plus, 
  UserPlus, 
  MoreVertical, 
  ShieldCheck, 
  Phone, 
  Search, 
  X, 
  Trash2, 
  UserCheck, 
  CheckCircle2,
  Building
} from 'lucide-react';

interface TeamsViewProps {
  teams: Team[];
  currentUser: User;
  allUsers: User[];
  onCreateTeam: (newTeam: Team) => void;
  onAddMemberToTeam: (teamId: string, newMember: TeamMember) => void;
  onRemoveMemberFromTeam: (teamId: string, memberId: string) => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({
  teams,
  currentUser,
  allUsers,
  onCreateTeam,
  onAddMemberToTeam,
  onRemoveMemberFromTeam
}) => {
  // Modals
  const [showCreateTeamModal, setShowCreateTeamModal] = useState<boolean>(false);
  const [selectedTeamForAdd, setSelectedTeamForAdd] = useState<Team | null>(null);

  // Create Team Form State
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [newTeamDesc, setNewTeamDesc] = useState<string>('');

  // Add Member State
  const [searchMemberQuery, setSearchMemberQuery] = useState<string>('');
  const [selectedUserToAdd, setSelectedUserToAdd] = useState<User | null>(null);

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const created: Team = {
      id: 't_' + Date.now(),
      name: newTeamName,
      description: newTeamDesc || 'Nhóm chuyên môn vừa được khởi tạo.',
      leaderId: currentUser.id,
      leaderName: currentUser.fullName,
      memberCount: 1,
      members: [
        {
          id: currentUser.id,
          fullName: currentUser.fullName,
          phone: currentUser.phone,
          email: currentUser.email,
          role: 'leader'
        }
      ]
    };

    onCreateTeam(created);
    setShowCreateTeamModal(false);
    setNewTeamName('');
    setNewTeamDesc('');
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTeamForAdd && selectedUserToAdd) {
      const memberToAdd: TeamMember = {
        id: selectedUserToAdd.id,
        fullName: selectedUserToAdd.fullName,
        phone: selectedUserToAdd.phone,
        email: selectedUserToAdd.email,
        role: 'member'
      };

      onAddMemberToTeam(selectedTeamForAdd.id, memberToAdd);
      setSelectedTeamForAdd(null);
      setSelectedUserToAdd(null);
      setSearchMemberQuery('');
    }
  };

  const availableUsers = allUsers.filter(
    u => u.status === 'active' && (!selectedTeamForAdd || !selectedTeamForAdd.members.some(m => m.id === u.id))
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold text-indigo-600 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 inline" />
            <span>Điều phối nhân sự & Đội nhóm</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Nhóm chuyên môn của tôi
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Quản lý danh sách, phân quyền và thêm thành viên cho các đội nhóm dự án.
          </p>
        </div>

        <button
          onClick={() => setShowCreateTeamModal(true)}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center space-x-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tạo nhóm mới</span>
        </button>
      </div>

      {/* Teams Grid Cards */}
      <div className="space-y-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all hover:border-indigo-200"
          >
            {/* Team Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h2 className="text-lg font-black text-slate-900">
                    {team.name}
                  </h2>
                  <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-900 border border-indigo-200">
                    {team.members.length} thành viên
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  {team.description}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedTeamForAdd(team)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Thêm thành viên</span>
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Member Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 text-[11px] font-extrabold uppercase tracking-wider">
                    <th className="py-3.5 px-6 text-left">Họ tên thành viên</th>
                    <th className="py-3.5 px-6 text-left">Số điện thoại</th>
                    <th className="py-3.5 px-6 text-left">Vai trò</th>
                    <th className="py-3.5 px-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                  {team.members.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-semibold flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-800 font-extrabold flex items-center justify-center text-xs shadow-xs">
                          {member.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900">{member.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{member.email || 'nguyenvana@schedulo.com'}</p>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-semibold text-slate-600">
                        <span className="flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{member.phone}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        {member.role === 'leader' ? (
                          <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center space-x-1.5 shadow-xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                            <span>TRƯỞNG NHÓM</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 inline-flex items-center space-x-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                            <span>THÀNH VIÊN</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {member.role !== 'leader' && (
                          <button
                            onClick={() => onRemoveMemberFromTeam(team.id, member.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title="Xóa khỏi nhóm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Tạo nhóm mới */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-black text-slate-900">
                Tạo nhóm chuyên môn mới
              </h3>
              <button
                onClick={() => setShowCreateTeamModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeamSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên nhóm chuyên môn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Ví dụ: Đội Kiểm Thử AI Q3"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-2xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả nhóm
                </label>
                <textarea
                  rows={3}
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  placeholder="Mô tả nhiệm vụ chuyên môn chính của đội..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-2xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-colors cursor-pointer"
                >
                  Tạo Nhóm
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateTeamModal(false)}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Thêm thành viên */}
      {selectedTeamForAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Thêm thành viên vào nhóm
                </h3>
                <p className="text-xs text-indigo-600 font-bold">{selectedTeamForAdd.name}</p>
              </div>
              <button
                onClick={() => setSelectedTeamForAdd(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tìm kiếm CTV theo Tên hoặc Số điện thoại
                </label>
                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchMemberQuery}
                    onChange={(e) => setSearchMemberQuery(e.target.value)}
                    placeholder="Nhập tên CTV..."
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-2xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {availableUsers
                    .filter(u => u.fullName.toLowerCase().includes(searchMemberQuery.toLowerCase()))
                    .map((user) => {
                      const isSelected = selectedUserToAdd?.id === user.id;
                      return (
                        <div
                          key={user.id}
                          onClick={() => setSelectedUserToAdd(user)}
                          className={`p-2.5 rounded-2xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-500 font-bold text-indigo-950'
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                            <div>
                              <p className="font-bold">{user.fullName}</p>
                              <p className="text-[10px] text-slate-500 font-medium">{user.phone}</p>
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="submit"
                  disabled={!selectedUserToAdd}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-colors cursor-pointer"
                >
                  Xác nhận Thêm
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTeamForAdd(null)}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
