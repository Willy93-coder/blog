import { reactive, ref, computed } from 'vue';
import { defineStore } from 'pinia';

import { postFormSchema, PostAction, type PostActionType, type Post, type PostForm } from '~/types/post';
import { createPost, publishPost, unpublishPost, updatePost } from '~/actions/post';

function getHasChanges(postA: Partial<Post>, postB: Partial<Post>): boolean {
  return postA.title !== postB.title;
}

function getPostActions(post: Partial<Post>, hasChanges: boolean): PostAction[] {
  const list: PostAction[] = [];

  if (post.id && !hasChanges) {
    if (post.published) {
      list.push({
        type: 'unpublish',
        label: 'Unpublish',
        icon: 'i-lucide-book-lock',
        color: 'secondary',
      });
    } else {
      list.push({
        type: 'publish',
        label: 'Publish',
        icon: 'i-lucide-book-open-check',
        color: 'secondary',
      });
    }
  }

  if (!post.id || hasChanges) {
    list.push({
      type: 'cancel',
      label: 'Cancel',
      icon: 'i-lucide-x',
      color: 'neutral',
    });
  }
  list.push({
    type: 'save',
    label: 'Save',
    icon: 'i-lucide-save',
    color: 'primary',
  });

  return list;
}

export const State = {
  Idle: 'idle',
  Ready: 'ready',
  Submitting: 'submitting',
  Error: 'error',
} as const;

type Errors<T> = {
  [K in keyof T | 'general']?: string;
};

type IdleState = {
  status: typeof State.Idle;
};

type ReadyState = {
  status: typeof State.Ready;
};

type SubmittingState = {
  status: typeof State.Submitting;
  action: PostActionType;
};

type ErrorState<T> = {
  status: typeof State.Error;
  errors: Errors<T>;
};

type UiState<T> = IdleState | ReadyState | SubmittingState | ErrorState<T>;

export const usePostFormStore = defineStore('post-form', () => {
  const form = reactive<PostForm>({ title: '' });
  const originalPost = reactive<Partial<Post>>({});

  const uiState = ref<UiState<PostForm>>({
    status: 'idle',
  });

  let successCallback: ((updatedPost: Post, action: PostActionType) => void) | null = null;
  let errorCallback: ((error: string, action: PostActionType) => void) | null = null;
  let cancelCallback: (() => void) | null = null;

  const hasChanges = computed<boolean>(() => getHasChanges(form, originalPost));
  const actions = computed<PostAction[]>(() => getPostActions(originalPost, hasChanges.value));

  function init(initial?: Partial<Post>) {
    form.title = initial?.title ?? '';
    Object.assign(originalPost, initial ?? {});

    uiState.value = { status: 'ready' };
  }

  function onSuccess(cb: (updatedPost: Post, action: PostActionType) => void) {
    successCallback = cb;
  }

  function onError(cb: (error: string, action: PostActionType) => void) {
    errorCallback = cb;
  }

  function onCancel(cb: () => void) {
    cancelCallback = cb;
  }

  async function submit(action: PostActionType) {
    if (uiState.value.status === 'submitting') return;

    uiState.value = {
      status: 'submitting',
      action,
    };

    if (action === 'cancel') {
      init(originalPost);
      cancelCallback?.();
      uiState.value = { status: 'ready' };
      return;
    }

    try {
      const result = postFormSchema.safeParse(form);
      if (!result.success) {
        const fieldErrors: Errors<PostForm> = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof PostForm;
          fieldErrors[field] = issue.message;
        });

        uiState.value = {
          status: 'error',
          errors: fieldErrors,
        };
        return;
      }

      switch (action) {
        case 'save':
          if (form.id) updatePost({ ...form, id: form.id });
          else createPost(form);
          break;
        case 'publish':
          if (originalPost.id) publishPost(originalPost.id);
          break;
        case 'unpublish':
          if (originalPost.id) unpublishPost(originalPost.id);
          break;
      }

      successCallback?.(result.data as Post, action);
      uiState.value = { status: 'ready' };
    } catch (e: any) {
      if (e.message === 'Title already exists') {
        uiState.value = {
          status: 'error',
          errors: {
            title: e.message,
          },
        };
        errorCallback?.(e.message, action);
        return;
      }

      uiState.value = {
        status: 'error',
        errors: {
          general: e.message || 'Something went wrong',
        },
      };
      errorCallback?.(e.message, action);
    }
  }

  return {
    actions,
    form,
    originalPost,
    uiState,
    init,
    onCancel,
    onError,
    onSuccess,
    submit,
  };
});
