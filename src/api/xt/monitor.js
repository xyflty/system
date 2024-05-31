import request from "@/utils/request";
// 查询项目变更审核记录列表
export const monitoringList = (query) => {
  return request({
    url: "/synergy/monitoring/list",
    method: "get",
    params: query,
  });
};

// 新增申报结果监测管理
export const monitoringAdd = (data) => {
  return request({
    url: "/synergy/monitoring",
    method: "post",
    data,
  });
};

// 修改监测状态
export const monitoringEdit = (data) => {
  return request({
    url: "/synergy/monitoring",
    method: "put",
    data,
  });
};
// 删除监测
export const monitoringRemove = (id) => {
  return request({
    url: `synergy/monitoring/${id}`,
    method: "Delete",
  });
};
// 获取申报结果监测管理详细信息
export const monitoringDetail = (id) => {
  return request({
    url: `/synergy/monitoring/${id}`,
    method: "get",
  });
};

// 下载导入模板
export function importTemplate() {
  return request({
    url: "/synergy/monitoring/importTemplate",
    method: "get",
    responseType: "blob",
  });
}

// 查询新三库一平台监测管理列表
export function monitoringEntList(query) {
  return request({
    url: "/system/monitoringEnt/list",
    method: "get",
    params: query,
  });
}

export function areaClass() {
  return request({
    url: "/system/monitoringEnt/areaClass",
    method: "post",
  });
}
