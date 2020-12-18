export function toggleDrawer (state) {
  state.drawer = !state.drawer;
}

export function setDrawer (state, newValue) {
  state.drawer = newValue;
}

export function setReveal (state, newValue) {
  state.reveal = newValue;
}
