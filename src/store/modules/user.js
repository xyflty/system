import {
  login,
  logout,
  getInfo,
  getSubjectDeptId,
  getDeptId,
  getDataAnalysisDefaultDeptId,
  qrLoginCheckLogin,
} from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";

const user = {
  state: {
    token: getToken(),
    name: "",
    userId: "",
    avatar: "",
    roles: [],
    permissions: [],
    subjectDeptId: 0,
    deptId: 0,
    posts: [], //角色权限，总经理，部门主管，个人
    defaultDeptId: 0,
    treeList: [],
    defaultUserId: 0, //登录人用户id
    user: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_USERID: (state, userId) => {
      state.userId = userId;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    },
    SET_SUBJECTDEPTID: (state, subjectDeptId) => {
      state.subjectDeptId = subjectDeptId;
    },
    SET_DEPTID: (state, deptId) => {
      state.deptId = deptId;
    },
    SET_POSTS: (state, posts) => {
      state.posts = posts;
    },
    SET_DEFAULTDEPTID: (state, posts) => {
      state.defaultDeptId = posts.deptId;
      state.treeList = posts.treeList;
      state.defaultUserId = posts.userId;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      const password = userInfo.password;
      const code = userInfo.code;
      const uuid = userInfo.uuid;
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid)
          .then((res) => {
            setToken(res.data.token);
            commit("SET_TOKEN", res.data.token);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    qrCheckLogin({ commit }, qrCodeId) {
      return new Promise((resolve, reject) => {
        let sendData = {
          qrCodeId: qrCodeId,
        };
        qrLoginCheckLogin(sendData)
          .then((res) => {
            if (res.code === 200) {
              if (res.data) {
                setToken(res.data.token);
                commit("SET_TOKEN", res.data.token);
                resolve(res);
              }
            } else {
              resolve(res);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            const user = res.data.user;
            const avatar =
              user.avatar == "" || user.avatar == null
                ? require("@/assets/images/profile.jpg")
                : user.avatar;
            if (res.data.roles && res.data.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              commit("SET_ROLES", res.data.roles);
              commit("SET_PERMISSIONS", res.data.permissions);
            } else {
              commit("SET_ROLES", ["ROLE_DEFAULT"]);
            }
            commit("SET_NAME", user.userName);
            commit("SET_USERID", user.userId);
            commit("SET_AVATAR", avatar);
            commit("SET_POSTS", res.data.posts || []);
            commit("SET_USER", user);
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取当前登录人的主体部门id
    getSubjectDeptId({ commit, state }) {
      return new Promise((resolve, reject) => {
        getSubjectDeptId()
          .then((res) => {
            commit("SET_SUBJECTDEPTID", res.data);
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取数据分析相关业务的默认选中部门id
    getDefaultDeptId({ commit, state }) {
      return new Promise((resolve, reject) => {
        getDataAnalysisDefaultDeptId()
          .then((res) => {
            commit("SET_DEFAULTDEPTID", res.data);
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取当前登录人的主体id
    getDeptId({ commit, state }) {
      return new Promise((resolve, reject) => {
        getDeptId()
          .then((res) => {
            commit("SET_DEPTID", res.data);
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit("SET_TOKEN", "");
            commit("SET_ROLES", []);
            commit("SET_PERMISSIONS", []);
            removeToken();
            // 清除使用的缓存记录
            sessionStorage.removeItem("DRAFT_KEY");
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit("SET_TOKEN", "");
        removeToken();
        resolve();
      });
    },
  },
};

export default user;
