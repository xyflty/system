import request from "@/utils/request";


export function getIndexPieChar(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getIndexPieChar",
        method: "get",
        params: query,
    });
}

export function getIndexProjectMatrixChart(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getIndexProjectMatrixChart",
        method: "get",
        params: query,
    });
}

// 首页 顶部 柱状图
export function getSalesBusinessAnalysisChart(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getSalesBusinessAnalysisChart",
        method: "get",
        params: query,
    });
}

export function getSalesBusinessAnalysisList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getSalesBusinessAnalysisList",
        method: "get",
        params: query,
    });
}

// 详情页 顶部 数据概览
export function getDetailTopData(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getDetailTopData",
        method: "get",
        params: query,
    });
}

// 详情页 跳转列表 数据来源类型饼图
export function dataSourceList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/dataSourceList",
        method: "get",
        params: query,
    });
}

// 详情页 底部 列表 人员筛选条件
export function getDetailUserList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getDetailUserList",
        method: "get",
        params: query,
    });
}

// 线索详情页 底部 列表 部门有子级
export function getClueDetailDeptList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getClueDetailDeptList",
        method: "get",
        params: query,
    });
}
// 线索详情页 底部 列表 部门无子级
export function getDetailDeptUserList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getDetailDeptUserList",
        method: "get",
        params: query,
    });
}

export function getDetailDeptList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getDetailDeptList",
        method: "get",
        params: query,
    });
}

export function getDataSourcePercentageDeptList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getDataSourcePercentageDeptList",
        method: "get",
        params: query,
    });
}

export function getDataSourcePercentageUserList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getDataSourcePercentageUserList",
        method: "get",
        params: query,
    });
}



export function followUpList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/followUpList",
        method: "get",
        params: query,
    });
}

export function getDetailClueDataList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getDetailClueDataList",
        method: "get",
        params: query,
    });
}


export function getDetailOpportunityDataList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getDetailOpportunityDataList",
        method: "get",
        params: query,
    });
}

export function getDetailOrderDataList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getDetailOrderDataList",
        method: "get",
        params: query,
    });
}


export function getReferralOrderList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getReferralOrderList",
        method: "get",
        params: query,
    });
}


export function getFollowUpMethodList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getFollowUpMethodList",
        method: "get",
        params: query,
    });
}


export function getFollowUpMethodDetailList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getFollowUpMethodDetailList",
        method: "get",
        params: query,
    });
}



export function getOpportunityDetailTopData(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOpportunityDetailTopData",
        method: "get",
        params: query,
    });
}


export function getOpportunityDetailPieChar(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOpportunityDetailPieChar",
        method: "get",
        params: query,
    });
}



export function getOpportunityProjectMatrixChartVo(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOpportunityProjectMatrixChart",
        method: "get",
        params: query,
    });
}


export function getOpportunityStatusPieChart(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOpportunityStatusPieChart",
        method: "get",
        params: query,
    });
}

export function getOpportunityDetailUserList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOpportunityDetailUserList",
        method: "get",
        params: query,
    });
}




export function getOpportunityDetailDeptList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOpportunityDetailDeptList",
        method: "get",
        params: query,
    });
}



export function getOrderDetailTopData(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOrderDetailTopData",
        method: "get",
        params: query,
    });
}


export function getOrderDetailPieChart(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOrderDetailPieChart",
        method: "get",
        params: query,
    });
}


export function getOrderDetailMatrixChart(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOrderDetailMatrixChart",
        method: "get",
        params: query,
    });
}

export function getOrderDetailBottomDeptList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOrderDetailBottomDeptList",
        method: "get",
        params: query,
    });
}


export function getOrderDetailBottomUserList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOrderDetailBottomUserList",
        method: "get",
        params: query,
    });
}



export function getOrderPieChart(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOrderPieChart",
        method: "get",
        params: query,
    });
}


export function getUserOrderStatusNumAndConvertRate(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getUserOrderStatusNumAndConvertRate",
        method: "get",
        params: query,
    });
}


export function getOrderStatusNumAndConvertRate(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOrderStatusNumAndConvertRate",
        method: "get",
        params: query,
    });
}

// 订单状态占比 状态分析
export function getOrderStatusAnalysis(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOrderStatusAnalysis",
        method: "get",
        params: query,
    });
}



export function getOrderProject(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOrderProject",
        method: "get",
        params: query,
    });
}

// 商机详情页 底部列表 部门无子级
export function getOpportunityDetailDeptUserList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOpportunityDetailDeptUserList",
        method: "get",
        params: query,
    });
}


// 订单详情 底部 部门有子级
export function getOrderDetailDeptList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOrderDetailDeptList",
        method: "get",
        params: query,
    });
}

// 订单详情 底部 部门无子级
export function getOrderDetailDeptUserList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOrderDetailDeptUserList",
        method: "get",
        params: query,
    });
}

// 订单详情 底部 用户数据列表
export function getOrderDetailUserList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOrderDetailUserList",
        method: "get",
        params: query,
    });
}


// 订单详情 底部 用户数据列表
export function customerDealCountList(query) {
    return request({
        url: "/zw/customerAnalysis/customerDealCountList",
        method: "get",
        params: query,
    });
}

// 订单详情 底部 用户数据列表
export function getCustomerCountList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getCustomerCountList",
        method: "get",
        params: query,
    });
}

export function getOpportunityPercentageDeptList(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOpportunityPercentageDeptList",
        method: "get",
        params: query,
    });
}


// 商机状态转化率与占比 的发现需求
export function getDiscoverRequire(query) {
    return request({
        url: "/zw/salesBusinessAnalysis/getOpportunityStatusList",
        method: "get",
        params: query,
    })
}
