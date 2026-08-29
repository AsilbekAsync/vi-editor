<script setup lang="ts">
import { computed } from "vue";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link,
  Image,
  Table,
  Sigma,
  Undo,
  Redo,
} from "lucide-vue-next";
import { useLabels } from "../composables/useLabels";

const labels = useLabels();

const props = defineProps<{
  activeFormats: Record<string, any>;
  tools?: string[];
}>();

const emit = defineEmits<{
  (e: "command", command: string, value?: string): void;
  (e: "formatBlock", tag: string): void;
  (e: "openModal", type: string): void;
  (e: "undo"): void;
  (e: "redo"): void;
}>();

const isActive = (format: string) => !!props.activeFormats[format];

const currentHeading = computed(() => {
  const block = props.activeFormats.formatBlock;
  if (block && block.toLowerCase().includes("h1")) return "H1";
  if (block && block.toLowerCase().includes("h2")) return "H2";
  if (block && block.toLowerCase().includes("h3")) return "H3";
  if (block && block.toLowerCase().includes("h4")) return "H4";
  if (block && block.toLowerCase().includes("h5")) return "H5";
  if (block && block.toLowerCase().includes("h6")) return "H6";
  return "P";
});

const onHeadingChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  emit("formatBlock", target.value);
};

const defaultTools = [
  "headings",
  "|",
  "bold",
  "italic",
  "underline",
  "strikeThrough",
  "|",
  "ul",
  "ol",
  "|",
  "link",
  "image",
  "table",
  "formula",
  "|",
  "undo",
  "redo",
];
const computedTools = computed(() => props.tools || defaultTools);

// Split tools into groups by '|'
const toolGroups = computed(() => {
  const groups: string[][] = [];
  let currentGroup: string[] = [];

  for (const tool of computedTools.value) {
    if (tool === "|") {
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
        currentGroup = [];
      }
    } else {
      currentGroup.push(tool);
    }
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }
  return groups;
});
</script>

<template>
  <div class="vi-toolbar">
    <template
      v-for="(group, groupIndex) in toolGroups"
      :key="'group-' + groupIndex"
    >
      <div class="toolbar-group">
        <template v-for="tool in group" :key="tool">
          <!-- Headings -->
          <select
            v-if="tool === 'headings'"
            class="heading-select"
            @change="onHeadingChange"
            :value="currentHeading"
          >
            <option value="P">{{ labels.toolbar.p }}</option>
            <option value="H1">{{ labels.toolbar.h1 }}</option>
            <option value="H2">{{ labels.toolbar.h2 }}</option>
            <option value="H3">{{ labels.toolbar.h3 }}</option>
            <option value="H4">{{ labels.toolbar.h4 }}</option>
            <option value="H5">{{ labels.toolbar.h5 }}</option>
            <option value="H6">{{ labels.toolbar.h6 }}</option>
          </select>

          <!-- Formatting -->
          <button
            v-else-if="tool === 'bold'"
            type="button"
            class="toolbar-btn"
            :class="{ active: isActive('bold') }"
            @click="emit('command', 'bold')"
            :title="labels.toolbar.bold"
          >
            <Bold :size="18" />
          </button>
          <button
            v-else-if="tool === 'italic'"
            type="button"
            class="toolbar-btn"
            :class="{ active: isActive('italic') }"
            @click="emit('command', 'italic')"
            :title="labels.toolbar.italic"
          >
            <Italic :size="18" />
          </button>
          <button
            v-else-if="tool === 'underline'"
            type="button"
            class="toolbar-btn"
            :class="{ active: isActive('underline') }"
            @click="emit('command', 'underline')"
            :title="labels.toolbar.underline"
          >
            <Underline :size="18" />
          </button>
          <button
            v-else-if="tool === 'strikeThrough'"
            type="button"
            class="toolbar-btn"
            :class="{ active: isActive('strikeThrough') }"
            @click="emit('command', 'strikeThrough')"
            :title="labels.toolbar.strikeThrough"
          >
            <Strikethrough :size="18" />
          </button>

          <!-- Lists -->
          <button
            v-else-if="tool === 'ul'"
            type="button"
            class="toolbar-btn"
            :class="{ active: isActive('insertUnorderedList') }"
            @click="emit('command', 'insertUnorderedList')"
            :title="labels.toolbar.ul"
          >
            <List :size="18" />
          </button>
          <button
            v-else-if="tool === 'ol'"
            type="button"
            class="toolbar-btn"
            :class="{ active: isActive('insertOrderedList') }"
            @click="emit('command', 'insertOrderedList')"
            :title="labels.toolbar.ol"
          >
            <ListOrdered :size="18" />
          </button>

          <!-- Modals -->
          <button
            v-else-if="tool === 'link'"
            type="button"
            class="toolbar-btn"
            @click="emit('openModal', 'link')"
            :title="labels.toolbar.link"
          >
            <Link :size="18" />
          </button>
          <button
            v-else-if="tool === 'image'"
            type="button"
            class="toolbar-btn"
            @click="emit('openModal', 'image')"
            :title="labels.toolbar.image"
          >
            <Image :size="18" />
          </button>
          <button
            v-else-if="tool === 'table'"
            type="button"
            class="toolbar-btn"
            @click="emit('openModal', 'table')"
            :title="labels.toolbar.table"
          >
            <Table :size="18" />
          </button>
          <button
            v-else-if="tool === 'formula'"
            type="button"
            class="toolbar-btn"
            @click="emit('openModal', 'formula')"
            :title="labels.toolbar.formula"
          >
            <Sigma :size="18" />
          </button>

          <!-- History -->
          <button
            v-else-if="tool === 'undo'"
            type="button"
            class="toolbar-btn"
            @click="emit('undo')"
            :title="labels.toolbar.undo"
          >
            <Undo :size="18" />
          </button>
          <button
            v-else-if="tool === 'redo'"
            type="button"
            class="toolbar-btn"
            @click="emit('redo')"
            :title="labels.toolbar.redo"
          >
            <Redo :size="18" />
          </button>
        </template>
      </div>

      <div
        v-if="groupIndex < toolGroups.length - 1"
        class="toolbar-divider"
        :key="'div-' + groupIndex"
      ></div>
    </template>
  </div>
</template>

<style scoped>
.vi-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0.5rem;
  background: var(--vi-bg-alt);
  border-bottom: 1px solid var(--vi-border);
  gap: 0.5rem;
  border-top-left-radius: var(--vi-radius-md);
  border-top-right-radius: var(--vi-radius-md);
}

.toolbar-group {
  display: flex;
  gap: 0.25rem;
}

.toolbar-divider {
  width: 1px;
  height: 1.5rem;
  background: var(--vi-border);
  margin: 0 0.25rem;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--vi-radius-sm);
  cursor: pointer;
  padding: 0.375rem;
  color: var(--vi-text-light);
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: var(--vi-bg);
  color: var(--vi-text);
  box-shadow: var(--vi-shadow-sm);
}

.toolbar-btn.active {
  background: var(--vi-bg);
  color: var(--vi-primary);
  border-color: var(--vi-border);
  box-shadow: var(--vi-shadow-sm);
}

.heading-select {
  padding: 0.375rem 0.5rem;
  border-radius: var(--vi-radius-sm);
  border: 1px solid transparent;
  background: transparent;
  font-size: 0.875rem;
  color: var(--vi-text);
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
}

.heading-select:hover {
  background: var(--vi-bg);
  border-color: var(--vi-border);
}

.heading-select:focus {
  background: var(--vi-bg);
  border-color: var(--vi-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
</style>
