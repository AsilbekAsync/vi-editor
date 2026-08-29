import { ref } from 'vue'

export function useHistory(initialContent: string) {
  const historyStack = ref<string[]>([initialContent])
  const currentIndex = ref(0)
  const isUndoRedoAction = ref(false)

  const pushState = (content: string) => {
    if (isUndoRedoAction.value) {
      isUndoRedoAction.value = false
      return
    }
    
    if (currentIndex.value < historyStack.value.length - 1) {
      historyStack.value = historyStack.value.slice(0, currentIndex.value + 1)
    }
    
    if (historyStack.value[currentIndex.value] !== content) {
      historyStack.value.push(content)
      currentIndex.value++
    }
  }

  const undo = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--
      isUndoRedoAction.value = true
      return historyStack.value[currentIndex.value]
    }
    return null
  }

  const redo = () => {
    if (currentIndex.value < historyStack.value.length - 1) {
      currentIndex.value++
      isUndoRedoAction.value = true
      return historyStack.value[currentIndex.value]
    }
    return null
  }

  return {
    historyStack,
    currentIndex,
    pushState,
    undo,
    redo,
    isUndoRedoAction
  }
}
