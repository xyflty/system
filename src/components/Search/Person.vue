<template>
  <el-form-item :label="label" :prop="prop">
    <el-select
      style="width: 100%"
      v-model="value"
      filterable
      clearable
      :placeholder="placeholder"
      remote
      :multiple="multiple"
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
  </el-form-item>
</template>

<script>
import { listUser } from "@/api/system/user";

export default {
  props: {
    userIds: {
      type: Array | String,
    },
    prop: {
      type: String,
      default: "userIds",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "跟进人员",
    },
    label: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      value: "",
      userList: [],
    };
  },

  watch: {
    userIds: {
      handler(n) {
        if (n == undefined || n == "") {
          this.value = "";
        }
      },
    },
    value: {
      handler(n) {
        this.$emit("update:userIds", n);
      },
    },
  },
  methods: {
    /** 查询用户列表 */
    getUserList(e, isFocus) {
      listUser({
        userName: isFocus ? "" : e,
      }).then((response) => {
        this.userList = response.rows;
      });
    },
  },
};
</script>

<style></style>
