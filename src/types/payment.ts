export interface Transaction {
  _id: string;
  transactionId: string;
  userEmail:string;
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

  // basic info
  title: string;
  heading?: string | null;

  // pricing
  price: number;
  currency?: string;

  // duration
  duration?: {
    value: number;
    unit: "days" | "months" | "years";
  };

  // features
  features: PlanFeature[];

  // limits
  contactViews?: number;
  chatProfilesLimit: number;

  // permissions
  allowCall?: boolean;
  allowChat?: boolean;

  // special flags
  millionClub?: boolean;
  isPopular?: boolean;

  // plan state
  isActive?: boolean;

  // analytics
  subscribersCount?: number;
  sortOrder?: number;

  // audit
  createdBy?: string;

  // timestamps
  createdAt?: string;
  updatedAt?: string;

  durationInMonths:string;
  status:string;
}

export interface CreatePlanPayload {
  title: string;
  heading?: string | null;

  price: number;
  currency?: string;

  features: string[] | PlanFeature[];

  contactViews?: number;

  chatProfilesLimit: number;

  allowCall?: boolean;
  allowChat?: boolean;

  millionClub?: boolean;

  isPopular?: boolean;

  isActive?: boolean;

  sortOrder?: number;
}

export interface AddOfflinePaymentPayload {
  userEmail:string
  planId:string;
  amount: number;
  paymentMethod: string;
  referenceNo?: string;
}
