import React from 'react';
import { Link } from 'react-router';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: '🔍',
      title: 'Smart Search & Filters',
      description: 'Filter by status, source, and search by name or email — all filters work together instantly.',
    },
    {
      icon: '👥',
      title: 'Role-Based Access',
      description: 'Admin and Sales roles with granular permissions. Right access for the right people.',
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Track lead pipeline stages from New to Qualified. Know exactly where every lead stands.',
    },
    {
      icon: '⚡',
      title: 'Debounced Search',
      description: 'Lightning fast search with 500ms debounce. No unnecessary API calls, smooth experience.',
    },
    {
      icon: '📁',
      title: 'CSV Export',
      description: 'Export your filtered leads to CSV in one click. Your data, your way, anytime.',
    },
    {
      icon: '🔐',
      title: 'Secure JWT Auth',
      description: 'Bank-grade security with JWT tokens and bcrypt password hashing.',
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-text font-sans overflow-x-hidden">
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight">LeadFlow</span>
            <div className="w-2 h-2 rounded-full bg-brand"></div>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-sm font-medium text-muted hover:text-text transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="text-sm font-medium bg-brand hover:bg-brand-light text-white px-4 py-2 rounded-md transition-all hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left space-y-8 animate-fade-in-up stagger-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-medium border border-brand/20">
            ✦ Smart Lead Management for Modern Sales Teams
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Convert More Leads,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand">
              Close More Deals
            </span>
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto md:mx-0 leading-relaxed">
            Track, manage, and convert your leads with powerful filters, real-time insights, and role-based team collaboration.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-3 bg-brand hover:bg-brand-light text-white font-medium rounded-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
              Start Free →
            </Link>
            <a 
              href="#demo" 
              className="w-full sm:w-auto px-8 py-3 bg-transparent border border-border hover:border-muted text-text font-medium rounded-lg transition-all"
            >
              View Demo
            </a>
          </div>
          <p className="text-xs text-muted">No credit card required · Free forever plan</p>
        </div>

        <div className="flex-1 w-full max-w-lg animate-fade-in-up stagger-2">
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-brand/20 blur-[100px] rounded-full"></div>
            <div className="relative bg-surface border border-border rounded-xl shadow-2xl p-6 rotate-y-12 transform perspective-1000">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="h-4 w-24 bg-border rounded"></div>
                <div className="h-6 w-16 bg-brand/20 rounded-full"></div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-bg border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-border"></div>
                      <div className="space-y-2">
                        <div className="h-3 w-20 bg-muted rounded"></div>
                        <div className="h-2 w-32 bg-border rounded"></div>
                      </div>
                    </div>
                    <div className={`h-5 w-16 rounded-full ${i === 1 ? 'bg-blue-500/20' : i === 2 ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STATS BAR */}
      <section className="bg-surface border-y border-border py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center animate-fade-in-up stagger-3">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-text">2,400+</div>
            <div className="text-sm text-muted font-medium uppercase tracking-wider">Active Users</div>
          </div>
          <div className="space-y-2 relative md:before:absolute md:before:left-0 md:before:top-2 md:before:bottom-2 md:before:w-px md:before:bg-border md:after:absolute md:after:right-0 md:after:top-2 md:after:bottom-2 md:after:w-px md:after:bg-border">
            <div className="text-4xl font-bold text-text">98%</div>
            <div className="text-sm text-muted font-medium uppercase tracking-wider">Customer Satisfaction</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-brand">10x</div>
            <div className="text-sm text-muted font-medium uppercase tracking-wider">Faster Lead Tracking</div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up stagger-3">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything your sales team needs</h2>
          <p className="text-muted text-lg">Powerful features, zero complexity.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className={`bg-surface border border-border rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] animate-fade-in-up stagger-${(idx % 3) + 4}`}
            >
              <div className="w-12 h-12 bg-bg rounded-lg border border-border flex items-center justify-center text-2xl mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="py-24 px-6 bg-surface/50 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up stagger-3">
            <h2 className="text-3xl font-bold">Get started in 3 simple steps</h2>
          </div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-px border-t-2 border-dashed border-border z-0"></div>
            
            {[
              { step: 1, title: 'Create Account', desc: 'Register as Admin or Sales user in seconds.' },
              { step: 2, title: 'Add Your Leads', desc: 'Import or manually add leads with source tracking.' },
              { step: 3, title: 'Track & Convert', desc: 'Filter, search, and move leads through your pipeline.' }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center animate-fade-in-up stagger-4">
                <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xl mb-6 ring-8 ring-bg">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted text-sm max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LEAD STATUS SHOWCASE */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12 animate-fade-in-up stagger-2">Visual pipeline at a glance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up stagger-3">
          {[
            { label: 'NEW', color: 'bg-blue-500', text: 'Fresh leads just added', count: '124' },
            { label: 'CONTACTED', color: 'bg-yellow-500', text: 'In conversation', count: '58' },
            { label: 'QUALIFIED', color: 'bg-green-500', text: 'Ready to close', count: '32' },
            { label: 'LOST', color: 'bg-red-500', text: 'Learn and improve', count: '14' },
          ].map((status, idx) => (
            <div key={idx} className="bg-surface border border-border p-6 rounded-xl flex flex-col items-center gap-4">
              <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${status.color}`}>
                {status.label}
              </div>
              <div className="text-5xl font-extrabold text-text">{status.count}</div>
              <div className="text-sm text-muted">{status.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/20 to-bg z-0"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8 border border-border bg-surface/50 backdrop-blur-xl p-12 rounded-3xl animate-fade-in-up stagger-3">
          <h2 className="text-4xl font-bold">Ready to supercharge your sales?</h2>
          <p className="text-lg text-muted">Join hundreds of teams closing more deals.</p>
          <Link 
            to="/register" 
            className="inline-block px-8 py-4 bg-text text-bg hover:bg-white font-bold rounded-lg transition-transform hover:scale-105"
          >
            Get Started Free →
          </Link>
          <p className="text-xs text-muted">Setup takes less than 2 minutes</p>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">LeadFlow</span>
            <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
          </div>
          
          <div className="flex gap-6 text-sm text-muted">
            <a href="#" className="hover:text-text transition-colors">Features</a>
            <a href="#" className="hover:text-text transition-colors">Pricing</a>
            <Link to="/login" className="hover:text-text transition-colors">Login</Link>
            <Link to="/register" className="hover:text-text transition-colors">Register</Link>
          </div>
          
          <div className="text-sm text-muted">
            Built with <span className="text-red-500">❤️</span> using MERN Stack
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center mt-12 text-xs text-border">
          &copy; {new Date().getFullYear()} LeadFlow by Smart Leads Dashboard. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
