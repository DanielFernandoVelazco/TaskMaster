// src/pages/Landing/Landing.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Landing: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Navigation */}
            <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary p-1.5 rounded-lg">
                                <span className="material-symbols-outlined text-white text-xl">task_alt</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">TaskMaster</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-sm font-bold px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                        TaskMaster Pro
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                        The ultimate project management platform for modern teams.
                        Organize, track, and deliver your best work.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-primary text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors shadow-xl shadow-primary/20"
                        >
                            Start Free Trial
                        </Link>
                        <button className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-bold px-8 py-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            Book a Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-3xl font-bold text-center mb-12">Everything you need to manage projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-4">
                            <span className="material-symbols-outlined text-2xl">dashboard</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Kanban Boards</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Visualize your workflow with customizable boards, columns, and cards. Drag and drop to organize tasks.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-4">
                            <span className="material-symbols-outlined text-2xl">group</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Assign tasks, add comments, and mention team members. Real-time updates keep everyone in sync.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-4">
                            <span className="material-symbols-outlined text-2xl">analytics</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Analytics & Reports</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Track progress with powerful analytics. Monitor team performance and project health at a glance.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-3xl font-bold text-center mb-4">Simple, transparent pricing</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 text-center mb-12">
                    Choose the plan that's right for your team
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
                        <h3 className="text-xl font-bold mb-2">Free</h3>
                        <p className="text-slate-500 text-sm mb-6">Perfect for small side projects</p>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-4xl font-black">$0</span>
                            <span className="text-slate-500">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                Up to 3 Projects
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                Basic Analytics
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                Community Support
                            </li>
                        </ul>
                        <Link
                            to="/register"
                            className="w-full py-3 px-4 rounded-lg font-bold text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-block text-center"
                        >
                            Start for Free
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-white dark:bg-slate-900 border-2 border-primary rounded-xl p-8 relative scale-105 shadow-xl">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                            Most Popular
                        </div>
                        <h3 className="text-xl font-bold mb-2">Pro</h3>
                        <p className="text-slate-500 text-sm mb-6">Everything you need to scale</p>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-4xl font-black text-primary">$29</span>
                            <span className="text-slate-500">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                Unlimited Projects
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                Advanced Analytics
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                24/7 Email Support
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                Custom Branding
                            </li>
                        </ul>
                        <Link
                            to="/register"
                            className="w-full py-3 px-4 rounded-lg font-bold text-sm bg-primary text-white hover:opacity-90 transition-opacity inline-block text-center"
                        >
                            Upgrade Now
                        </Link>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
                        <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                        <p className="text-slate-500 text-sm mb-6">Advanced controls and security</p>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-4xl font-black">Custom</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                Everything in Pro
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                Priority Phone Support
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                Dedicated Account Manager
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                SSO & Advanced Security
                            </li>
                        </ul>
                        <button className="w-full py-3 px-4 rounded-lg font-bold text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 mt-20 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="bg-primary p-1.5 rounded-lg">
                                    <span className="material-symbols-outlined text-white">task_alt</span>
                                </div>
                                <span className="text-lg font-bold">TaskMaster</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-6">
                                The ultimate project management platform for modern teams.
                            </p>
                        </div>
                        <div>
                            <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-400">Product</h5>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-sm hover:text-primary transition-colors">Features</a></li>
                                <li><a href="#" className="text-sm hover:text-primary transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-sm hover:text-primary transition-colors">Integrations</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-400">Company</h5>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-sm hover:text-primary transition-colors">About Us</a></li>
                                <li><a href="#" className="text-sm hover:text-primary transition-colors">Careers</a></li>
                                <li><a href="#" className="text-sm hover:text-primary transition-colors">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-400">Support</h5>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-sm hover:text-primary transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-sm hover:text-primary transition-colors">Documentation</a></li>
                                <li><a href="#" className="text-sm hover:text-primary transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                        © 2024 TaskMaster Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};