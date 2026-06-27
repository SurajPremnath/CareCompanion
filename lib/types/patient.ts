export interface Patient {
  id: string;
  userId: string;

  fullName: string;
  dateOfBirth: string | null;

  gender: "Male" | "Female" | "Other" | "Prefer not to say" | null;

  relationship: string | null;

  status: "ACTIVE" | "INACTIVE";

  createdAt: string;
  updatedAt: string;
}