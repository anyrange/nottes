export default ({ authenticated, visibility }) => {
  const isShared = visibility === 'shared'
  return [
    { label: 'Public', value: 'public', disabled: isShared },
    { label: 'Unlisted', value: 'unlisted', disabled: isShared },
    { label: 'Private', value: 'private', disabled: !authenticated || isShared },
    { label: 'Shared', value: 'shared', disabled: !authenticated },
  ]
}
