// TypeScript interfaces mirroring the Jan-Setu backend Pydantic schemas.

export interface RequestCodeResponse {
  verification_id: string;
  method: "whatsapp_approval" | "reverse_code";
  code?: string | null;
  wa_link?: string | null;
  browser_label?: string | null;
  requested_at?: string | null;
  expires_at?: string | null;
}

export type AuthStatusValue = "pending" | "verified" | "denied" | "expired";

export interface AuthStatusResponse {
  status: AuthStatusValue;
  access_token?: string;
}

export interface RefreshResponse {
  access_token: string;
}

export interface LogoutResponse {
  status: string;
}

export type ImageMatchStatus = "none" | "matched" | "mismatched" | "skipped";

export type GrievanceStatus =
  | "draft"
  | "processing"
  | "awaiting_confirmation"
  | "photo_mismatch"
  | "registered"
  | "pending_window"
  | "dispatching"
  | "submitted"
  | "duplicate"
  | "cancelled"
  | "dispatch_failed";

export type GrievanceSource = "whatsapp" | "web";

export interface GrievanceSummary {
  id: string;
  human_id: string;
  category: string | null;
  status: string;
  priority: string | null;
  source: GrievanceSource;
  created_at: string;
}

