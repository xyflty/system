import Vue from "vue";
import table from "./table.vue";
import ExcelJS from "exceljs";
// import * as XLSX from "xlsx";

const renderSheet = async (buffer, target) => {
  // let workbook = XLSX.read(new Uint8Array(buffer), { type: "array" }); //表格对象
  // let sheetNames = workbook.SheetNames; //获取到所有表格
  // let worksheet = workbook.Sheets[sheetNames[0]]; //取第一张表

  // //   调用xlsx提供的方法，直接将提取到的表格数据转换为html代码，将html代码渲染到指定容器就完成了
  // let data = XLSX.utils.sheet_to_json(worksheet);
  const  workbook =await new ExcelJS.Workbook().xlsx.load(buffer)
  // .then((workbook) => {
  //   // const ws = workbook.getWorksheet(1);
  //   // const data = ws.getRows(1, ws.actualRowCount);
   
  // }); 
    return new Vue({
      render: h => h(table, { props: {workbook:workbook } })
  }).$mount(target);
};
export default renderSheet;
