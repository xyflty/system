// 市场新增
<template>
  <el-card class="box-card">
    <div slot="header" class="header-box">
      <span> {{ `${title}订单需求货源匹配需求` }}</span>
      <span>为必填项</span>
    </div>
    <!-- 表单 -->
    <avue-form
      v-model="form"
      :option="option"
      @submit="handleSubmit"
      @reset-change="resetChange"
    ></avue-form>
  </el-card>
</template>

<script>
// 表单配置信息
import { bazaar, channel } from "./Options";

// 接口api
import {
  sourceMatchingAdd,
  sourceMatchingDetail,
  sourceMatchingEdit,
  sourceMatchingEditChannel,
} from "@/api/core/orderNeed";

import { cloneDeep } from "lodash";
export default {
  data() {
    return {
      form: {},
      detailForm: {},
      option: {
        submitText: "新增",
        emptyText: "重置",
        column: [],
      },
      type: 1, //新增（1） ，编辑（2）反馈（3）
      title: "",
    };
  },
  methods: {
    dealOptions(type) {
      if (type) {
        if (type === 2) {
          // 编辑
          this.type = 2;
          this.option.submitText = "修改";
          this.title = "修改";
          this.option.column = bazaar;
        } else {
          //    反馈
          this.title = "反馈";
          const newBazaar = bazaar.map((item) => {
            delete item.row;
            return {
              ...item,
              disabled: true,
            };
          });
          console.log(newBazaar);
          this.type = 3;
          this.option.submitText = "提交";
          this.option.group = [
            {
              label: "市场部信息",
              column: newBazaar,
            },
            {
              label: "渠道部反馈信息",
              column: channel,
            },
          ];
        }
      } else {
        // 新增
        this.type = 1;
        this.title = "添加";
        this.option.column = bazaar;
      }
    },
    // 获取路由参数
    getRouteParams() {
      const { type, id } = this.$route.query;

      this.dealOptions(type);

      id && this.getDetail(id);
    },
    // 获取货源匹配详情信息
    async getDetail(id) {
      const res = await sourceMatchingDetail(id);

      if (res.code === 200) {
        this.form = res.data;
        this.detailForm = cloneDeep(res.data);
      } else {
        this.$message.error(res.msg);
      }
    },

    // 提交操作
    async handleSubmit(form, done) {
      console.log(form);

      let fn = sourceMatchingAdd;
      let msg = "";
      if (this.type === 1) {
        // 新增
        msg = "新增成功";
      } else if (this.type === 2) {
        // 编辑
        fn = sourceMatchingEdit;
        msg = "修改成功";
      } else {
        // 反馈
        fn = sourceMatchingEditChannel;
        msg = "反馈成功";
      }

      try {
        const res = await fn(form);

        if (res.code === 200) {
          this.$message.success(msg);
          this.$router.push({ path: "/customerManager/orderNeed" });
        } else {
          this.$message.error(res.msg);
        }
      } finally {
        done();
      }
    },
    resetChange() {
      this.form = cloneDeep(this.detailForm);
    },
  },
  mounted() {
    this.getRouteParams();
  },
};
</script>

<style lang='scss' scoped>
.box-card {
  width: 70%;
  margin: 30px auto;
  .header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    span {
      &:nth-child(2) {
        color: #999;
        font-size: 14px;
        &::before {
          content: "*";
          color: #f56c6c;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>