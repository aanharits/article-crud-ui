"use client";

import api from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schema/authSchema";
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
import Branding from "@/components/forms/branding";

export default function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            const res = await api.post("/auth/login", data);
            const token = res.data.token;
            localStorage.setItem("token", token);
            router.push("/dashboard");
        } catch (err) {
            setError(err.response?.data?.status || "Login failed");
        }
    };

    return (
        <Card className="p-3 md:p-8 rounded-xl w-full max-w-sm md:max-w-md shadow-xl">
            <div className="block md:hidden mb-6 bg-gray-900 p-4 rounded-lg shadow-lg">
                <Branding />
            </div>
            <CardHeader>
                <CardTitle className="text-lg md:text-2xl text-center font-bold text-gray-800">
                    Login to your account
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-800 text-sm md:text-base">
                {error && (
                    <p className="text-red-500 text-xs md:text-sm mb-2">{error}</p>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs md:text-sm">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="your@email.com"
                            className="w-full px-3 py-2 text-sm border text-black border-gray-800 bg-gray-200 rounded-xl focus:outline-none focus:ring-2"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-xs md:text-sm">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            {...register("password")}
                            placeholder="Your password"
                            className="w-full px-3 py-2 text-sm border text-black border-gray-800 bg-gray-200 rounded-lg focus:ring-2"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">
                                {errors.password.message}
                            </p>
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
                <p className="text-sm md:text-sm text-gray-500">
                    Don’t have an account?{" "}
                    <a
                        href="/auth/register"
                        className="text-gray-800 font-semibold hover:underline"
                    >
                        Register
                    </a>
                </p>
            </CardFooter>
        </Card>
    );
}
