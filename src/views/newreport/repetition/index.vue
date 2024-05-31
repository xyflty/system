// 销售重复对比分析
<template>
  <div class="app-container">
    <QueryCard
      :options="queryOptions"
      :search.sync="queryForm"
      @submit="handleQuery"
      @reset="resetQuery"
    />

    <template v-if="queryParams">
      <el-card v-loading="topLoading">
        <PagesTable
          title="数据概要"
          :options="pagesTableOptions.summary"
          :data="pagesData"
        />
        <div class="repetition">
          <div class="repetition_table">
            <h3>数据重复分布</h3>
            <div v-if="queryParams.type === 1">
              <template v-for="(item, key) in deptData">
                <PagesTable
                  :key="key"
                  :titleBorder="false"
                  :isAction="true"
                  :data="item"
                  :options="pagesTableOptions.repetition[key]"
                  @operate="operateEvent"
                />
              </template>
            </div>
            <div v-if="queryParams.type === 2">
              <PagesTable
                :key="Math.random()"
                :titleBorder="false"
                :data="deptData.dept"
                :options="pagesTableOptions.repetition.dept"
              />
            </div>
            <div v-if="queryParams.type === 3">
              <PagesTable
                :key="Math.random()"
                :titleBorder="false"
                :data="deptData.user"
                :options="pagesTableOptions.repetition.user"
              />
            </div>
          </div>

          <div class="repetition_pie">
            <h3>重复分类占比</h3>
            <Echarts
              :chartData="chartData"
              style="height: 400px"
              :isAxisChart="false"
            />
          </div>
        </div>
      </el-card>
      <!-- 按集团 -->
      <div class="box1" v-if="queryParams.type === 1">
        <template v-for="(repet, index) in repetitionData">
          <el-card :key="index">
            <PagesTable
              :title="repet.title"
              :api="repet.api"
              :isPagination="true"
              :isAction="true"
              :paginationAttrs="{
                pagerCount: 5,
                layout: 'total, prev, pager, next',
              }"
              :parmas="queryParams"
              :options="pagesTableOptions[`${repet.type}`]"
              @operate="operateEvent"
            />
          </el-card>
        </template>
      </div>
      <!-- 按部门 -->
      <div class="box2" v-if="queryParams.type === 2">
        <template v-for="(item, index) in deptRepeat">
          <el-card :key="`dept${index}`">
            <PagesTable
              :title="item.title"
              :api="item.api"
              :isPagination="true"
              :addColumns="true"
              :parmas="queryParams"
              :options="item.options"
              :dealData="dealData"
              btnsPosition="right"
            >
              <template #btns>
                <el-button
                  type="warning"
                  plain
                  icon="el-icon-download"
                  size="mini"
                  >导出</el-button
                >
              </template>
            </PagesTable>
          </el-card>
        </template>
      </div>
      <div class="box2" v-if="queryParams.type === 3">
        <template v-for="(item, index) in userRepeat">
          <el-card :key="`user${index}`">
            <PagesTable
              :title="item.title"
              :api="item.api"
              :isPagination="true"
              :parmas="queryParams"
              :options="item.options"
              :dealData="dealData"
              btnsPosition="right"
            >
              <!-- <template #btns>
                <el-button
                  type="warning"
                  plain
                  icon="el-icon-download"
                  size="mini"
                  >导出</el-button
                >
              </template> -->
            </PagesTable>
          </el-card>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import QueryCard from "./QueryCard.vue";
import PagesTable from "./PagesTable";
import Echarts from "@/components/Echarts";
import {
  getDataOverview,
  clueRepeatPageList,
  customerRepeatPageList,
  opportunityRepeatCompanyPageList,
  opportunityRepeatTitlePageList,
  getOpportunityPieChart,
  getDataRepeatDistribution,
} from "@/api/newreport/repetition";

