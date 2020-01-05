const state = () => ({
  menu: [],
  hotPlace: []
});

const mutations = {
  setMenu(state, val) {
    state.menu = val
  },
  setHotPlace(state, val) {
    state.hotPlace = val
  }
}

export {
  state,
  mutations
}
