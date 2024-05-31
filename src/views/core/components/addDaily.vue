<template>
  <!-- 添加日报对话框 -->
  <el-dialog
    title="写工作日报"
    :visible="show"
    width="800px"
    append-to-body
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-form-item label="日报标题" prop="title">
        <el-input v-model="form.title" placeholder="日报标题" />
      </el-form-item>
      <el-form-item label="日报时间" prop="dailyTime">
        <el-date-picker
          v-model="form.dailyTime"
          type="date"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="外呼电话/添加客户" prop="fieldOne">
        <el-input v-model="form.fieldOne" placeholder="外呼电话/添加客户" />
      </el-form-item>
      <el-form-item label="业绩收入/收入项目 " prop="fieldTwo">
        <el-input v-model="form.fieldTwo" placeholder="业绩收入/收入项目" />
      </el-form-item>
      <el-form-item label="跟进客户数/跟进情况" prop="fieldThree">
        <el-input v-model="form.fieldThree" placeholder="跟进客户数/跟进情况" />
      </el-form-item>
      <el-form-item label="工作总结" prop="content">
        <el-input
          type="textarea"
          :rows="4"
          v-model="form.content"
          placeholder="工作总结"
        />
      </el-form-item>
      <el-form-item label="直属领导" prop="leaderId">
        <el-select
          style="width: 100%"
          v-model="form.leaderId"
          filterable
          clearable
          placeholder="请输入关键字搜索用户"
          remote
          :remote-method="getUserList"
          @focus="getUserList($event, true)"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="抄送人员" prop="copyUserIds">
        <el-select
          style="width: 100%"
          v-model="form.copyUserIds"
          filterable
          multiple
          clearable
          placeholder="请输入关键字搜索用户"
          remote
          :remote-method="getUserList"
          @focus="getUserList($event, true)"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listUser } from "@/api/system/user";
import { add } from "@/api/content/daily";

export default {
  name: "AddDaily",
  watch: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userList: [],

      form: {},

      // 跟进表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        dailyTime: [
          { required: true, message: "日报时间不能为空", trigger: "blur" },
        ],
        fieldThree: [
          {
            required: true,
            message: "跟进客户数/跟进情况不能为空",
            trigger: "blur",
          },
        ],
        leaderId: [
          { required: true, message: "直属领导不能为空", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {},
  methods: {
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

    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.form));
          params.copyUserIds = params.copyUserIds.join(",");
          add(params).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.$emit("update:show", false);
            this.$emit("syncList");
            this.form = {};
          });
        }
      });
    },
    cancel() {
      this.$emit("update:show", false);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/upload.scss";
@import "@/assets/styles/dialog.scss";
</style>
