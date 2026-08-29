<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLabels } from '../../composables/useLabels'

const labels = useLabels()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', url: string, alt: string, align: string): void
}>()

const url = ref('')
const alt = ref('')
const align = ref('center')
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})

const onSubmit = () => {
  if (url.value) {
    emit('submit', url.value, alt.value, align.value)
  }
}
</script>

<template>
  <div class="vi-modal-backdrop" @mousedown.self="emit('close')">
    <div class="vi-modal-content">
      <h3>{{ labels.modal.image.title }}</h3>
      <div class="form-group">
        <label>{{ labels.modal.image.url }}</label>
        <input ref="inputRef" class="vi-input" v-model="url" type="url" placeholder="https://..." @keyup.enter="onSubmit" />
      </div>
      <div class="form-group">
        <label>{{ labels.modal.image.alt }}</label>
        <input class="vi-input" v-model="alt" type="text" placeholder="..." @keyup.enter="onSubmit" />
      </div>
      <div class="form-group">
        <label>{{ labels.modal.image.align }}</label>
        <select class="vi-input" v-model="align" @keyup.enter="onSubmit">
          <option value="none">{{ labels.modal.image.none }}</option>
          <option value="left">{{ labels.modal.image.left }}</option>
          <option value="center">{{ labels.modal.image.center }}</option>
          <option value="right">{{ labels.modal.image.right }}</option>
        </select>
      </div>
      <div class="modal-actions">
        <button type="button" class="vi-btn vi-btn-secondary" @click="emit('close')">{{ labels.modal.cancel }}</button>
        <button type="button" class="vi-btn vi-btn-primary" @click="onSubmit">{{ labels.modal.insert }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h3 { margin-top: 0; margin-bottom: 1rem; font-size: 1.125rem; }
.form-group { margin-bottom: 0.25rem; display: flex; flex-direction: column; }
.form-group label { font-size: 0.875rem; margin-bottom: 0.25rem; color: var(--vi-text); font-weight: 500; }
select.vi-input { cursor: pointer; }
</style>
