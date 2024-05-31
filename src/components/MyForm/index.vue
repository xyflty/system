<template>
  <el-form
    ref="formRef"
    v-if="model"
    :model="model"
    :rules="rules"
    class="demo-ruleForm"
    :validate-on-rule-change="false"
    v-bind="$attrs"
  >
    <template v-for="item in formOptions">
      <!-- 没有children -->
      <el-form-item
        :label="item.label"
        :prop="item.prop"
        :key="item.prop"
        v-if="!item.children || !item.children.length"
      >
        <template v-if="item.slotName">
          <slot :name="item.slotName" :scope="item"></slot>
        </template>
        <template v-else>
          <treeselect
            v-if="item.type === 'treeselect'"
            v-model="model[item.prop]"
            :options="item.options"
            v-bind="item.attrs"
            @select="(obj) => handleSelect(obj, item)"
          />
          <component
            v-if="item.type !== 'upload' && item.type !== 'treeselect'"
            :is="`el-${item.type}`"
            :options="item.options"
            :placeholder="item.placeholder"
            v-model="model[item.prop]"
            v-bind="item.attrs"
            @change="(val) => handleChange(val, item)"
          ></component>
          <el-upload
            v-if="item.type === 'upload'"
            v-bind="item.uploadAttrs"
            :on-preview="onPreview"
            :on-remove="onRemove"
            :on-success="onSuccess"
            :on-error="onError"
            :on-progress="onProgress"
            :on-change="onChange"
            :on-exceed="onExceed"
            :before-upload="beforeUpload"
            :before-remove="beforeRemove"
            :http-request="httpRequest"
          >
            <template #default>
              <slot name="uploadArea"></slot>
            </template>
            <template #tip>
              <div class="el-upload__tip">
                <slot name="uploadTip"></slot>
              </div>
            </template>
          </el-upload>
        </template>
      </el-form-item>
      <!-- 有children -->
      <el-form-item
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        v-if="item.children && item.children.length"
      >
        <el-checkbox-group
          v-if="item.type === 'checkbox-group'"
          v-model="model[item.prop]"
          v-bind="item.attrs"
        >
          <template v-for="option in item.children">
            <el-checkbox :key="option.value" :label="option.value">{{
              option.label
            }}</el-checkbox>
          </template>
        </el-checkbox-group>
        <el-radio-group
          v-if="item.type === 'radio-group'"
          v-model="model[item.prop]"
          v-bind="item.attrs"
          @input="(val) => handleInput(val, item)"
        >
          <template v-for="option in item.children">
            <el-radio :key="option.value" :label="option.value">{{
              option.label
            }}</el-radio>
          </template>
        </el-radio-group>
        <el-select
          v-if="item.type === 'select'"
          :placeholder="item.placeholder"
          v-model="model[item.prop]"
          v-bind="item.attrs"
        >
          <template v-for="option in item.children">
            <el-option
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </template>
        </el-select>
      </el-form-item>
    </template>

    <el-form-item>
      <slot name="formAction" :form="$refs.formRef" :model="model"></slot>
    </el-form-item>
  </el-form>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "MyForm",
  components: { Treeselect },
  props: {
    formOptions: {
      type: Array,
      required: true,
    },
    form: {
      type: Object,
    },
    httpRequest: {
      type: Function,
    },
  },

  data() {
    return {
      model: {},
      rules: {},
    };
  },

  mounted() {
    this.initForm();
    this.$refs["formRef"].getFormData = this.getData;
  },

  methods: {
    // 初始化表单数据
    initForm() {
      let m = {};
      let r = {};
      this.formOptions.map((item) => {
        if (this.form) {
          m = this.form;
          r[item.prop] = item.rules;
        } else {
          if (item.prop) {
            m[item.prop] = item.value;
            r[item.prop] = item.rules;
          }
        }
      });

      this.model = cloneDeep(m);
      this.rules = cloneDeep(r);
    },
    getData() {
      return this.model;
    },
    // 上传的方法
    onPreview(uploadFile) {
      this.$emit("on-preview", uploadFile);
    },
    onRemove(uploadFile, uploadFiles) {
      this.$emit("on-remove", { uploadFile, uploadFiles });
    },
    onSuccess(response, uploadFile, uploadFiles) {
      let uploadItem = this.formOptions.find((item) => item.type === "upload");
      this.model[uploadItem.prop] = { response, uploadFile, uploadFiles };
      this.$emit("on-success", { response, uploadFile, uploadFiles });
    },
    onError(error, uploadFile, uploadFiles) {
      this.$emit("on-error", { error, uploadFile, uploadFiles });
    },
    onProgress(evt, uploadFile, uploadFiles) {
      this.$emit("on-progress", { evt, uploadFile, uploadFiles });
    },
    onChange(uploadFile, uploadFiles) {
      this.$emit("on-change", { uploadFile, uploadFiles });
    },
    onExceed(files, uploadFiles) {
      this.$emit("on-exceed", { files, uploadFiles });
    },
    beforeUpload(rawFile) {
      this.$emit("before-upload", rawFile);
    },
    beforeRemove(uploadFile, uploadFiles) {
      this.$emit("before-remove", { uploadFile, uploadFiles });
    },
    handleSelect(val, item) {
      if (item.isSelectLabel) {
        let obj = {
          label: val[item.prop],
          value: val["id"],
        };
        this.model[item.dataProp] = obj.label;
        //  this.$emit("treeSelect", { data:obj, model: this.model,prop:item.dataProp });
      }
    },

    handleInput(val, row) {
      this.$emit("input", { val, row });
    },
    handleChange(val, row) {
      this.$emit("change", { val, row });
    },
  },
  watch: {
    formOptions: {
      handler() {
        this.initForm();
      },
    },
    form: {
      handler() {
        this.model = this.form;
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>