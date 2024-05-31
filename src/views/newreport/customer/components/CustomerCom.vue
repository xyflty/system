<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form
        size="small"
        inline
        ref="form"
        :model="queryParams"
        label-width="80px"
      >
        <template v-if="isData">
          <el-form-item label="" prop="dateType">
            <el-select v-model="queryParams.dateType" @change="toggleDateType">
              <el-option label="按年统计" :value="1" />
              <el-option label="按月统计" :value="2" />
              <el-option label="按周统计" :value="4" />
              <el-option label="按日统计" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="beginTime">
            <el-date-picker
              v-if="queryParams.dateType == 1"
              v-model="queryParams.beginTime"
              value-format="yyyy"
              type="year"
              placeholder="开始年份"
              :editable="false"
              :clearable="false"
            >
            </el-date-picker>
            <el-date-picker
              v-if="queryParams.dateType == 2 || queryParams.dateType == 3"
              v-model="dateMonth"
              :type="pickerType"
              :value-format="valueFormat"
              range-separator="至"
              :start-placeholder="
                queryParams.dateType === 2 ? '开始月份' : '开始日期'
              "
              :end-placeholder="
                queryParams.dateType === 2 ? '结束月份' : '结束日期'
              "
              :editable="false"
              :clearable="false"
            />
          </el-form-item>
          <!-- 这是周的选择日期 -->
          <el-form-item label="" v-if="queryParams.dateType == 4" prop="">
            <Chooseweek ref="Chooseweek" @sallBusiness="date"></Chooseweek>
          </el-form-item>
          <el-form-item label="" prop="endTime">
            <el-date-picker
              v-if="queryParams.dateType == 1"
              v-model="queryParams.endTime"
              type="year"
              value-format="yyyy"
              placeholder="结束年份"
              :editable="false"
              :clearable="false"
            >
            </el-date-picker>
          </el-form-item>
        </template>
        <el-form-item label="" prop="deptIds" v-if="user.treeList">
          <!-- 个人是没有部门选择 -->
          <div class="vueTreeSelectSmall">
            <treeselect
              v-model="queryParams.deptIds"
              :flat="true"
              appendToBody
              style="margin-left: 10px; max-width: 400px"
              :multiple="true"
              :options="deptOptions"
              value-consists-of="ALL"
              :show-count="true"
              placeholder="请选择归属部门"
              clearable
            />
          </div>
        </el-form-item>
        <el-form-item label="" prop="userId">
          <el-select
            style="width: 100%"
            v-model="queryParams.userId"
            filterable
            placeholder="请输入关键字搜索用户"
            remote
            clearable
            :disabled="!user.treeList"
          >
            <!-- 个人用户不能看其他人员 -->
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button
            v-if="isBack"
            icon="el-icon-back"
            type="primary"
            @click="goBack"
            >返回</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <section v-if="isShowData">
      <el-card style="margin-top: 10px" v-loading="loading1">
        <div class="menu-box">
          <div
            v-for="(item, index) in tabData['top']"
            :key="index"
            class="text item"
          >
            <div>{{ item.lable }}</div>
            <div
              style="
                display: inline-block;
                white-space: nowrap;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: center;
              "
            >
              {{ item.value || 0 }}
            </div>
          </div>
        </div>
      </el-card>

      <div style="display: flex; flex-wrap: wrap">
        <el-card
          style="
            margin-top: 10px;
            margin-right: 20px;
            flex: 3;
            min-width: 250px;
          "
          v-loading="loading1"
        >
          <div class="menu-box">
            <div
              v-for="(item, index) in tabData['left']"
              :key="index"
              class="text item flex"
            >
              <div>{{ item.lable }}</div>
              <div
                style="
                  display: inline-block;
                  white-space: nowrap;
                  width: 100%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  text-align: center;
                "
              >
                {{ item.value || "" }}
              </div>
            </div>
          </div>
        </el-card>
        <el-card
          style="margin-top: 10px; flex: 4; min-width: 250px"
          v-loading="loading1"
        >
          <div class="menu-box">
            <div
              v-for="(item, index) in tabData['right']"
              :key="index"
              class="text item flex2"
            >
              <div>{{ item.lable }}</div>
              <div style="text-align: center">{{ item.value || "" }}</div>
            </div>
          </div>
        </el-card>
      </div>
    </section>

    <slot></slot>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Chooseweek from "@/components/Chooseweek/weeks1.vue";

