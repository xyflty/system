import request from "@/utils/request";

// 查询日程列表
export function listSchedule(query) {
  return request({
    url: "/core/schedule/list",
    method: "get",
    params: query,
  });
}

// 获取当月每天的日程数
export function getScheduleCount(query) {
  return request({
    url: "/core/schedule/count",
    method: "get",
    params: query,
  });
}

// 获取用户的基本线索信息
export function getBaseInfoList(query, type) {
  return request({
    url: `/zw/${type}/baseInfoList`,
    method: "get",
    params: query,
  });
}

// 获取日程详细信息
export function getSchedule(query) {
  return request({
    url: "/core/schedule/getInfo",
    method: "get",
    params: query,
  });
}

// 新增日程
export function addSchedule(data) {
  return request({
    url: "/core/schedule",
    method: "post",
    data: data,
  });
}

// 修改日程
export function updateSchedule(data) {
  return request({
    url: "/core/schedule",
    method: "put",
    data: data,
  });
}
// 删除日程
export function delSchedule(id) {
  return request({
    url: "/core/schedule/" + id,
    method: "delete",
  });
}

// 通过日期范围获取每天的日程列表
export function getListByDateRange(query) {
  return request({
    url: "/core/schedule/listByDateRange",
    method: "get",
    params: query,
  });
}
