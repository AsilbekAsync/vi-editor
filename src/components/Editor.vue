<script setup lang="ts">
import { ref, onMounted, watch, provide } from "vue";
import katex from "katex";
import "katex/dist/katex.min.css";

import Toolbar from "./Toolbar.vue";
import LinkModal from "./modals/LinkModal.vue";
import ImageModal from "./modals/ImageModal.vue";
import TableModal from "./modals/TableModal.vue";
import FormulaModal from "./modals/FormulaModal.vue";

import { useSelection } from "../composables/useSelection";
import { useHistory } from "../composables/useHistory";
import { useCommands } from "../composables/useCommands";
import { viLabelsKey } from "../composables/useLabels";
import { en } from "../locales/en";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    height?: string;
    tools?: string[];
    editorClass?: string;
    hideToolbar?: boolean;
    labels?: Record<string, any>;
  }>(),
  {
    modelValue: "",
    placeholder: "",
    height: "300px",
    hideToolbar: false,
    labels: () => en,
  },
);

provide(viLabelsKey, props.labels);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const editorRef = ref<HTMLElement | null>(null);
const activeFormats = ref<Record<string, any>>({});

const { saveSelection, restoreSelection } = useSelection();
const { pushState, undo, redo } = useHistory(props.modelValue);

const triggerInput = () => {
  if (editorRef.value) {
    const html = editorRef.value.innerHTML;
    emit("update:modelValue", html);
    pushState(html);
    updateActiveFormats();
  }
};

const { executeCommand, formatBlock, insertHTML } = useCommands(
  restoreSelection,
  saveSelection,
  triggerInput,
);

watch(
  () => props.modelValue,
  (newVal) => {
    if (editorRef.value && newVal !== editorRef.value.innerHTML) {
      editorRef.value.innerHTML = newVal || "";
      pushState(newVal || "");
    }
  },
);

onMounted(() => {
  if (editorRef.value && props.modelValue) {
    editorRef.value.innerHTML = props.modelValue;
  }
});

const onInput = () => triggerInput();

const updateActiveFormats = () => {
  if (!editorRef.value) return;
  saveSelection();

  activeFormats.value = {
    bold: document.queryCommandState("bold"),
    italic: document.queryCommandState("italic"),
    underline: document.queryCommandState("underline"),
    strikeThrough: document.queryCommandState("strikeThrough"),
    insertUnorderedList: document.queryCommandState("insertUnorderedList"),
    insertOrderedList: document.queryCommandState("insertOrderedList"),
    formatBlock: document.queryCommandValue("formatBlock"),
  };
};

const onKeyup = (e: KeyboardEvent) => {
  updateActiveFormats();
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case "b":
        e.preventDefault();
        executeCommand("bold");
        break;
      case "i":
        e.preventDefault();
        executeCommand("italic");
        break;
      case "u":
        e.preventDefault();
        executeCommand("underline");
        break;
      case "z":
        e.preventDefault();
        onUndo();
        break;
      case "y":
        e.preventDefault();
        onRedo();
        break;
    }
  }
};

const onMouseup = () => updateActiveFormats();
const onBlur = () => saveSelection();

const onCommand = (command: string, value?: string) => {
  executeCommand(command, value);
  updateActiveFormats();
};

const onUndo = () => {
  const previousHtml = undo();
  if (previousHtml !== null && editorRef.value) {
    editorRef.value.innerHTML = previousHtml;
    emit("update:modelValue", previousHtml);
    updateActiveFormats();
  }
};

const onRedo = () => {
  const nextHtml = redo();
  if (nextHtml !== null && editorRef.value) {
    editorRef.value.innerHTML = nextHtml;
    emit("update:modelValue", nextHtml);
    updateActiveFormats();
  }
};

// Modal states
const openModalType = ref<string | null>(null);
const onOpenModal = (type: string) => {
  saveSelection(); // preserve selection before opening modal
  openModalType.value = type;
};
const closeModal = () => {
  openModalType.value = null;
  restoreSelection();
};

const insertLink = (url: string, text: string, targetBlank: boolean) => {
  const rel = targetBlank ? "noopener noreferrer" : "";
  const target = targetBlank ? "_blank" : "_self";
  const linkText = text || url;
  const html = `<a href="${url}" target="${target}" rel="${rel}" class="vi-link">${linkText}</a>`;
  insertHTML(html);
  closeModal();
};

const insertImage = (url: string, alt: string, align: string) => {
  let style =
    "max-width: 100%; height: auto; border-radius: var(--vi-radius-md); box-shadow: var(--vi-shadow-sm); margin: 1rem 0;";
  if (align === "center")
    style += "display: block; margin-left: auto; margin-right: auto;";
  else if (align === "right") style += "float: right; margin-left: 1.5rem;";
  else if (align === "left") style += "float: left; margin-right: 1.5rem;";

  const html = `<img src="${url}" alt="${alt}" style="${style}" />`;
  insertHTML(html);
  closeModal();
};

