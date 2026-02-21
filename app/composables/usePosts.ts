import { useNuxtApp } from '#app';
import type { PostgrestError } from '@supabase/supabase-js';
import type { ActionResult, QueryResult } from '~/types/result';
import type { CreatePostInput, DeletePostInput, Post, PostIdInput, PostWithTags, UpdatePostInput } from '~/types/post';

const toErrorMessage = (error: PostgrestError | null) => error?.message ?? null;

const usePosts = () => {
  const { $supabase } = useNuxtApp();

  return {
    getPosts: async (): Promise<QueryResult<Post[]>> => {
      const { data, error } = await $supabase.from('post').select().order('created_at', { ascending: false });

      return { data: data ?? [], error: toErrorMessage(error) };
    },
    getPostById: async ({ id }: PostIdInput): Promise<QueryResult<Post | null>> => {
      if (!id) {
        return { data: null, error: 'Post ID is required' };
      }
      const { data, error } = await $supabase.from('post').select().eq('id', id).single();

      return { data, error: toErrorMessage(error) };
    },
    createPost: async (postInput: CreatePostInput): Promise<ActionResult<Post>> => {
      const { data, error } = await $supabase.from('post').insert(postInput).select().single();

      return { data, error: toErrorMessage(error) };
    },
    updatePost: async (postInput: UpdatePostInput): Promise<ActionResult<Post>> => {
      if (!postInput.id) {
        return { error: 'Post ID is required for update' };
      }

      const { data, error } = await $supabase.from('post').update(postInput).eq('id', postInput.id).select().single();

      return { data, error: toErrorMessage(error) };
    },
    publishPostById: async ({ id }: PostIdInput): Promise<ActionResult<Post>> => {
      if (!id) {
        return { error: 'Post ID is required for publishing' };
      }

      const { data, error } = await $supabase
        .from('post')
        .update({ published: true, published_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      return { data, error: toErrorMessage(error) };
    },
    unpublishPostById: async ({ id }: PostIdInput): Promise<ActionResult<Post>> => {
      if (!id) {
        return { error: 'Post ID is required for unpublishing' };
      }

      const { data, error } = await $supabase
        .from('post')
        .update({ published: false, published_at: null })
        .eq('id', id)
        .select()
        .single();

      return { data, error: toErrorMessage(error) };
    },
    deletePost: async ({ id }: DeletePostInput): Promise<ActionResult> => {
      if (!id) {
        return { error: 'Post ID is required for deletion' };
      }

      const { error } = await $supabase.from('post').delete().eq('id', id);

      return { error: toErrorMessage(error) };
    },
    deletePosts: async (ids: string[]): Promise<ActionResult> => {
      const { error } = await $supabase.from('post').delete().in('id', ids);
      return { error: toErrorMessage(error) };
    },
    getPostWithTagsById: async ({ id }: PostIdInput): Promise<QueryResult<PostWithTags | null>> => {
      if (!id) {
        return { data: null, error: 'Post ID is required' };
      }
      const { data, error } = await $supabase.from('post').select('*, post_tag(tag(id, name))').eq('id', id).single();

      return { data: data as PostWithTags | null, error: toErrorMessage(error) };
    },
    getPostsWithTags: async (): Promise<QueryResult<PostWithTags[]>> => {
      const { data, error } = await $supabase
        .from('post')
        .select('*, post_tag(tag(id, name))')
        .order('created_at', { ascending: false });

      return { data: (data ?? []) as PostWithTags[], error: toErrorMessage(error) };
    },
    getPublishedPostsWithTags: async (): Promise<QueryResult<PostWithTags[]>> => {
      const { data, error } = await $supabase
        .from('post')
        .select('*, post_tag(tag(id, name))')
        .eq('published', true)
        .order('published_at', { ascending: false });

      return { data: (data ?? []) as PostWithTags[], error: toErrorMessage(error) };
    },
    getLimitPublishedPostsWithTags: async ({ limit = 10 }: { limit: number }): Promise<QueryResult<PostWithTags[]>> => {
      const { data, error } = await $supabase
        .from('post')
        .select('*, post_tag(tag(id, name))')
        .eq('published', true)
        .limit(limit)
        .order('published_at', { ascending: false });

      return { data: (data ?? []) as PostWithTags[], error: toErrorMessage(error) };
    },
  };
};

export { usePosts };
