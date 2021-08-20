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
