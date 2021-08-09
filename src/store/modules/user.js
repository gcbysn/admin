import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter , constantRoutes , asyncRoutes , anyRoutes} from "@/router";
import router from '@/router'
import filterAsyncRoutes from "@/utils/filterAsyncRoutes"
import mapButtons from "@/utils/mapButtons"


const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",

    // 权限管理相关
    roles:[],
    routeNames:[],
    routes:[],
    buttons:{}
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },

  SET_PERMISSION:(state,info)=>{
    state.roles = info.roles;
    state.routeNames = info.routes;
    // console.log(info.routes,asyncRoutes);
    const selectAsyncRoutes = filterAsyncRoutes(asyncRoutes,info.routes);
    // 此时routes中存储了当前账号所有的路由对象信息,目的是为了方便左侧菜单的展示
    state.routes = constantRoutes.concat(selectAsyncRoutes,anyRoutes);
    // console.log(filterAsyncRoutes(asyncRoutes,info.routes));
    // 动态注入异步路由npm
    console.log([...selectAsyncRoutes,...anyRoutes]);
    router.addRoutes([...selectAsyncRoutes,...anyRoutes]);
    // router.addRoutes(asyncRoutes);
    console.log(router);
    state.buttons = mapButtons(info.buttons);
  }
};

const actions = {
  // user login
  //   login({ commit }, userInfo) {
  //     const { username, password } = userInfo
  //     return new Promise((resolve, reject) => {
  //       login({ username: username.trim(), password: password }).then(response => {
  //         const { data } = response
  //         commit('SET_TOKEN', data.token)
  //         setToken(data.token)
  //         resolve()
  //       }).catch(error => {
  //         reject(error)
  //       })
  //     })
  //   },

  async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    try {
      const response = await login({
        username: username.trim(),
        password: password
      });
      const { data } = response;
      commit("SET_TOKEN", data.token);
      setToken(data.token);
    } catch (error) {
      console.log(error);
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response;

          if (!data) {
            return reject("Verification failed, please Login again.");
          }

          const { name, avatar } = data;

          commit("SET_NAME", name);
          commit("SET_AVATAR", avatar);
          commit('SET_PERMISSION',data)
        //   console.log(data);
          resolve(data);
          
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken(); // must remove  token  first
          resetRouter();
          commit("RESET_STATE");
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
