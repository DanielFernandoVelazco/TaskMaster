// src/layouts/AuthLayout/AuthLayout.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    alternativeText: string;
    alternativeLink: string;
    alternativeLinkText: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    title,
    subtitle,
    alternativeText,
    alternativeLink,
    alternativeLinkText,
}) => {
    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
            {/* Navbar */}
            <nav className="w-full px-6 py-4 flex items-center justify-between bg-transparent">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-xl">task_alt</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        TaskMaster
                    </span>
                </Link>
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                        Features
                    </Link>
                    <Link to="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                        Pricing
                    </Link>
                    <Link to="/support" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                        Support
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-[480px]">
                    {/* Auth Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 md:p-10">
                        <div className="mb-8">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 mb-2">
                                {title}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>
                        </div>

                        {children}

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                {alternativeText}{' '}
                                <Link to={alternativeLink} className="text-primary font-bold ml-1 hover:underline">
                                    {alternativeLinkText}
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Social Proof */}
                    <div className="mt-8 flex flex-col items-center gap-4 opacity-70">
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                            Trusted by teams at
                        </p>
                        <div className="flex gap-8 items-center grayscale opacity-50">
                            <span className="font-black text-xl text-slate-600 dark:text-slate-300">VELOCITY</span>
                            <span className="font-black text-xl text-slate-600 dark:text-slate-300">PRISM</span>
                            <span className="font-black text-xl text-slate-600 dark:text-slate-300">NOVA</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full px-6 py-8 text-center">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                    © 2024 TaskMaster Inc. All rights reserved.
                </p>
            </footer>
        </div>
    );
};