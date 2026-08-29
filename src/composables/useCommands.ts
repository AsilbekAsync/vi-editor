export function useCommands(restoreSelection: () => void, saveSelection: () => void, triggerInput: () => void) {
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    restoreSelection()
    document.execCommand(command, false, value)
    saveSelection()
    triggerInput()
  }

  const formatBlock = (tag: string) => {
    executeCommand('formatBlock', tag)
  }

  const insertHTML = (html: string) => {
    restoreSelection()
    document.execCommand('insertHTML', false, html)
    saveSelection()
    triggerInput()
  }

  return {
    executeCommand,
    formatBlock,
    insertHTML
  }
}
