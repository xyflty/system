<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--项目数据-->
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
          @submit.native.prevent
        >
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="queryParams.projectName"
              placeholder="请输入项目名称"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
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
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['core:project:add']"
              >新增</el-button
            >
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['core:project:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['core:project:remove']"
              >删除</el-button
            >
          </el-col> -->
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['core:project:import']"
              >导入</el-button
            >
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['core:project:export']"
              >导出</el-button
            >
          </el-col> -->
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
            :columns="HSdata == 1 ? columns : HSdata == 2 ? columns1 : columns2"
          ></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="list"
          border
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="selection" width="50" align="center" /> -->
          <!-- <el-table-column
            label="项目编号"
            align="center"
            key="projectNumber"
            prop="projectNumber"
          /> -->
          <el-table-column
            v-if="
              columns[0].visible && columns1[0].visible && columns2[0].visible
            "
            label="项目名称"
            align="center"
            key="projectName"
            prop="projectName"
          />
          <el-table-column
            v-if="
              HSdata == 4 ||
              HSdata == 1 ||
              (columns[1].visible && columns2[1].visible)
            "
            label="最低限价"
            align="center"
            key="lowestQuotation"
            prop="lowestQuotation"
          />
          <el-table-column
            v-if="
              HSdata == 4 ||
              HSdata == 1 ||
              (columns[2].visible && columns2[2].visible)
            "
            label="指导单价"
            align="center"
            key="guidancePrice"
            prop="guidancePrice"
          />
          <el-table-column
            v-if="
              columns[3].visible && columns1[1].visible && columns2[3].visible
            "
            label="项目类型"
            align="center"
            key="projectType"
            prop="projectType"
          />
          <el-table-column
            label="提成"
            align="center"
            key="commission"
            prop="commission"
          />
          <el-table-column
            label="对接人"
            align="center"
            key="dockingPerson"
            prop="dockingPerson"
          />

          <el-table-column
            v-if="
              HSdata == 4 ||
              HSdata == 2 ||
              (columns1[2].visible && columns2[4].visible)
            "
            label="渠道最低限价"
            align="center"
            key="channelFloorPrice"
            prop="channelFloorPrice"
          />
          <el-table-column
            v-if="
              HSdata == 4 ||
              HSdata == 2 ||
              (columns1[3].visible && columns2[5].visible)
            "
            label="渠道指导价"
            align="center"
            key="channelGuidePrice"
            prop="channelGuidePrice"
          />
          <el-table-column
            v-if="
              HSdata == 4 ||
              HSdata == 2 ||
              (columns1[4].visible && columns2[6].visible)
            "
            label="经营部结算价"
            align="center"
            key="channelOperatingSettlementPrice"
            prop="channelOperatingSettlementPrice"
          />
          <el-table-column
            v-if="
              HSdata == 4 ||
              HSdata == 2 ||
              (columns1[5].visible && columns2[7].visible)
            "
            label="合作方结算价"
            align="center"
            key="channelPartnerSettlementPrice"
            prop="channelPartnerSettlementPrice"
          />
          <el-table-column
            v-if="
              HSdata == 4 ||
              HSdata == 2 ||
              (columns1[6].visible && columns2[8].visible)
            "
            label="同行合作价"
            align="center"
            key="channelPeerPartnerPrice"
            prop="channelPeerPartnerPrice"
          />

          <el-table-column
            v-if="
              columns[4].visible && columns1[7].visible && columns2[9].visible
            "
            label="产品规格"
            align="center"
            key="projectType"
            prop="projectType"
          />
          <el-table-column
            v-if="
              columns[5].visible && columns1[8].visible && columns2[10].visible
            "
            label="备注信息"
            align="center"
            key="remark"
            prop="remark"
            :show-overflow-tooltip="true"
          />

          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['core:project:edit']"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['core:project:remove']"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改项目配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="form.projectName"
            placeholder="请输入项目昵称"
            maxlength="30"
          />
        </el-form-item>
        <el-form-item label="归属分类" prop="categoryId">
          <treeselect
            v-model="form.categoryId"
            :options="deptOptions"
            :disableBranchNodes="true"
            :show-count="true"
            placeholder="请选择归属分类"
          />
        </el-form-item>
        <el-form-item label="提成" prop="commission">
          <el-input
            v-model="form.commission"
            placeholder="请输入提成"
            :controls="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="对接人" prop="dockingPerson">
          <el-input
            v-model="form.dockingPerson"
            placeholder="请输入对接人"
            :controls="false"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="HSdata == 4 || HSdata == 1"
          label="最低限价"
          prop="lowestQuotation"
        >
          <el-input-number
            v-model="form.lowestQuotation"
            placeholder="请输入最低限价"
            :controls="false"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          v-if="HSdata == 4 || HSdata == 1"
          label="指导价"
          prop="guidancePrice"
        >
          <el-input-number
            v-model="form.guidancePrice"
            placeholder="请输入指导价"
            :controls="false"
          ></el-input-number>
        </el-form-item>

        <el-form-item
          v-if="HSdata == 4 || HSdata == 2"
          label="渠道最低限价"
          prop="channelFloorPrice"
        >
          <el-input-number
            v-model="form.channelFloorPrice"
            placeholder="请输入渠道最低限价"
            :controls="false"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          v-if="HSdata == 4 || HSdata == 2"
          label="渠道指导价"
          prop="channelGuidePrice"
        >
          <el-input-number
            v-model="form.channelGuidePrice"
            placeholder="请输入渠道指导价"
            :controls="false"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          v-if="HSdata == 4 || HSdata == 2"
          label="经营部结算价"
          prop="channelOperatingSettlementPrice"
        >
          <el-input-number
            v-model="form.channelOperatingSettlementPrice"
            placeholder="请输入经营部结算价"
            :controls="false"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          v-if="HSdata == 4 || HSdata == 2"
          label="合作方结算价"
          prop="channelPartnerSettlementPrice"
        >
          <el-input-number
            v-model="form.channelPartnerSettlementPrice"
            placeholder="请输入合作方结算价"
            :controls="false"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          v-if="HSdata == 4 || HSdata == 2"
          label="同行合作价"
          prop="channelPeerPartnerPrice"
        >
          <el-input-number
            v-model="form.channelPeerPartnerPrice"
            placeholder="请输入同行合作价"
            :controls="false"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="产品规格" prop="ProductSpecification">
          <el-input
            v-model="form.ProductSpecification"
            placeholder="请输入产品规格"
            :controls="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目类型" prop="projectType">
          <el-input
            v-model="form.projectType"
            placeholder="请输入项目类型"
            :controls="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目编号" prop="projectNumber">
          <el-input
            v-model="form.projectNumber"
            placeholder="请输入项目编号"
            :controls="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属主体" prop="subject">
          <el-input
            v-model="form.subject"
            placeholder="请输入所属主体"
            :controls="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注信息"
            :controls="false"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 项目导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  list,
  add,
  update,
  del,
  getProject,
  importTemplate,
  getProjectpermission,
} from "@/api/core/project/index";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/core/project/category";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Project",
  dicts: ["sys_normal_disable", "sys_user_sex"],
  components: { Treeselect },
  data() {
    return {
      HSdata: 1,
      // 遮罩层
      loading: true,
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
      // 项目表格数据
      list: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {
        orderNum: 0,
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 项目导入参数
      upload: {
        // 是否显示弹出层（项目导入）
        open: false,
        // 弹出层标题（项目导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的项目数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/core/project/importData",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: undefined,
      },
      // 列信息
      columns: [
        { key: 0, label: `项目名称`, visible: true },
        { key: 1, label: `最低限价`, visible: true },
        { key: 2, label: `指导单价`, visible: true },
        { key: 3, label: `项目类型`, visible: true },
        { key: 4, label: `产品规格`, visible: true },
        { key: 5, label: `备注信息`, visible: true },
      ],
      columns1: [
        { key: 0, label: `项目名称`, visible: true },
        { key: 1, label: `项目类型`, visible: true },
        { key: 2, label: `渠道最低限价`, visible: true },
        { key: 3, label: `渠道指导价`, visible: true },
        { key: 4, label: `经营部结算价`, visible: true },
        { key: 5, label: `合作方结算价`, visible: true },
        { key: 6, label: `同行合作价`, visible: true },
        { key: 7, label: `产品规格`, visible: true },
        { key: 8, label: `备注信息`, visible: true },
      ],
      columns2: [
        { key: 0, label: `项目名称`, visible: true },
        { key: 1, label: `最低限价`, visible: true },
        { key: 2, label: `指导单价`, visible: true },
        { key: 3, label: `项目类型`, visible: true },
        { key: 5, label: `渠道最低限价`, visible: true },
        { key: 6, label: `渠道指导价`, visible: true },
        { key: 7, label: `经营部结算价`, visible: true },
        { key: 8, label: `合作方结算价`, visible: true },
        { key: 9, label: `同行合作价`, visible: true },
        { key: 10, label: `产品规格`, visible: true },
        { key: 11, label: `备注信息`, visible: true },
      ],
      // 表单校验
      rules: {
        projectName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
        categoryId: [
          { required: true, message: "项目所属主体不能为空", trigger: "blur" },
        ],
        lowestQuotation: [
          { required: true, message: "最低价格不能为空", trigger: "blur" },
        ],
        guidancePrice: [
          { required: true, message: "指导价不能为空", trigger: "blur" },
        ],
        channelFloorPrice: [
          { required: true, message: "渠道最低限价不能为空", trigger: "blur" },
        ],
        channelGuidePrice: [
          { required: true, message: "渠道指导价不能为空", trigger: "blur" },
        ],
        channelOperatingSettlementPrice: [
          { required: true, message: "经营部结算价不能为空", trigger: "blur" },
        ],
        channelPartnerSettlementPrice: [
          { required: true, message: "合作方结算价不能为空", trigger: "blur" },
        ],
        channelPeerPartnerPrice: [
          { required: true, message: "同行合作价不能为空", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getConfigKey("sys.user.initPassword").then((response) => {
      this.initPassword = response.msg;
    });

    getProjectpermission().then((res) => {
      this.HSdata = res.data;
    });
  },
  methods: {
    /** 查询项目列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then((response) => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
        console.log("部门", response);
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.categoryId = data.id;
      this.handleQuery();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        categoryId: undefined,
        projectName: undefined,
        lowestQuotation: undefined,
        guidancePrice: undefined,
        phonenumber: undefined,
        orderNum: 0,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      this.open = true;
      this.title = "添加项目";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();

      getProject(row.id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改项目";
      });
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            update(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            add(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除项目编号为"' + row.projectName + '"的数据项？')
        .then(function () {
          return del(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "core/project/export",
        {
          ...this.queryParams,
        },
        `project_${new Date().getTime()}.xlsx`
      );
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "项目导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        const link = document.createElement("a");
        let blob = new Blob([response], {
          type: "application/vnd.ms-excel",
        });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.download = new Date().getTime() + "项目导入模板";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
          response.msg +
          "</div>",
        "导入结果",
        { dangerouslyUseHTMLString: true }
      );
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/dialog.scss";
</style>