const insertTable = (rows: number, cols: number) => {
  let html = '<div class="vi-table-wrapper"><table class="vi-table">';
  for (let i = 0; i < rows; i++) {
    html += "<tr>";
    for (let j = 0; j < cols; j++) {
      html += "<td>&nbsp;</td>";
    }
    html += "</tr>";
  }
  html += "</table></div><br/>";
  insertHTML(html);
  closeModal();
};

const insertFormula = (formula: string) => {
  try {
    const rendered = katex.renderToString(formula, { throwOnError: false });
    // Using a wrapper so it acts like a single character/block
    const html = `<span class="vi-math" contenteditable="false">${rendered}</span>&nbsp;`;
    insertHTML(html);
  } catch (e) {
    console.error("KaTeX rendering error", e);
  }
  closeModal();
};

defineExpose({
  executeCommand,
  formatBlock,
  insertHTML,
  undo: onUndo,
  redo: onRedo,
  activeFormats,
});
</script>

<template>
  <div class="vi-editor" :class="editorClass">
    <slot
      name="toolbar"
      :active-formats="activeFormats"
      :execute="onCommand"
      :format-block="formatBlock"
      :open-modal="onOpenModal"
      :undo="onUndo"
      :redo="onRedo"
    >
      <Toolbar
        v-if="!hideToolbar"
        :activeFormats="activeFormats"
        :tools="tools"
        @command="onCommand"
        @formatBlock="formatBlock"
        @undo="onUndo"
        @redo="onRedo"
        @openModal="onOpenModal"
      />
    </slot>
    <div
      ref="editorRef"
      class="vi-editor-content"
      contenteditable="true"
      @input="onInput"
      @mouseup="onMouseup"
      @keyup="onKeyup"
      @blur="onBlur"
      :data-placeholder="placeholder"
      :style="{ minHeight: height }"
    ></div>

    <slot name="footer"></slot>

    <LinkModal
      v-if="openModalType === 'link'"
      @close="closeModal"
      @submit="insertLink"
    />
    <ImageModal
      v-if="openModalType === 'image'"
      @close="closeModal"
      @submit="insertImage"
    />
    <TableModal
      v-if="openModalType === 'table'"
      @close="closeModal"
      @submit="insertTable"
    />
    <FormulaModal
      v-if="openModalType === 'formula'"
      @close="closeModal"
      @submit="insertFormula"
    />
  </div>
</template>

<style scoped>
.vi-editor {
  border: 1px solid var(--vi-border);
  border-radius: var(--vi-radius-md);
  display: flex;
  flex-direction: column;
  background: var(--vi-bg);
  color: var(--vi-text);
  position: relative;
  box-shadow: var(--vi-shadow-sm);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.vi-editor:focus-within {
  border-color: var(--vi-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.vi-editor-content {
  padding: 1.5rem;
  outline: none;
  overflow-y: auto;
  line-height: 1.7;
  font-size: 1rem;
}

.vi-editor-content:empty:before {
  content: attr(data-placeholder);
  color: var(--vi-text-light);
  pointer-events: none;
  display: block;
}

/* Typography styles applied inside the editor */
.vi-editor-content :deep(p) {
  margin: 0 0 1.25rem 0;
}
.vi-editor-content :deep(h1),
.vi-editor-content :deep(h2),
.vi-editor-content :deep(h3),
.vi-editor-content :deep(h4),
.vi-editor-content :deep(h5),
.vi-editor-content :deep(h6) {
  margin: 2rem 0 1rem 0;
  color: var(--vi-text-heading);
  font-weight: 600;
  line-height: 1.2;
}
.vi-editor-content :deep(h1) {
  font-size: 2.25rem;
}
.vi-editor-content :deep(h2) {
  font-size: 1.875rem;
  border-bottom: 1px solid var(--vi-border);
  padding-bottom: 0.5rem;
}
.vi-editor-content :deep(h3) {
  font-size: 1.5rem;
}
.vi-editor-content :deep(ul),
.vi-editor-content :deep(ol) {
  padding-left: 1.5rem;
  margin: 0 0 1.25rem 0;
}
.vi-editor-content :deep(li) {
  margin-bottom: 0.5rem;
}
.vi-editor-content :deep(.vi-link) {
  color: var(--vi-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}
.vi-editor-content :deep(.vi-link:hover) {
  border-bottom-color: var(--vi-primary);
}

/* Table styling */
.vi-editor-content :deep(.vi-table-wrapper) {
  overflow-x: auto;
  margin: 1.5rem 0;
}
.vi-editor-content :deep(.vi-table) {
  width: 100%;
  border-collapse: collapse;
}
.vi-editor-content :deep(.vi-table td),
.vi-editor-content :deep(.vi-table th) {
  border: 1px solid var(--vi-border);
  padding: 0.75rem 1rem;
}
.vi-editor-content :deep(.vi-table tr:nth-child(even)) {
  background-color: var(--vi-bg-alt);
}

.vi-editor-content :deep(.vi-math) {
  display: inline-block;
  cursor: pointer;
  background: var(--vi-bg-alt);
  padding: 0.2rem 0.4rem;
  border-radius: var(--vi-radius-sm);
}
</style>
