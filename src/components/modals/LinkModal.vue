<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useLabels } from "../../composables/useLabels";

const labels = useLabels();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", url: string, text: string, targetBlank: boolean): void;
}>();

const url = ref("");
const text = ref("");
const targetBlank = ref(true);
const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  inputRef.value?.focus();
});

const onSubmit = () => {
  if (url.value) {
    emit("submit", url.value, text.value, targetBlank.value);
  }
};
</script>

<template>
  <div class="vi-modal-backdrop" @mousedown.self="emit('close')">
    <div class="vi-modal-content">
      <h3>{{ labels.modal.link.title }}</h3>
      <div class="form-group">
        <label>{{ labels.modal.link.url }}</label>
        <input
          ref="inputRef"
          class="vi-input"
          v-model="url"
          type="url"
          placeholder="https://..."
          @keyup.enter="onSubmit"
        />
      </div>
      <div class="form-group">
        <label>{{ labels.modal.link.text }}</label>
        <input
          class="vi-input"
          v-model="text"
          type="text"
          placeholder="..."
          @keyup.enter="onSubmit"
        />
      </div>
      <div class="form-group checkbox">
        <label>
          <input v-model="targetBlank" type="checkbox" />
          {{ labels.modal.link.newTab }}
        </label>
      </div>
      <div class="modal-actions">
        <button
          type="button"
          class="vi-btn vi-btn-secondary"
          @click="emit('close')"
        >
          {{ labels.modal.cancel }}
        </button>
        <button type="button" class="vi-btn vi-btn-primary" @click="onSubmit">
          {{ labels.modal.insert }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.125rem;
}
.form-group {
  margin-bottom: 0.25rem;
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: var(--vi-text);
  font-weight: 500;
}
.form-group.checkbox {
  flex-direction: row;
  align-items: center;
  margin-top: 0.75rem;
  margin-bottom: 0;
}
.form-group.checkbox label {
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
</style>
