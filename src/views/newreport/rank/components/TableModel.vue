<template>
  <div class="app-container">
    <!-- 日期搜索 -->
    <el-card class="box-card">
      <el-form
        size="small"
        inline
        ref="form"
        :model="queryParams"
        label-width="80px"
      >
        <template>
          <el-form-item label="" prop="searchDateType">
            <el-select
              v-model="queryParams.searchDateType"
              @change="toggleDateType"
            >
              <el-option label="按年统计" :value="1" />
              <el-option label="按月统计" :value="2" />
              <el-option label="按周统计" :value="3" />
              <el-option label="按日统计" :value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="searchStartDate">
            <el-date-picker
              v-if="queryParams.searchDateType == 1"
              v-model="queryParams.searchStartDate"
              value-format="yyyy"
              type="year"
              placeholder="开始年份"
              :editable="false"
              :clearable="false"
            >
            </el-date-picker>
            <el-date-picker
              v-if="
                queryParams.searchDateType == 2 ||
                queryParams.searchDateType == 4
              "
              v-model="dateMonth"
              :type="pickerType"
              :value-format="valueFormat"
              range-separator="至"
              :start-placeholder="
                queryParams.searchDateType === 2 ? '开始月份' : '开始日期'
              "
              :end-placeholder="
                queryParams.searchDateType === 2 ? '结束月份' : '结束日期'
              "
              :editable="false"
              :clearable="false"
            />
          </el-form-item>
          <!-- 这是周的选择日期 -->
          <el-form-item label="" v-if="queryParams.searchDateType == 3" prop="">
            <Chooseweek ref="Chooseweek" @sallBusiness="date"></Chooseweek>
          </el-form-item>
          <el-form-item label="" prop="searchEndDate">
            <el-date-picker
              v-if="queryParams.searchDateType == 1"
              v-model="queryParams.searchEndDate"
              type="year"
              value-format="yyyy"
              placeholder="结束年份"
              :editable="false"
              :clearable="false"
            >
            </el-date-picker>
          </el-form-item>
        </template>
        <el-form-item
          label=""
          prop="searchDeptIds"
          v-if="isDept && user.treeList"
        >
          <!-- 个人是没有部门选择 -->
          <div class="vueTreeSelectSmall">
            <treeselect
              v-model="searchDeptIds"
              :flat="true"
              appendToBody
              z-index="9999"
              style="margin-left: 10px; max-width: 400px"
              :multiple="true"
              :options="deptOptions"
              value-consists-of="ALL"
              :show-count="true"
              placeholder="请选择归属部门"
              clearable
              @input="treeselectinput"
            />
          </div>
        </el-form-item>
        <el-form-item label="" prop="userId" v-if="isDept">
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
          <el-button icon="el-icon-back" @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
      <!-- 数据的预览 -->
      <div class="menu-box2" v-if="previewData.length">
        <div
          v-for="(item, index) in previewData"
          :key="index"
          class="department-item"
        >
          <div>{{ item.lable }}:</div>
          <div class="son-item">{{ item.value || 0 }} ;</div>
        </div>
      </div>
    </el-card>
    <slot></slot>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Chooseweek from "@/components/Chooseweek/weeks1.vue";

import { mapState } from "vuex";
import { cloneDeep } from "lodash";

export default {
  name: "TableModel",
  components: { Treeselect, Chooseweek },
  props: {
    queryForm: {
      type: Object,
      required: true,
    },
    // 是否展示时间
    isDept: {
      type: Boolean,
      default: true,
    },
    deptOptions: Array, //树形数据
    userList: Array, //用户数据
    previewData: {
      type: Array,
      default: () => {
        return [];
      },
    }, //预览数据
  },
  data() {
    return {
      queryParams: {},
      dateMonth: "",

      searchDeptIds: [],
    };
  },
  methods: {
    toggleDateType(val) {
      if (val == 1) {
        this._getNowYear(this.queryParams, "searchStartDate", "searchEndDate");
      } else if (val == 3) {
      } else {
        this.dateMonth = [];
      }
    },
    handleClose() {},
    // 重置
    handleReset() {
      this.$emit("reset", this.$route.query);
    },
    // 查询
    handleQuery() {
      if (this.queryParams.searchStartDate && this.queryParams.searchEndDate) {
        if (this.isDept && !this.queryParams.searchDeptIds) {
          this.$message.error("请选择部门");
          return;
        }
        this.$emit("query", this.queryParams);
      } else {
        this.$message.error("请选择日期");
      }
    },
    goBack() {
      this.$router.go(-1);
    },

    treeselectinput(i) {
      this.queryParams.searchDeptIds = this.searchDeptIds.join(",");
    },

    // 选择周
    date(value) {
      // 判断是否是第一次进入，第一次进入不对其初始化
      this.queryParams.searchStartDate = value[0];
      this.queryParams.searchEndDate = value[1];
    },
  },
  mounted() {},
  watch: {
    queryForm: {
      handler(newVal) {
        newVal.searchDateType = +newVal.searchDateType;

        let form = cloneDeep(newVal);
        console.log({ form });

        if ([2, 4].includes(form.searchDateType)) {
          this.dateMonth = [form.searchStartDate, form.searchEndDate];
        } else if ([3].includes(form.searchDateType)) {
          // 周

          this.$nextTick(() => {
            this.$refs.Chooseweek &&
              this.$refs.Chooseweek.getMont(form.searchStartDate);
          });
        }

        if (form.searchDeptIds) {
          this.searchDeptIds = form.searchDeptIds
            .toString()
            .split(",")
            .map((item) => {
              if (item == 200) {
                return Number(item);
              } else {
                return item;
              }
            });
        }

        this.queryParams = cloneDeep(newVal);
      },
      deep: true,
      immediate: true,
    },

    dateMonth: {
      handler(n) {
        this.queryParams.searchStartDate = n != null ? n[0] : "";
        this.queryParams.searchEndDate = n != null ? n[1] : "";
      },
    },
  },
  computed: {
    pickerType() {
      const { searchDateType } = this.queryParams;
      if (searchDateType === 2) {
        return "monthrange";
      } else if (searchDateType === 4) {
        return "daterange";
      }
    },
    valueFormat() {
      const { searchDateType } = this.queryParams;
      if (searchDateType === 2) {
        return "yyyy-MM";
      } else if (searchDateType === 4) {
        return "yyyy-MM-dd";
      }
    },
    ...mapState(["user"]),
  },
};
</script>

<style lang="scss" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.click--active {
  color: #409eff;
  cursor: pointer;
}

.menu-box2 {
  display: flex;
  color: rgb(0, 121, 254);
}

.department-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
</style>
