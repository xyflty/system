const state = {
  transaction: {
    params: null,
    list: null,
    total: 0,
  },

  revenue: {
    params: null,
    list: null,
    total: 0,
  },
};
const mutations = {
  SET_DATA(state, data) {
    state.transaction.params = data.params;
    state.transaction.list = data.data;
    state.transaction.total = data.total;
  },
  SET_REVENUE(state, data) {
    state.revenue.params = data.params;
    state.revenue.list = data.data;
    state.revenue.total = data.total;
  },
};

export default {
  state,
  mutations,
};
