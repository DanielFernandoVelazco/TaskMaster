// src/pages/Team/Team.tsx
import React, { useState, useEffect } from 'react';
import { usersService } from '../../services/users.service';
import type { User } from '../../types';
import toast from 'react-hot-toast';

export const Team: React.FC = () => {
    const [members, setMembers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            setIsLoading(true);
            // Simulamos datos por ahora, luego conectaremos con el backend real
            const mockMembers: User[] = [
                { id: '1', name: 'Jordan Smith', email: 'jordan@taskmaster.com', role: 'admin', avatar: '', createdAt: '', updatedAt: '' },
                { id: '2', name: 'Elena Rodriguez', email: 'elena.r@taskmaster.com', role: 'member', avatar: '', createdAt: '', updatedAt: '' },
                { id: '3', name: 'Marcus Chen', email: 'm.chen@taskmaster.com', role: 'viewer', avatar: '', createdAt: '', updatedAt: '' },
                { id: '4', name: 'Sarah Connor', email: 'sarah.c@taskmaster.com', role: 'member', avatar: '', createdAt: '', updatedAt: '' },
            ];
            setMembers(mockMembers);
        } catch (error) {
            toast.error('Error al cargar los miembros del equipo');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInviteMember = () => {
        // Implementar lógica de invitación
        toast.success('Función de invitación próximamente');
    };

    const handleEditMember = (memberId: string) => {
        // Implementar edición
        toast.success(`Editar miembro ${memberId}`);
    };

    const handleDeleteMember = (memberId: string) => {
        if (!confirm('¿Estás seguro de eliminar este miembro del equipo?')) return;

        // Implementar eliminación
        setMembers(members.filter(m => m.id !== memberId));
        toast.success('Miembro eliminado del equipo');
    };

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || member.role === roleFilter;
        const matchesStatus = statusFilter === 'all'; // Por ahora siempre true

        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', label: 'Admin' };
            case 'member':
                return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700', label: 'Member' };
            case 'viewer':
                return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700', label: 'Viewer' };
            default:
                return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700', label: role };
        }
    };

    const getStatusBadge = (status: string) => {
        // Simulamos diferentes estados
        const random = Math.random();
        if (random < 0.6) {
            return { color: 'bg-emerald-500', label: 'Active' };
        } else if (random < 0.8) {
            return { color: 'bg-amber-500', label: 'Away' };
        } else {
            return { color: 'bg-slate-300 dark:bg-slate-600', label: 'Offline' };
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                        Team Management
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Manage your team members and their account permissions.
                    </p>
                </div>
                <button
                    onClick={handleInviteMember}
                    className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm inline-flex items-center gap-2 transition-all shadow-sm"
                >
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                    Invite Member
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-800 mb-6">
                <nav className="flex gap-8">
                    <button className="border-b-2 border-primary text-primary px-1 pb-4 text-sm font-bold flex items-center gap-2">
                        All Members
                        <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full">{members.length}</span>
                    </button>
                    <button className="border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-1 pb-4 text-sm font-bold transition-colors">
                        Teams
                    </button>
                    <button className="border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-1 pb-4 text-sm font-bold transition-colors">
                        Permissions
                    </button>
                </nav>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="relative flex-1 min-w-[300px]">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Search by name or email"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                    <option value="all">Role: All</option>
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                    <option value="viewer">Viewer</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                    <option value="all">Status: All</option>
                    <option value="active">Active</option>
                    <option value="away">Away</option>
                    <option value="offline">Offline</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                    More Filters
                </button>
            </div>

            {/* Members Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Member</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Role</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredMembers.map((member) => {
                                const roleBadge = getRoleBadge(member.role || 'member');
                                const status = getStatusBadge(member.id);

                                return (
                                    <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                                    {member.avatar ? (
                                                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-primary font-bold text-sm">
                                                            {member.name.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{member.name}</p>
                                                    <p className="text-xs text-slate-500">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge.bg} ${roleBadge.text} border ${roleBadge.border}`}>
                                                {roleBadge.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                                                <span className="text-sm text-slate-600 dark:text-slate-400">{status.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditMember(member.id)}
                                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-slate-600"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteMember(member.id)}
                                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-red-500"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                        Showing {filteredMembers.length} of {members.length} members
                    </span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs font-medium text-slate-400 cursor-not-allowed">
                            Previous
                        </button>
                        <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <span className="material-symbols-outlined">info</span>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">About Roles & Permissions</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Admins have full access to settings and billing. Members can create and manage projects.
                        Viewers have read-only access to assigned projects. You can customize these defaults in the
                        <button className="text-primary font-semibold hover:underline ml-1">Permissions tab</button>.
                    </p>
                </div>
            </div>
        </div>
    );
};