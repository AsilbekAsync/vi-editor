<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useLabels } from "../../composables/useLabels";

const labels = useLabels();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", rows: number, cols: number): void;
}>();

const rows = ref(3);
const cols = ref(3);
const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  inputRef.value?.focus();
});

const onSubmit = () => {
  if (rows.value > 0 && cols.value > 0) {
    emit("submit", rows.value, cols.value);
  }
};
</script>

<template>
  <div class="vi-modal-backdrop" @mousedown.self="emit('close')">
    <div class="vi-modal-content">
      <h3>{{ labels.modal.table.title }}</h3>
      <div class="form-row">
        <div class="form-group">
          <label>{{ labels.modal.table.rows }}</label>
          <input
            ref="inputRef"
            class="vi-input"
            v-model.number="rows"
            type="number"
            min="1"
            max="20"
            @keyup.enter="onSubmit"
          />
        </div>
        <div class="form-group">
          <label>{{ labels.modal.table.cols }}</label>
          <input
            class="vi-input"
            v-model.number="cols"
            type="number"
            min="1"
            max="20"
            @keyup.enter="onSubmit"
          />
        </div>
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
.form-row {
  display: flex;
  gap: 1rem;
}
.form-group {
  margin-bottom: 0.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.form-group label {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: var(--vi-text);
  font-weight: 500;
}
</style>
