import Vue from "vue";
import ImagesView from "./ImagesView.vue";
import { readDataURL } from "@/utils";

const renderImage = async (buffer, target) => {
  let url = await readDataURL(buffer);
    return new Vue({
      render: h => h(ImagesView, { props: { image: url } })
  }).$mount(target);
};
export default renderImage;
