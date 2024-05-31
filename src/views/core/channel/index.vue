<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryFormtop"
      :inline="true"
      label-width="68px"
    >
      <el-form-item prop="keyWords">
        <el-input
          v-model="queryParams.keyWords"
          placeholder="请输入关键词"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item prop="certificate">
        <!-- <el-input v-model="queryParams.certificate" autocomplete="off" /> -->
        <el-select
          v-model="queryParams.certificate"
          placeholder="请选择证书"
          clearable
        >
          <!-- <el-option
            v-for="item in $common.getDictType('channel_certificate')"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item prop="safetyCertificate">
        <!-- <el-input v-model="queryParams.safetyCertificate" autocomplete="off" /> -->
        <el-select
          v-model="queryParams.safetyCertificate"
          placeholder="请选择安证"
          clearable
        >
          <!-- <el-option
            v-for="item in $common.getDictType('channel_safety_certificate')"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item prop="upgrade">
        <!-- <el-input v-model="queryParams.upgrade" autocomplete="off" /> -->
        <el-select
          v-model="queryParams.upgrade"
          placeholder="请选择升级"
          clearable
        >
          <!-- <el-option
            v-for="item in $common.getDictType('channel_upgrade')"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> -->
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="NewRepairOpen(false)"
          plain
          icon="el-icon-plus"
          v-hasPermi="['core:channelCustomer:add']"
          size="mini"
          >新增
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="渠道基本信息">
        <el-table-column prop="companyName" label="公司全称" width="120" />
        <el-table-column prop="area" label="市区" width="100" />
        <el-table-column prop="onAccess" label="对接人" width="100" />
        <el-table-column prop="contactWay" label="联系方式" width="120" />
        <el-table-column prop="post" label="职务" width="100" />
        <!-- <template #default="scope">
                        <span>{{ $common.getDictLabel('channel_post', scope.row.post) }}</span>
                    </template>
                </el-table-column> -->

        <el-table-column prop="relatedCompanies" label="关联公司" width="120" />
        <el-table-column prop="customerLevel" label="客户等级" width="120" />
        <!-- <template #default="scope">
                        <span>{{ $common.getDictLabel('channel_customer_level', scope.row.customerLevel) }}</span>
                    </template>
                </el-table-column> -->
      </el-table-column>
      <el-table-column label="渠道项目">
        <el-table-column label="优势">
          <el-table-column
            prop="publicRelationArea"
            label="可公关地区"
            width="120"
          />
          <el-table-column
            prop="advantageProject"
            label="优势项目"
            width="100"
          />
        </el-table-column>
        <el-table-column prop="mainProject" label="主营项目" width="120" />
      </el-table-column>

      <el-table-column label="合作情况">
        <el-table-column label="合作项目（单价）">
          <el-table-column prop="certificate" label="证书" width="120">
            <!-- <template #default="scope">
              <span>{{
                $common.getDictLabel(
                  "channel_certificate",
                  scope.row.certificate
                )
              }}</span>
            </template> -->
          </el-table-column>
          <el-table-column prop="safetyCertificate" label="安证" width="100">
            <!-- <template #default="scope">
              <span>{{
                $common.getDictLabel(
                  "channel_safety_certificate",
                  scope.row.safetyCertificate
                )
              }}</span>
            </template> -->
          </el-table-column>
          <el-table-column prop="upgrade" label="升级" width="100">
            <!-- <template #default="scope">
              <span>{{
                $common.getDictLabel("channel_upgrade", scope.row.upgrade)
              }}</span>
            </template> -->
          </el-table-column>
        </el-table-column>
        <el-table-column prop="business" label="商机" width="120" />
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="marketer"
        label="市场人员"
        width="120"
      />
      <el-table-column
        fixed="right"
        prop="dataSource"
        label="数据来源"
        width="120"
      />
      <!-- <template #default="scope">
                    <span>{{ $common.getDictLabel('channel_data_source', scope.row.dataSource) }}</span>
                </template>
            </el-table-column> -->
      <el-table-column
        fixed="right"
        prop="dataAttribution"
        label="数据归属（众为/蚂蚁）"
        width="120"
      />
      <!-- <template #default="scope">
                    <span>{{ $common.getDictLabel('channel_data_attribution', scope.row.dataAttribution) }}</span>
                </template>
            </el-table-column> -->
      <el-table-column fixed="right" prop="remarks" label="备注" width="120" />
      <el-table-column fixed="right" label="操作" width="140">
        <template #default="scope">
          <el-button
            @click="NewRepairOpen(scope.row)"
            icon="ElIconEdit"
            type="text"
            v-hasPermi="['core:channelCustomer:edit']"
            >修改</el-button
          >
          <el-button
            @click="deleteFun(scope.row)"
            type="text"
            icon="ElIconDelete"
            v-hasPermi="['core:channelCustomer:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: flex-end">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <el-dialog :visible.sync="channelOpen" :title="channelName">
      <el-form :rules="rules" ref="refRules" label-width="100px" :model="form">
        <el-divider>渠道基本信息</el-divider>
        <el-row justify="space-between">
          <el-col :span="11">
            <el-form-item label="公司全称" prop="companyName">
              <el-input v-model="form.companyName" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="市区" prop="area">
              <el-input v-model="form.area" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="对接人" prop="onAccess">
              <el-input v-model="form.onAccess" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系方式" prop="contactWay">
              <el-input v-model="form.contactWay" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="职务" prop="post">
              <!-- <el-select v-model="form.post" placeholder="请选择">
                <el-option
                  v-for="item in $common.getDictType('channel_post')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select> -->
              <el-input v-model="form.post" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户等级" prop="customerLevel">
              <!-- <el-select v-model="form.customerLevel" placeholder="请选择">
                <el-option
                  v-for="item in $common.getDictType('channel_customer_level')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select> -->
              <el-input v-model="form.customerLevel" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="关联公司" prop="relatedCompanies">
              <el-input v-model="form.relatedCompanies" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider>渠道项目</el-divider>
        <el-row justify="space-between">
          <el-col :span="11">
            <el-form-item label="可公关地区" prop="publicRelationArea">
              <el-input v-model="form.publicRelationArea" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="优势项目" prop="advantageProject">
              <el-input v-model="form.advantageProject" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="主营项目" prop="mainProject">
              <el-input v-model="form.mainProject" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider>合作情况</el-divider>
        <el-row justify="space-between">
          <el-col :span="11">
            <el-form-item label="证书" prop="certificate">
              <!-- <el-input v-model="form.certificate" autocomplete="off" /> -->
              <el-select v-model="form.certificate" placeholder="请选择">
                <!-- <el-option
                  v-for="item in $common.getDictType('channel_certificate')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="安证" prop="safetyCertificate">
              <!-- <el-input v-model="form.safetyCertificate" autocomplete="off" /> -->
              <el-select v-model="form.safetyCertificate" placeholder="请选择">
                <!-- <el-option
                  v-for="item in $common.getDictType(
                    'channel_safety_certificate'
                  )"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="升级" prop="upgrade">
              <!-- <el-input v-model="form.upgrade" autocomplete="off" /> -->
              <el-select v-model="form.upgrade" placeholder="请选择">
                <!-- <el-option
                  v-for="item in $common.getDictType('channel_upgrade')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="商机" prop="business">
              <el-input v-model="form.business" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider>其它</el-divider>
        <el-row justify="space-between">
          <el-col :span="11">
            <el-form-item label="市场人员" prop="marketer">
              <el-input v-model="form.marketer" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="form.remarks" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="数据来源" prop="dataSource">
              <!-- <el-select v-model="form.dataSource" placeholder="请选择">
                                <el-option v-for="item in $common.getDictType('channel_data_source')" :key="item.value"
                                    :label="item.label" :value="item.value">
                                </el-option>
                            </el-select> -->
              <el-input v-model="form.dataSource" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="数据归属" prop="dataAttribution">
              <!-- <el-select v-model="form.dataAttribution" placeholder="请选择">
                                <el-option v-for="item in $common.getDictType('channel_data_attribution')"
                                    :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select> -->
              <el-input v-model="form.dataAttribution" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="channelOpen = false">关闭</el-button>
          <el-button @click="NewRepairMet()" type="primary">
            {{ channelName }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  channelCustomerList,
  channelCustomer,
  channelCustomerPut,
  delClue,
} from "@/api/core/channel";
export default {
  name: "channel",
  data() {
    return {
      // 表单列表数量
      total: 0,
      //   请求报单数据
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      //   表单数据
      tableData: [],
      //   新增修改显示隐藏
      channelOpen: false,
      // dialog title
      channelName: "新增",
      // 新增 修改数据
      form: {},
      //   验证
      rules: {
        companyName: [
          { required: true, message: "请输入公司全称", trigger: "blur" },
        ],
        area: [{ required: true, message: "市区", trigger: "blur" }],
        customerLevel: [
          { required: true, message: "请输入客户等级", trigger: "blur" },
        ],
        post: [{ required: true, message: "请输入职务", trigger: "blur" }],
        contactWay: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
        ],
        onAccess: [
          { required: true, message: "请输入对接人", trigger: "blur" },
        ],
        dataSource: [
          { required: true, message: "请输入数据来源", trigger: "blur" },
        ],
        dataAttribution: [
          { required: true, message: "请输入数据归属", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取表单数据
    getList() {
      channelCustomerList(this.queryParams).then((res) => {
        console.log(res);
        this.tableData = res.rows;
        this.value = res.total;
      });
    },
    // 查询
    handleQuery() {
      this.getList();
    },
    // 重置查询
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
      };
      this.getList();
    },
    // 新增/修改
    NewRepairOpen(row) {
      if (row) {
        this.channelName = "修改";
        this.form = row;
      } else {
        this.channelName = "新增";
        this.form = {};
      }
      this.channelOpen = true;
    },
    // dialog 新增/修改
    NewRepairMet() {
      this.$refs.refRules.validate((valid) => {
        if (valid) {
          // 新增
          if (this.channelName == "新增") {
            channelCustomer(this.form).then((res) => {
              if (res.code == 200) {
                this.$modal.msgSuccess("新增成功");
                this.channelOpen = false;
                this.getList();
              } else {
                this.$modal.msgError("失败");
              }
            });
          } else {
            // 修改
            channelCustomerPut(this.form).then((res) => {
              if (res.code == 200) {
                this.$modal.msgSuccess("新增成功");
                this.channelOpen = false;
                this.getList();
              } else {
                this.$modal.msgError("失败");
              }
            });
          }
        }
      });
    },
    // 删除按钮事件
    deleteFun(row) {
      delClue(row.id).then((res) => {
        this.getList();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>