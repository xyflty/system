import request from "@/utils/request";

// 查询协同下单审批关联列表
export function synergyOrderAuditList(query) {
    return request({
        url: "/xt/synergyOrder/auditList",
        method: "get",
        params: query,
    });
}
// 协同下单审批
export function  xtSynergyOrderAudit(data) {
    return request({
        url: "/xt/synergyOrder/audit",
        method: "post",
        data
    });
}

// 查询工单审批中心列表
export function xtOrderJobAuditList(query) {
    return request({
        url: "/xt/orderJobAudit/list",
        method: "get",
        params: query,
    });
}

// 查询工单列表
export function xtOrderJobList(query) {
    return request({
        url: "/xt/orderJob/list",
        method: "get",
        params: query,
    });
}

// 查询协同项目及其映射的所有子类
export function projectCategoryAllZwAndXtList() {
    return request({
        url: "/xt/projectCategory/allZwAndXtList",
        method: "get",
    });
}

// 审批
export function xtOrderJobAuditAudit(data) {
    return request({
        url: "/xt/orderJobAudit/audit",
        method: "put",
        data
    });
}

// 撤销
export function xtOrderJobAuditQuash(data) {
    return request({
        url: "/xt/orderJobAudit/quash",
        method: "put",
        data

    });
}