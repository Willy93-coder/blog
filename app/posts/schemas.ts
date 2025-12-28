import z from 'zod';

export const postFormSchema = z.object({
  title: z.string('Title is required').min(1, 'Title is required'),
});

export type PostForm = z.infer<typeof postFormSchema>;
