export default ({ authenticated }) => {
  return [
    { label: 'Public', value: 'public' },
    { label: 'Unlisted', value: 'unlisted' },
    { label: 'Private', value: 'private', disabled: !authenticated },
    { label: 'Shared', value: 'shared', disabled: !authenticated },
  ]
}
