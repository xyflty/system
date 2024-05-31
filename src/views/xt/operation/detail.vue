<template>
  <div class="detail-warp">
    <DetailPage
      v-if="detailData"
      :title="detailData.orderJob.projectName"
      :tabs="tabs"
      :nodeData="nodeData"
      :flowData="flowData"
      :active="active"
      mode="show"
      @togggle="handleTogggle"
    >
      <template #nodeStatus>
        <el-button size="mini" type="primary" @click="nodeDetailStatus"
          >详情工单节点动态</el-button
        >
      </template>

      <template #content>
        <TimeLine
          v-if="pageMode === 'job'"
          mode="edit"
          :timelineList="timelineList.firstNodeList"
          :disabledBtns="timelineList"
          reverse
          :value="timeLineNames"
          @click="handleClick"
          @preview="handlePreview"
        ></TimeLine>
        <div v-else>
          <TabsPublic
            v-if="pageData"
            :config="cloneConfigData"
            :allData="pageData"
            isShowUpdateOrder
            isShowBorrowMoney
            mode="show"
            :pageMode="pageMode"
          ></TabsPublic>
        </div>
      </template>
    </DetailPage>
    <!-- 开始和结束 -->
    <el-dialog
      :title="
        nodeStatusMode === 'start'
          ? '开始节点作业确认提示'
          : '节点作业完成确认提示'
      "
      :visible.sync="visible"
      width="30%"
    >
      <div v-if="nodeStatusMode === 'start'" class="dialog-box">
        <div class="tip">请确认开始本阶段的节点作业？</div>
        <div class="desc">是否确认开启本阶段的节点作业？</div>
      </div>
      <div v-else class="dialog-box">
        <div class="tip">本工单节点作业完成</div>
        <div class="desc">是否确认本工单节点作业完成？</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="nodeSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 确定收款 -->
    <el-dialog
      title="发起收款确认"
      :visible.sync="collectionVisible"
      width="40%"
    >
      <el-form
        :model="collectionForm"
        ref="collectionFormRef"
        label-width="120px"
        class="demo-ruleForm"
        @close="collectionCancel"
      >
        <el-form-item label="工单作业阶段：" prop="name">
          <el-input v-model="collectionForm.nodeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="收款阶段：" prop="stage">
          <el-input v-model="collectionForm.moneyTag" disabled></el-input>
        </el-form-item>
        <el-form-item label="收款金额：" prop="price">
          <el-input v-model="collectionForm.actualPrice" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="collectionCancel">取 消</el-button>
        <el-button type="primary" @click="collectionSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 作业信息 -->
    <el-dialog
      title="填入作业信息"
      :visible.sync="jobVisible"
      width="40%"
      @close="jobCancel"
    >
      <el-form
        :model="jobForm"
        :rules="jobRules"
        ref="jobFormRef"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="作业信息：" prop="content">
          <el-input
            type="textarea"
            placeholder="请填入作业信息"
            :rows="6"
            maxlength="1000"
            show-word-limit
            v-model="jobForm.content"
          ></el-input>
        </el-form-item>
        <el-form-item label="文件上传：" prop="fileUrl">
          <el-upload
            class="upload-demo"
            ref="uploadRef1"
            action="#"
            :limit="1"
            :before-upload="beforeUpload"
            :http-request="(option) => uploadCallback(option, 'fileUrl')"
          >
            <el-button size="small" type="primary">选择附件</el-button>
            <div slot="tip" class="el-upload__tip">
              支持格式：.xml.doc .docx .pdf ，单个文件不能超过20MB
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片上传：" prop="imgUrl">
          <el-upload
            class="upload-demo"
            action="#"
            ref="uploadRef2"
            :limit="1"
            :before-upload="handleBeforeUpload"
            :http-request="(option) => uploadCallback(option, 'imgUrl')"
          >
            <div class="upload-img">
              <div v-if="imgUrl">
                <el-image
                  style="width: 120px; height: 120px"
                  :src="imgUrl"
                  fit="fit"
                ></el-image>
              </div>
              <div v-else>
                <i class="el-icon-plus"></i>
                <span>上传图片</span>
              </div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="服务顾问(审)：" prop="receive_user_id">
          <el-select v-model="jobForm.receive_user_id">
            <el-option
              v-for="item in commonData.userList"
              :key="item.value"
              v-bind="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jobCancel">取 消</el-button>
        <el-button type="primary" @click="jobSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 工单信息补充 -->
    <el-dialog
      title="工单信息补充"
      :visible.sync="replenishVisible"
      @close="replenishClose"
    >
      <MyForm :formOptions="formOptions" label-width="150px">
        <template #formAction="{ form, model }">
          <el-button @click="replenishCancel(form, model)">取 消</el-button>
          <el-button type="primary" @click="replenishSubmit(form, model)"
            >确 定</el-button
          >
        </template>
      </MyForm>
    </el-dialog>
    <!-- 财务收款确认弹出框 -->
    <FinancialCollection
      title="收款确认"
      :visible.sync="financialVisible"
      :form="financialForm"
      @confirm="financialConfirm"
      @cancel="financialCancel"
    ></FinancialCollection>
    <el-dialog
      title="文件预览"
      class="previewDialog"
      :visible.sync="previewDialog"
      width="1240px"
    >
      <files-view :url="previewUrl"></files-view>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewDown">下载</el-button>
        <el-button @click="previewDialog = false">取 消</el-button>
        <el-button type="primary" @click="previewDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 资质工单接口详情导入
