// src/pages/Auth/Register.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout/AuthLayout';
import { useAuth } from '../../contexts/AuthContext';

const registerSchema = z.object({
    name: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede tener más de 50 caracteres'),
    email: z.string().email('Por favor ingresa un email válido'),
    password: z.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(20, 'La contraseña no puede tener más de 20 caracteres')
        .regex(
            /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
            'La contraseña debe tener al menos una mayúscula, una minúscula y un número o carácter especial'
        ),
    terms: z.boolean().refine(val => val === true, {
        message: 'Debes aceptar los términos y condiciones',
    }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register: registerUser, isLoading } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            terms: false,
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerUser(data.email, data.password, data.name);
            navigate('/dashboard');
        } catch (error) {
            // Error ya manejado por el contexto
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Join TaskMaster and boost your productivity today."
            alternativeText="Already have an account?"
            alternativeLink="/login"
            alternativeLinkText="Log in"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Full Name
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <span className="material-symbols-outlined text-lg">person</span>
                        </span>
                        <input
                            id="name"
                            type="text"
                            {...register('name')}
                            placeholder="John Doe"
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 ${errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                                }`}
                        />
                    </div>
                    {errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Email Address
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <span className="material-symbols-outlined text-lg">mail</span>
                        </span>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            placeholder="john@example.com"
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                                }`}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Password
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <span className="material-symbols-outlined text-lg">lock</span>
                        </span>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                                }`}
                        />
                    </div>
                    {errors.password && (
                        <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                        Must contain at least 1 uppercase, 1 lowercase, and 1 number or special character.
                    </p>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start gap-3 py-2">
                    <div className="flex items-center h-5">
                        <input
                            id="terms"
                            type="checkbox"
                            {...register('terms')}
                            className="w-4 h-4 text-primary bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded focus:ring-primary focus:ring-offset-0"
                        />
                    </div>
                    <label htmlFor="terms" className="text-sm text-slate-500 dark:text-slate-400 leading-tight">
                        I agree to the{' '}
                        <a href="/terms" className="text-primary font-medium hover:underline">
                            Terms and Conditions
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-primary font-medium hover:underline">
                            Privacy Policy
                        </a>.
                    </label>
                </div>
                {errors.terms && (
                    <p className="text-xs text-red-500 mt-1">{errors.terms.message}</p>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-opacity-90 text-white font-bold py-3.5 px-4 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Creating account...</span>
                        </span>
                    ) : (
                        <>
                            <span>Create Account</span>
                            <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">
                                arrow_forward
                            </span>
                        </>
                    )}
                </button>
            </form>
        </AuthLayout>
    );
};