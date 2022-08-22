import { createPatch } from 'diff'

export const getCodeDiff = ({ title, from, to }) => {
  const diff = createPatch(title, from, to)
  const clearDiff = diff
    .replace(/.*/, '')
    .substr(1)
    .replace(/.*/, '')
    .substr(1)
    .replace(/.*/, '')
    .substr(1)
    .replace(/.*/, '')
    .substr(1)

  return clearDiff || 'No changes'
}

export function debounce(func, wait, immediate) {
  let timeout

  return function executedFunction() {
    const context = this
    const args = arguments

    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)

    timeout = setTimeout(later, wait)

    if (callNow) func.apply(context, args)
  }
}
