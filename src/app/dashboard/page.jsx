'use client'

import api from '@/lib/axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { articleSchema } from '@/lib/articleSchema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Pencil, Trash } from "lucide-react"

export default function DashboardPage() {
    const router = useRouter()
    const [posts, setPosts] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [viewArticle, setViewArticle] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editPostId, setEditPostId] = useState(null)

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
            title: '',
            author_name: '',
            content: '',
            published: false,
        },
    })

    const publishedValue = watch('published')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/auth/login')
            return
        }
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        const token = localStorage.getItem('token')
        try {
            const res = await api.get('/api/posts', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setPosts(res.data.data)
        } catch (error) {
            console.error('Error fetching posts:', error)
        }
    }

    const handleCreate = async (data) => {
        const token = localStorage.getItem('token')
        try {
            await api.post('/api/posts', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            reset()
            setShowForm(false)
            fetchPosts()

            toast.success('Create Successfull!', {
                position: 'top-right', 
                duration: 4000,
                style: {
                    fontSize: '21px',
                    color: '#1A1F36',
                    backgroundColor: '#D1D8BE',
                },
                className: 'rounded-xl shadow-xl border-2 border-gray-800',
            })
        } catch (err) {
            console.error('Gagal tambah artikel:', err.response?.data || err)
        }
    }

    const handleUpdate = async (id, data) => {
        const token = localStorage.getItem('token')
        try {
            await api.patch(`/api/posts/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            fetchPosts()
            toast.success('Post Updated!', {
                position: 'top-right',
                duration: 4000,
                style: {
                    fontSize: '21px',
                    color: '#1A1F36',
                    backgroundColor: '#D1D8BE',
                },
                className: 'rounded-xl shadow-xl border-2 border-gray-800',
            })
        } catch (err) {
            console.error('Gagal update :', err.response?.data || err)
        }
    }

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token')
        try {
            await api.delete(`/api/posts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            // Hapus post langsung dari state tanpa refetch
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id))

            toast.success('Post Deleted!', {
                position: 'top-right',
                duration: 4000,
                style: {
                    fontSize: '21px',
                    color: '#1A1F36',
                    backgroundColor: '#D1D8BE',
                },
                className: 'rounded-xl shadow-xl border-2 border-gray-800',
            })
        } catch (err) {
            console.error('Gagal hapus artikel:', err.response?.data || err)
        }
    }

    const onSubmit = async (data) => {
        if (isEditing && editPostId) {
            await handleUpdate(editPostId, data)
        } else {
            await handleCreate(data)
        }
        setIsEditing(false)
        setEditPostId(null)
        reset()
        setShowForm(false)
    }

    return (
        <div className="relative min-h-screen p-6 z-10 bg-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-accent-foreground text-shadow-lg/50">TicleCraft</h1>
                <div className="flex space-x-2">
                    <Dialog open={showForm} onOpenChange={setShowForm}>
                        <DialogTrigger asChild>
                            <Button className="bg-accent-foreground hover:bg-accent-foreground-60 shadow-6xl font-bold text-gray-700 transition-transform hover:scale-105 flex items-center justify-center">
                                + Create Article
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg bg-accent-foreground border-4 border-gray-700 rounded-xl text-gray-700">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-center mb-2">Add Artikel</DialogTitle>
                            </DialogHeader>

                            {/* Form for creating a new article */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <Input
                                        {...register('title')}
                                        placeholder="Title"
                                        className="w-full px-4 py-2 border text-black border-gray-800 bg-white rounded-lg focus:outline-none focus:ring-2"
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                                </div>

                                <div>
                                    <Input
                                        {...register('author_name')}
                                        placeholder="Author (optional)"
                                        className="w-full px-4 py-2 border text-black border-gray-800 bg-white rounded-lg focus:outline-none focus:ring-2"
                                    />
                                </div>

                                <div>
                                    <Textarea
                                        {...register('content')}
                                        placeholder="Content"
                                        className="w-full h-32 resize-y px-4 py-2 border text-black border-gray-800 bg-white rounded-lg whitespace-pre-wrap break-words break-all"
                                    />
                                    {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        className="border border-[#1A1F36]"
                                        id="published"
                                        checked={publishedValue}
                                        onCheckedChange={(checked) => setValue('published', Boolean(checked))}
                                    />
                                    <label htmlFor="published" className="text-sm font-medium">
                                        Published?
                                    </label>
                                </div>

                                <DialogFooter className="flex justify-end space-x-2 pt-2">
                                    <Button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="bg-white text-black hover:bg-gray-100"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-gray-700 text-white hover:bg-gray-600"
                                    >
                                        Submit
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* // Logout Button */}
                    <Button onClick={() => {
                        localStorage.removeItem('token')
                        router.push('/auth/login')
                    }} className="bg-red-500 text-white hover:bg-red-500 font-bold transition-transform hover:scale-105">Logout</Button>
                </div>
            </div>

            {/* Display Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {posts.map((post) => (
                    <div key={post.id} className="bg-gray-900 p-4 border border-gray-700 rounded-xl">
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-bold text-white">{post.title}</h2>
                            <span className={post.published ? 'text-green-400' : 'text-red-400'}>
                                {post.published ? 'Published' : 'Draft'}
                            </span>
                        </div>
                        <hr className="my-2 border-gray-600" />
                        <p className="text-gray-400 text-sm">Author: {post.author_name}</p>
                        <p className="text-gray-300 text-sm mt-2 line-clamp-2">{post.content}</p>

                        <div className="flex justify-between items-center mt-4">
                            <Dialog open={viewArticle?.id === post.id} onOpenChange={(open) => setViewArticle(open ? post : null)}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="flex-1 bg-gray-800 text-white hover:bg-gray-700">
                                        View Article
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-accent-foreground text-black border-3 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold">{post.title}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-2 mt-2">
                                        <p className="text-gray-600 text-sm">Author: {post.author_name}</p>
                                        <hr className="border-gray-400" />
                                        <p className="whitespace-pre-wrap break-words text-gray-800 text-base">{post.content}</p>
                                    </div>
                                    <DialogFooter className="mt-4">
                                        <Button onClick={() => setViewArticle(null)} className="bg-gray-800 text-white hover:bg-gray-700">
                                            Close
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="hover:bg-gray-900 text-yellow-500 transition-transform hover:scale-105"
                                    onClick={() => {
                                        setValue('title', post.title)
                                        setValue('author_name', post.author_name)
                                        setValue('content', post.content)
                                        setValue('published', post.published)
                                        setIsEditing(true)
                                        setEditPostId(post.id)
                                        setShowForm(true)
                                    }}
                                >
                                    <Pencil size={20} />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="hover:bg-gray-900 text-red-500 transition-transform hover:scale-105"
                                    onClick={() => handleDelete(post.id)}
                                >
                                    <Trash size={20} />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}