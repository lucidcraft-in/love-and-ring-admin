export interface ConsultantPermissions {
  create_profile: boolean;
  edit_profile: boolean;
  view_profile: boolean;
  delete_profile: boolean;
}

export interface Consultant {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  agencyName: string;
  regions: string[];
  status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
  permissions: ConsultantPermissions;
  profilesCreated: number;
  createdAt: string;
  lastLogin: string;
}

export interface ConsultantUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  permissions: ConsultantPermissions;
}

export interface MemberProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  status: "active" | "pending" | "matched";
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
}

export interface ConsultantStats {
  total: number;
  active: number;
  pending: number;
  rejected: number;
}

export interface RegisterFormData {
  username: string;
  email: string;
  fullName: string;
  phone: string;
  agencyName: string;
  licenseNumber: string;
  regions: string;
  password: string;
  confirmPassword: string;
}
