export type UserRole = 'admin' | 'manager' | 'collaborator';

export type AccountStatus = 'pending' | 'active' | 'locked';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  cccd: string;
  avatar?: string;
  role: UserRole;
  status: AccountStatus;
  registeredDate: string;
  dob?: string;
  address?: string;
  teamId?: string;
  teamName?: string;
  idCardFront?: string;
  idCardBack?: string;
  phoneVerified?: boolean;
  cccdVerified?: boolean;
}

export type RoomStatus = 'active' | 'maintenance';

export interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
  status: RoomStatus;
  location?: string;
}

export interface ShiftConfig {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  type: 'morning' | 'afternoon' | 'evening';
  requiredCerts?: string[];
  maxCollaborators: number;
}

export type ShiftStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'in_progress' | 'completed';

export interface ShiftRegistration {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  date: string; // YYYY-MM-DD
  shiftId: string;
  shiftName: string;
  timeSlot: string;
  roomId: string;
  roomName: string;
  taskDescription: string;
  isTeamRegistration: boolean;
  teamMembers?: string[];
  status: ShiftStatus;
  createdAt: string;
  cancelReason?: string;
}

export interface TeamMember {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  role: 'leader' | 'member';
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  leaderName: string;
  memberCount: number;
  members: TeamMember[];
}

export type ActiveTab =
  | 'register_shift'
  | 'my_schedule'
  | 'my_teams'
  | 'profile_settings'
  | 'system_config'
  | 'ctv_management'
  | 'master_calendar'
  | 'ctv_dashboard'
  | 'auth_sign_in'
  | 'auth_sign_up';
