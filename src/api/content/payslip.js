import request from "@/utils/request";

// 查询工资主体统计列表
export function zwPayrollOuterLayerList(query) {
  return request({
    url: "/zw/payroll/outerLayerList",
    method: "get",
    params: query,
  });
}

// 查询工资列表
export function zwPayrollList(query) {
  return request({
    url: "/zw/payroll/list",
    method: "get",
    params: query,
  });
}

// 工资消息发送
export function zwPayrollSendMessage(data) {
  return request({
    url: "/zw/payroll/sendMessage",
    method: "post",
    data,
  });
}
