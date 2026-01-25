export interface ConsultantPermissions {
  createProfile: boolean;
  editProfile: boolean;
  viewProfile: boolean;
  deleteProfile: boolean;
}

export interface Consultant {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  branch: {
    _id: string;
    name: string;
    city: string;
    state: string;
  };
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
  branch: string;
  licenseNumber: string;
  regions: string;
  password: string;
  confirmPassword: string;
}
