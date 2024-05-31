<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="" prop="companyName">
        <el-input v-model="queryParams.companyName" placeholder="搜索企业名称" clearable />
      </el-form-item>
      <!-- <el-form-item label="" prop="contactName">
        <el-input
          v-model="queryParams.contactName"
          placeholder="搜索联系人名称"
          clearable
        />
      </el-form-item> -->

      <el-form-item label="" prop="followUpPersonIds">
        <el-select style="width: 100%" v-model="queryParams.followUpPersonIds" filterable clearable placeholder="跟进人员"
          remote :remote-method="getUserList" @focus="getUserList($event, true)">
          <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userId" />
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="deptId">
        <treeselect v-model="queryParams.deptId" appendToBody style="margin-left: 10px; max-width: 200px"
          :options="deptOptions" value-consists-of="LEAF_PRIORITY" :show-count="true" placeholder="请选择归属部门" />
      </el-form-item>

      <el-form-item label="" prop="businessType">
        <el-select v-model="queryParams.businessType" :clearable="true" placeholder="数据类型">
          <el-option v-for="item in dataType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="dataSource">
        <el-select v-model="queryParams.dataSource" :clearable="true" placeholder="数据来源">
          <el-option v-for="dataSource in commonData.dataSourceList" :key="dataSource.value" :label="dataSource.label"
            :value="dataSource.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="lastFollowUpTime">
        <el-date-picker clearable v-model="queryParams.lastFollowUpTime" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择最后跟进时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>


    <div v-loading="loading" v-if="showDate" class="description-box">
      <span class="description-text">请按照条件查询相关内容</span>
    </div>
    <el-table v-if="showList" v-loading="loading" :data="List" border @sort-change="sortChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="企业名称" align="center" prop="companyName" sortable="custom" />
      <el-table-column label="数据类型" align="center" prop="businessType">
        <template slot-scope="{ row }">
          <span>{{
            getLabel(commonData.businessTypeList, row.businessType)
          }}</span>
        </template>
      </el-table-column>
      <!-- <template slot-scope="{ row }">
          <span
            class="ableClick"
            @click="
              $router.push({ name: 'Customer/detail', query: { id: row.id } })
            "
            >{{ row.companyName }}</span
          >
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="联系人名称" align="center" prop="contactName" /> -->
      <el-table-column label="跟进人员" align="center" prop="userName" />

      <el-table-column label="最后跟进时间" align="center" prop="lastFollowUpTime" width="180" sortable="custom" />
      <el-table-column label="未跟进天数" align="center" prop="unFollowUpDays" width="180" sortable="custom" />
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
import { queryCustomer } from "@/api/core/customer";
import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapState } from "vuex";

export default {
  name: "CustomerQuery",
  components: { Treeselect },
  data() {
    return {
      deptOptions: [],
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 线索记录表格数据
      List: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: undefined, // 公司名称
        contactName: undefined, // 联系人
        dataSource: undefined, // 数据来源
        lastFollowUpTime: undefined, // 最后跟进  2022-08-04
      },

      // 1线索 2挖需 3商机  5客户
      dataType: [
        { label: "线索", value: 1 },
        // { label: "挖需", value: 2 },
        { label: "商机", value: 3 },
        { label: "客户", value: 5 },
      ],
      userList: [],
      showDate: true, // 根据条件展示文字
      showList: false, // 根据条件展示表格
    };
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // console.log(vm);
      // vm.getList();

    });
  },

  created() {
    // this.getList();
    this.getTreeselect();
  },
  methods: {
    // 排序改变
    sortChange({ column, prop, order }) {
      console.log(column, prop, order);
      this.queryParams.orderBy = prop;
      this.queryParams.orderType = order === "descending" ? "desc" : "asc";
      this.getList();
    },

    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    /** 查询线索记录列表 */
    getList() {
      this.loading = true;
      queryCustomer(this.queryParams).then((response) => {
        this.List = response.rows;
        this.total = response.total;
        this.loading = false;

      });

    },
    /** 查询用户列表 */
    getUserList(e, isFocus) {
      listUser({
        pageNum: 1,
        pageSize: 10,
        userName: isFocus ? "" : e,
      }).then((response) => {
        console.log(response);
        this.userList = response.rows;

      });
    },

    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        clueStatus: 0,
        companyName: undefined,
        legalPerson: undefined,
        safetyPermitsTime: undefined,
        dataSource: 0,
        contaceName: undefined,
        gender: 0,
        role: 0,
        position: undefined,
        cellphone: undefined,
        telephone: undefined,
        fax: undefined,
        email: undefined,
        tencentWx: undefined,
        tencentQq: undefined,
        hobby: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
      this.showDate = false
      this.showList = true
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.loading = true
      this.showDate = true
      this.showList = false
      this.queryParams= {
        pageNum: 1,
        pageSize: 10,
        companyName: undefined, // 公司名称
        contactName: undefined, // 联系人
        dataSource: undefined, // 数据来源
        lastFollowUpTime: undefined, // 最后跟进  2022-08-04
      };
      this.List = []
      this.total = 0
      clearTimeout(timer)
    
      let timer = setTimeout(() => {
        this.loading = false
      }, 400);
    
     
      // this.resetForm("queryForm");
      // this.handleQuery();
    },
  },
};
</script>
<style scoped>
.ableClick {
  color: rgb(0, 121, 254);
  cursor: pointer;
}

/* 描述文字的盒子 */
.description-box {
  margin: 0 auto;
  width: 400px;
}

/* 描述文字文本 */
.description-text {
  margin: 0 auto;
  color: rgba(167, 165, 165, 0.568);
  font-size: 36px;
}
</style>
