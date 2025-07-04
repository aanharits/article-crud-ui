'use client';

import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/authSchema';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { NotebookPen } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            const res = await api.post('/auth/login', data);
            const token = res.data.token;
            localStorage.setItem('token', token);
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.status || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-800">
            {/* Left Side - Branding */}
            <div className="hidden md:flex flex-col justify-center items-center text-accent-foreground px-10 bg-gray-900 relative overflow-hidden">
                {/* Decorative circle */}
                <div className="absolute -top-16 -left-16 w-64 h-64 bg-gray-700 rounded-full opacity-20" />
                <div className="absolute bottom-10 right-10">
                    <NotebookPen size={120} className="text-white/20" />
                </div>
                <h1 className="text-6xl font-bold mb-4 z-10 text-shadow-lg/100">TicleCraft</h1>
                <p className="text-xl text-center font-bold max-w-sm z-10 text-shadow-lg/20 font-sans md:font-serif">
                    Simplify your workflow and manage articles efficiently with style.
                </p>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center px-4 py-8 bg-gray-800">
                <Card className="p-8 rounded-2xl w-full max-w-md shadow-2xl/50 drop-shadow-xl/50">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center font-bold text-gray-800 text-shadow-lg/20">
                            Login to your account
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-gray-800">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-2 border text-black border-gray-800 bg-gray-200 rounded-xl focus:outline-none focus:ring-2"
                                    />
                                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                                {errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("password")}
                                    placeholder="Your password"
                                    className="w-full px-4 py-2 border text-black border-gray-800 bg-gray-200 rounded-xl focus:outline-none focus:ring-2"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="transition duration-300 ease-in-out w-full bg-gray-800 text-white hover:bg-gray-700"
                            >
                                Login
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <p className="text-sm text-gray-500">Don't Have an account?{' '}
                            <a href="/auth/register" className="text-gray-800 font-semibold hover:underline">
                                Register
                            </a>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
