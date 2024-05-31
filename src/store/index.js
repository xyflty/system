import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import user from "./modules/user";
import tagsView from "./modules/tagsView";
import permission from "./modules/permission";
import settings from "./modules/settings";
import commonData from "./modules/commonData";
import getters from "./getters";
import statistics from "./modules/statistics";
import enterpriseData from "./modules/enterpriseData";
import setData from "./modules/setData";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings,
    commonData,
    statistics,
    enterpriseData,
    setData,
  },
  getters,
});

export default store;
