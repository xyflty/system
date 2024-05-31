import { mapState } from "vuex";
import { getToken } from "@/utils/auth";
import { listUser } from "@/api/system/user";
import {
  channelOpportunityimportTemplate,
  channelOrderimportTemplate,
  channelCustomerimportTemplate,
} from "../../../api/irrigationDitch/inquiry";
export default {
  data() {
    return {
      isRandom: 0,
      customerTypeObj: { 1: "企业客户", 2: "个人客户", 3: "渠道客户" },
      queryParams: {
        keyword: undefined,
        opportunityStatus: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        publicArea: undefined,
        marketingUserId: undefined,
        dataSource: undefined,
        dataAttribution: undefined,
        customerType: undefined,
        pageNum: 1,
        pageSize: 10,
        signTime: undefined,
        orderBy: "createTime",
        orderType: "desc",
      },
      total: 0,
      // 数据归属
      dataAttributionArr: [
        {
          value: "众为",
          lable: 0,
        },
        {
          value: "蚂蚁",
          lable: 1,
        },
      ],
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
        url:
          process.env.VUE_APP_BASE_API +
          "/zw/channel/channelOpportunity/importData",
        // 订单上传地址
        url1:
          process.env.VUE_APP_BASE_API + "/zw/channel/channelOrder/importData",
        // 客户上传地址
        url2:
          process.env.VUE_APP_BASE_API +
          "/zw/channel/channelCustomer/importData",
      },
      title: [
        "查看商机关联项目",
        "查看关联子公司",
        "查看客户优势项目与主营项目",
        "查看联系人",
        "新增跟进",
        "查看成交项目",
        "查看合作项目",
      ],
      dialog: {
        title: "查看商机关联项目",
        OpportunitySH: false,
        type: 1,
        row: {},
      },
      userList: [],
    };
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;

      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateMonth = [];
      this.createTimeDate = [];
      this.queryParams.beginSignTime = "";
      this.queryParams.endSignTime = "";
      this.queryParams.beginCreateTime = "";
      this.queryParams.endCreateTime = "";

      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "项目导入";
      this.upload.open = true;
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
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
    /** 下载模板操作 */
    importTemplate(index) {
      var url = undefined;
      if (index == 1) {
        url = channelOpportunityimportTemplate;
      }
      if (index == 2) {
        url = channelOrderimportTemplate;
      }
      if (index == 3) {
        url = channelCustomerimportTemplate;
      }
      url().then((response) => {
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
    /** 查询用户列表 */
    getUserList(e, isFocus) {
      listUser({
        pageNum: 1,
        pageSize: 10,
        userName: isFocus ? "" : e,
      }).then((response) => {
        this.userList = response.rows;
      });
    },
    // 打开浮窗列表
    dialogSH(type, row, cooper) {
      if (cooper) {
        this.dialog.row = { ...row, dialogType: type, cooper };
      } else {
        this.dialog.row = { ...row, dialogType: type };
        this.dialog.title = this.title[type - 1];
      }

      this.dialog.OpportunitySH = true;
      this.dialog.type = type;
    },
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
  watch: {
    columns: {
      handler(n) {
        this.isRandom = Math.random();
        // this.$refs.myTable.doLayout();
      },
    },
  },
};
