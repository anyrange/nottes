export default function ({ store, redirect }) {
  if (!store.state.user.authenticated) {
    return redirect('/login')
  }
}
