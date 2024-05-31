import request from "@/utils/request";

//查询三库资源公海列表
export function threeLibrarySeaList(query) {
  return request({
    url: "/zw/threeLibrarySea/list",
    method: "get",
    params: query,
  });
}

// 三库资源库公海-领取
export function threeLibrarySeaTake(data) {
  return request({
    url: "/zw/threeLibrarySea/threeLibrarySeaTake",
    method: "put",
    data,
  });
}

// 三库资源库公海-手动放回公共资源公海
export function threeLibrarySeaPutBackSea(data) {
  return request({
    url: "/zw/threeLibrarySea/putBackSea",
    method: "put",
    data,
  });
}

// 三库资源库公海-转为线索
export function convertClue(data) {
  return request({
    url: "/zw/threeLibrarySea/convertClue",
    method: "put",
    data,
  });
}
