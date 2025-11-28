import { useState } from "react";
import type { MemberProfile, ActivityLog } from "../types";

const mockProfiles: MemberProfile[] = [
  { id: "1", name: "Priya Sharma", age: 26, gender: "Female", location: "Mumbai", status: "active", createdAt: "2024-01-15" },
  { id: "2", name: "Rahul Patel", age: 29, gender: "Male", location: "Pune", status: "pending", createdAt: "2024-01-14" },
  { id: "3", name: "Anjali Gupta", age: 24, gender: "Female", location: "Delhi", status: "matched", createdAt: "2024-01-13" },
  { id: "4", name: "Vikram Singh", age: 31, gender: "Male", location: "Mumbai", status: "active", createdAt: "2024-01-12" },
  { id: "5", name: "Neha Reddy", age: 27, gender: "Female", location: "Bangalore", status: "active", createdAt: "2024-01-11" },
];

const mockActivity: ActivityLog[] = [
  { id: "1", action: "Profile Created", description: "Created profile for Priya Sharma", timestamp: "2 hours ago" },
  { id: "2", action: "Profile Updated", description: "Updated profile for Rahul Patel", timestamp: "4 hours ago" },
  { id: "3", action: "Login", description: "Logged in from Mumbai", timestamp: "5 hours ago" },
  { id: "4", action: "Profile Viewed", description: "Viewed profile for Anjali Gupta", timestamp: "Yesterday" },
  { id: "5", action: "Profile Created", description: "Created profile for Vikram Singh", timestamp: "2 days ago" },
];

export function useMemberProfiles() {
  const [profiles] = useState<MemberProfile[]>(mockProfiles);
  const [activity] = useState<ActivityLog[]>(mockActivity);

  return {
    profiles,
    activity,
  };
}
