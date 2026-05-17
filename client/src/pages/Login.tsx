import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Target } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:3000/api';

const Login: React.FC = () => {
  const [role, setRole] = useState<'sales' | 'admin'>('sales');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
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
      const res = await axios.post(`${API_BASE}/auth/login`, { ...formdata, role });
      const user = res.data.data.user;
      const token = res.data.data.accessToken;

      login(token, user);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Target className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-500">Enter your credentials to access your dashboard</p>
        </div>

        {/* Role Selection Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-8 border border-gray-200">
          <button
            type="button"
            onClick={() => setRole('sales')}
            className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${role === 'sales' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Sales
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${role === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Administrator
          </button>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-gray-500 ml-1">Email</label>
            <input
              type="email"
              required
              name="email"
              onChange={handleChange}
              value={formdata.email}
              placeholder="admin@smartleads.com"
              className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none transition-all text-sm text-gray-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-gray-500 ml-1">Password</label>
            <input
              type="password"
              required
              name="password"
              onChange={handleChange}
              value={formdata.password}
              placeholder="••••••••"
              className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none transition-all text-sm text-gray-900"
            />
          </div>

          <button
            disabled={loading}
            className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg flex items-center justify-center mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
          
          <div className="text-center text-sm mt-6">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="font-bold text-blue-600 hover:underline ml-1">
              Join Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