import {
  queryType,
  cliqueOptions,
  deptOptions,
  deptPageOptions,
  pageOptions,
  userPageOptions,
} from "./options";
import { mapState } from "vuex";
export default {
  components: { QueryCard, PagesTable, Echarts },
  data() {
    return {
      // 头部加载状态
      topLoading: false,
      queryOptions: {
        filterDic: true,
        filterNull: true,
        labelWidth: 20,
        menuSpan: 4,

        submitText: "查询",
        emptyText: "重置",
        column: [],
      },
      queryForm: {
        type: 1,
        deptIds: [200, "1580402169644216321"],
        deptId: null,
        userId: null,
      },
      //   表格参数
      queryParams: null,
      // 页面表格的配置信息
      pagesTableOptions: pageOptions,
      // 页面数据
      pagesData: [],
      apiFn: null,

      // 重复数据

      chartData: {
        series: [
          {
            type: "pie",
            roseType: "radius",
            data: [],
          },
        ],
      },
      // 集团筛选
      repetitionData: [
        {
          title: "线索数据重复明细",
          api: clueRepeatPageList,
          type: "clue",
        },
        {
          title: "客户数据重叠明细",
          api: customerRepeatPageList,
          type: "customer",
        },
        {
          title: "商机-按企业重复明细",
          api: opportunityRepeatCompanyPageList,
          type: "opportunityCompany",
        },
        {
          title: "商机-按商机标题重复明细",
          api: opportunityRepeatTitlePageList,
          type: "opportunityCustomer",
        },
      ],
      // 部门筛选
      deptRepeat: [
        {
          title: "线索数据重复明细",
          api: clueRepeatPageList,
          type: "clue",
          options: deptPageOptions.clue,
        },
        {
          title: "商机-按商机标题重复明细",
          api: opportunityRepeatTitlePageList,
          type: "opportunityCustomer",
          options: deptPageOptions.opportunityCustomer,
        },
        {
          title: "商机-按企业重复明细",
          api: opportunityRepeatCompanyPageList,
          type: "opportunityCompany",
          options: deptPageOptions.opportunityCompany,
        },
        {
          title: "客户数据重叠明细",
          api: customerRepeatPageList,
          type: "customer",
          options: deptPageOptions.customer,
        },
      ],
      // 人员筛选
      userRepeat: [
        {
          title: "线索数据重复明细",
          api: clueRepeatPageList,
          type: "clue",
          options: userPageOptions.clue,
        },
        {
          title: "客户数据重叠明细",
          api: customerRepeatPageList,
          type: "customer",
          options: userPageOptions.customer,
        },
        {
          title: "商机-按企业重复明细",
          api: opportunityRepeatCompanyPageList,
          type: "opportunityCompany",
          options: userPageOptions.opportunityCompany,
        },
        {
          title: "商机-按商机标题重复明细",
          api: opportunityRepeatTitlePageList,
          type: "opportunityCustomer",
          options: userPageOptions.opportunityCustomer,
        },
      ],

      deptData: {
        dept2: [], //第二集团军
        dept1: [], //第一集团军
        dept: [], //按部门存储的重复数据
        user: [],
      },
    };
  },
  methods: {
    setOptions() {
      this.queryOptions.column = [
        {
          label: "",
          prop: "type",
          type: "select",
          dicData: queryType,
          span: 4,
          value: 1,
          clearable: false,
          change: ({ value, column, item, dic }) => {
            this.toggleType(value);
          },
        },
        {
          label: "",
          prop: "deptIds",
          type: "select",
          multiple: true,
          dicData: cliqueOptions,
          span: 6,
          display: false,
        },
        {
          label: "",
          prop: "deptId",
          type: "select",
          dicData: deptOptions,
          span: 6,
          display: false,
        },
        {
          label: "",
          prop: "userId",
          type: "select",
          filterable: true,
          dicData: this.commonData.userList,
          span: 6,
          display: false,
        },
      ];
    },

    // 切换数据分析类型
    toggleType(type) {
      let showProps = "deptIds";
      let formVal = [200, "1580402169644216321"];
      if (type === 1) {
        showProps = "deptIds";
        formVal = [200, "1580402169644216321"];
      } else if (type === 2) {
        showProps = "deptId";
        formVal = deptOptions[0].value;
      } else if (type === 3) {
        showProps = "userId";
        formVal = this.user.userId;
      }

      this.queryOptions.column.forEach((item) => {
        if (["deptIds", "deptId", "userId"].includes(item.prop)) {
          if (item.prop === showProps) {
            item.display = true;
          } else {
            item.display = false;
          }
        }
      });

      //   切换类型后，重置筛选表单数据
      this.queryForm = {
        type: type,
        deptIds: [],
        deptId: "",
        userId: "",
        [showProps]: formVal,
      };
    },
    // 查询
    handleQuery(form, done) {
      const { deptIds, deptId, userId } = form;
      if (!deptIds && !deptId && !userId) {
        done();
        return this.$message.error("请选择筛选条件");
      }

      this.queryParams = this.getParams();

      this.getData();
      done();
    },
    // 重置
    resetQuery() {
      this.queryForm = {
        type: 1,
        deptIds: [200, "1580402169644216321"],
        deptId: null,
        userId: null,
      };
      this.queryParams = this.getParams();

      this.getData();
    },

    // 表格操作事件
    operateEvent({ type, row }) {
      let routeName = "";
      let query = { id: row.id };
      if (type === "repeat") {
        // 数据重复钻取页面
        routeName = "RepeatDrill";
        query.id = row.deptId;
      } else {
        routeName = "RepeatDetail";
        query.type = type;
        query.companyName = row.companyName;
      }

      this.$router.push({
        name: routeName,
        query,
      });
    },

    getParams() {
      const { deptIds, deptId, type, userId } = this.queryForm;
      let sendParams = {
        ...this.queryForm,
        deptIds: null,
        deptId: null,
        userId: null,
      };

      if (type === 1) {
        sendParams.deptIds = (deptIds && deptIds.join(",")) || null;
      } else if (type === 2) {
        sendParams.deptIds = deptId;
      } else if (type === 3) {
        sendParams.userId = userId;
      }

      return sendParams;
    },

    async getTopData() {
      const sendParams = this.getParams();

      try {
        const res = await getDataOverview(sendParams);

        this.pagesData = [res.data];
        return true;
      } catch (error) {
        return false;
      }
    },
    // 获取图表数据
    async getPieChart() {
      let sendParams = this.getParams();
      const res = await getOpportunityPieChart(sendParams);

      this.chartData.series[0].data = res.data.map((item) => {
        return {
          name: item.rootCategoryName,
          value: item.categoryCount,
          categoryRate: item.categoryRate,
        };
      });

      return true;
    },
    // 获取重复数据
    async getDataRepeat() {
      let sendParams = this.getParams();
      const res = await getDataRepeatDistribution(sendParams);
      const { deptIds, type } = this.queryForm;
      let data = res.data;

      if (type === 2) {
        // 按部门
        this.deptData.dept = res.data[0];
      } else if (type === 3) {
        // 按个人
        this.deptData.user = res.data[0];
      } else {
        // 按集团
        if (deptIds && deptIds.length) {
          // 先清空
          this.deptData = {};
          deptIds.forEach((item, index) => {
            let prop = "dept2";
            if (item === 200) {
              prop = "dept2";
            } else {
              prop = "dept1";
            }
            this.deptData[`${prop}`] = data[index];
          });
        }
      }

      return true;
    },

    // 获取数据
    getData() {
      let promiseArr = [
        // 获取头部数据
        this.getTopData(),
        // 获取图表数据
        this.getPieChart(),
        // 重复数据分布
        this.getDataRepeat(),
      ];

      this.topLoading = true;
      Promise.all(promiseArr)
        .then((res) => {
          this.topLoading = false;
        })
        .catch((err) => {
          this.topLoading = false;
        });
    },
    // 处理表格方法
    dealData(data, props) {
      data.forEach((item) => {
        props.forEach((user) => {
          // 当前部门的人员
          item[user.userId] = 0;
        });

        if (item.userRepeatMap) {
          let obj = item.userRepeatMap;

          for (const key in obj) {
            item[key] = obj[key];
          }
        }
      });

      return data;
    },
  },
  mounted() {
    this.$store.dispatch("commonData/getUserList");
    // 表格参数赋值(使用queryform，接口对多次调用)
    this.queryParams = this.getParams();
    this.setOptions();
    this.getData();
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
    ...mapState(["user"]),
  },
};
</script>

<style lang='scss' scoped>
.el-card {
  margin-bottom: 15px;
}
.repetition {
  display: grid;
  grid-template-columns: 70% 30%;
  .pie {
    width: 100%;
  }
  .repetition_table {
    h3 {
      margin: 20px 0 0;
    }
  }
}

h3 {
  margin: 20px 0 20px 30px;
  font-size: 16px;
  font-weight: bold;
  color: rgb(96, 149, 255);
  display: flex;
  align-items: center;

  &::before {
    content: "";
    display: inline-block;
    width: 3px;
    height: 20px;
    background: rgb(96, 149, 255);
    border-radius: 5px;
    margin-right: 8px;
  }
}

.box1 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 15px;
  grid-column-gap: 15px;
}
</style>