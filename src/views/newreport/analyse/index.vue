<template>
  <!-- 这是销售业务分析页面 -->
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="" prop="timeType">
          <el-select v-model="timeType">
            <el-option label="按年统计" :value="1" />
            <el-option label="按月统计" :value="2" />
            <el-option label="按周统计" :value="3" />
            <el-option label="按日统计" :value="4" />
            <!-- <el-option label="按年统计" :value="3" /> -->
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="timeValueBegin">
          <el-date-picker
            v-if="timeType == 1"
            v-model="queryParams.timeValueBegin"
            value-format="yyyy"
            type="year"
            placeholder="开始年份"
            :editable="false"
            :clearable="false"
            
          >
          </el-date-picker>
          <el-date-picker
            v-if="timeType != 1 && timeType != 3"
            v-model="dateMonth"
            :type="pickerType"
            :value-format="valueFormat"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :editable="false"
            :clearable="false"
          />
        </el-form-item>
        <!-- 这是周的选择日期 -->
        <el-form-item label="" v-if="timeType == 3" prop="">
          <Chooseweek ref="Chooseweek" @sallBusiness="date"></Chooseweek>
        </el-form-item>

        <el-form-item label="" prop="timeValueEnd">
          <el-date-picker
            v-if="timeType == 1"
            v-model="queryParams.timeValueEnd"
            type="year"
            value-format="yyyy"
            placeholder="结束年份"
            :editable="false"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" prop="deptIds">
          <treeselect
            @input="treeselectinput"
            :flat="true"
            v-model="getTreeselectArr1"
            appendToBody
            style="margin-left: 10px; max-width: 400px"
            :multiple="true"
            :options="deptOptions"
            value-consists-of="ALL"
            :show-count="true"
            :clearable="false"
            placeholder="请选择归属部门"
          />
        </el-form-item>

        <el-form-item label="" prop="userId">
          <el-select
            @input="selectInput"
            style="width: 100%"
            v-model="queryParams.userId"
            filterable
            :clearable="true"
            placeholder="请输入关键字搜索用户"
            remote
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-loading="loading2" class="box-card" style="margin-top: 10px">
      <div>销售过程业务分布统计</div>
      <customerChart
        class="chart-box"
        :name="[
          '线索',
          '商机',
          '订单',
          '客户',
          '线索环比增长率',
          '商机环比增长率',
          '订单环比增长率',
          '客户环比增长率',
        ]"
        :initData="echartData1"
      />
    </el-card>

    <!-- 饼图 -->
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-card v-loading="loading1" style="margin-top: 10px">
          <div>数据来源占比</div>
          <pieChart :initData="echartData2" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-card v-loading="loading1" style="margin-top: 10px"
          ><div>部门线索占比分布</div>
          <pieChart :initData="echartData3" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-card v-loading="loading1" style="margin-top: 10px"
          ><div>跟进方式占比</div>
          <pieChart :initData="echartData4" />
        </el-card>
      </el-col>
    </el-row>

    <!-- <el-card style="margin-top: 20px">
      <div>关联产品销售数量及金额分布图</div>
      <treeChart v-loading="loading4" :initData="echartData5" />
    </el-card> -->

      <!-- 表格 -->
    <el-card style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span>业绩数据可视化 </span>
        </div>
        <!-- <el-button plain>导出数据</el-button> -->
      </div>
      <div>
        <el-table
          v-loading="loading3"
          :data="tableData"
          stripe
          style="width: 100%"
          border
        >
          <el-table-column prop="timeString" label="时间" align="center" />
          <el-table-column
            v-if="queryParams.deptId || queryParams.deptIds"
            prop="deptName"
            label="主体\部门"
            align="center"
          />
          <el-table-column
            v-if="queryParams.userId"
            prop="postName"
            label="职务"
            align="center"
          />
          <el-table-column
            v-if="queryParams.userId"
            prop="userName"
            label="姓名"
            align="center"
          />
          <el-table-column prop="clueCount" label="线索数量" align="center" />
          <el-table-column
            align="center"
            prop="clueIncreaseRate"
            label="线索环比增长率"
          >
            <template slot-scope="{ row }">
              {{ row.clueIncreaseRate }}%
            </template></el-table-column
          >
          <el-table-column
            align="center"
            prop="opportunityCount"
            label="转商机数量"
          >
            <template slot-scope="{ row }">
              {{ row.opportunityCount || "0" }}
            </template></el-table-column
          >

          <el-table-column
            align="center"
            prop="opportunityTransRate"
            label="转商机转化率"
          >
            <template slot-scope="{ row }">
              {{ row.opportunityTransRate || 0 }}%
            </template></el-table-column
          >
          <el-table-column
            align="center"
            prop="orderCount"
            label="转订单数量"
          />
          <el-table-column
            align="center"
            prop="orderTransRate"
            label="转订单转化率"
            ><template slot-scope="{ row }">
              {{ row.orderTransRate || 0 }}%
            </template></el-table-column
          >
          <el-table-column
            align="center"
            prop="customerCount"
            label="转客户数量"
          />
          <el-table-column
            align="center"
            prop="customerTransRate"
            label="转客户转化率"
            ><template slot-scope="{ row }">
              {{ row.customerTransRate || 0 }}%
            </template></el-table-column
          >
          <el-table-column
            align="center"
            prop="referralDealCount"
            label="转介绍成交数量"
          >
            <template slot-scope="{ row }">
              {{ row.referralDealCount || "0" }}
            </template></el-table-column
          >
          <el-table-column align="center" prop="clueQuality" label="线索质量" />
          <el-table-column
            align="center"
            prop="opportunityQuality"
            label="商机质量"
          />
          <el-table-column align="center" prop="followUpCount" label="跟进次数">
            <template slot-scope="{ row }">
              {{ row.followUpCount || "0" }}
            </template></el-table-column
          >
          <el-table-column
            align="center"
            prop="followUpContentCount"
            label="跟进内容量"
          >
            <template slot-scope="{ row }">
              {{ row.followUpContentCount || "0" }}
            </template></el-table-column
          >
          <el-table-column
            align="center"
            prop="followUpDensity"
            label="跟进密度"
          >
            <template slot-scope="{ row }">
              {{ row.followUpDensity || "0" }}
            </template></el-table-column
          >
          <el-table-column align="center" prop="avgMoney" label="详细分析">
            <template slot-scope="{ row }">
              <el-button type="primary" size="mini" @click="handleClick(row)"
                >钻取</el-button
              >
            </template></el-table-column
          >
        </el-table>
        <pagination
          v-show="total"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getSalesBusinessAnalysisList"
          :autoScroll="false"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Chooseweek from "@/components/Chooseweek/weeks1.vue";
