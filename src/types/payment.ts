export interface Transaction {
  _id: string;
  transactionId: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
  };
  planName: string;
  amount: number;
  paymentMethod: string;
  paymentGateway: string;
  referenceNo?: string;
  status: 'Success' | 'Pending' | 'Failed';
  addedBy?: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentDashboardStats {
  totalRevenue: number;
  thisMonthRevenue: number;
  totalTransactions: number;
}


export interface PlanFeature {
  label: string;
  value: string | boolean;
  isHighlighted?: boolean;
}

export interface MembershipPlan {
  _id: string;
  name: string;
  price: number;
  duration: string | { value: number; unit: string };
  durationInMonths: number;
  features: string[] | PlanFeature[];
  status: 'Active' | 'Inactive';
  subscribers?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePlanPayload {
  name: string;
  price: number;
  duration: string;
  durationInMonths: number;
  features: string[] | PlanFeature[];
  status: 'Active' | 'Inactive';
}

export interface AddOfflinePaymentPayload {
  userId: string;
  planName: string;
  amount: number;
  paymentMethod: string;
  referenceNo?: string;
}
