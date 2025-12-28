import type { ButtonProps } from '@nuxt/ui';

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
} as const;

export type PostActionType = (typeof PostAction)[keyof typeof PostAction];

export type PostAction = {
  type: PostActionType;
  label: string;
  icon: string;
  color: ButtonProps['color'];
};
