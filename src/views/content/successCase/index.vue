<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="合作项目" prop="project">
        <el-input
          v-model="queryParams.project"
          placeholder="请输入合作项目"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资质名称" prop="qualificationName">
        <el-input
          v-model="queryParams.qualificationName"
          placeholder="请输入资质名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司名称" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入公司名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          v-hasPermi="['core:successCase:query']"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery" v-hasPermi="['core:successCase:query']"
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
          v-hasPermi="['core:successCase:add']"
          >新增</el-button
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
          v-hasPermi="['core:successCase:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['core:successCase:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['core:successCase:import']"
          >导入
        </el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="caseList"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="id" align="center" prop="id" v-if="false" />
      <el-table-column label="公司名称" align="center" prop="companyName" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="合作项目" align="center" prop="project" />
      <el-table-column
        label="资质名称"
        align="center"
        prop="qualificationName"
      />
      <el-table-column
        label="资质类型"
        align="center"
        prop="qualificationType"
      />
      <el-table-column label="企业负责人" align="center" prop="principal" />
      <el-table-column
        label="最新合作日期"
        align="center"
        prop="latelyDate"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.latelyDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签约合同" align="center" prop="contractUrl">
        <template slot-scope="scope">
          <!-- <el-image
            v-if="scope.row.contractUrl != null"
            style="max-width: 40px; max-height: 40px"
            :src="scope.row.contractUrl"
            :preview-src-list="scope.row.contractUrl"
          >
          </el-image> -->

          <img
            style="max-width: 40px; max-height: 40px"
            :src="scope.row.contractUrl[0]"
            @click="seeImage(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="客户经理" align="center" prop="businessMan" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['core:successCase:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['core:successCase:remove']"
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

    <!-- 添加或修改成功案例对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="合作项目" prop="project">
          <el-input v-model="form.project" placeholder="请输入合作项目" />
        </el-form-item>
        <el-form-item label="资质名称" prop="qualificationName">
          <el-input
            v-model="form.qualificationName"
            placeholder="请输入资质名称"
            v-if="false"
          />

          <!-- 资质名称 标签输入 -->
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            >+ 新增</el-button
          >
          <!-- 资质名称 标签输入 -->
        </el-form-item>
        <el-form-item label="资质类型" prop="qualificationType">
          <el-input
            v-model="form.qualificationType"
            placeholder="请输入资质类型"
            v-if="false"
          />

          <!-- 资质类型 标签输入 -->
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags1"
            closable
            :disable-transitions="false"
            @close="handleClose1(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible1"
            v-model="inputValue1"
            ref="_saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm1"
            @blur="handleInputConfirm1"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput1"
            >+ 新增</el-button
          >
          <!-- 资质类型 标签输入 -->
        </el-form-item>
        <!-- <el-form-item>
          <div id="mapContainer" style="width: 100%; height: 300px"></div>
        </el-form-item> -->
        <el-form-item label="企业负责人" prop="principal">
          <el-input v-model="form.principal" placeholder="请输入企业负责人" />
        </el-form-item>
        <el-form-item
          label="最新合作日期"
          prop="latelyDate"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
          <el-date-picker
            clearable
            size="small"
            v-model="form.latelyDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择最新合作日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签约合同" prop="contractUrl">
          <!-- 上传单张 -->
          <!-- <el-upload
            class="avatar-uploader"
            action=""
            :http-request="uploadImg"
            :show-file-list="false"
            v-show="false"
          >
            <img
              v-if="form.contractUrl != null && form.contractUrl != ''"
              :src="form.contractUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload> -->
          <!-- 上传单张 -->

          <!-- 上传多张 -->
          <el-upload
            class="avatar-uploader"
            action=""
            :multiple="false"
            :file-list="fileList"
            :http-request="uploadImg"
            :show-file-list="true"
            list-type="picture-card"
            :limit="5"
            :auto-upload="true"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :on-exceed="handleExceed"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- 上传多张 -->
        </el-form-item>
        <el-form-item label="客户经理" prop="businessMan">
          <el-input v-model="form.businessMan" placeholder="请输入客户经理" />
        </el-form-item>
        <el-form-item label="详情" prop="detail">
          <EditorTow id="successCaseEditor" v-if="open" v-model="form.detail" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 人员导入对话框 -->
    <el-dialog
      :title="upload.title"
      :close-on-click-modal="false"
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
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" />
            是否更新已经存在的数据(重复数据)
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >下载模板
          </el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  </div>
</template>

<script>
import {
  listSuccessCase,
  getSuccessCase,
  delSuccessCase,  
  addSuccessCase,
  updateSuccessCase,
  exportSuccessCase,
  importTemplate,
} from "@/api/content/successCase";
import { fileUpload } from "@/api/upload/upload";
import EditorTow from "@/components/Tinymce";
import { getToken } from "@/utils/auth";

