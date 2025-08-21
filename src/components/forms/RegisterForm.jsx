"use client";

import api from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/schema/authSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import Branding from "@/components/forms/branding";

export default function RegisterForm() {
    const router = useRouter();
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        try {
            await api.post("/auth/register", data);
            router.push("/auth/login");

            toast.success("Registration Successful!", {
                position: "top-right",
                duration: 5000,
                style: {
                    fontSize: "15px",
                    color: "#D1D8BE",
                    backgroundColor: "#1A1F36",
                },
                className: "rounded-xl shadow-xl border-1 border-gray-800",
            });
        } catch (err) {
            setError(err.response?.data?.status || "Register failed");
        }
    };

    return (
        <Card className="p-3 md:p-8 rounded-xl w-full max-w-sm md:max-w-md shadow-xl">
            <div className="block md:hidden mb-6 bg-gray-900 p-4 rounded-lg shadow-lg">
                <Branding />
            </div>
            <CardHeader>
                <CardTitle className="text-lg md:text-2xl text-center font-bold text-gray-800">
                    Create an account
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-800 text-sm md:text-base">
                {error && (
                    <p className="text-red-500 text-xs md:text-sm mb-2">{error}</p>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs md:text-sm">
                            Name
                        </Label>
                        <Input
                            id="name"
                            {...register("name")}
                            placeholder="Your name"
                            className="w-full px-3 py-2 text-sm border text-black border-gray-800 bg-gray-200 rounded-lg focus:ring-2"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs md:text-sm">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="your@email.com"
                            className="w-full px-3 py-2 text-sm border text-black border-gray-800 bg-gray-200 rounded-lg focus:ring-2"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs">{errors.email.message}</p>
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
                            <p className="text-red-500 text-xs">{errors.password.message}</p>
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
                <p className="text-xs md:text-sm text-gray-500">
                    Have an account?{" "}
                    <a
                        href="/auth/login"
                        className="text-gray-800 font-semibold hover:underline"
                    >
                        Login
                    </a>
                </p>
            </CardFooter>
        </Card>
    );
}
