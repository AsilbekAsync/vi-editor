# Vue 3 Professional WYSIWYG Editor

A fully custom, from-scratch WYSIWYG rich text editor built for Vue 3 using the Composition API (`<script setup>`). It depends entirely on vanilla DOM `contenteditable` and the standard Selection API, without relying on external heavy rich-text libraries (like TipTap, Quill, etc.).

## Features

- **Text Formatting:** Bold, Italic, Underline, Strikethrough (with keyboard shortcuts)
- **Headings & Paragraphs:** Dropdown for H1-H6 and standard paragraphs
- **Lists:** Bulleted (UL) and Numbered (OL) lists
- **Links:** Custom modal to insert links with `target="_blank"` and `rel="noopener noreferrer"` options.
- **Images:** Insert images via URL with customizable alignment (left, center, right).
- **Tables:** Insert dynamic tables by specifying rows and columns.
- **Formulas:** LaTeX math rendering via KaTeX integration.
- **Undo/Redo:** Custom history stack for reliable state management.
- **Reactive UI:** Toolbar buttons update automatically based on cursor position and active formats.
- **Clean output:** Direct HTML v-model binding.

## Installation

1. Install dependencies (requires Node.js):
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

You can use the `Editor` component directly in your Vue application. It supports `v-model` for two-way data binding.

```vue
<script setup>
import { ref } from 'vue'
import Editor from './components/Editor.vue'

const content = ref('<p>Initial content...</p>')
</script>

<template>
  <Editor v-model="content" placeholder="Start typing here..." />
</template>
```

### Component Props

- **`modelValue`** (string): The HTML string representation of the editor's content.
- **`placeholder`** (string): Placeholder text to show when the editor is empty.

### Component Events

- **`update:modelValue`**: Emits the updated HTML string whenever the content changes.

## Architecture

- **`Editor.vue`**: The main container component. Manages state, selection bindings, keyboard shortcuts, and hosts the contenteditable element.
- **`Toolbar.vue`**: Renders the formatting UI. Emits commands up to the Editor.
- **`composables/useSelection.ts`**: Safely saves and restores the DOM text selection range when focus is lost (e.g., when clicking a modal or toolbar).
- **`composables/useCommands.ts`**: Wrapper around `document.execCommand` for text manipulation.
- **`composables/useHistory.ts`**: Custom Undo/Redo stack avoiding default browser inconsistencies.
- **`modals/*`**: Specialized dialogs for inserting complex elements (Links, Tables, Images, Formulas).

## License
MIT
