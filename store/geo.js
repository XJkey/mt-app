const state = () => ({
  position: {}
});

const mutations = {
  setPosition(state, val) {
    state.position = val
  }
}

export {
  state,
  mutations
}
