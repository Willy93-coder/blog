import type { ButtonProps } from '@nuxt/ui';
import z from 'zod';

export const postFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  id: z.string().optional(),
  content: z.string().optional(),
});

export type PostForm = z.infer<typeof postFormSchema>;

export type CreatePostForm = Omit<PostForm, 'id'>;
export type UpdatePostForm = PostForm & { id: string };

export type Post = {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  published: boolean;
  publishedAt?: Date;
  updatedAt: Date;
  createdAt: Date;
};

export const PostAction = {
  Save: 'save',
  Publish: 'publish',
  Unpublish: 'unpublish',
  Cancel: 'cancel',
} as const;

export type PostActionType = (typeof PostAction)[keyof typeof PostAction];

export type PostAction = {
  type: PostActionType;
  label: string;
  icon: string;
  color: ButtonProps['color'];
};
