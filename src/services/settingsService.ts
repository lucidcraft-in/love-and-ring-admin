import Axios from "../axios/axios";

export interface GeneralSettings {
  appName: string;
  tagline?: string;
  supportEmail?: string;
  supportPhone?: string;
  defaultCountry: string;
  defaultCurrency: string;
  logoUrl?: string;
  faviconUrl?: string;
}

export interface NotificationsSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  matchAlerts: boolean;
  profileViews: boolean;
  interests: boolean;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface EmailTemplatesSettings {
  welcome?: EmailTemplate;
  verification?: EmailTemplate;
  passwordReset?: EmailTemplate;
  matchAlert?: EmailTemplate; // Assuming these keys exist based on usage, though schema showed limited keys initially
  interestReceived?: EmailTemplate;
  subscription?: EmailTemplate;
}

export interface PaymentGatewayConfig {
  enabled: boolean;
  keyId?: string; // Razorpay
  keySecret?: string; // Razorpay
  publishableKey?: string; // Stripe
  secretKey?: string; // Stripe
}

export interface PaymentGatewaySettings {
  razorpay: PaymentGatewayConfig;
  stripe: PaymentGatewayConfig;
}

export interface SocialLoginConfig {
  enabled: boolean;
  clientId?: string; // Google
  clientSecret?: string; // Google
  appId?: string; // Facebook
  appSecret?: string; // Facebook
  serviceId?: string; // Apple
  teamId?: string; // Apple
}

export interface SocialLoginSettings {
  google: SocialLoginConfig;
  facebook: SocialLoginConfig;
  apple: SocialLoginConfig;
}

export interface Settings {
  _id: string;
  appName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  defaultCountry: string;
  defaultCurrency: string;
  logoUrl: string;
  faviconUrl: string;
  notifications: NotificationsSettings;
  emailTemplates: EmailTemplatesSettings;
  paymentGateway: PaymentGatewaySettings;
  socialLogin: SocialLoginSettings;
}

export const settingsService = {
  getSettings: async (): Promise<Settings> => {
    const response = await Axios.get<Settings>("/api/settings");
    return response.data;
  },

  updateGeneralSettings: async (payload: FormData): Promise<Settings> => {
    // Note: Payload is FormData because of file uploads
    const response = await Axios.put<Settings>("/api/settings/general", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateNotifications: async (payload: NotificationsSettings): Promise<Settings> => {
    const response = await Axios.put<Settings>("/api/settings/notifications", payload);
    return response.data;
  },

  updateEmailTemplate: async (payload: { templateKey: string; subject: string; body: string }): Promise<Settings> => {
    const response = await Axios.put<Settings>("/api/settings/email-template", payload);
    return response.data;
  },

  updatePaymentGateway: async (payload: PaymentGatewaySettings): Promise<Settings> => {
    const response = await Axios.put<Settings>("/api/settings/payment-gateway", payload);
    return response.data;
  },

  updateSocialLogin: async (payload: SocialLoginSettings): Promise<Settings> => {
    const response = await Axios.put<Settings>("/api/settings/social-login", payload);
    return response.data;
  },
};
