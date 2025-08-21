import { z } from "zod";

export const articleSchema = z.object ({
    title: z.string().min(1, { message: "Title is required" }),
    author_name: z.string().optional(),
    content: z.string().min(1, { message: "Content is required" }),
    published: z.boolean().optional(), 
});
