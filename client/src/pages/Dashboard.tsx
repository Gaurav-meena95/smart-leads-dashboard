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
import { Search, Download, Plus, Pencil, Trash2, Users, Eye } from 'lucide-react';
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

  const displayedLeads = user?.role === 'sales'
    ? leads.filter(lead => {
        if (!lead.createdBy || !user) return false;
        const createdById = lead.createdBy._id || (lead.createdBy as any).id;
        const loggedInId = (user as any).id || user._id;
        return createdById === loggedInId || lead.createdBy.email === user.email;
      })
    : leads;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
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

  const openViewModal = (lead: Lead) => {
    setModalMode('view');
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
    if (modalMode === 'view') return setIsModalOpen(false);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
          {/* Top Filters Bar */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full"
                  />
                </div>
                
                <select
                  value={filters.status || 'All'}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Sources</option>
                  <option value="Website">Website</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Referral">Referral</option>
                </select>

                <select
                  value={filters.sort || 'latest'}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value as 'latest'|'oldest', page: 1 })}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full sm:w-auto text-gray-500 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Clear
                </Button>
              </div>

              <div className="flex gap-3 w-full lg:w-auto">
                <Button variant="secondary" onClick={handleExport} loading={isExporting} className="flex-1 sm:flex-none w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={openAddModal} className="flex-1 sm:flex-none w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </Button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 relative min-h-[200px]">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center h-48">
                      <Spinner className="mx-auto" />
                    </td>
                  </tr>
                )}
                {!loading && displayedLeads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12">
                      <EmptyState icon={Users} title="No leads found" description="Try adjusting your filters or add a new lead." />
                    </td>
                  </tr>
                )}
                {!loading && displayedLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{lead.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lead.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant={getStatusBadgeVariant(lead.status)}>{lead.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lead.source}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openViewModal(lead)} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mx-2 p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => openEditModal(lead)} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mx-2 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30" title="Edit Lead">
                        <Pencil className="h-4 w-4" />
                      </button>
                      {user?.role === 'admin' && (
                        <button onClick={() => handleDelete(lead._id)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 mx-2 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30" title="Delete Lead">
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
            <div className="bg-white dark:bg-gray-900 px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between sm:px-6">
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
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{((meta.page - 1) * meta.limit) + 1}</span> to <span className="font-medium">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="font-medium">{meta.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                      disabled={(filters.page || 1) === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {/* Render page numbers */}
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setFilters({ ...filters, page: pageNumber })}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                          (filters.page || 1) === pageNumber
                            ? 'z-10 bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    <button
                      onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                      disabled={(filters.page || 1) === meta.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Add/Edit/View Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add New Lead' : modalMode === 'edit' ? 'Edit Lead' : 'View Lead Details'}>
        <form onSubmit={handleModalSubmit} className="space-y-4 mt-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={modalMode === 'view'}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={modalMode === 'view'}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:dark:bg-gray-950 disabled:opacity-75"
              disabled={modalMode === 'view'}
            >
              <option value="New" className="dark:bg-gray-800 dark:text-gray-100">New</option>
              <option value="Contacted" className="dark:bg-gray-800 dark:text-gray-100">Contacted</option>
              <option value="Qualified" className="dark:bg-gray-800 dark:text-gray-100">Qualified</option>
              <option value="Lost" className="dark:bg-gray-800 dark:text-gray-100">Lost</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:dark:bg-gray-950 disabled:opacity-75"
              disabled={modalMode === 'view'}
            >
              <option value="Website" className="dark:bg-gray-800 dark:text-gray-100">Website</option>
              <option value="Instagram" className="dark:bg-gray-800 dark:text-gray-100">Instagram</option>
              <option value="Referral" className="dark:bg-gray-800 dark:text-gray-100">Referral</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            {modalMode === 'view' ? (
              <Button type="button" onClick={() => setIsModalOpen(false)}>Close</Button>
            ) : (
              <>
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" loading={isSubmitting}>
                  {modalMode === 'add' ? 'Create Lead' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
