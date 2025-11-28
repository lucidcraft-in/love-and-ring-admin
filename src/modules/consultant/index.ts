// Pages
export { default as ConsultantList } from "./pages/ConsultantList";
export { default as ConsultantLogin } from "./pages/ConsultantLogin";
export { default as ConsultantRegister } from "./pages/ConsultantRegister";
export { default as ConsultantDashboard } from "./pages/ConsultantDashboard";

// Components
export { ConsultantViewDialog } from "./components/ConsultantViewDialog";
export { ConsultantApproveDialog } from "./components/ConsultantApproveDialog";
export { ConsultantRejectDialog } from "./components/ConsultantRejectDialog";
export { ConsultantPermissionsDialog } from "./components/ConsultantPermissionsDialog";
export { ConsultantCreateDialog } from "./components/ConsultantCreateDialog";

// Hooks
export { useConsultantData } from "./hooks/useConsultantData";
export { useConsultantAuth } from "./hooks/useConsultantAuth";
export { useMemberProfiles } from "./hooks/useMemberProfiles";

// Validation
export { validatePassword, validateEmail, validatePhone, validateUsername } from "./validation/consultant.schema";

// Types
export type {
  Consultant,
  ConsultantUser,
  ConsultantPermissions,
  MemberProfile,
  ActivityLog,
  ConsultantStats,
  RegisterFormData,
} from "./types";
