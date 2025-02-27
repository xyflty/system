import Vue from "vue";

import Cookies from "js-cookie";

import Element from "element-ui";
import "./assets/styles/element-variables.scss";
import Avue from "@smallwei/avue";
import "@smallwei/avue/lib/index.css";

import "@/assets/styles/index.scss"; // global css
import "@/assets/styles/ruoyi.scss"; // ruoyi css
import App from "./App";
import store from "./store";
import router from "./router";
import directive from "./directive"; // directive
import plugins from "./plugins"; // plugins
import { download } from "@/utils/request";
import { getNowYear } from "@/utils/common";
import VCalendar from "v-calendar"; // 引入日历插件
// import 'default-passive-events'
Vue.prototype.$bus = new Vue();

Vue.use(VCalendar, {
  componentPrefix: "vc",
}); // 组件前缀，以防后期跟其他冲突

import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";
Vue.use(Viewer);
Viewer.setDefaults({
  Options: {
    inline: true,
    button: true,
    navbar: true,
    title: true,
    toolbar: true,
    tooltip: true,
    movable: true,
    zoomable: true,
    rotatable: true,
    scalable: true,
    transition: true,
    fullscreen: true,
    keyboard: true,
    url: "data-source",
  },
});

import { scrollBoard } from "@jiaminghi/data-view";

Vue.use(scrollBoard);

import "./assets/icons"; // icon
import "./permission"; // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey, updateConfigByKey } from "@/api/system/config";
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  handleTree,
  getLabel,
  getValue,
  changeMoney,
} from "@/utils/ruoyi";
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar";

// 自定义表格工具组件 升级版
import RightToolbar_2 from "@/components/RightToolbar_2";

// 线索，商机，订单，客户表格统计
import PresentationStatistics from "@/views/components/PresentationStatistics";

// 富文本组件
import Editor from "@/components/Editor";
// 文件上传组件
import FileUpload from "@/components/FileUpload";
// 图片上传组件
import ImageUpload from "@/components/ImageUpload";
// 图片预览组件
import ImagePreview from "@/components/ImagePreview";
// 字典标签组件
import DictTag from "@/components/DictTag";
// 头部标签组件
import VueMeta from "vue-meta";
// 字典数据组件
import DictData from "@/components/DictData";

// 地区选择
import ProvinceSelect from "@/views/core/components/province";

// 全局方法挂载
Vue.prototype.getLabel = getLabel;
Vue.prototype.getValue = getValue;
Vue.prototype.changeMoney = changeMoney;
Vue.prototype.getDicts = getDicts;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.updateConfigByKey = updateConfigByKey;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
Vue.prototype._getNowYear = getNowYear;

// 全局组件挂载
Vue.component("DictTag", DictTag);
Vue.component("Pagination", Pagination);
Vue.component("RightToolbar", RightToolbar);
Vue.component("RightToolbar_2", RightToolbar_2);
Vue.component("PresentationStatistics", PresentationStatistics);
Vue.component("Editor", Editor);
Vue.component("FileUpload", FileUpload);
Vue.component("ImageUpload", ImageUpload);
Vue.component("ImagePreview", ImagePreview);
Vue.component("ProvinceSelect", ProvinceSelect);

import { DragWrap, DragItem } from "vue-gn-components";
import "vue-gn-components/lib/style/index.css";
Vue.use(DragWrap).use(DragItem);

Vue.use(directive);
Vue.use(plugins);
Vue.use(VueMeta);
DictData.install();

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get("size") || "medium", // set element-ui default size
});
Vue.use(Avue);

Vue.config.productionTip = false;

// 获取触底加载

// Vue.directive("loadmore", {
//   inserted: function (el, binding) {
//     const dom = el.querySelector(
//       ".el-select-dropdown .el-select-dropdown__wrap"
//     ); // 获取下拉框元素
//     dom.addEventListener("scroll", function () {
//       // 监听元素触底
//       const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
//       if (condition) {
//         binding.value();
//       }
//     });
//   },
// });

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
