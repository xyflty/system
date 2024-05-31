import request from "@/utils/request";

// 查询广告记录详细
export function getAd() {
  return request({
    url: "/zw/homePage/getPop",
    method: "get",
  });
}

// 查询广告记录详细 - 第二版
export function getAdvertising() {
  return request({
    url: "/zw/homePage/getHomepagePopup",
    method: "get",
  });
}

// 查询广告记录详细 - 第二版
export function setAdvertising(data) {
  return request({
    url: "/zw/homePage/setHomepagePopup",
    method: "post",
    data: data,
  });
}

// 查询广告记录详细 - 第二版
export function noticeDetails() {
  return request({
    url: "/system/notice/noticeDetails",
    method: "get",
  });
}
