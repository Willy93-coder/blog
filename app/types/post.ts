import type { Tables, TablesInsert, TablesUpdate } from './supabase';
import z from 'zod';

export type Post = Tables<'post'>;
export type PostWithTags = Post & {
  post_tag: { tag: { id: string; name: string } }[];
};
export type CreatePostInput = TablesInsert<'post'>;
export type UpdatePostInput = TablesUpdate<'post'>;
export type DeletePostInput = Pick<Post, 'id'>;
export type PostIdInput = Pick<Post, 'id'>;

export const postFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  id: z.string().optional(),
});

export type PostForm = z.infer<typeof postFormSchema>;

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
  color: 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral';
};
