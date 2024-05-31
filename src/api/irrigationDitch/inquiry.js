import request from '@/utils/request'

// 查询渠道CRM订单记录列表
export function getchannelCustomerqueryCustomer(query) {
    return request({
        url: '/zw/channel/channelCustomer/queryCustomer',
        method: 'get',
        params: query,
    })
}

// 下载导入商机模板
export function channelOpportunityimportTemplate(query) {
    return request({
        url: '/zw/channel/channelOpportunity/importTemplate',
        method: 'get',
        params: query,
        responseType: "blob",
    })
}

// 下载导入订单模板
export function channelOrderimportTemplate(query) {
    return request({
        url: '/zw/channel/channelOrder/importTemplate',
        method: 'get',
        params: query,
        responseType: "blob",
    })
}
// 下载导入客户模板
export function channelCustomerimportTemplate(query) {
    return request({
        url: '/zw/channel/channelCustomer/importTemplate',
        method: 'get',
        params: query,
        responseType: "blob",
    })
}