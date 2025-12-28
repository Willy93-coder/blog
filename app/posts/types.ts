import type { ButtonProps } from '@nuxt/ui';

export type Post = {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  published: boolean;
  publishedAt?: Date;
  updatedAt: Date;
  createdAt: Date;
};

export type PostActionType = 'save' | 'publish' | 'unpublish';

export type PostAction = {
  type: PostActionType;
  label: string;
  icon: string;
  color: ButtonProps['color'];
};
