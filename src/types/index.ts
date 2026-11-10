export type Gender = 'Male' | 'Female' | 'Other';

export type ApplicationStatus = 'Pending' | 'Issued' | 'Rejected';

export type CertificateStatus = 'Active' | 'Revoked';

export interface Application {
  id: string;
  name: string;
  phone: string;
  gender: Gender;
  city: string;
  state: string;
  status: ApplicationStatus;
  submittedAt: string;
  decidedAt?: string;
  rejectionReason?: string;
}

export interface Certificate {
  id: string;
  applicationId: string;
  name: string;
  phone: string;
  gender: Gender;
  city: string;
  state: string;
  status: CertificateStatus;
  issuedAt: string;
  revokedAt?: string;
  revokeReason?: string;
}
