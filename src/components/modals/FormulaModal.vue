<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useLabels } from "../../composables/useLabels";

const labels = useLabels();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", formula: string): void;
}>();

const formula = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  inputRef.value?.focus();
});

const onSubmit = () => {
  if (formula.value) {
    emit("submit", formula.value);
  }
};
</script>

<template>
  <div class="vi-modal-backdrop" @mousedown.self="emit('close')">
    <div class="vi-modal-content">
      <h3>{{ labels.modal.formula.title }}</h3>
      <div class="form-group">
        <label>{{ labels.modal.formula.expression }}</label>
        <input
          ref="inputRef"
          class="vi-input"
          v-model="formula"
          type="text"
          :placeholder="labels.modal.formula.placeholder"
          @keyup.enter="onSubmit"
        />
        <small class="help-text">{{ labels.modal.formula.helpText }}</small>
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
.help-text {
  font-size: 0.75rem;
  color: var(--vi-text-light);
  margin-top: 0.25rem;
}
</style>
