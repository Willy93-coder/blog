<script setup lang="ts">
  interface Props {
    modelValue?: string;
    disabled?: boolean;
    placeholder?: string;
    class?: string;
  }

  interface Emits {
    (e: 'update:modelValue', value: string): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    placeholder: 'Start typing...',
    class: 'w-full min-h-96 rounded-md border border-slate-700',
  });

  const emit = defineEmits<Emits>();

  const content = computed({
    get: () => props.modelValue,
    set: (value: string) => emit('update:modelValue', value),
  });
</script>

<template>
  <div>
    <UEditor
      v-slot="{ editor }"
      v-model="content"
      content-type="markdown"
      :placeholder="placeholder"
      :class="props.class"
      :editable="!props.disabled"
      :starter-kit="{
        link: {
          openOnClick: false,
        },
      }"
    >
      <UEditorToolbar
        v-if="!props.disabled"
        :editor="editor"
        :items="[
          [
            {
              icon: 'i-lucide-heading',
              tooltip: { text: 'Headings' },
              content: { align: 'start' },
              items: [
                { kind: 'heading', level: 1, icon: 'i-lucide-heading-1', label: 'Heading 1' },
                { kind: 'heading', level: 2, icon: 'i-lucide-heading-2', label: 'Heading 2' },
                { kind: 'heading', level: 3, icon: 'i-lucide-heading-3', label: 'Heading 3' },
                { kind: 'paragraph', icon: 'i-lucide-type', label: 'Paragraph' },
              ],
            },
          ],
          [
            { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: 'Bold' } },
            { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: 'Italic' } },
            { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline', tooltip: { text: 'Underline' } },
            { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough', tooltip: { text: 'Strikethrough' } },
            { kind: 'mark', mark: 'code', icon: 'i-lucide-code', tooltip: { text: 'Code' } },
          ],
          [
            { kind: 'bulletList', icon: 'i-lucide-list', tooltip: { text: 'Bullet List' } },
            { kind: 'orderedList', icon: 'i-lucide-list-ordered', tooltip: { text: 'Ordered List' } },
            { kind: 'blockquote', icon: 'i-lucide-quote', tooltip: { text: 'Quote' } },
            { kind: 'codeBlock', icon: 'i-lucide-square-code', tooltip: { text: 'Code Block' } },
          ],
          [
            { kind: 'link', icon: 'i-lucide-link', tooltip: { text: 'Link' } },
            { kind: 'image', icon: 'i-lucide-image', tooltip: { text: 'Image from URL' } },
            { kind: 'horizontalRule', icon: 'i-lucide-separator-horizontal', tooltip: { text: 'Horizontal Rule' } },
          ],
          [
            { kind: 'undo', icon: 'i-lucide-undo', tooltip: { text: 'Undo' } },
            { kind: 'redo', icon: 'i-lucide-redo', tooltip: { text: 'Redo' } },
          ],
        ]"
        class="border-b border-slate-700 px-2 py-2 flex flex-wrap gap-1"
      />
    </UEditor>
  </div>
</template>
