import request from '@/utils/request'

// 查询渠道CRM订单记录列表
export function getchannelOrderList(query) {
    return request({
        url: '/zw/channel/channelOrder/list',
        method: 'get',
        params: query,
    })
}

// 设置置顶状态
export function getchannelOpportunitytopStatus(query) {
    return request({
        url: '/zw/channel/channelOrder/topStatus',
        method: 'get',
        params: query,
    })
}

// 跟进订单
export function getchannelOrderfollowUp(data) {
    return request({
        url: '/zw/channel/channelOrder/followUp',
        method: 'POST',
        data: data,
    })
}


// 获取渠道CRM订单详细信息(编辑信息)
export function getchannelOrderId(id) {
    return request({
        url: '/zw/channel/channelOrder/' + id,
        method: 'get',
    })
}

// 修改渠道CRM订单记录
export function getchannelchannelOrder(data) {
    return request({
        url: '/zw/channel/channelOrder',
        method: 'PUT',
        data: data,
    })
}
// 新增渠道CRM订单记录
export function getchannelchannelOrderPost(data) {
    return request({
        url: '/zw/channel/channelOrder',
        method: 'post',
        data: data,
    })
}
// 获取渠道CRM商机详细信息
export function getchannelOpportunityInfo(id) {
    return request({
        url: '/zw/channel/channelOrder/getInfoDetail/' + id,
        method: 'get',
    })
}

// 获取商机下拉选项
export function getchannelOpportunitylistOption(id) {
    return request({
        url: '/zw/channel/channelOpportunity/listOption',
        method: 'get',
    })
}

// 修改跟进订单
export function getchannelOrdereditFollowUp(data) {
    return request({
        url: '/zw/channel/channelOrder/editFollowUp',
        method: 'post',
        data: data,
    })
}