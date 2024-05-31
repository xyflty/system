import Vue from "vue";
import {readText} from "@/utils"
import TextView from "./TextView.vue"

 const renderText = async (buffer, target) => { 
    const text =await readText(buffer)
  return new Vue({
    render: h => h(TextView, { props: { text } })
}).$mount(target);
};
export default renderText
