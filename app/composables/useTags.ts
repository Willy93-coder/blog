import { useNuxtApp } from '#app';
import type { PostgrestError } from '@supabase/supabase-js';
import type { ActionResult, QueryResult } from '~/types/result';
import type { CreateTagInput, DeleteTagInput, Tag, TagIdInput, UpdateTagInput } from '~/types/tag';

const toErrorMessage = (error: PostgrestError | null) => error?.message ?? null;

const useTags = () => {
  const { $supabase } = useNuxtApp();

  return {
    getTags: async (): Promise<QueryResult<Tag[]>> => {
      const { data, error } = await $supabase.from('tag').select().order('created_at', { ascending: false });
      return { data: data ?? [], error: toErrorMessage(error) };
    },
    getTagById: async ({ id }: TagIdInput): Promise<QueryResult<Tag | null>> => {
      const { data, error } = await $supabase.from('tag').select().eq('id', id).single();
      return { data: data ?? null, error: toErrorMessage(error) };
    },
    createTag: async ({ name }: CreateTagInput): Promise<ActionResult> => {
      const { error } = await $supabase.from('tag').insert({ name });
      return { error: toErrorMessage(error) };
    },
    updateTag: async ({ id, name }: UpdateTagInput): Promise<ActionResult> => {
      const { error } = await $supabase.from('tag').update({ name }).eq('id', id);
      return { error: toErrorMessage(error) };
    },
    deleteTag: async ({ id }: DeleteTagInput): Promise<ActionResult> => {
      const { error } = await $supabase.from('tag').delete().eq('id', id);
      return { error: toErrorMessage(error) };
    },
    deleteTags: async (ids: string[]): Promise<ActionResult> => {
      const { error } = await $supabase.from('tag').delete().in('id', ids);
      return { error: toErrorMessage(error) };
    },
  };
};

export { useTags };
