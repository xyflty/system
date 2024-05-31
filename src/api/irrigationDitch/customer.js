import request from '@/utils/request'

// 查询渠道CRM订单记录列表
export function getchannelCustomerlist(query) {
    return request({
        url: '/zw/channel/channelCustomer/list',
        method: 'get',
        params: query,
    })
}

// 更改客户置顶状态
export function getchannelCustomertopStatus(query) {
    return request({
        url: '/zw/channel/channelCustomer/topStatus',
        method: 'get',
        params: query,
    })
}

// 跟进客户
export function getchannelCustomertopfollowUp(data) {
    return request({
        url: '/zw/channel/channelCustomer/followUp',
        method: 'post',
        data: data,
    })
}

// 新增渠道CRM客户
export function getchannelchannelCustomer(data) {
    return request({
        url: '/zw/channel/channelCustomer',
        method: 'post',
        data: data,
    })
}

// 获取渠道CRM客户详细信息(编辑信息)
export function getchannelchannelCustomerId(id) {
    return request({
        url: '/zw/channel/channelCustomer/' + id,
        method: 'get',
    })
}

// 修改渠道CRM客户
export function getchannelchannelCustomerPut(data) {
    return request({
        url: '/zw/channel/channelCustomer',
        method: 'PUT',
        data: data,
    })
}

// 修改跟进客户
export function getchannelCustomereditFollowUp(data) {
    return request({
        url: '/zw/channel/channelCustomer/editFollowUp',
        method: 'post',
        data: data,
    })
}