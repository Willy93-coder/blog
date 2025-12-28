import z from 'zod';

export const postFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  id: z.string().optional(),
});

export type PostForm = z.infer<typeof postFormSchema>;

export type CreatePostForm = Omit<PostForm, 'id'>;
export type UpdatePostForm = PostForm & { id: string };
