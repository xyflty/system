<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :span="6">
        <div class="chart-wrapper">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="header-box">
              <span>业绩目标</span>
              <div>
                <el-select
                  v-model="value1"
                  placeholder="请选择"
                  style="max-width: 110px"
                >
                  <el-option label="我的目标" :value="1"> </el-option>
                  <el-option label="部门目标" :value="2"> </el-option>
                  <el-option label="公司目标" :value="3"> </el-option>
                </el-select>
                <el-select
                  v-model="value2"
                  style="margin-left: 10px; max-width: 130px"
                  placeholder="请选择"
                >
                  <el-option label="成交金额数" :value="1"> </el-option>
                  <el-option label="新增线索数" :value="2"> </el-option>
                  <el-option label="新增订单数" :value="3"> </el-option>
                </el-select>
                <el-date-picker
                  v-model="value3"
                  style="margin-left: 10px"
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="选择月"
                >
                </el-date-picker>
              </div>
            </div>
            <chart1 :initData="data1" />
          </el-card>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12">
        <div class="chart-wrapper">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="header-box">
              <span>业绩排行</span>
              <div style="display: flex">
                <el-select
                  v-model="value4"
                  placeholder="请选择"
                  style="max-width: 110px"
                >
                  <el-option label="个人排行" :value="1"> </el-option>
                  <el-option label="部门排行" :value="2"> </el-option>
                </el-select>
                <el-select
                  v-model="timeType1"
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
                <treeselect
                  v-if="value4 == 2"
                  style="margin-left: 10px; width: 200px"
                  v-model="value10"
                  :options="deptOptions"
                  :show-count="true"
                  placeholder="请选择归属部门"
                />
                <el-date-picker
                  v-model="value5"
                  style="margin-left: 10px"
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="选择月"
                >
                </el-date-picker>
              </div>
            </div>
            <chart2 :initData="data2" />
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="12" style="margin-top: 10px">
        <div class="chart-wrapper">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="header-box">
              <span>新增数排名</span>
              <div>
                <el-select
                  v-model="value6"
                  placeholder="请选择"
                  style="max-width: 110px"
                >
                  <el-option label="线索" :value="1"> </el-option>
                  <!-- <el-option label="挖需" :value="2"> </el-option> -->
                  <el-option label="商机" :value="3"> </el-option>
                  <el-option label="订单" :value="4"> </el-option>
                  <el-option label="客户" :value="5"> </el-option>
                  <el-option label="综合" :value="6"> </el-option>
                </el-select>
                <el-select
                  v-model="timeType2"
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
                  v-model="value7"
                  style="margin-left: 10px"
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="选择月"
                >
                </el-date-picker>
              </div>
            </div>
            <chart3 :initData="data3" />
          </el-card>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" style="margin-top: 10px">
        <div class="chart-wrapper">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="header-box">
              <span>销售漏斗</span>
              <div>
                <el-select
                  v-model="value8"
                  style="margin-left: 10px; max-width: 110px"
                  placeholder="请选择"
                >
                  <!-- <el-option label="线索" :value="1"> </el-option> -->
                  <!-- <el-option label="挖需" :value="2"> </el-option> -->
                  <el-option label="商机" :value="3"> </el-option>
                  <el-option label="订单" :value="4"> </el-option>
                  <!-- <el-option label="客户" :value="5"> </el-option> -->
                </el-select>
                <el-date-picker
                  v-model="value9"
                  style="margin-left: 10px"
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="选择月"
                >
                </el-date-picker>
              </div>
            </div>
            <chart4 :initData="data4" />
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import chart1 from "./components/chart1.vue";
import chart2 from "./components/chart2.vue";
import chart3 from "./components/chart3.vue";
import chart4 from "./components/chart4.vue";

import {
  getTargetData,
  getSaleAmountRank,
  getAddDataRank,
  getSalesFunnel,
} from "@/api/index/index";

