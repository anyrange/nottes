import { createPatch } from 'diff'

export const getCodeDiff = ({ title, from, to }) => {
  return createPatch(title, from, to)
}
