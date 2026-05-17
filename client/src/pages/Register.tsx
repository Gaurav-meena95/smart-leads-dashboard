import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';
import { Target } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Register: React.FC = () => {
  const [role, setRole] = useState<'sales' | 'admin'>('sales');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API_BASE}/auth/register`, { ...formdata, role });
      toast.success('Registration successful. Please login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 transition-colors">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Target className="h-8 w-8 text-blue-600 dark:text-blue-500" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Join Smart Leads Dashboard today</p>
        </div>

        {/* Role Selection Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8 border border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setRole('sales')}
            className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${role === 'sales' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`}
          >
            Sales User
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${role === 'admin' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`}
          >
            Administrator
          </button>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 ml-1">Full Name</label>
            <input
              type="text"
              required
              name="name"
              onChange={handleChange}
              value={formdata.name}
              placeholder="John Doe"
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 ml-1">Email</label>
            <input
              type="email"
              required
              name="email"
              onChange={handleChange}
              value={formdata.email}
              placeholder="john@example.com"
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 ml-1">Password</label>
            <input
              type="password"
              required
              name="password"
              onChange={handleChange}
              value={formdata.password}
              placeholder="••••••••"
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 px-1">Min. 8 characters, 1 number, 1 special character</p>
          </div>

          <button
            disabled={loading}
            className="w-full p-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg flex items-center justify-center mt-6"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <div className="text-center text-sm mt-6">
            <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
            <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline ml-1">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
