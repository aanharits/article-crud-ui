'use client';

import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/authSchema';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NotebookPen } from 'lucide-react';
import { toast } from 'sonner';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        try {
            await api.post('/auth/register', data);
            router.push('/auth/login');

            toast.success('Registration Successfull!', {
                position: 'top-right',
                duration: 5000,
                style: {
                    fontSize: '21px',       
                    color: '#D1D8BE',
                    backgroundColor: '#1A1F36', 
                },
                className: 'rounded-xl shadow-xl border-1 border-gray-800',
            });
        } catch (err) {
            setError(err.response?.data?.status || 'Register failed');
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
                            Create an account
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-gray-800">
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    placeholder="Your name"
                                    className="w-full px-4 py-2 border text-black border-gray-800 bg-gray-200 rounded-xl focus:outline-none focus:ring-2"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-2 border text-black border-gray-800 bg-gray-200 rounded-xl focus:outline-none focus:ring-2"
                                />
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
                                Register
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <p className="text-sm text-gray-500">Have an account?{' '}
                            <a href="/auth/login" className="text-gray-800 font-semibold hover:underline">
                                Login
                            </a>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