export default {
  name: "SuccessCase",
  components: { EditorTow },
  watch: {
    open(newValue) {
      if (newValue == false) {
        this.fileList = [];
      }
    },
  },
  data() {
    return {
      fileList: [],

      dynamicTags: [], // 资质名称
      inputVisible: false,
      inputValue: "",
      inputVisible1: false,
      inputValue1: "",
      dynamicTags1:[], // 资质类型

      // 用户导入参数
      upload: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { "Authorization": "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/core/successCase/importData",
      },
      // 截图比例
      rate: "1:1",
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
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
      // 成功案例表格数据
      caseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        project: undefined,
        qualificationName: undefined,
        qualificationType: undefined,
        address: undefined,
        lon: undefined,
        lat: undefined,
        companyName: undefined,
        principal: undefined,
        latelyDate: undefined,
        contractUrl: undefined,
        businessMan: undefined,
        businessManId: undefined,
        detail: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue && inputValue.trim().length) {
        this.dynamicTags.push(inputValue.trim());
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    handleClose1(tag) {
      this.dynamicTags1.splice(this.dynamicTags1.indexOf(tag), 1);
    },

    showInput1() {
      this.inputVisible1 = true;
      this.$nextTick((_) => {
        this.$refs._saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm1() {
      let inputValue = this.inputValue1;
      if (inputValue && inputValue.trim().length) {
        this.dynamicTags1.push(inputValue.trim());
      }
      this.inputVisible1 = false;
      this.inputValue1 = "";
    },
    // 查看图片
    seeImage(item) {
      this.$viewerApi({
        images: item.contractUrl,
      });
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.fileList = fileList;
    },
    handleChange(file, fileList) {
      console.log("handleChange", file, fileList);
      this.fileList = fileList.filter((item) => item.status === "success");
    },
    handleExceed(file, fileList) {
      console.log("handleExceed", file, fileList);
      this.$message.error("上传图片数量超出限制");
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "成功案例导入";
      this.upload.open = true;
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
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate(this.queryParams).then((response) => {
        const link = document.createElement("a");
        let blob = new Blob([response], {
          type: "application/vnd.ms-excel",
        });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.download = new Date().getTime() + "成功案例导入模板";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    /** 查询成功案例列表 */
    getList() {
      this.loading = true;
      listSuccessCase(this.queryParams).then((response) => {
        this.caseList = response.rows;
        this.caseList.forEach((item) => {
          item.contractUrl = item.contractUrl
            ? item.contractUrl.split(",")
            : [];
        });
        this.total = response.total;
        this.loading = false;
      });
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
        project: undefined,
        qualificationName: undefined,
        qualificationType: undefined,
        address: undefined,
        lon: undefined,
        lat: undefined,
        companyName: undefined,
        principal: undefined,
        latelyDate: undefined,
        contractUrl: undefined,
        businessMan: undefined,
        businessManId: undefined,
        detail: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加成功案例";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getSuccessCase(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改成功案例";
        if (this.form.contractUrl && this.form.contractUrl.length) {
          let arr = this.form.contractUrl.split(",");
          arr.forEach((item, index) => {
            this.fileList.push({
              name: index,
              url: item,
            });
          });
        }
        if (this.form.qualificationName && this.form.qualificationName.length) {
          this.dynamicTags = this.form.qualificationName.split(",");
        }
        if (this.form.qualificationType && this.form.qualificationType.length) {
          this.dynamicTags1 = this.form.qualificationType.split(",");
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        console.log("this.detail", this.detail);
        console.log('资质名称',this.dynamicTags)
        console.log('资质类型',this.dynamicTags1)
        console.log("文件列表", this.fileList);
        let url = "";
        this.fileList &&
          this.fileList.length &&
          this.fileList.forEach((item) => (url += `,${item.url}`));
        this.form.contractUrl = url.substr(1);
        this.form.qualificationName = this.dynamicTags.join(',');
        this.form.qualificationType = this.dynamicTags1.join(',');
        console.log("this.form", this.form);
        //  return
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateSuccessCase(this.form)
              .then((response) => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addSuccessCase(this.form)
              .then((response) => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除成功案例编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.loading = true;
          return delSuccessCase(ids);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportSuccessCase(queryParams);
        })
        .then((response) => {
          const link = document.createElement("a");
          let blob = new Blob([response], {
            type: "application/vnd.ms-excel",
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.download = new Date().getTime() + "成功案例";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    /** 图片上传 */
    uploadImg(file) {
      console.log("文件列表", this.fileList);
      fileUpload(file).then((res) => {
        if (res.code == 200) {
          // 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台
          this.fileList.push({ name: res.data.fileName, url: res.data.url });
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/upload.scss";
@import "@/assets/styles/dialog.scss";
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 120px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
