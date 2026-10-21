export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issued_on: string | null;
  credential_url: string | null;
  image_url: string | null;
  skills: string[];
  sort_order: number;
  in_progress: boolean;
  created_at: string;
}

export interface CertificateInput {
  title: string;
  issuer: string;
  issued_on: string | null;
  credential_url: string | null;
  image_url: string | null;
  skills: string[];
  sort_order: number;
  in_progress: boolean;
}
