<template>
  <el-row>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="header-box">
        <span>数据简报</span>
        <div>
          <el-select
            v-model="value"
            placeholder="请选择"
            clearable
            style="max-width: 110px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="timeType"
            placeholder="请选择"
            clearable
            style="margin-left: 10px; max-width: 100px"
          >
            <el-option label="今天" :value="1" />
            <el-option label="昨天" :value="2" />
            <el-option label="近7天" :value="3" />
            <el-option label="近15天" :value="4" />
            <el-option label="近30天" :value="5" />
          </el-select>
          <el-date-picker
            style="margin-left: 10px; max-width: 240px"
            v-model="value1"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="menu-box">
        <div
          v-for="(item, index) in menuList"
          :key="index"
          class="text item"
          @click="getDetaiPage(item.path, { timeType }, value)"
        >
          <div class="name">{{ item.name }}</div>
          <div class="value">{{ item.value || "0" }}</div>
        </div>
      </div>
    </el-card></el-row
  >
</template>

<script>
import { getDataReport } from "@/api/index/index";
export default {
  data() {
    return {
      menuList: [
        {
          name: "新建客户",
          key: "customerCount",
          value: "",
          path: "Customer",
        },
        {
          name: "新建线索",
          key: "clueCount",
          value: "",
          path: "Clue",
        },
        // {
        //   name: "新建挖需",
        //   key: "demandCount",
        //   value: "",
        //   path: "Demand",
        // },
        {
          name: "新建商机",
          key: "opportunityCount",
          value: "",
          path: "Opportunity",
        },
        {
          name: "新建订单",
          key: "orderCount",
          value: "",
          path: "Order",
        },
        {
          name: "成交金额",
          key: "priceSum",
          value: "",
          path: "ReportCustomer",
        },
        {
          name: "跟进次数",
          key: "followUpCount",
          value: "",
          path: "FollowUp",
        },
        {
          name: "成交产品",
          key: "orderProjectCount",
          value: "",
          path: "Sale",
        },
      ],

      options: [
        {
          value: 1,
          label: "我的简报",
        },
        {
          value: 2,
          label: "部门简报",
        },
        {
          value: 3,
          label: "公司简报",
        },
      ],
      value: 1,
      timeType: "",
      options1: [
        "今天",
        "昨天",
        "本周",
        "上周",
        "本月",
        "上月",
        "本季度",
        "上季度",
        "今年",
        "去年",
      ],
      value1: "",
    };
  },

  watch: {
    value: {
      handler(n) {
        console.log(n);
        this.getInfo();
      },
    },
    timeType: {
      handler(n) {
        console.log(n);
        this.getInfo();
      },
    },
    value1: {
      handler(n) {
        console.log(n);
        this.getInfo();
      },
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    // 获取数据
    getInfo() {
      getDataReport({
        type: this.value,
        timeType: this.timeType,
        beginTime: this.value1 == null ? "" : this.value1[0],
        endTime: this.value1 == null ? "" : this.value1[1],
      }).then((res) => {
        let data = res.data;
        this.menuList.forEach((item) => {
          if (data[item.key] != undefined) {
            item.value = data[item.key];
          }
        });
      });
    },
    // 跳转页面
    getDetaiPage(name, params, value) {
      this.$router.push({ name, params });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-card__header {
  background: #f9f9f9;
}
.text {
  font-size: 14px;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // padding: 10px 40px;
  cursor: pointer;
}
.item .name {
  white-space: nowrap;
  color: rgb(153, 153, 153);
}

.item .value {
  font-size: 28px;
  margin-top: 20px;
}
.menu-box {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
}
.menu-box .item:nth-child(n + 5) {
  margin-top: 50px;
}

.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
}

.box-card {
  width: 100%;
}
::v-deep .el-card__body,
.el-main {
  padding: 50px 25px;
}
::v-deep .el-card__body {
  height: 310px;
}
</style>
