export const state = () => ({
  isAuth: false,
});

export const actions = {
  async nuxtServerInit({ commit, dispatch }) {
    // await dispatch("checkAuth");
  },
  async checkAuth({ commit }) {
    const isAuth = (await this.$axios.$get("/api/auth/me")) || false;
    commit("setAuth", isAuth);
  },
};

export const mutations = {
  setAuth(state, message) {
    state.isAuth = message;
  },
};
