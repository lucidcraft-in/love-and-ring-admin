import Axios from "../axios/axios";
import {
  Transaction,
  PaymentDashboardStats,
  MembershipPlan,
  CreatePlanPayload,
  AddOfflinePaymentPayload
} from "../types/payment";

export const paymentService = {
  // Transactions
  getAllTransactions: async (): Promise<Transaction[]> => {
    const response = await Axios.get("/api/payment/transactions");
    return response.data;
  },

  getTransactionById: async (id: string): Promise<Transaction> => {
    const response = await Axios.get(`/api/payment/transactions/${id}`);
    return response.data;
  },

  addOfflinePayment: async (data: AddOfflinePaymentPayload): Promise<{ message: string; transaction: Transaction }> => {
    const response = await Axios.post("/api/payment/offline", data);
    return response.data;
  },

  getPaymentDashboardStats: async (): Promise<PaymentDashboardStats> => {
    const response = await Axios.get("/api/payment/dashboard");
    return response.data;
  },

  // Membership Plans
  getAllPlans: async (): Promise<MembershipPlan[]> => {
    const response = await Axios.get("/api/payment/plans");
    return response.data;
  },

  getPlanById: async (id: string): Promise<MembershipPlan> => {
    const response = await Axios.get(`/api/payment/plans/${id}`);
    return response.data;
  },

  createPlan: async (data: CreatePlanPayload): Promise<MembershipPlan> => {
    const response = await Axios.post("/api/payment/plans", data);
    return response.data;
  },

  updatePlan: async (id: string, data: Partial<CreatePlanPayload>): Promise<MembershipPlan> => {
    const response = await Axios.put(`/api/payment/plans/${id}`, data);
    return response.data;
  },

  deletePlan: async (id: string): Promise<MembershipPlan> => {
    const response = await Axios.delete(`/api/payment/plans/${id}`);
    return response.data;
  }
};