import {
  xtOrderJobCenter,
  synergyNodeQueryProcess,
  synergyNodeHandleFillInfo,
  synergyNodeHandleStart,
  synergyNodeHandleFinish,
  synergyNodeHandleLaunchMoney,
  synergyNodeGetOrderJobAllProcessNodePreview,
  synergyNodeGetOrderJobProcessNodePreview,
  synergyNodeHandleOrderJobInfoButton,
  synergyNodeGetFinancialConfirmMoneyInfo,
  synergyNodeHandleConfirmMoneyButton,
} from "@/api/workOrderOperation";
import { fileUpload } from "@/api/upload/upload";

// 组件
import DetailPage from "@/components/DetailPage";
import TimeLine from "@/components/TimeLine";
import MyForm from "@/components/MyForm";
// 公共组件
import TabsPublic from "@/components/TabsPublic";
import FinancialCollection from "./components/FinancialCollection";
import FilesView from "@/components/FilesView";

// 配置信息
import { configData } from "./configData";
import {
  processingData,
  replenishProps,
} from "@/mixins/configData/processingData";
import { getPagesCategoryType } from "@/utils/common";
import { downFile } from "@/utils/previewAndDownload";
// 获取文件类型
import { getType } from "@/utils/previewAndDownload";

import { mapState } from "vuex";
export default {
  components: {
    DetailPage,
    TabsPublic,
    TimeLine,
    MyForm,
    FinancialCollection,
    FilesView,
  },
  data() {
    return {
      // 节点动态数据
      nodeData: [],
      flowData: {},
      tabs: [
        {
          value: 1,
          label: "基本信息",
        },
        {
          value: 2,

          label: "工单作业",
        },
        {
          value: 3,

          label: "资料文件",
        },
        {
          value: 4,

          label: "三库一平台账号密码",
        },
      ],
      active: 1,
      detailData: null,
      detailId: "", // 工单id
      pagesId: "",
      pagesType: "", //当前页面是那个分类下的详情
      cloneConfigData: null,
      allData: {
        base: {},
        attachment: {},
        account: {},
      },
      pageMode: "base",
      pageData: null,
      // 树形数据结构
      timelineList: {},
      timeLineNames: [], //选中展开的数据

      visible: false,
      nodeStatusMode: "",

      //   提前收款
      collectionVisible: false,
      collectionForm: {
        nodeName: "",
        moneyTag: "",
        actualPrice: "",
      },

      //   作业信息
      jobVisible: false,
      jobForm: {
        firstNodeId: "",
        content: "",
        fileUrl: "",
        imgUrl: "",
        receive_user_id: "",
      },
      jobRules: {
        content: [
          { required: true, message: "请输入作业信息", trigger: "blur" },
        ],
      },
      nodeDetail: null, //存储当前点击节点信息
      fileNameObj: {}, //存储上传的文件名

      // 工单补充
      replenishVisible: false,
      formOptions: [],
      // 财务确认收款
      financialVisible: false,
      financialForm: {},
      imgUrl: "",
      // 文件预览
      previewDialog: false,
      previewUrl: "", //文件地址
      previewFileName: "", //文件名称

      type: "",
      firstNodeId: "", //当前节点的id
    };
  },
  methods: {
    // 获取传递的参数
    initFun() {
      this.detailId = this.$route.query.id;

      this.pagesId = this.$route.query.pagesId;
      this.projectId = this.$route.query.projectId;
      this.pagesType = getPagesCategoryType(this.pagesId);
    },
    initConfig(key) {
      switch (key) {
        case "基本信息":
          this.pageMode = "base";

          this.cloneConfigData = configData[this.pageMode][this.pagesType];

          break;
        case "工单作业":
          this.pageMode = "job";
          this.cloneConfigData = {};
          break;
        case "资料文件":
          this.pageMode = "attachment";
          this.cloneConfigData = configData[this.pageMode];
          break;
        case "三库一平台账号密码":
          this.pageMode = "account";
          this.cloneConfigData = {};
          break;
      }
      this.cloneConfigData.processing =
        processingData[this.pagesType].processing;
    },

    // 生成数据结构
    generateData(data, key) {
      switch (key) {
        case "base":
          this.allData[key].descData = {
            ...data.zwOrderVo,

            ...data.orderJob,
            ...data.projectBasicInfo,
          }; //基础信息
          this.allData[key].remark = ""; //备注
          this.allData[key].projectData = data.orderProjectList; //项目数据
          this.allData[key].financeData = data.xtMoneyNodeList; //财务信息
          this.allData[key].processingData =
            {
              ...data.projectMainInfo,
              auditUserName: data.orderJob.auditUserName,
              makeUserName: data.orderJob.makeUserName,
            } || {}; //当前页面数据
          if (this.pagesType === "talents") {
            //人才详情基础信息才显示人才需求
            this.allData[key].talentData = data.xtTalentDemandInfos;
          }
          this.allData[key].addOrSubOrderInfo =
            data.xtOrderProjectChangeRecordList; //项目变更数据

          break;
        case "attachment":
          let accessoryData = data.resourceAnnexList.filter(
            (item) => item.annexType === 1
          );
          let jobData = data.resourceAnnexList.filter(
            (item) => item.annexType === 2
          );
          this.allData[key].accessoryData = accessoryData; //附件数据
          this.allData[key].jobData = jobData; //附件数据
          break;
        case "account":
          this.allData[key].accountInfoData = data.zwCustomerAccount; //账号信息
          break;
      }

      if (this.pageMode !== "job") {
        this.pageData = this.allData[this.pageMode];
      }

      if (this.pagesType === "certification") {
        // 资质需要判断多种情况
        let projectNature = this.allData["base"].descData.projectNature;
        if (projectNature === "新申请" || projectNature === "增项") {
          this.cloneConfigData.processing =
            processingData[this.pagesType].processing.add;
        } else if (projectNature === "整转") {
          this.cloneConfigData.processing =
            processingData[this.pagesType].processing.full;
        } else {
          this.cloneConfigData.processing =
            processingData[this.pagesType].processing.part;
        }
      }
    },
    getDetail() {
      if (this.pageMode === "job") {
        // 工单作业
        this.getSynergyNodeQueryProcess();
      } else {
        this.getXtOrderJob();
      }
    },
    // 获取基础信息
    getXtOrderJob() {
      let sendData = {
        id: this.detailId,
        projectId: this.projectId,
        projectCategory: this.pagesId,
      };

      xtOrderJobCenter(sendData).then((res) => {
        if (res.code === 200) {
          this.detailData = res.data;

          this.generateData(res.data, "base");
          if (this.pageMode === "attachment" || this.pageMode === "account") {
            this.generateData(res.data, this.pageMode);
          }
          if (this.type && this.pageMode === "job") {
            this.getSynergyNodeQueryProcess();
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 获取工单作业的树型数据
    getSynergyNodeQueryProcess() {
      let sendParams = {
        orderJobId: this.detailId,
      };
      synergyNodeQueryProcess(sendParams).then((res) => {
        this.timelineList = res.data;
        let rowItem = this.timelineList.firstNodeList.find(
          (item) => item.showButtonFlag
        );
        this.timeLineNames = rowItem ? rowItem.name : [];
        this.generateData(res.data, this.pageMode);
      });
    },
    // 切换当前节点
    handleTogggle(row) {
      this.pageData = null;
      this.active = row.value;
      this.initConfig(row.label);

      this.getDetail();
    },

    // 工单作业的方法操作start
    // 生成补充信息的表单配置信息
    generaterePlenishOptions() {
      let comparison = this.cloneConfigData.processing.comparison.map(
        (item) => item.prop
      );
      replenishProps.forEach((item) => {
        if (comparison.includes(item.prop)) {
          this.formOptions.push(item);
        }
      });
    },
    // 树形按钮操作
    handleClick({ type, row }) {
      this.firstNodeId = row.firstNodeId;
      if (type === "start") {
        // 开始节点
        this.nodeStatusMode = "start";
        this.visible = true;
      } else if (type === "end") {
        // 结束节点
        this.nodeStatusMode = "end";
        this.visible = true;
      } else if (type === "money") {
        this.collectionVisible = true;
        this.collectionForm = {
          nodeName: row.name,
          moneyTag: row.moneyTag,
          actualPrice: row.planPrice,
        };
      } else if (type === "job") {
        // 作业信息
        this.jobVisible = true;
        this.jobForm.firstNodeId = row.firstNodeId;
      } else if (type === "replenish") {
        // 工单补充
        this.generaterePlenishOptions();
        this.replenishVisible = true;
      } else if (type === "receipt") {
        this.getFinancialConfirmMoneyInfo();
      }
      this.nodeDetail = row;
    },
    // 获取财务收款确认信息
    getFinancialConfirmMoneyInfo() {
      let sendData = {
        orderJobId: this.detailId,
      };
      synergyNodeGetFinancialConfirmMoneyInfo(sendData).then((res) => {
        if (res.code === 200) {
          let moneyNodeList = res.data.moneyNodeList.map((item) => {
            return {
              ...item,
              rowEdit: item.editFlag,
            };
          });
          this.financialVisible = true;
          this.$nextTick(() => {
            const { orderJob } = this.detailData;
            this.financialForm = {
              ...res.data,
              moneyNodeList,
              launchPerson: this.findUserName(orderJob.launchUserId),
              handlePerson: orderJob.financeAdvisor,
            };
            console.log(this.financialForm);
          });
        }
      });
    },
    // 查询用户名称
    findUserName(userId) {
      let userList = this.commonData.userList;
      if (userList && userList.length) {
        const row = userList.find((item) => item.value == userId);
        console.log(row);
        return (row && row.label) || "";
      }
      return "";
    },

    // 上传之前对文件进行校验
    beforeUpload(rawFile) {
      let fileType = [
        ".jpg",
        ".png",
        ".JPG",
        ".PNG",
        ".pdf",
        ".PDF",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
        ".ppt",
        ".txt",
        ".zip",
        ".rar",
      ];
      const type = rawFile.name.substring(rawFile.name.lastIndexOf("."));

      const isImage = fileType.indexOf(type) > -1;
      let imgSize = Number(rawFile.size / 1024 / 1024);
      if (!isImage) {
        this.$message.error("上传文件只能是 以.xml,.doc,.docx,.pdf 格式!");
        return false;
      }
      if (imgSize > 20) {
        this.$message.error("上传头像图片大小不能超过 20MB!");
        return false;
      }
    },

    // 判断上传的是否为图片
    handleBeforeUpload(file) {
      var img = file.name.substring(file.name.lastIndexOf(".") + 1);

      let fileType = ["jpg", "png", "jpeg"];
      const isLt1M = file.size / 1024 / 1024 < 5;
      if (!fileType.includes(img)) {
        this.$message.error("只能上传图片！");
        return false;
      }
      // 可以限制图片的大小
      if (!isLt1M) {
        this.$message.error("上传图片大小不能超过 5MB!");
        return false;
      }
    },
    // 上传的回调函数
    uploadCallback(option, prop) {
      if (prop === "fileUrl") {
        this.fileNameObj.fileName = option.file.name;
        let imgSize = Number(option.file.size / 1024); // kb
        this.fileNameObj.fileSize = imgSize.toFixed(2) + "KB";
      }

      fileUpload(option).then((res) => {
        if (res.code === 200) {
          this.jobForm[prop] = res.data.url;

          if (prop === "imgUrl") {
            this.imgUrl = res.data.url;
          } else {
            this.fileNameObj.fileSuffix = getType(res.data.url);
          }
          this.$message.success("上传成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 开始和结束节点
    nodeSubmit() {
      let loading = null;
      let sendParams = {
        firstNodeId: this.nodeDetail.firstNodeId,
        orderJobId: this.detailId,
      };
      let fn = "";
      if (this.nodeStatusMode === "start") {
        // 开始节点
        fn = synergyNodeHandleStart;
      } else if (this.nodeStatusMode === "end") {
        // 开启加载
        loading = this.$loading({
          lock: true,
          text: "数据正在保存中，请稍等...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        // 结束节点
        fn = synergyNodeHandleFinish;
      }
      fn(sendParams)
        .then((res) => {
          if (res.code === 200) {
            this.getDetail();
            this.getAllNodeStatus();
            this.getNodeStatus();

            this.visible = false;
            this.$message.success("操作成功");
            loading && loading.close(); //结束时取消加载
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.visible = false;
          loading && loading.close(); //结束时取消加载
        });
    },
    // 作业信息取消
    jobCancel() {
      this.jobVisible = false;
      this.imgUrl = "";
      this.$refs.jobFormRef.resetFields();
      this.fileNameObj = {};
      this.$refs.uploadRef1.clearFiles();
      this.$refs.uploadRef2.clearFiles();
    },
    // 作业信息提交
    jobSubmit() {
      this.$refs.jobFormRef.validate((valid) => {
        if (valid) {
          let sendParams = {
            orderJobId: this.detailId,
            ...this.fileNameObj,
            ...this.jobForm,
          };

          synergyNodeHandleFillInfo(sendParams).then((res) => {
            if (res.code === 200) {
              this.jobCancel();
              this.getDetail(); // 重新获取数据
              this.getAllNodeStatus();
              this.getNodeStatus();
              this.$message.success("操作成功");
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.error("请填写必填信息");
        }
      });
    },
    //取消收款作业员
    collectionCancel() {
      this.collectionVisible = false;
      this.$refs.collectionFormRef.resetFields();
    },
    // 确认收款作业员提交
    collectionSubmit() {
      let sendParams = {
        orderJobId: this.detailId,
      };
      synergyNodeHandleLaunchMoney(sendParams).then((res) => {
        if (res.code === 200) {
          this.getDetail();
          this.getAllNodeStatus();
          this.getNodeStatus();
          this.collectionCancel();
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    replenishCancel(form, model) {
      this.replenishVisible = false;
      form.resetFields();
      this.formOptions = [];
      this.firstNodeId = "";
    },
    replenishClose() {
      this.formOptions = [];
    },
    replenishSubmit(form, model) {
      let sendParams = {
        firstNodeId: this.firstNodeId,
        mainInfoBo: {
          orderJobId: this.detailId,
          ...model,
        },
      };

      synergyNodeHandleOrderJobInfoButton(sendParams).then((res) => {
        if (res.code === 200) {
          this.getDetail();
          this.getAllNodeStatus();
          this.getNodeStatus();
          this.replenishCancel(form, model);
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 财务确认收款取消
    financialCancel() {
      this.financialVisible = false;
      this.financialForm = {};
    },
    // 财务确认收款确认操作
    financialConfirm({ form, model }) {
      form.validate((valid) => {
        if (valid) {
          console.log(valid);

          const { handlePerson, launchPerson, payment, subjectName } = model;
          let moneyNodeRow = model.moneyNodeList.find((item) => item.editFlag);
          let receiveDate = "";
          let actualPrice = "";
          if (moneyNodeRow) {
            receiveDate = moneyNodeRow.receiveDate;
            actualPrice = moneyNodeRow.actualPrice;
          }
          if (!receiveDate && !actualPrice)
            return this.$message.error("请填写收款日期 或 收款阶段已收(元)");
          let sendData = {
            orderJobId: this.detailId,
            receiveDate,
            actualPrice,
            handlePerson,
            launchPerson,
            payment,
            subjectName,
          };

          synergyNodeHandleConfirmMoneyButton(sendData).then((res) => {
            if (res.code === 200) {
              this.getDetail();
              this.getAllNodeStatus();
              this.getNodeStatus();
              this.financialCancel();
              this.$message.success("确认成功");
            }
          });
        } else {
          this.$message.error("请填写必填信息");
        }
      });
    },
    // 工单作业的方法操作end

    // 获取所有的节点状态
    getAllNodeStatus() {
      let sendParams = {
        orderJobId: this.detailId,
      };
      synergyNodeGetOrderJobAllProcessNodePreview(sendParams).then((res) => {
        this.nodeData = res.data;
      });
    },
    // 获取当前节点状态
    getNodeStatus() {
      let sendParams = {
        orderJobId: this.detailId,
      };
      synergyNodeGetOrderJobProcessNodePreview(sendParams).then((res) => {
        this.flowData = res.data;
      });
    },
    // 获取详情节点动态
    nodeDetailStatus() {
      this.$router.push({
        path: "/xt/nodeStatus",
        query: {
          // id: this.detailData.orderJob.id,
          orderId: this.detailData.zwOrderVo.id,
          pagesId: this.pagesId,
        },
      });
    },

    handlePreview(row) {
      this.previewDialog = true;

      this.$nextTick(() => {
        this.previewUrl = row.fileUrl;
        this.previewFileName = row.fileName;
      });
    },

    previewDown() {
      downFile(this.previewUrl, this.previewFileName);
    },
  },
  mounted() {
    this.initFun();

    this.type = this.$route.query.type;
    if (this.type) {
      this.getXtOrderJob();
      this.initConfig("工单作业");
      this.active = 2;
    } else {
      this.initConfig("基本信息");
      this.getDetail();
    }

    this.getAllNodeStatus();
    this.getNodeStatus();
    this.$store.dispatch("commonData/getUserList");
  },
  computed: {
    // 获取state仓库存储的数据
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang='scss' scoped>
.detail-warp {
  .dialog-box {
    .tip {
      font-size: 16px;
      color: #666;
      font-weight: 500;
      margin-bottom: 10px;
    }
    .desc {
      font-size: 14px;
      color: #999;
    }
  }
  .upload-img {
    width: 120px;
    height: 120px;
    background-color: rgba(249, 249, 249, 1);
    border: 1px solid rgba(233, 233, 233, 1);
    border-radius: 3px;
    color: #cccccc;

    > div {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      i {
        font-size: 25px;
      }
    }
  }
}
</style>