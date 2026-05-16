export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales';
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LeadsResponse {
  success: boolean;
  data: Lead[];
  meta: PaginationMeta;
}

export interface LeadFilters {
  status?: string;
  source?: string;
  search?: string;
  sort?: 'latest' | 'oldest';
  page?: number;
  limit?: number;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'sales';
}

export interface LeadInput {
  name: string;
  email: string;
  status: Lead['status'];
  source: Lead['source'];
}