import { getBusinessAddRank, getBusinessAddRankList } from "@/api/report/index";
import {
  getIndexPieChar,
  getIndexProjectMatrixChart,
  getSalesBusinessAnalysisChart,
  getSalesBusinessAnalysisList,
} from "@/api/newreport/analyse";
import customerChart from "newreport/chart/customer.vue";
import pieChart from "newreport/chart/pie.vue";
import treeChart from "newreport/chart/tree.vue";
export default {
  name: "",
  components: { Treeselect, customerChart, pieChart, treeChart, Chooseweek },
  data() {
    return {
      pickerType: "monthrange",
      valueFormat: "yyyy-MM",
      dateMonth: "",
      deptOptions: [],
      userList: [],
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      previousRouterName:'',
      queryParams: {
        userId: "",
        timeType: 1,
        timeValueBegin: "2022",
        timeValueEnd: "2023",
        pageNum: 1,
        pageSize: 10,
        deptIds: "",
      },
      timeType: 1,
      echartData1: [],
      echartData2: [],
      echartData3: [],
      echartData4: [],
      echartData5: [],
      tableData: [],
      total: 0,
      getTreeselectArr: [],
      getTreeselectArr1: [],
      storageData:[], // 存储返回的数据
      dateDatas1:'',
      dateDatas2:'',
    };
  },
  watch: {
    dateMonth: {
      handler(n) {
        this.queryParams.timeValueBegin = n != null ? n[0] : "";
        this.queryParams.timeValueEnd = n != null ? n[1] : "";
      },
    },
    timeType: {
      handler(n) {
        this.queryParams.timeType = this.timeType 
        if (n == 1) {
          this.dateMonth = ["2023", "2023"];
        } else if (n == 3) {
        }  else {
                    this.pickerType = n == 2 ? "monthrange" : "daterange";
                    this.valueFormat = n == 2 ? "yyyy-MM" : "yyyy-MM-dd";
                    if (n == 2) {
                 
                        if (this.dateDatas1 !=='') {
                        
                            this.dateMonth = 
                                [ this.dateDatas1,  this.dateDatas2];
                        } else {
                       
                            this.dateMonth = ["2023-01", "2023-01"]
                        }
                    } else {
                      if (this.dateDatas1 !=='') {
                       
                            this.dateMonth = 
                                [ this.dateDatas1,  this.dateDatas2];
                        } else {
                        
                            this.dateMonth = ["2023-01-01", "2023-01-01"]
                        }
                       
                    }

                }
      },
      deep: true,
    },
  },
 beforeRouteEnter(to,from,next){
  const that =this
  if(from.name!=='PerformanceData'){
       
    sessionStorage.setItem('storageDatas',null)

  }
  next()
    // if(from.name){}
 },
  created() {
    this.getTreeselect();
  },
  mounted() {
    if (this.timeType == 3) {
   
      this.$refs.Chooseweek.getMont(this.dateDatas1);
      
    }
  },
  methods: {
    date(value) {
      this.queryParams.timeValueBegin = value[0];
      this.queryParams.timeValueEnd = value[1];
    },
    treeselectinput(i) {
       
      if (i.length) {
        this.queryParams.deptIds = this.getTreeselectArr1.join(",");
        this.queryParams.userId = "";
      } else {
        if (!this.queryParams.userId) {
          this.getTreeselectArr1 = [this.deptOptions[0].id];
        }
      }
    },
    selectInput(i) {
      this.queryParams.userId = i;
      if (this.queryParams.userId) {
        this.queryParams.deptIds = undefined;
        this.getTreeselectArr1 = [];
      }
    },
    getList() {
      this.queryParams.deptIds = this.getTreeselectArr1.join(",");
      // 获取 首页 顶部 柱状图
      this.getSalesBusinessAnalysisChart();
      // 首页 中部 饼图
      this.getIndexPieChar();
      // 首页 中部 产品矩阵分布图
      this.getIndexProjectMatrixChart();
      // 首页 底部 统计图
      this.getSalesBusinessAnalysisList();
    },
    // 获取 首页 顶部 柱状图
    getSalesBusinessAnalysisChart() {
      this.loading2 = true;
      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.timeType =
        queryParams.timeType == 4 ? 3 : queryParams.timeType;
      getSalesBusinessAnalysisChart(queryParams).then((res) => {
        const {
          xaxis,
          clueCount,
          clueIncreaseRate,
          customerCount,
          customerIncreaseRate,
          opportunityCount,
          opportunityIncreaseRate,
          orderCount,
          orderIncreaseRate,
        } = res.data;

        // 数据处理
        const arr1 = [
          xaxis,
          clueCount,
          customerCount,
          opportunityCount,
          orderCount,
        ];
        const arr2 = [
          clueIncreaseRate,
          customerIncreaseRate,
          opportunityIncreaseRate,
          orderIncreaseRate,
        ];
        if (arr2[0].length < 14) {
          arr2.forEach((value, idx) => {
            value.forEach((item, index, array) => {
              array[index] = [
                index * 92.36 + 30 + idx * 10.6,
                arr1[idx + 1][index],
                `${Number(item)}%`,
              ];
            });
          });
        } else {
          arr2.forEach((value, idx) => {
            value.forEach((item, index, array) => {
              array[index] = [
                index * 97 + 20 + idx * 18,
                arr1[idx + 1][index],
                `${Number(item)}%`,
              ];
            });
          });
        }
        this.echartData1 = [...arr1, ...arr2];
        this.loading2 = false;
      });
    },
    // 首页 中部 饼图
    getIndexPieChar() {
      this.loading1 = true;
      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.timeType =
        queryParams.timeType == 4 ? 3 : queryParams.timeType;
      getIndexPieChar(queryParams).then((res) => {
        if (res.data.dataSourcePieChart && res.data.dataSourcePieChart.length) {
          this.echartData2 = res.data.dataSourcePieChart;
        } else {
          this.echartData2 = [{ name: "无", value: 0 }];
        }

        if (res.data.deptCluePieChart && res.data.deptCluePieChart.length) {
          this.echartData3 = res.data.deptCluePieChart;
        } else {
          this.echartData3 = [{ name: "无", value: 0 }];
        }

        if (
          res.data.followUpMethodPieChart &&
          res.data.followUpMethodPieChart.length
        ) {
          this.echartData4 = res.data.followUpMethodPieChart;
        
        } else {
          this.echartData4 = [{ name: "无", value: 0 }];
        }
        this.loading1 = false;
      });
    },
    // 首页 中部 产品矩阵分布图
    getIndexProjectMatrixChart() {
      this.loading4 = true;
      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.timeType =
        queryParams.timeType == 4 ? 3 : queryParams.timeType;
      getIndexProjectMatrixChart(queryParams).then((res) => {
        const {
          educationCenter,
          enterpriseServices,
          talentServices,
          vocationalTrainingServices,
        } = res.data;
        const totalValue1 = educationCenter.map((item) => item.count);
        const totalValue2 = enterpriseServices.map((item) => item.count);
        const totalValue3 = talentServices.map((item) => item.count);
        const totalValue4 = vocationalTrainingServices.map(
          (item) => item.count
        );
        this.echartData5 = [
          {
            name: "企业服务",
            value: 1,
            children: enterpriseServices.map((i) => ({
              name: i.name,
              value: [i.count, i.price],
            })),
          },
          {
            name: "职训服务",
            value: 1,
            children: vocationalTrainingServices.map((i) => ({
              name: i.name,
              value: [i.count, i.price],
            })),
          },
          {
            name: "人才服务",
            value: 1,
            children: talentServices.map((i) => ({
              name: i.name,
              value: [i.count, i.price],
            })),
          },
          {
            name: "教育中心",
            value: 1,
            children: educationCenter.map((i) => ({
              name: i.name,
              value: [i.count, i.price],
            })),
          },
        ];
        this.loading4 = false;
      });
    },
    // 首页 底部 统计图
    getSalesBusinessAnalysisList() {
      this.loading3 = true;
      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.timeType =
        queryParams.timeType == 4 ? 3 : queryParams.timeType;
      getSalesBusinessAnalysisList(queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading3 = false;
      });
    },
    /** 查询用户列表 */
    getUserList(deptId, e, isFocus = true) {
     
      listUser({
        pageNum: 1,
        pageSize: 10,
        userName: isFocus ? "" : e,
        deptId: deptId,
      }).then((response) => {
        this.userList = response.rows;
      });
    },

    /** 查询部门下拉树结构 */
    getTreeselect() {
    if(JSON.parse( sessionStorage.getItem('storageDatas')) !==null && JSON.parse( sessionStorage.getItem('storageDatas')).length!==0){
      this.storageData= JSON.parse( sessionStorage.getItem('storageDatas')) 
        this.queryParams=  this.storageData.pop()
        sessionStorage.setItem('storageDatas',JSON.stringify( this.storageData))
        this.timeType=this.queryParams.timeType
        this.dateDatas1=this.queryParams.timeValueBegin
        this.dateDatas2=this.queryParams.timeValueEnd
    }
     
      treeselect().then((response) => {
        this.deptOptions = response.data;
        this.getTreeselectArr1 = [this.deptOptions[0].id];
        this.getUserList(this.getTreeselectArr1[0]);
        this.getTreeselectList(this.deptOptions);
        this.getList();
      });
    
      
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      (this.queryParams = {
        userId: "",
        timeType: 1,
        timeValueBegin: "2022",
        timeValueEnd: "2023",
        pageNum: 1,
        pageSize: 10,
        deptIds: this.deptOptions[0].id,
      }),
   
        (this.getTreeselectArr1 = [this.deptOptions[0].id]);
      // this.resetForm("queryForm");
      this.timeType =1
      this.getList();
    },
    getTreeselectList1(children, dep) {
      var _this = this;
      if (this.getTreeselectArr1.length) {
        return;
      }
      children.forEach((element) => {
        if (dep == element.id) {
          this.getTreeselectArr1 = element.children.map((i) => {
            return i.id;
          });
    
          return;
        } else {
          _this.getTreeselectList1(element.children, dep);
        }
      });
    },
    getTreeselectList(deptOptions) {
      var _this = this;
      deptOptions.forEach((element) => {
        if (element.children) {
          _this.getTreeselectList(element.children);
        } else {
          this.getTreeselectArr.push(element.id);
        }
      });
    },
    // 钻石跳转
    handleClick(row) {
   
      this.storageData.push(this.queryParams)
      sessionStorage.setItem('storageDatas',JSON.stringify( this.storageData))

      this.getTreeselectArr1 = [];
      if (
        this.getTreeselectArr.some((i) => {
          return i == row.deptId;
        })
      ) {
        this.getTreeselectArr1[0] = row.deptId;
      } else {
        this.getTreeselectList1(this.deptOptions, row.deptId);
      }
      this.$router.push({
        name: "PerformanceData",
        query: {
          deptId: this.getTreeselectArr1.join(","),
          userId: row.userId,
          userName: row.userName,
          timeType: this.timeType,
          timeValueBegin: this.queryParams.timeValueBegin,
          timeValueEnd: this.queryParams.timeValueEnd,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.echart-box {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
  padding: 20px 100px;
}
.chart-box {
  flex: 60%;
}
.table-box {
  flex: 40%;
}
.tip p {
  font-size: 12px;
  line-height: 24px;
  color: rgb(153, 153, 153);
}
.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.vue-treeselect {
  margin-right: 10px;
}
::v-deep .vue-treeselect__control {
  width: 350px;
  min-height: 30px;
  line-height: 32px;
}
::v-deep .vue-treeselect__multi-value-item {
  height: 22px;
}
::v-deep .vue-treeselect__multi-value-item-container {
  height: 25px;
}

::v-deep .vue-treeselect__multi-value-item {
  display: block;
  line-height: 18px;
  height: 22px;
}

::v-deep .vue-treeselect__value-container {
  width: 400px;
  line-height: normal;
}
::v-deep .vue-treeselect__control-arrow-container {
  display: block;
  position: absolute;
  top: 2px;
  right: 8px;
  width: 12px;
  height: 30px;
  line-height: 32px;
}
</style>
