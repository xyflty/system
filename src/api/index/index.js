import request from "@/utils/request";

// 首页-数据简报
export function getDataReport(query) {
  return request({
    url: "/zw/homePage/getDataReport",
    method: "get",
    params: query,
  });
}

// 查询消息列表
export function listMessage(query) {
  return request({
    url: "/zw/message/homePageList",
    method: "get",
    params: query,
  });
}

// 查询消息详情
export function getMessageInfo(id) {
  return request({
    url: "/zw/message/" + id,
    method: "get",
  });
}

// 首页-业绩目标
export function getTargetData(query) {
  return request({
    url: "/zw/homePage/getTargetData",
    method: "get",
    params: query,
  });
}

// 首页-业绩排行
export function getSaleAmountRank(query) {
  return request({
    url: "/zw/homePage/getSaleAmountRank",
    method: "get",
    params: query,
  });
}

// 首页-新增数排名
export function getAddDataRank(query) {
  return request({
    url: "/zw/homePage/getAddDataRank",
    method: "get",
    params: query,
  });
}

// 首页-销售漏斗
export function getSalesFunnel(query) {
  return request({
    url: "/zw/homePage/getSalesFunnel",
    method: "get",
    params: query,
  });
}

export const messageCount = (query) => {
  return request({
    url: "/zw/message/messageCount",
    method: "get",
    params: query,
  });
};

// 日历需要的跟进数据
export const calendarFollowUpData = (query) => {
  return request({
    url: `/zw/followUp/getCalendarFollowUpData`,
    method: "get",
    params: query,
  });
};

// 查询首页跟进记录列表
export const homePageList = (query) => {
  return request({
    url: `/zw/followUp/homePageList`,
    method: "get",
    params: query,
  });
};

// 重点跟进数据
export const importantFollowUp = (query) => {
  return request({
    url: `/zw/followUp/getImportantFollowUp`,
    method: "get",
    params: query,
  });
};
// 查询详情跟进记录列表
export const followUpGetInfo = (id) => {
  return request({
    url: `/zw/followUp/getInfo/${id}`,
    method: "get",
  });
};

// 个人简报
export const getUserBusinessDataRank = (query) => {
  return request({
    url: `/zw/homePage/getUserBusinessData`,
    method: "get",
    params: query,
  });
};

// 集团简报
export const getGroupBusinessData = (query) => {
  return request({
    url: `/zw/homePage/getGroupBusinessData`,
    method: "get",
    params: query,
  });
};
// 主体简报
export const getSubjectBusinessData = (query) => {
  return request({
    url: `/zw/homePage/getSubjectBusinessData`,
    method: "get",
    params: query,
  });
};
// 部门业务数据排名
export const getDeptBusinessData = (query) => {
  return request({
    url: `/zw/homePage/getDeptBusinessData`,
    method: "get",
    params: query,
  });
};

// 团队简报
export const getTeamBusinessData = (query) => {
  return request({
    url: `/zw/homePage/getTeamBusinessData`,
    method: "get",
    params: query,
  });
};

// 成员简报
export const getMemberBusinessData = (query) => {
  return request({
    url: `/zw/homePage/getMemberBusinessData`,
    method: "get",
    params: query,
  });
};

// 成员简报
export const getDeptTreeListForHomePage = () => {
  return request({
    url: `/system/dept/getDeptTreeListForHomePage`,
    method: "get",
  });
};
