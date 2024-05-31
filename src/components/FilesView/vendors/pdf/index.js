
import Vue from "vue";
import PDFView from "./PDFView.vue";

const renderPdf = async (buffer, target) => {
  return new Vue({
    render: h => h(PDFView, { props: { buffer } })
}).$mount(target);
};
export default renderPdf;
