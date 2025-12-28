import type { CreatePostForm, UpdatePostForm } from './schemas';
import type { Post } from './types';

export function createPost(post: CreatePostForm): Promise<Post> {
  return Promise.resolve({} as Post);
}

export function updatePost(post: UpdatePostForm): Promise<Post> {
  return Promise.resolve({} as Post);
}

export function publishPost(id: string): Promise<Post> {
  return Promise.resolve({} as Post);
}

export function unpublishPost(id: string): Promise<Post> {
  return Promise.resolve({} as Post);
}
