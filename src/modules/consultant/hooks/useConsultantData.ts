import { useState } from "react";
import type { Consultant, ConsultantStats } from "../types";

const mockConsultants: Consultant[] = [
  { id: "1", username: "broker1", email: "broker1@agency.com", fullName: "Ravi Kumar", phone: "+91 98765 43210", agencyName: "Shubh Matches", regions: ["Mumbai", "Pune"], status: "ACTIVE", permissions: { create_profile: true, edit_profile: true, view_profile: true, delete_profile: false }, profilesCreated: 45, createdAt: "2024-03-10", lastLogin: "2 hours ago" },
  { id: "2", username: "consultant_priya", email: "priya@matchmakers.com", fullName: "Priya Sharma", phone: "+91 98765 43211", agencyName: "Divine Matches", regions: ["Delhi", "Noida"], status: "PENDING", permissions: { create_profile: false, edit_profile: false, view_profile: true, delete_profile: false }, profilesCreated: 0, createdAt: "2024-03-14", lastLogin: "-" },
  { id: "3", username: "suresh_broker", email: "suresh@weddings.com", fullName: "Suresh Reddy", phone: "+91 98765 43212", agencyName: "Perfect Match", regions: ["Hyderabad", "Bangalore"], status: "ACTIVE", permissions: { create_profile: true, edit_profile: true, view_profile: true, delete_profile: true }, profilesCreated: 89, createdAt: "2024-02-20", lastLogin: "1 day ago" },
  { id: "4", username: "meena_consultant", email: "meena@rishtey.com", fullName: "Meena Patel", phone: "+91 98765 43213", agencyName: "Rishtey.com", regions: ["Ahmedabad", "Surat"], status: "REJECTED", permissions: { create_profile: false, edit_profile: false, view_profile: false, delete_profile: false }, profilesCreated: 0, createdAt: "2024-03-12", lastLogin: "-" },
  { id: "5", username: "anand_broker", email: "anand@vivah.com", fullName: "Anand Singh", phone: "+91 98765 43214", agencyName: "Vivah Services", regions: ["Chennai"], status: "SUSPENDED", permissions: { create_profile: true, edit_profile: true, view_profile: true, delete_profile: false }, profilesCreated: 23, createdAt: "2024-01-15", lastLogin: "1 week ago" },
];

export function useConsultantData() {
  const [consultants] = useState<Consultant[]>(mockConsultants);

  const stats: ConsultantStats = {
    total: 24,
    active: 18,
    pending: 4,
    rejected: 2,
  };

  return {
    consultants,
    stats,
  };
}
