import request from "@/utils/request";

// 查询日报列表
export function list(query) {
  return request({
    url: "/core/daily/list",
    method: "get",
    params: query,
  });
}
// 新增日报-初始化默认数据
export function addInit() {
  return request({
    url: "/core/daily/addInit",
    method: "get",
  });
}

// 新增日报
export function add(data) {
  return request({
    url: "/core/daily",
    method: "POST",
    data: data,
  });
}
// 修改日报
export function dailyEdit(data) {
  return request({
    url: "/core/daily",
    method: "put",
    data: data,
  });
}
// 删除日报
export function dailyRemove(ids) {
  return request({
    url: `/core/daily/${ids}`,
    method: "delete",
  });
}
// 获取日报详细信息
export function getInfo(query) {
  return request({
    url: "/core/daily/getInfo",
    method: "get",
    params: query,
  });
}

// 日报领导人更新为已读
export function dailyRead(data) {
  return request({
    url: `/core/daily/updateIsRead?id=${data.dailyId}`,
    method: "PUT",
  });
}

// 新增批阅评论记录
export function dailyComment(data) {
  return request({
    url: "/core/dailyComment",
    method: "post",
    data,
  });
}

// 新增工作报告上传文件
// export function dailyAnnex(data) {
//   return request({
//     url: "/core/dailyAnnex",
//     method: "post",
//     data,
//   });
// }

// 删除工作报告上传文件
// export function dailyAnnexRemove(ids) {
//   return request({
//     url: `/core/dailyAnnex/${ids}`,
//     method: "DELETE",
//   });
// }

// 日报抄送更新为已读
export function updateIsRead(data) {
  return request({
    url: `/core/dailyCcPerson/updateIsRead?dailyId=${data.dailyId}`,
    method: "PUT",
  });
}

// 查询用户指定日期的跟进记录
export function listByDate(query) {
  return request({
    url: "/zw/followUp/listByDate",
    method: "GET",
    params: query,
  });
}

// 获取所有用户一周内日报提交情况
export function getDailyList(query) {
  return request({
    url: "/core/daily/getDailyList",
    method: "GET",
    params: query,
  });
}

/**
 * 获取工作报告阶段的浮层信息
 * @param {*} query
 * @returns
 */
export function getDailyInfoStage(query) {
  return request({
    url: "/core/daily/getDailyInfoStage",
    method: "GET",
    params: query,
  });
}
