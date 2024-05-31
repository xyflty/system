import request from "@/utils/request";

// 人员管理-每日目标-列表
export function list(query) {
  return request({
    url: "/zw/targetDay/listTargetDay",
    method: "get",
    params: query,
  });
}

// 人员管理-每日目标-修改
export function editTarget(data) {
  return request({
    url: "/zw/targetDay/editTargetDay",
    method: "put",
    data: data,
  });
}

// 人员管理-每日目标-修改-具体月列表查询
export function listWeChat(query) {
  return request({
    url: "/zw/targetDay/queryTargetDayMonth",
    method: "get",
    params: query,
  });
}

// 人员管理-每日目标-修改-列表查询
export function getInfo(query) {
  return request({
    url: "/zw/targetDay/queryTargetDay",
    method: "get",
    params: query,
  });
}

// 人员管理-每日目标-删除
export function del(data) {
  return request({
    url: "/zw/targetDay",
    method: "delete",
    data: data,
  });
}

// 人员管理-每日目标-新增
export function add(data) {
  return request({
    url: "/zw/targetDay",
    method: "post",
    data: data,
  });
}
