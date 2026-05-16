import api from './api';
import type { LeadsResponse, Lead, LeadInput, LeadFilters } from '../types';

export const getLeads = async (filters: LeadFilters): Promise<LeadsResponse> => {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.status && filters.status !== 'All') params.append('status', filters.status);
  if (filters.source && filters.source !== 'All') params.append('source', filters.source);
  if (filters.sort) params.append('sort', filters.sort === 'oldest' ? 'createdAt:1' : 'createdAt:-1');

  const response = await api.get<LeadsResponse>(`/leads?${params.toString()}`);
  return response.data;
};

export const createLead = async (data: LeadInput): Promise<Lead> => {
  const response = await api.post<{ success: boolean; data: Lead }>('/leads', data);
  return response.data.data;
};

export const updateLead = async (id: string, data: Partial<LeadInput>): Promise<Lead> => {
  const response = await api.put<{ success: boolean; data: Lead }>(`/leads/${id}`, data);
  return response.data.data;
};

export const deleteLead = async (id: string): Promise<void> => {
  await api.delete(`/leads/${id}`);
};

export const exportCSV = async (filters: LeadFilters): Promise<Blob> => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.status && filters.status !== 'All') params.append('status', filters.status);
  if (filters.source && filters.source !== 'All') params.append('source', filters.source);
  if (filters.sort) params.append('sort', filters.sort === 'oldest' ? 'createdAt:1' : 'createdAt:-1');

  const response = await api.get(`/leads/export/csv?${params.toString()}`, {
    responseType: 'blob',
  });
  return response.data;
};
