import React, { useState, useEffect } from 'react';
import { useLeads } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';
import * as leadService from '../services/lead.service';
import { downloadCSV } from '../utils/csvExport';
import type { LeadInput, Lead } from '../types';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import { Search, Download, Plus, Pencil, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { leads, meta, loading, filters, setFilters, refreshLeads } = useLeads({
    page: 1,
    limit: 10,
    search: '',
    status: 'All',
    source: 'All',
    sort: 'latest',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentLeadId, setCurrentLeadId] = useState<string | null>(null);
  const [formData, setFormData] = useState<LeadInput>({
    name: '',
    email: '',
    status: 'New',
    source: 'Website',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch, setFilters]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await leadService.exportCSV(filters);
      downloadCSV(blob, `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
      toast.success('Export successful');
    } catch (error: any) {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await leadService.deleteLead(id);
      toast.success('Lead deleted successfully');
      refreshLeads();
    } catch (error: any) {
      toast.error('Failed to delete lead');
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', email: '', status: 'New', source: 'Website' });
    setIsModalOpen(true);
  };

  const openEditModal = (lead: Lead) => {
    setModalMode('edit');
    setCurrentLeadId(lead._id);
    setFormData({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (modalMode === 'add') {
        await leadService.createLead(formData);
        toast.success('Lead added successfully');
      } else if (currentLeadId) {
        await leadService.updateLead(currentLeadId, formData);
        toast.success('Lead updated successfully');
      }
      setIsModalOpen(false);
      refreshLeads();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'New': return 'blue';
      case 'Contacted': return 'yellow';
      case 'Qualified': return 'green';
      case 'Lost': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {/* Top Filters Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                
                <select
                  value={filters.status || 'All'}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Lost">Lost</option>
                </select>

                <select
                  value={filters.source || 'All'}
                  onChange={(e) => setFilters({ ...filters, source: e.target.value, page: 1 })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Sources</option>
                  <option value="Website">Website</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Referral">Referral</option>
                </select>

                <select
                  value={filters.sort || 'latest'}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value as 'latest'|'oldest', page: 1 })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({ page: 1, limit: 10, search: '', status: 'All', source: 'All', sort: 'latest' });
                  }}
                  className="text-gray-500"
                >
                  Clear
                </Button>
              </div>

              <div className="flex gap-3 w-full lg:w-auto">
                <Button variant="secondary" onClick={handleExport} loading={isExporting} className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={openAddModal} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </Button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 relative min-h-[200px]">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center h-48">
                      <Spinner className="mx-auto" />
                    </td>
                  </tr>
                )}
                {!loading && leads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12">
                      <EmptyState icon={Users} title="No leads found" description="Try adjusting your filters or add a new lead." />
                    </td>
                  </tr>
                )}
                {!loading && leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant={getStatusBadgeVariant(lead.status)}>{lead.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.source}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEditModal(lead)} className="text-blue-600 hover:text-blue-900 mx-2 p-1 rounded-full hover:bg-blue-50">
                        <Pencil className="h-4 w-4" />
                      </button>
                      {user?.role === 'admin' && (
                        <button onClick={() => handleDelete(lead._id)} className="text-red-600 hover:text-red-900 mx-2 p-1 rounded-full hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 0 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                  disabled={(filters.page || 1) === 1}
                  variant="secondary"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                  disabled={(filters.page || 1) === meta.totalPages}
                  variant="secondary"
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{((meta.page - 1) * meta.limit) + 1}</span> to <span className="font-medium">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="font-medium">{meta.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                      disabled={(filters.page || 1) === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {/* Render page numbers */}
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setFilters({ ...filters, page: pageNumber })}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          (filters.page || 1) === pageNumber
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    <button
                      onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                      disabled={(filters.page || 1) === meta.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add New Lead' : 'Edit Lead'}>
        <form onSubmit={handleModalSubmit} className="space-y-4 mt-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>
              {modalMode === 'add' ? 'Create Lead' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
