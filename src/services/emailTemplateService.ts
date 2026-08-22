import Axios from "@/axios/axios";

export interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  body: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTemplatePayload {
  name: string;
  subject: string;
  body: string;
  category?: string;
}

export interface SendIndividualEmailPayload {
  templateId: string;
  userId?: string;
  recipientEmail?: string;
}

export interface SendBulkEmailPayload {
  templateId: string;
}

export interface SendBulkEmailResponse {
  message: string;
  totalUsers: number;
  successCount: number;
  failCount: number;
  errors: { email: string; error: string }[];
}

export const emailTemplateService = {
  getTemplates: async (): Promise<EmailTemplate[]> => {
    const response = await Axios.get<EmailTemplate[]>("/api/email-templates");
    return response.data;
  },

  getTemplateById: async (id: string): Promise<EmailTemplate> => {
    const response = await Axios.get<EmailTemplate>(`/api/email-templates/${id}`);
    return response.data;
  },

  createTemplate: async (payload: CreateTemplatePayload): Promise<EmailTemplate> => {
    const response = await Axios.post<EmailTemplate>("/api/email-templates", payload);
    return response.data;
  },

  updateTemplate: async (id: string, payload: Partial<CreateTemplatePayload>): Promise<EmailTemplate> => {
    const response = await Axios.put<EmailTemplate>(`/api/email-templates/${id}`, payload);
    return response.data;
  },

  deleteTemplate: async (id: string): Promise<{ message: string }> => {
    const response = await Axios.delete<{ message: string }>(`/api/email-templates/${id}`);
    return response.data;
  },

  sendIndividualEmail: async (payload: SendIndividualEmailPayload): Promise<{ message: string; recipient: string }> => {
    const response = await Axios.post<{ message: string; recipient: string }>("/api/email-templates/send-individual", payload);
    return response.data;
  },

  sendBulkEmail: async (payload: SendBulkEmailPayload): Promise<SendBulkEmailResponse> => {
    const response = await Axios.post<SendBulkEmailResponse>("/api/email-templates/send-bulk", payload);
    return response.data;
  },
};