import { getHeaderData } from "@/api/newreport/customer";

import data from "../config/data";

import { mapState } from "vuex";
import { cloneDeep } from "lodash";
export default {
  name: "CustomerCom",
  props: {
    queryForm: {
      type: Object,
      required: true,
    },
    // 是否展示头部，左右部数据
    isShowData: {
      type: Boolean,
      default: true,
    },
    // 是否有回退
    isBack: {
      type: Boolean,
      default: true,
    },
    // 是否展示时间
    isData: {
      type: Boolean,
      default: true,
    },

    deptOptions: Array, //树形数据
    userList: Array, //用户数据
  },
  components: {
    Treeselect,
    Chooseweek,
  },
  data() {
    return {
      dateMonth: "",
      queryParams: {},
      deptIds: [],

      tabData: data.tabData,
      loading1: false, //头部左右的数据加载

      growthRate: 0, //环比增长率
    };
  },
  methods: {
    toggleDateType(val) {
      if (val == 1) {
        this._getNowYear(this.queryParams, "beginTime", "endTime");
      } else if (val == 4) {
        // 周
      } else {
        this.dateMonth = null;
      }
    },
    // 重置
    handleReset() {
      this.$emit("reset", this.$refs.form, this.queryParams);
    },

    // 搜索
    handleQuery() {
      if (this.queryParams.beginTime && this.queryParams.endTime) {
    
        this.$emit("query", this.queryParams);
      } else {
        this.$message.error("请选择日期");
      }
    },

    // 返回
    goBack() {
      this.$emit("back");
    },
    // 选择周
    date(value) {
      this.queryParams.beginTime = value[0];
      this.queryParams.endTime = value[1];
    },

    // 获取头部，左右2部数据
    getHeaderData(params) {
      this.loading1 = true;

      getHeaderData(params).then((res) => {
        const {
          headerData: topData,
          leftData: lData,
          rightData: rData,
          lastHeaderData,
        } = res.data;

        // 计算顶部环比增长数据
        let proData = lastHeaderData ? res.data.lastHeaderData : []; //判空
        let nowData = 0;
        let preData = 0;

        // this.tabData["top"] = this.tabData["top"].map((item) => {
        //   item.value = 0;
        // });
        this.tabData["top"].forEach((item) => {
          item.value = 0;
        });
        if (topData && topData.length) {
          // 获取旧的累计数
          proData.forEach((t) => {
            preData += Number(t.customerTransactionPrice);
          });
          // 获取当前的累计数
          topData.forEach((t) => {
            return (nowData += Number(t.customerTransactionPrice));
          });

          // this.growthRate = (nowData -preData) / preData * 100+'%'
          let num = ((nowData - preData) / preData) * 100;
          // 判断上期数据为空进行特殊处理
          if (proData.length > 0) {
            this.growthRate = num.toFixed(2) + "%";
          } else {
            this.growthRate = 0 + "%";
          }

          this.dealTopData(topData, rData);
        }

        // 左边数据
        if (lData && lData.length) {
          lData.forEach((res) => {
            this.dealLeftData(res.customerGradeName, res);
          });
        } else {
          this.tabData["left"].forEach((item) => {
            item.value = "0 | 0 | 0.00";
          });
        }

        // 右边数据
        if (rData) {
          this.tabData["right"].map(
            (item, index) =>
              (item.value = this.dealRightData(item.key, index, rData))
          );
        } else {
          this.tabData["right"].forEach((item) => {
            item.value = "0 | 0 | 0.00";
          });
        }
        this.loading1 = false;
      });
    },
    // 处理顶部数据
    dealTopData(topData, rData) {
      topData.forEach((item) => {
        this.tabData["top"].forEach((i, index) => {
          if ((index < 4) & (index != 1)) {
            i.value = Number(i.value) + Number(item[i.key]);
          }
          if (index == 1) {
            //  环比增长率
            i.value = this.growthRate;
          }
          if (index == 4) {
            i.value = (Number(i.value) + Number(item[i.key])).toFixed(6);
          }
          if (index == 5) {
            i.value = (
              Number(i.value) +
              (item["customerGradeName"] == "C"
                ? Number(item["customerNumber"]) * 0.2
                : item["customerGradeName"] == "B"
                ? Number(item["customerNumber"]) * 0.23
                : item["customerGradeName"] == "A"
                ? Number(item["customerNumber"]) * 0.27
                : Number(item["customerNumber"]) * 0.3) /
                4 /
                100
            ).toFixed(6);
          }
        });
      });
      this.tabData["top"][5].value = (
        this.tabData["top"][5].value / 100
      ).toFixed(6);
      this.tabData["top"][6].value = (
        (Number(rData.firstDealCount) * 0.1 +
          Number(rData.twiceDealCount) * 0.15 +
          Number(rData.manyTimesDealCount) * 0.2 +
          Number(rData.fansCustomerOrderCount) * 0.25 +
          Number(rData.loyalCustomerOrderCount) * 0.3) /
        5 /
        100
      ).toFixed(6);
    },
    // 处理左边数据
    dealLeftData(key, res) {
      const customerCount = res.customerCount | 0;
      const orderCount = res.orderCount | 0;
      const orderPrice = res.orderPrice | "0.00";
      let index = 0;
      switch (key) {
        case "VIP":
          index = 0;
          break;
        case "A":
          index = 1;
          break;
        case "B":
          index = 2;
          break;
        case "C":
          index = 3;
          break;
      }
      this.tabData["left"][
        index
      ].value = `${customerCount} | ${orderCount} | ${orderPrice}`;
    },
    // 处理右边数据
    dealRightData(key, index, rData) {
      let Count = key + "Count";
      let OrderCount = key + "OrderCount";
      let OrderPriceCount = "";
      if (index === 3 || index === 4) {
        OrderPriceCount = key + "OrderPriceCount";
      } else {
        OrderPriceCount = key + "AmountCount";
      }
      return `${rData[Count]} | ${rData[OrderCount]} | ${rData[OrderPriceCount]}`;
    },
  },
  mounted() {
    this._getHeaderData = this.getHeaderData;
  },

  watch: {
    queryForm: {
      handler(newVal) {
        let form = cloneDeep(newVal);

        if ([2, 3].includes(form.dateType)) {
          this.dateMonth = [form.beginTime, form.endTime];
        } else if ([4].includes(form.dateType)) {
          // 周

          this.$nextTick(() => {
         
            this.$refs.Chooseweek &&
              this.$refs.Chooseweek.getMont(form.beginTime);
          });
        }
        this.queryParams = cloneDeep(newVal);
      },
      deep: true,
      immediate: true,
    },

    dateMonth: {
      handler(n) {
        this.queryParams.beginTime = n != null ? n[0] : "";
        this.queryParams.endTime = n != null ? n[1] : "";
      },
    },
  },
  computed: {
    pickerType() {
      const { dateType } = this.queryParams;
      if (dateType === 2) {
        return "monthrange";
      } else if (dateType === 3) {
        return "daterange";
      }
    },
    valueFormat() {
      const { dateType } = this.queryParams;
      if (dateType === 2) {
        return "yyyy-MM";
      } else if (dateType === 3) {
        return "yyyy-MM-dd";
      }
    },
    ...mapState(["user"]),
  },
};
</script>

<style lang='scss' scoped>
.menu-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 40px;
  cursor: pointer;
}

.item:hover {
  background-color: #f9f9f9;
}

.item div {
  margin-top: 20px;
}

.item div:nth-child(1) {
  color: rgb(0, 121, 254);
  font-size: 18px;
}

.item div:nth-child(2) {
  color: #000;
  font-size: 20px;
}
.flex {
  flex: 50%;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
}
</style>

