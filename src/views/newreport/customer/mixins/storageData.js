export const storage = {
  data() {
    return {
      storageData: {},
    };
  },
  methods: {
    setStorage() {
      console.log(this.$route);
      const { name } = this.$route;
      if (sessionStorage.getItem("STORAGE_KEY")) {
        this.storageData = JSON.parse(sessionStorage.getItem("STORAGE_KEY"));
      }

      this.storageData[name] = this.queryParams;
      console.log(name);
      console.log(this.storageData[name]);
      sessionStorage.setItem("STORAGE_KEY", JSON.stringify(this.storageData));
    },
    getStorage() {
      const { name } = this.$route;
      this.storageData = JSON.parse(sessionStorage.getItem("STORAGE_KEY"));

      this.queryParams = this.storageData[name];
      // const { deptIds } = this.queryParams;
      // let dealDeptIds = null;
      // if (typeof deptIds === "string") {
      //   dealDeptIds = deptIds.split(",");
      // } else {
      //   dealDeptIds = deptIds;
      // }
      // this.queryParams.deptIds = dealDeptIds;
      // sessionStorage.setItem("STORAGE_KEY", JSON.stringify(this.storageData));
    },
    isExist() {
      if (
        sessionStorage.getItem("STORAGE_KEY") &&
        sessionStorage.getItem("STORAGE_KEY") !== "[]"
      ) {
        return true;
      }
      return false;
    },

    setRouterName(val) {
      sessionStorage.setItem("ROUTERNAME", val);
    },
    getRouterName() {
      return sessionStorage.getItem("ROUTERNAME");
    },
    removeRouterName() {
      if (sessionStorage.getItem("ROUTERNAME")) {
        sessionStorage.removeItem("ROUTERNAME");
      }
    },
  },
};
