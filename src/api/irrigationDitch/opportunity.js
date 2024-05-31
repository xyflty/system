import request from "@/utils/request";

// 商机列表
export function getList(query) {
  return request({
    url: "/zw/channel/channelOpportunity/list",
    method: "get",
    params: query,
  });
}

// 渠道CRM关联项目Controller
export function getChannelRelevanceProjectList(query) {
  return request({
    url: "/zw/channel/channelRelevanceProject/list",
    method: "get",
    params: query,
  });
}

// 渠道CRM子公司Controller
export function getChannelSubsidiaryList(query) {
  return request({
    url: "/zw/channel/channelSubsidiary/list",
    method: "get",
    params: query,
  });
}
// 渠道CRM优势项目Controller
export function getChannelDomainProjectList(query) {
  return request({
    url: "/zw/channel/channelDomainProject/list",
    method: "get",
    params: query,
  });
}

// 项目Controller
export function getChannelProjectList(query) {
  return request({
    url: "/core/project/channelProjectList",
    method: "get",
    params: query,
  });
}

// 新增渠道CRM商机
export function getChannelOpportunity(data) {
  return request({
    url: "/zw/channel/channelOpportunity",
    method: "post",
    data: data,
  });
}

// 查询项目列表(渠道部)
export function list(query) {
  return request({
    url: "/core/project/channelList",
    method: "get",
    params: query,
  });
}

// 商机联系人
export function getchannelContactInfolist(query) {
  return request({
    url: "/zw/channel/channelContactInfo/list",
    method: "get",
    params: query,
  });
}

// 获取渠道CRM商机详细信息(编辑信息)
export function getchannelOpportunity(id) {
  return request({
    url: "/zw/channel/channelOpportunity/" + id,
    method: "get",
  });
}

export function channelOpportunity(data) {
  return request({
    url: "/zw/channel/channelOpportunity",
    method: "put",
    data: data,
  });
}

// 新增商机跟进
export function getChannelOpportunityFollowUp(data) {
  return request({
    url: "/zw/channel/channelOpportunity/followUp",
    method: "post",
    data: data,
  });
}

// 获取渠道CRM商机详细信息
export function getchannelOpportunityInfo(query) {
  return request({
    url: "/zw/channel/channelOpportunity/info",
    method: "get",
    params: query,
  });
}

// 获取渠道CRM商机详细信息
export function getchannelFollowUplist(query) {
  return request({
    url: "/zw/channel/channelFollowUp/list",
    method: "get",
    params: query,
  });
}

// 获取渠道CRM跟进记录详细信息
export function getchannelFollowUpId(id) {
  return request({
    url: "/zw/channel/channelFollowUp/" + id,
    method: "get",
  });
}

// 修改商机跟进
export function channelOpportunityeditFollowUp(data) {
  return request({
    url: "/zw/channel/channelOpportunity/editFollowUp",
    method: "put",
    data: data,
  });
}

// 新增渠道CRM跟进评论记录
export function getchannelFollowUpComment(data) {
  return request({
    url: "/zw/channel/channelFollowUpComment",
    method: "post",
    data: data,
  });
}

// 查询渠道CRM跟进评论记录列表
export function getchannelFollowUpCommentlist(query) {
  return request({
    url: "/zw/channel/channelFollowUpComment/list",
    method: "get",
    params: query,
  });
}

// 设置置顶状态
export function getchannelOpportunitytopStatus(query) {
  return request({
    url: "/zw/channel/channelOpportunity/topStatus",
    method: "get",
    params: query,
  });
}

export function getchannelOpportunityconversion(data) {
  return request({
    url: "/zw/channel/channelOpportunity/conversion",
    method: "post",
    data: data,
  });
}

// 查询渠道CRM订单成交项目列表
export function getchannelOrderProjectlist(query) {
  return request({
    url: "/zw/channel/channelOrderProject/list",
    method: "get",
    params: query,
  });
}

// 模糊搜索企业名称
export function getchannelChannelCustomerListByName(query) {
  return request({
    url: "/zw/channel/channelCustomer/listByName",
    method: "get",
    params: query,
  });
}

// 按企业名称查询渠道CRM报价列表
export function channelChannelAuditReferPrice(query) {
  return request({
    url: "/channel/channelAuditReferPrice/listByCompany",
    method: "get",
    params: query,
  });
}

export function channelChannelAuditReferPriceAdd(data) {
  return request({
    url: "/channel/channelAuditReferPrice",
    method: "post",
    data,
  });
}
// 获取渠道CRM审批流程报价详细信息
export function channelChannelAuditReferPriceDetail(id) {
  return request({
    url: `/channel/channelAuditReferPrice/${id}`,
    method: "get",
  });
}

// 修改渠道CRM审批流程报价-修改详情
export function channelChannelAuditReferPriceEdit(data) {
  return request({
    url: `/channel/channelAuditReferPrice`,
    method: "put",
    data,
  });
}
// 修改渠道CRM审批流程报价-撤回审批
export function withdrawApproval(auditId) {
  return request({
    url: `/channel/channelAuditReferPrice/withdrawApproval/${auditId}`,
    method: "PUT",
  });
}

// 修改渠道查询审批流程报价详细
export function channelAuditReferPriceGetInfoByAuditId(query) {
  return request({
    url: "/channel/channelAuditReferPrice/getInfoByAuditId",
    method: "get",
    params: query,
  });
}
