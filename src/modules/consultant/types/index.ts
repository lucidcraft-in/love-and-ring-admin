export interface ConsultantPermissions {
  createProfile: boolean;
  editProfile: boolean;
  viewProfile: boolean;
  deleteProfile: boolean;
}

export interface ConsultantPayment {
  _id: string;
  transactionId: string;
  userEmail: string;
  user?: {
    _id: string;
    fullName?: string;
    name?: string;
    email: string;
    mobile?: string;
    phone?: string;
    customId?: string;
  };
  plan?: {
    _id: string;
    title: string;
    price?: number;
    currency?: string;
    chatProfilesLimit?: number;
    contactViews?: number;
  };
  amount: number;
  paymentMethod: string;
  paymentGateway?: string;
  referenceNo?: string;
  attachment?: string;
  status: 'Success' | 'Pending' | 'Failed';
  paidAt?: string;
  createdAt: string;
  addedBy?: {
    _id: string;
    fullName?: string;
    email?: string;
  };
}

export interface Consultant {
  _id?: string;
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  branch?: {
    _id: string;
    name: string;
    city: string;
    state: string;
  };
  regions: string[];
  status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
  permissions: ConsultantPermissions;
  profilesCreated: number;
  totalRevenue?: number;
  revenueGenerated?: number;
  paymentsCount?: number;
  payments?: ConsultantPayment[];
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
