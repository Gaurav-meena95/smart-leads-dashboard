import { ILead } from '../types';

export const generateCsv = (leads: ILead[]): string => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  
  const rows = leads.map(lead => {
    return [
      `"${lead.name.replace(/"/g, '""')}"`,
      `"${lead.email.replace(/"/g, '""')}"`,
      `"${lead.status}"`,
      `"${lead.source}"`,
      `"${new Date(lead.createdAt).toISOString()}"`
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};
