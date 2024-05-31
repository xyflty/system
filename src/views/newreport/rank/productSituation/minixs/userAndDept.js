import { mapState } from "vuex";
import { systemUserListForSelect } from "@/api/system/user";
import { filterDepts } from "@/utils/common";

export default {
  data() {
    return {
      userList: [], //用户数据列表
      deptOptions: [], //部门数据列表
      individual: true, //判断当前登录人是否是个体，true 个体 ，false 为部门
      defaultDeptId: undefined, //默认当前登录人部门
      defaultUserId: undefined, //默认当前登录人id
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
      // 判断其id是否最高 最高展示特殊数据 否则隐藏

      // 去除顶级数型数据，保留子数据和当前子部门的所有部门id
      const { children, deptIds } = filterDepts(treeList, defaultDeptId);
      this.deptOptions = children;

      if (treeList) {
        this.individual = false;
        this.defaultDeptId = deptIds.join(",");
      } else {
        this.defaultDeptId = undefined;

        this.productOptions.column = this.productOptions.column.filter(
          (item) => {
            return item.prop !== "userName";
          }
        );
      }
      this.defaultUserId = defaultUserId;

      this.getUserList(defaultDeptId);
    },
  },
  mounted() {
    this.getTreeselect();
  },
  computed: {
    ...mapState(["user"]),
  },
};
