import request from "@/utils/request";

// 查询企业安证资质监测管理列表
export function companyMonitorList(query) {
  return request({
    url: "/synergy/companyMonitor/list",
    method: "get",
    params: query,
  });
}

// 获取企业安证资质监测管理详细信息
export function companyMonitorDetail(id) {
  return request({
    url: `/synergy/companyMonitor/${id}`,
    method: "get",
  });
}

// 查询企业安证资质监测管理统计
export function companyMonitorTotal(query) {
  return request({
    url: "/synergy/companyMonitor/total",
    method: "get",
    params: query,
  });
}
