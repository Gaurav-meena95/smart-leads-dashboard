import { useState, useEffect, useCallback } from 'react';
import type { Lead, LeadFilters, PaginationMeta } from '../types';
import * as leadService from '../services/lead.service';
import toast from 'react-hot-toast';

export const useLeads = (initialFilters: LeadFilters) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<LeadFilters>(initialFilters);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await leadService.getLeads(filters);
      setLeads(response.data);
      setMeta(response.meta);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    meta,
    loading,
    filters,
    setFilters,
    refreshLeads: fetchLeads,
  };
};
