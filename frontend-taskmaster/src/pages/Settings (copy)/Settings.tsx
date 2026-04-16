// src/pages/Settings/Settings.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

type SettingsTab = 'profile' | 'notifications' | 'security' | 'workspace' | 'billing';

export const Settings: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [isLoading, setIsLoading] = useState(false);

    // Profile form state
    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: '',
    });

    // Notification settings
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        pushNotifications: true,
        weeklyReports: false,
        taskUpdates: {
            statusChanges: true,
            dueDateReminders: true,
        },
        teamComments: {
            directMentions: true,
            repliesToThreads: false,
        },
        systemAlerts: {
            securityLogins: true,
            maintenanceWindows: true,
        },
    });

    // Password form state
    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    // Workspace settings
    const [workspace, setWorkspace] = useState({
        name: 'TaskMaster Admin',
        url: 'admin-workspace',
        privacyMode: 'public' as 'public' | 'private',
    });

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            // Aquí iría la llamada al backend
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Perfil actualizado correctamente');
        } catch (error) {
            toast.error('Error al actualizar el perfil');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveNotifications = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Preferencias de notificaciones actualizadas');
        } catch (error) {
            toast.error('Error al actualizar las notificaciones');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (password.new !== password.confirm) {
            toast.error('Las contraseñas no coinciden');
            return;
        }
        if (password.new.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Contraseña actualizada correctamente');
            setPassword({ current: '', new: '', confirm: '' });
        } catch (error) {
            toast.error('Error al cambiar la contraseña');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveWorkspace = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Configuración del workspace actualizada');
        } catch (error) {
            toast.error('Error al actualizar la configuración');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        if (!confirm('¿Estás absolutamente seguro? Esta acción no se puede deshacer.')) return;
        toast.success('Cuenta eliminada (simulado)');
    };

    const tabs = [
        { id: 'profile' as SettingsTab, label: 'Profile', icon: 'person' },
        { id: 'notifications' as SettingsTab, label: 'Notifications', icon: 'notifications' },
        { id: 'security' as SettingsTab, label: 'Security', icon: 'security' },
        { id: 'workspace' as SettingsTab, label: 'Workspace', icon: 'business' },
        { id: 'billing' as SettingsTab, label: 'Billing', icon: 'payments' },
    ];

    return (
        <div className="max-w-6xl mx-auto px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">
                    Settings
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="lg:w-64 flex-shrink-0">
                    <nav className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors ${activeTab === tab.id
                                        ? 'bg-primary/5 text-primary border-r-4 border-primary'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className="material-symbols-outlined">{tab.icon}</span>
                                <span className={`text-sm ${activeTab === tab.id ? 'font-semibold' : 'font-medium'}`}>
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Profile Section */}
                    {activeTab === 'profile' && (
                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-lg font-bold">Profile Information</h3>
                                <p className="text-sm text-slate-500">Update your personal details and how others see you.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                                            {profile.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined">photo_camera</span>
                                        </button>
                                    </div>
                                    <div>
                                        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
                                            Change Photo
                                        </button>
                                        <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Bio
                                        </label>
                                        <textarea
                                            value={profile.bio}
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                            rows={3}
                                            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary"
                                            placeholder="Write a short bio about yourself..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isLoading}
                                        className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Notifications Section */}
                    {activeTab === 'notifications' && (
                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-lg font-bold">Notification Preferences</h3>
                                <p className="text-sm text-slate-500">Choose what you want to be notified about and where.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Global DND Toggle */}
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-3 rounded-full">
                                            <span className="material-symbols-outlined text-primary">do_not_disturb_on</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100">Do Not Disturb</h4>
                                            <p className="text-sm text-slate-500">Pause all notifications across email and push for a set period.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                {/* Email/Push Toggles */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold">Email Notifications</p>
                                            <p className="text-xs text-slate-500">Receive summary of activities via email</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notifications.emailNotifications}
                                                onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold">Push Notifications</p>
                                            <p className="text-xs text-slate-500">Receive instant alerts on your desktop</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notifications.pushNotifications}
                                                onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold">Weekly Reports</p>
                                            <p className="text-xs text-slate-500">Detailed productivity report every Monday</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notifications.weeklyReports}
                                                onChange={(e) => setNotifications({ ...notifications, weeklyReports: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>

                                {/* Detailed Settings Table */}
                                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden mt-6">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Activity Type</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Email</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Push</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            <tr>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium">Status changes</p>
                                                    <p className="text-xs text-slate-400">When a task is moved to another column</p>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.taskUpdates.statusChanges}
                                                        onChange={(e) => setNotifications({
                                                            ...notifications,
                                                            taskUpdates: { ...notifications.taskUpdates, statusChanges: e.target.checked }
                                                        })}
                                                        className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.taskUpdates.statusChanges}
                                                        onChange={(e) => setNotifications({
                                                            ...notifications,
                                                            taskUpdates: { ...notifications.taskUpdates, statusChanges: e.target.checked }
                                                        })}
                                                        className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium">Due date reminders</p>
                                                    <p className="text-xs text-slate-400">24 hours before a task is due</p>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.taskUpdates.dueDateReminders}
                                                        onChange={(e) => setNotifications({
                                                            ...notifications,
                                                            taskUpdates: { ...notifications.taskUpdates, dueDateReminders: e.target.checked }
                                                        })}
                                                        className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.taskUpdates.dueDateReminders}
                                                        onChange={(e) => setNotifications({
                                                            ...notifications,
                                                            taskUpdates: { ...notifications.taskUpdates, dueDateReminders: e.target.checked }
                                                        })}
                                                        className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium">Direct mentions</p>
                                                    <p className="text-xs text-slate-400">When someone uses @username</p>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.teamComments.directMentions}
                                                        onChange={(e) => setNotifications({
                                                            ...notifications,
                                                            teamComments: { ...notifications.teamComments, directMentions: e.target.checked }
                                                        })}
                                                        className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.teamComments.directMentions}
                                                        onChange={(e) => setNotifications({
                                                            ...notifications,
                                                            teamComments: { ...notifications.teamComments, directMentions: e.target.checked }
                                                        })}
                                                        className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20"
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSaveNotifications}
                                        disabled={isLoading}
                                        className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? 'Saving...' : 'Save Preferences'}
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Security Section */}
                    {activeTab === 'security' && (
                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-lg font-bold">Security & Password</h3>
                                <p className="text-sm text-slate-500">Secure your account by managing your password and 2FA.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
                                        <input
                                            type="password"
                                            value={password.current}
                                            onChange={(e) => setPassword({ ...password, current: e.target.value })}
                                            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                                            <input
                                                type="password"
                                                value={password.new}
                                                onChange={(e) => setPassword({ ...password, new: e.target.value })}
                                                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={password.confirm}
                                                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold">Two-Factor Authentication</p>
                                            <p className="text-xs text-slate-500">Adds an extra layer of security to your account.</p>
                                        </div>
                                        <button className="text-primary text-sm font-bold border border-primary/20 bg-primary/5 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors">
                                            Enable 2FA
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleChangePassword}
                                        disabled={isLoading}
                                        className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Workspace Section */}
                    {activeTab === 'workspace' && (
                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-lg font-bold">Workspace Settings</h3>
                                <p className="text-sm text-slate-500">Manage your workspace identity and visibility.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Workspace Name</label>
                                        <input
                                            type="text"
                                            value={workspace.name}
                                            onChange={(e) => setWorkspace({ ...workspace, name: e.target.value })}
                                            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Workspace URL</label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 text-sm">
                                                taskmaster.com/
                                            </span>
                                            <input
                                                type="text"
                                                value={workspace.url}
                                                onChange={(e) => setWorkspace({ ...workspace, url: e.target.value })}
                                                className="flex-1 rounded-r-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 pt-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Privacy Mode</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div
                                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${workspace.privacyMode === 'public'
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                                    }`}
                                                onClick={() => setWorkspace({ ...workspace, privacyMode: 'public' })}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`material-symbols-outlined ${workspace.privacyMode === 'public' ? 'text-primary' : 'text-slate-400'}`}>
                                                        public
                                                    </span>
                                                    <span className={`text-sm font-bold ${workspace.privacyMode === 'public' ? 'text-primary' : ''}`}>
                                                        Public
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    Visible to anyone with the link within the organization.
                                                </p>
                                            </div>
                                            <div
                                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${workspace.privacyMode === 'private'
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                                    }`}
                                                onClick={() => setWorkspace({ ...workspace, privacyMode: 'private' })}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`material-symbols-outlined ${workspace.privacyMode === 'private' ? 'text-primary' : 'text-slate-400'}`}>
                                                        lock
                                                    </span>
                                                    <span className={`text-sm font-bold ${workspace.privacyMode === 'private' ? 'text-primary' : ''}`}>
                                                        Private
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    Only invited team members can access this workspace.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSaveWorkspace}
                                        disabled={isLoading}
                                        className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Billing Section (Placeholder) */}
                    {activeTab === 'billing' && (
                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-lg font-bold">Billing & Plan</h3>
                                <p className="text-sm text-slate-500">Manage your subscription and billing information.</p>
                            </div>
                            <div className="p-6">
                                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
                                    <span className="material-symbols-outlined text-4xl text-primary mb-2">credit_card</span>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Billing Page Coming Soon</h4>
                                    <p className="text-sm text-slate-500">This section is under development.</p>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Danger Zone (visible en todas las tabs excepto billing) */}
                    {activeTab !== 'billing' && (
                        <section className="mt-8 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/30 shadow-sm overflow-hidden">
                            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Delete Account</h3>
                                    <p className="text-sm text-red-600/80 dark:text-red-400/60 mt-1">
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>
                                </div>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-all"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};