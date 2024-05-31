import request from "@/utils/request";

// 表字段显/隐列表
export const list = (query) => {
  return request({
    url: "/zw/tableColumn/field",
    method: "get",
    params: query,
  });
};

// 表字段显/隐列表
export const set = (data) => {
  return request({
    url: "/zw/tableColumn/showOrHide",
    method: "post",
    data: data,
  });
};
