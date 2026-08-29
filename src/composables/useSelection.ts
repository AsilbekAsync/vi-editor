import { ref } from 'vue'

export function useSelection() {
  const savedRange = ref<Range | null>(null)

  const saveSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      savedRange.value = selection.getRangeAt(0).cloneRange()
    } else {
      savedRange.value = null
    }
  }

  const restoreSelection = () => {
    if (savedRange.value) {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(savedRange.value)
      }
    }
  }

  return {
    savedRange,
    saveSelection,
    restoreSelection
  }
}
