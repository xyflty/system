import request from "@/utils/request";

// 渠道客户列表
export function channelCustomerList(query) {
    return request({
        url: "/zw/channelCustomer/list",
        method: "get",
        params: query,
    });
}

// 新增渠道客户
export function channelCustomer(query) {
    return request({
        url: "/zw/channelCustomer",
        method: "post",
        data: query,
    });
}

// 修改
export function channelCustomerPut(data) {
    return request({
        url: "/zw/channelCustomer",
        method: "put",
        data: data,
    });
}

// 删除
export function delClue(id) {
    return request({
        url: "/zw/channelCustomer/" + id,
        method: "delete",
    });
}