import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: {
    chart1,
    chart2,
    chart3,
    chart4,
    Treeselect,
  },
  data() {
    return {
      // 部门树选项
      deptOptions: undefined,

      value1: 1,
      value2: 1,
      value3: "",

      value4: 1,
      value5: "",
      value6: 1,
      value7: "",
      value8: 3,
      value9: "",
      value10: 200,
      data1: [],
      data2: [],
      data3: [],
      data4: [],

      timeType1: "",
      timeType2: "",
    };
  },
  watch: {
    value1: {
      handler(n) {
        this.getTargetData();
      },
    },
    value2: {
      handler(n) {
        this.getTargetData();
      },
    },
    value3: {
      handler(n) {
        this.getTargetData();
      },
    },
    value4: {
      handler(n) {
        this.getSaleAmountRank();
      },
    },
    timeType1: {
      handler(n) {
        this.getSaleAmountRank();
      },
    },
    value5: {
      handler(n) {
        this.getSaleAmountRank();
      },
    },
    value10: {
      handler(n) {
        this.getSaleAmountRank();
      },
    },
    value6: {
      handler(n) {
        this.getAddDataRank();
      },
    },
    timeType2: {
      handler(n) {
        this.getAddDataRank();
      },
    },
    value7: {
      handler(n) {
        this.getAddDataRank();
      },
    },

    value8: {
      handler(n) {
        this.getSalesFunnel();
      },
    },
    value9: {
      handler(n) {
        this.getSalesFunnel();
      },
    },
  },
  mounted() {
    let date = new Date();
    const defaultMonth =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1 < 10
        ? "0" + Number(date.getMonth() + 1)
        : Number(date.getMonth() + 1));
    this.value3 = defaultMonth;
    this.value5 = defaultMonth;
    this.value7 = defaultMonth;
    this.value9 = defaultMonth;
    this.getTreeselect();
  },
  methods: {
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },

    handleClick(index) {
      this.current = index;
    },

    // 业绩目标
    getTargetData() {
      getTargetData({
        type: this.value1, // 1个人 2部门 3公司
        targetType: this.value2, // 1成交金额  2新增线索  3新增订单
        yearMonth: this.value3 == null ? "" : this.value3, // 时间筛选，格式：2022-07
      }).then((res) => {
        this.data1 = [
          { value: res.data ? res.data.targetValue : 0, name: "目标金额" },
          { value: res.data ? res.data.resultValue : 0, name: "完成金额" },
        ];
      });
    },

    // 业绩排行
    getSaleAmountRank() {
      getSaleAmountRank({
        rankType: this.value4, //1个人排行  2部门排行
        timeType: this.timeType1,
        yearMonth: this.value5, // 时间筛选，格式：2022-07
        deptId: this.value4 == 1 ? "" : this.value10, //部门id，查询类型为部门时有值
      }).then((res) => {
        this.data2 = [
          res.data.name,
          res.data.targetValue,
          res.data.salesAmount,
        ];
      });
    },

    // 新增数排名
    getAddDataRank() {
      getAddDataRank({
        type: this.value6, //1 线索  2 挖需 3 商机 4 订单 5 客户 6 综合
        timeType: this.timeType2,
        yearMonth: this.value7, // 时间筛选，格式：2022-07
      }).then((res) => {
        let typeStr = ["线索", "挖需", "商机", "订单", "客户", "综合"];
        this.data3 = [
          res.data.userName,
          res.data.count,
          typeStr[Number(this.value6) - 1],
        ];
      });
    },

    // 销售漏斗
    getSalesFunnel() {
      getSalesFunnel({
        type: this.value8, //1 线索  2 挖需 3 商机 4 订单 5 客户
        yearMonth: this.value9, // 时间筛选，格式：2022-07
      }).then((res) => {
        this.data4 = res.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-card__header {
  background: #f9f9f9;
}
::v-deep .el-card__body {
  height: 500px;
}
.text {
  font-size: 14px;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 40px;
  cursor: pointer;
}
.item:hover {
  background-color: #f9f9f9;
}
.item img {
  width: 48px;
  height: 48px;
}
.item div {
  margin-top: 10px;
}

.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
}
.btn_more {
  box-sizing: border-box;
  width: 90px;
  height: 36px;
  font-size: 12px;
  color: #999999;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(228, 228, 228, 1);
  text-align: center;
  line-height: 36px;
  background: #fff;
  border-radius: 5px;
  font-family: "微软雅黑 Regular", 微软雅黑;
  font-weight: 400;
}
.msg_title {
  position: relative;
  padding: 0 20px;
  cursor: pointer;
}
.msg_title::after {
  position: absolute;
  top: 0;
  right: 0;
  content: "";
  background: #d7d7d7;
  width: 2px;
  height: 100%;
}
.msg-box .msg_title:first-child {
  padding-left: 0;
}
.msg-box .msg_title:last-child::after {
  width: 0;
}
.select_title {
  font-weight: 600;
  color: #333;
}
.box-card {
  width: 100%;
}
.menu-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f2f2f2;
}
</style>
