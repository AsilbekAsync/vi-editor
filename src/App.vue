<script setup lang="ts">
import { ref, computed } from "vue";
import Editor from "./components/Editor.vue";
import { uz } from "./locales/uz";

const content = ref(`<h1>Welcome to VI Editor</h1>
<p>This is a highly professional, <strong>production-ready</strong> WYSIWYG editor built for modern Vue 3 applications.</p>
<h2>Theming is incredibly easy!</h2>
<p>Try changing the primary color and the mode in the sidebar. Since the entire UI is powered by CSS variables, the changes apply instantly!</p>
`);

const myCustomTools = [
  "headings",
  "|",
  "bold",
  "italic",
  "underline",
  "|",
  "link",
  "image",
  "formula",
  "|",
  "undo",
  "redo",
];

// Theming state
const primaryColor = ref("#3b82f6");
const isDark = ref(false);

const editorStyles = computed(() => {
  const styles: Record<string, string> = {
    "--vi-primary": primaryColor.value,
  };

  if (isDark.value) {
    styles["--vi-bg"] = "#0f172a";
    styles["--vi-bg-alt"] = "#1e293b";
    styles["--vi-border"] = "#334155";
    styles["--vi-text"] = "#cbd5e1";
    styles["--vi-text-light"] = "#94a3b8";
    styles["--vi-text-heading"] = "#f8fafc";
  } else {
    styles["--vi-bg"] = "#ffffff";
    styles["--vi-bg-alt"] = "#f8fafc";
    styles["--vi-border"] = "#e2e8f0";
    styles["--vi-text"] = "#334155";
    styles["--vi-text-light"] = "#64748b";
    styles["--vi-text-heading"] = "#0f172a";
  }

  return styles;
});
</script>

<template>
  <div class="layout" :class="{ 'dark-mode': isDark }">
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-icon" :style="{ backgroundColor: primaryColor }">
          V
        </div>
        <span>VI Editor</span>
      </div>

      <div class="theme-controls">
        <h3>Theme Settings</h3>
        <div class="control-group">
          <label>Primary Color</label>
          <input type="color" v-model="primaryColor" />
        </div>
        <div class="control-group">
          <label>Dark Mode</label>
          <input type="checkbox" v-model="isDark" />
        </div>
      </div>

      <nav class="nav-menu">
        <a href="#" class="nav-item active">Editor Demo</a>
        <a href="#" class="nav-item">Documentation</a>
        <a href="#" class="nav-item">Installation</a>
        <a href="#" class="nav-item">API Reference</a>
      </nav>

      <div class="sidebar-bottom">
        <p class="version">v1.0.0 (Production Ready)</p>
      </div>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div class="breadcrumb">Docs / Editor Demo</div>
        <div class="actions">
          <button class="vi-btn vi-btn-secondary">GitHub</button>
          <button
            class="vi-btn vi-btn-primary"
            :style="{ backgroundColor: primaryColor, color: '#fff' }"
          >
            Download
          </button>
        </div>
      </header>

      <div class="content-wrapper">
        <div class="header-section">
          <h1 class="page-title">Editor Demo (Uzbek + Theming)</h1>
          <p class="page-desc">
            Change the theme settings in the sidebar to see CSS variables
            cascade in real-time!
          </p>
        </div>

        <!-- Apply inline styles with CSS variables to override defaults -->
        <Editor
          v-model="content"
          placeholder="Yozishni boshlang..."
          height="400px"
          :tools="myCustomTools"
          :labels="uz"
          editor-class="my-custom-editor-class"
          :style="editorStyles"
        >
          <template #footer>
            <div class="custom-footer" :style="editorStyles">
              Belgilar soni (Characters): {{ content.length }}
            </div>
          </template>
        </Editor>

        <div class="square"></div>

        <div class="output-preview" :style="editorStyles">
          <div class="output-header">
            <h3>HTML Output</h3>
            <span class="badge">Live</span>
          </div>
          <pre class="code-block">{{ content }}</pre>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
/* Layout styles adapted to read our dynamic variables for the demo page */
.layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #f8fafc;
  color: #334155;
  transition: all 0.3s;
}
.layout.dark-mode {
  background-color: #0f172a;
  color: #cbd5e1;
}
.layout.dark-mode .sidebar,
.layout.dark-mode .topbar {
  background-color: #1e293b;
  border-color: #334155;
}

.layout.dark-mode .page-title {
  color: #f8fafc;
}
.layout.dark-mode .nav-item {
  color: #cbd5e1;
}
.layout.dark-mode .nav-item:hover {
  background-color: #334155;
}

.sidebar {
  width: 260px;
  background-color: #fff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  border-bottom: 1px solid #e2e8f0;
}
.layout.dark-mode .logo {
  border-color: #334155;
  color: #f8fafc;
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: white;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}

.theme-controls {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}
.layout.dark-mode .theme-controls {
  border-color: #334155;
}

.theme-controls h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
}
.control-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.nav-menu {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.nav-item {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-item:hover {
  background-color: #f8fafc;
  color: #334155;
}

.nav-item.active {
  background-color: rgba(59, 130, 246, 0.1);
  color: inherit;
}

.sidebar-bottom {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}
.layout.dark-mode .sidebar-bottom {
  border-color: #334155;
}

.version {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #fff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.breadcrumb {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;
  width: 100%;
}

.header-section {
  margin-bottom: 2.5rem;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.page-desc {
  font-size: 1.125rem;
  color: #64748b;
}

.output-preview {
  margin-top: 3rem;
  background: var(--vi-bg);
  border: 1px solid var(--vi-border);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.output-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--vi-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--vi-bg-alt);
  color: var(--vi-text);
}

.output-header h3 {
  margin: 0;
  font-size: 1rem;
}

.badge {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.code-block {
  margin: 0;
  padding: 1.5rem;
  background: #1e293b;
  color: #e2e8f0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.custom-footer {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: var(--vi-text-light);
  background: var(--vi-bg-alt);
  border-top: 1px solid var(--vi-border);
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  text-align: right;
}
</style>
