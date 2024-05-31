<template>
  <el-select
    style="width: 100%"
    v-model="userIds"
    filterable
    multiple
    clearable
    :placeholder="placeholder"
    remote
    :remote-method="getUserList"
    @focus="getUserList($event, true)"
  >
    <el-option
      v-for="item in userList"
      :key="item.userId"
      :label="item.userName"
      :value="item.userId"
    />
  </el-select>
</template>

<script>
import { listUser } from "@/api/system/user";
export default {
  props: {
    userIds: {
      type: String | Array,
    },
    placeholder: {
      type: String,
      default: "请输入关键字搜索用户",
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      userList: [],
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    /** 查询用户列表 */
    getUserList(e, isFocus) {
      listUser({
        pageNum: 1,
        pageSize: 10,
        userName: isFocus ? "" : e,
      }).then((response) => {
        this.userList = response.rows;
      });
    },
  },
};
</script>
