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

