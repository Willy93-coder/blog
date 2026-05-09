import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';

const lowlight = createLowlight(common);

export function useCodeHighlight() {
  return [
    CodeBlockLowlight.configure({ lowlight }),
  ];
}
