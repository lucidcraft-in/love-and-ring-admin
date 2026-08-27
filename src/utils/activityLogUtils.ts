export interface LogItem {
  action: string;
  step?: number | null;
  status: string;
  errorMessage?: string;
  details?: Record<string, any>;
  category?: string;
}

export function getFriendlyActionName(action: string, step?: number | null): string {
  if (!action) return "User Activity";

  const upper = action.toUpperCase();
  if (upper.includes("SEND_OTP")) return "Requested Email OTP";
  if (upper.includes("OTP_VERIFY_SUCCESS") || upper.includes("VERIFY_OTP")) return "Verified Email OTP (Step 1)";
  if (upper.includes("STEP_2_NEXT") || upper === "REGISTRATION_STEP_2_NEXT") return "Completed Basic Info (Step 2)";
  if (upper.includes("STEP_3_NEXT") || upper === "REGISTRATION_STEP_3_NEXT") return "Completed Personal Details (Step 3)";
  if (upper.includes("STEP_4_NEXT") || upper === "REGISTRATION_STEP_4_NEXT") return "Completed Education & Profession (Step 4)";
  if (upper.includes("SUBMIT_SUCCESS") || upper === "REGISTRATION_SUBMIT_SUCCESS") return "Profile Created & Submitted (Step 5)";
  if (upper.includes("SUBMIT_FAILED") || upper === "REGISTRATION_SUBMIT_FAILED") return "Registration Submission Failed";
  if (upper.includes("STEP_ERROR")) return `Step ${step || ""} Validation Error`;
  if (upper.includes("LOGIN_SUCCESS")) return "User Logged In";
  if (upper.includes("LOGIN_FAILED")) return "User Login Failed";
  if (upper.includes("PROFILE_UPDATE")) return "Updated Profile";

  return action
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function getFriendlyDetails(log: LogItem): string {
  if (log.errorMessage) {
    return log.errorMessage;
  }

  const action = log.action ? log.action.toUpperCase() : "";
  const details = log.details || {};

  if (action.includes("STEP_2_NEXT") || details.nextStep === 3) {
    return "Saved basic details and advanced to Step 3 (Personal Details)";
  }
  if (action.includes("STEP_3_NEXT") || details.nextStep === 4) {
    return "Saved personal details and advanced to Step 4 (Education & Profession)";
  }
  if (action.includes("STEP_4_NEXT") || details.nextStep === 5) {
    return "Saved education & profession, advanced to Step 5 (Photos & Bio)";
  }
  if (action.includes("SUBMIT_SUCCESS")) {
    return "Completed all registration steps and submitted profile";
  }
  if (action.includes("OTP_VERIFY_SUCCESS")) {
    return "Email OTP verified successfully, unlocked Step 2";
  }
  if (action.includes("SEND_OTP")) {
    return "Verification OTP sent to user email";
  }

  if (details && Object.keys(details).length > 0) {
    const cleanPairs = Object.entries(details)
      .filter(([k]) => k !== "nextStep")
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    if (cleanPairs) return cleanPairs;
  }

  return "Step completed successfully";
}

export function getStepInfo(step?: number | null): { label: string; shortName: string; color: string } {
  switch (step) {
    case 1:
      return {
        label: "Step 1: Account & OTP",
        shortName: "Step 1 (OTP)",
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      };
    case 2:
      return {
        label: "Step 2: Basic Info",
        shortName: "Step 2 (Basic)",
        color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      };
    case 3:
      return {
        label: "Step 3: Personal Details",
        shortName: "Step 3 (Personal)",
        color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      };
    case 4:
      return {
        label: "Step 4: Education & Profession",
        shortName: "Step 4 (Education)",
        color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
      };
    case 5:
      return {
        label: "Step 5: Photos & Finalize",
        shortName: "Step 5 (Finalize)",
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      };
    default:
      return {
        label: "General",
        shortName: "General",
        color: "bg-muted text-muted-foreground border-border",
      };
  }
}
