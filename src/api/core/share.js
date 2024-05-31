import request from "@/utils/request";

// 查询线索记录列表
export function customerArchiveShare(data) {
  return request({
    url: "/zw/customerArchive/share",
    method: "post",
    data,
  });
}
