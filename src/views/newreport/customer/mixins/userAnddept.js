import { systemUserListForSelect } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";

import { filterDepts } from "@/utils/common";

import { mapState } from "vuex";
export const userAndDept = {
  data() {
    return {
      userList: [],
      deptOptions: [],
      lastDept: [], //最后一级部门
      noDrill: false, //是否有挖据按钮

      isUserRole: true, //当前登录是否为个人用户
      userId: 0,
      defaultDeptIds: [],
      miniDepts: false, //是否是最小部门
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

    dealDept(tree) {
      if (tree && tree.length) {
        tree.forEach((item) => {
          if (item.children && item.children.length) {
            this.dealDept(item.children);
          } else {
            this.lastDept.push(item.id);
          }
        });
      }
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
        this.dealDept(this.deptOptions);
      } else {
        this.isUserRole = true;
        this.defaultDeptIds = [this.user.subjectDeptId];
        const res = await treeselect();

        this.deptOptions = res.data;
        this.getUserList(defaultDeptId);
        this.dealDept(this.deptOptions);
      }

      // 判断是否存在
      this.noDrill = this.lastDept.some((item) => item === defaultDeptId);
    },
  },
  mounted() {
    this.getTreeselect();
  },
  computed: {
    ...mapState(["user"]),
  },
};
