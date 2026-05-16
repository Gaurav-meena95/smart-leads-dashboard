import type { Lead } from '../types';

export const fetchLeads = async (): Promise<Lead[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          status: 'new',
          createdAt: new Date().toISOString(),
        }
      ]);
    }, 1000);
  });
};
