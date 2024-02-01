// import { login, logout, getInfo } from '@/api/login';
// import { getToken, setToken, removeToken } from '@/utils/auth';
import { defineStore } from 'pinia';

const useUserStore = defineStore('user', {
  state: () => ({
    // token: getToken(),
    id: '',
    name: '',
    roles: [],
    permissions: [],
  }),
  actions: {
    // 登录
    login(userInfo) {
      // const username = userInfo.username.trim();
      // const { password } = userInfo;
      // const { code } = userInfo;
      return new Promise((resolve, reject) => {
        // login(username, password, code)
        //   .then((res) => {
        //     setToken(res.token);
        //     this.token = res.token;
        //     resolve();
        //   })
        //   .catch((error) => {
        //     reject(error);
        //   });
      });
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        this.name = '程序员';
        resolve(this.name);
        // getInfo()
        //   .then((res) => {
        //     const { user } = res;
        //     if (res.roles && res.roles.length > 0) {
        //       // 验证返回的roles是否是一个非空数组
        //       this.roles = res.roles;
        //       this.permissions = res.permissions;
        //     } else {
        //       this.roles = ['ROLE_DEFAULT'];
        //     }
        //     this.id = user.userId;
        // this.name = user.userName;
        // resolve(res);
        // })
        // .catch((error) => {
        //   reject(error);
        // });
      });
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        // logout(this.token)
        //   .then(() => {
        //     this.token = '';
        //     this.roles = [];
        //     this.permissions = [];
        //     removeToken();
        //     resolve();
        //   })
        //   .catch((error) => {
        //     reject(error);
        //   });
      });
    },
  },
});

export default useUserStore;
