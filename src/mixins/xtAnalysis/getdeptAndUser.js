import { systemUserListForSelect } from "@/api/system/user";

import { filterDepts } from "@/utils/common";
import { mapState } from "vuex";
export const deptAndUser = {
  data() {
    return {
      deptOptions: [], //部门数据
      userList: [],
      storageData: [],
      defaultDeptIds: [],
      isBasicEmployee: false, //是否显示筛选
    };
  },
  methods: {
    /** 查询用户列表 */
    getUserList(deptId, e, isFocus = true) {
      systemUserListForSelect({
        pageNum: 1,
        pageSize: 10,
        userName: isFocus ? "" : e,
        deptId: deptId,
      }).then((response) => {
        this.userList = response.rows;
      });
    },

    /** 查询部门下拉树结构 */
    async getTreeselect() {
      const { treeList, defaultUserId, defaultDeptId } = this.user;
      this.userId = defaultUserId;

      if (treeList) {
        this.isUserRole = false;

        const { children, deptIds, isflag } = filterDepts(
          treeList,
          defaultDeptId
        );
        this.deptOptions = children;
        this.defaultDeptIds = deptIds;
        this.miniDepts = isflag;
        this.getUserList(defaultDeptId);
      } else {
        this.isUserRole = true;
        this.defaultDeptIds = 100;
        const res = await treeselect();
        this.deptOptions = res.data;

        this.getUserList(defaultDeptId);
      }

      this.queryForm.deptIds = this.defaultDeptIds.join(","); //获取当前登录的部门
      this.isBasicEmployee = this.defaultDeptIds ? true : false;

      if (sessionStorage.getItem("XTPANORAMA_KEY")) {
        const getData = JSON.parse(sessionStorage.getItem("XTPANORAMA_KEY"));
        this.queryForm = getData;
        // 移除本地存储数据
        sessionStorage.removeItem("XTPANORAMA_KEY");
      }
      this.parmas = {
        projectCategory: this.pageType,
        ...this.queryForm,
      };
      this.getPageData();
    },
    // 获取当前年和上年，并赋值给初始状态
    getYear() {
      let year = new Date().getFullYear();
      const lastYear = year - 1;
      this.queryForm.timeValueBegin = lastYear + "";
      this.queryForm.timeValueEnd = year + "";
    },
  },
  mounted() {
    // this.getYear();
    this.getTreeselect();
  },
  computed: {
    ...mapState(["user"]),
  },
};
