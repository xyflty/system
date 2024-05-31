import request from "@/utils/request";
// 查询项目变更审核记录列表
export const synergyOrderJobManagerProjectList = (query) => {
  return request({
    url: "/synergy/orderJobManagerProject/list",
    method: "get",
    params: query,
  });
};
// 工单主管对接项目绑定确定按钮接口
export const synergyOrderJobManagerProjectSave = (data) => {
  return request({
    url: "/synergy/orderJobManagerProject/save",
    method: "post",
    data,
  });
};
