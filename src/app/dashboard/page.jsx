"use client";

import api from "@/lib/api/axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { articleSchema } from "@/lib/schema/articleSchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [viewArticle, setViewArticle] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editPostId, setEditPostId] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            title: "",
            author_name: "",
            content: "",
            published: false,
        },
    });

    const publishedValue = watch("published");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await api.get("/api/posts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPosts(res.data.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const handleCreate = async (data) => {
        const token = localStorage.getItem("token");
        try {
            await api.post("/api/posts", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            reset();
            setShowForm(false);
            fetchPosts();

            toast.success("Create Successfull!", {
                position: "top-right",
                duration: 2000,
                style: {
                    fontSize: "13px",
                    color: "#1A1F36",
                    backgroundColor: "#D1D8BE",
                },
                className: "rounded-xl shadow-xl border-2 border-gray-800",
            });
        } catch (err) {
            console.error("Gagal tambah artikel:", err.response?.data || err);
        }
    };

    const handleUpdate = async (id, data) => {
        const token = localStorage.getItem("token");
        try {
            await api.patch(`/api/posts/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchPosts();
            toast.success("Post Updated!", {
                position: "top-right",
                duration: 2000,
                style: {
                    fontSize: "13px",
                    color: "#1A1F36",
                    backgroundColor: "#D1D8BE",
                },
                className: "rounded-xl shadow-xl border-2 border-gray-800",
            });
        } catch (err) {
            console.error("Gagal update :", err.response?.data || err);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await api.delete(`/api/posts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));

            toast.success("Post Deleted!", {
                position: "top-right",
                duration: 2000,
                style: {
                    fontSize: "13px",
                    color: "#1A1F36",
                    backgroundColor: "#D1D8BE",
                },
                className: "rounded-xl shadow-xl border-2 border-gray-800",
            });
        } catch (err) {
            console.error("Gagal hapus artikel:", err.response?.data || err);
        }
    };

    const onSubmit = async (data) => {
        if (isEditing && editPostId) {
            await handleUpdate(editPostId, data);
        } else {
            await handleCreate(data);
        }
        setIsEditing(false);
        setEditPostId(null);
        reset();
        setShowForm(false);
    };

    return (
        <div className="relative min-h-screen p-4 sm:p-6 z-10 bg-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-accent-foreground">
                    PaperLane
                </h1>
                <div className="flex gap-2 sm:gap-3">
                    {/* Create Button */}
                    <Dialog open={showForm} onOpenChange={setShowForm}>
                        <DialogTrigger asChild>
                            <Button className="bg-accent-foreground hover:bg-accent-foreground-60 shadow-md font-semibold text-gray-700 transition-transform hover:scale-105 px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm">
                                + Create
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="px-5 sm:px-6 bg-accent-foreground border-4 border-gray-700 rounded-xl text-gray-700">
                            <DialogHeader>
                                <DialogTitle className="text-base sm:text-lg md:text-xl font-bold text-center mb-2">
                                    Create Anything
                                </DialogTitle>
                            </DialogHeader>

                            {/* Form */}
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-3 sm:space-y-4 "
                            >
                                <div>
                                    <Input
                                        {...register("title")}
                                        placeholder="Title"
                                        className="w-full px-3 py-2 border text-black border-gray-800 bg-white rounded-lg text-sm sm:text-base"
                                    />
                                    {errors.title && (
                                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                                            {errors.title.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Input
                                        {...register("author_name")}
                                        placeholder="Author (optional)"
                                        className="w-full px-3 py-2 border text-black border-gray-800 bg-white rounded-lg text-sm sm:text-base"
                                    />
                                </div>

                                <div>
                                    <Textarea
                                        {...register("content")}
                                        placeholder="Content"
                                        className="w-full h-28 sm:h-32 resize-y px-3 py-2 border text-black border-gray-800 bg-white rounded-lg text-sm sm:text-base whitespace-pre-wrap break-words break-all"
                                    />
                                    {errors.content && (
                                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                                            {errors.content.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        className="border border-[#1A1F36]"
                                        id="published"
                                        checked={publishedValue}
                                        onCheckedChange={(checked) =>
                                            setValue("published", Boolean(checked))
                                        }
                                    />
                                    <label
                                        htmlFor="published"
                                        className="text-xs sm:text-sm font-medium"
                                    >
                                        Published?
                                    </label>
                                </div>

                                <DialogFooter className="flex justify-end space-x-2 pt-2">
                                    <Button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="bg-white text-black hover:bg-gray-200 text-xs sm:text-sm"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-gray-900 text-white hover:bg-gray-600 text-xs sm:text-sm"
                                    >
                                        Submit
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Logout Button */}
                    <Button
                        onClick={() => {
                            localStorage.removeItem("token");
                            router.push("/auth/login");
                        }}
                        className="bg-red-500 text-white hover:bg-red-600 font-semibold transition-transform hover:scale-105 px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm"
                    >
                        Logout
                    </Button>
                </div>
            </div>

            {/* Display Articles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-gray-900 p-3 sm:p-4 border border-gray-700 rounded-xl shadow-lg h-full flex flex-col hover:scale-[1.03] sm:hover:scale-[1.05] transition-transform"
                    >
                        <div className="flex justify-between items-start">
                            <h2 className="text-base sm:text-lg font-bold text-white">
                                {post.title}
                            </h2>
                            <span
                                className={
                                    post.published
                                        ? "text-green-400 font-semibold text-xs sm:text-sm"
                                        : "text-red-400 font-semibold text-xs sm:text-sm"
                                }
                            >
                                {post.published ? "Published" : "Draft"}
                            </span>
                        </div>

                        <hr className="my-2 border-gray-600" />
                        <p className="text-gray-400 text-xs sm:text-sm">
                            Author: {post.author_name}
                        </p>
                        <p className="text-gray-300 text-sm sm:text-base mt-2 line-clamp-2">
                            {post.content}
                        </p>

                        {/* Actions */}
                        <div className="flex justify-between items-center mt-auto pt-3 sm:pt-4 gap-2">
                            {/* View Article */}
                            <Dialog
                                open={viewArticle?.id === post.id}
                                onOpenChange={(open) => setViewArticle(open ? post : null)}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-gray-800 text-white hover:bg-gray-700 text-xs sm:text-sm"
                                    >
                                        View
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="px-4 sm:px-6 bg-accent-foreground text-black border-3 border-gray-700 rounded-2xl shadow-xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-lg sm:text-2xl font-bold">
                                            {post.title}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-2 mt-2">
                                        <p className="text-gray-600 text-xs sm:text-sm">
                                            Author: {post.author_name}
                                        </p>
                                        <hr className="border-gray-400" />
                                        <p className="whitespace-pre-wrap break-words text-gray-800 text-sm sm:text-base">
                                            {post.content}
                                        </p>
                                    </div>
                                    <DialogFooter className="mt-4">
                                        <Button
                                            onClick={() => setViewArticle(null)}
                                            className="bg-gray-800 text-white hover:bg-gray-700 text-xs sm:text-sm"
                                        >
                                            Close
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* Edit & Delete */}
                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="hover:bg-gray-900 text-yellow-500 transition-transform hover:scale-105"
                                    onClick={() => {
                                        setValue("title", post.title);
                                        setValue("author_name", post.author_name);
                                        setValue("content", post.content);
                                        setValue("published", post.published);
                                        setIsEditing(true);
                                        setEditPostId(post.id);
                                        setShowForm(true);
                                    }}
                                >
                                    <Pencil size={16} />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="hover:bg-gray-900 text-red-500 transition-transform hover:scale-105"
                                    onClick={() => handleDelete(post.id)}
                                >
                                    <Trash size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
