<template>
    <div class="k-line" :class="className" :style="{ height: height, width: width }" />
</template>
<!-- 这是产品销售情况分析钻取后的图  -->
  <!-- 这是产品k线图 -->
<script>

//   
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/views/dashboard/mixins/resize";

export default {
    mixins: [resize],
    props: {
        name: {
            type: Array,
        },
        className: {
            type: String,
            default: "chart",
        },
        width: {
            type: String,
            default: "100%",
        },
        height: {
            type: String,
            default: "500px",
        },

        initData: {
            type: Array,
            default: () => [],
        },
    },
    watch: {
        initData: {
            handler(n) {
                this.data = n;
                this.$nextTick(() => {
                    this.initChart();
                });
            },
        },
    },
    data() {
        return {
            chart: null,
            data: [[]],
            length: 0,
            datas: {
                color: "",
                open: {
                    name: "开",
                    value: 0
                },
                close: {
                    name: "收",
                    value: 0
                },
                low: {
                    name: "低",
                    value: 0
                },
                heigh: {
                    name: "高",
                    value: 0
                }
            },
            dateTime: {}
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.initChart();
        });
    },

    methods: {
        initChart() {

            const upColor = '#00da3c';  // 绿色
            const downColor = '#ec0000'; // 红色
            function splitData(rawData) {
                let categoryData = []; // 存储时间
                let values = [];
                let volumes = [];
                for (let i = 0; i < rawData.length; i++) {
                    categoryData.push(rawData[i].date);
                    delete rawData[i].date
                    values.push(rawData[i]);
                    if (rawData[i + 1] !== undefined) {
                        var keys = JSON.parse(JSON.stringify(rawData[i + 1]))
                    }
                    volumes.push([i, rawData[i].totalPrice, keys.totalPrice > rawData[i].totalPrice ? 1 : -1]);
                }

                return {
                    categoryData: categoryData,
                    values: values,
                    volumes: volumes
                };
            }

            this.dateTime = JSON.parse(sessionStorage.getItem('setTime'))
    
            const rowData = this.initData
            var data = splitData(rowData);


            var dataArr = []
            let key = {}

            for (let i in data.values) {

                key[i] = data.values[i]

                dataArr.push(data.values[i])
            }


            // 计算显示线图  日平均值
            function calculateMA(dayCount, dataArr) {

                var result = [];
                if (dayCount == 5) {
                    dataArr.map((t) => {
                        result.push(t.ma5)
                    })

                } else if (dayCount == 10) {
                    dataArr.map((t) => {
                        result.push(t.ma10)
                    })
                } else if (dayCount == 20) {
                    dataArr.map((t) => {
                        result.push(t.ma20)
                    })

                } else {
                    dataArr.map((t) => {
                        result.push(t.ma30)
                    })
                }

                return result;
            }

            // 计算最高价最低价 和平均价
            var obj = {}
            var xxx = []
            dataArr.map((t) => {
                obj.averagePrice = t.averagePrice
                obj.maxUnitPrice = t.maxUnitPrice;
                obj.minUnitPrice = t.minUnitPrice
                obj.totalPrice = t.totalPrice
                if (obj.averagePrice !== '') {
                    xxx.push(obj.averagePrice, obj.maxUnitPrice, obj.minUnitPrice, obj.totalPrice)
                }
                obj.averagePrice = ''
            })
            var result = []
            for (var i = 0; i < xxx.length; i += 4) {
                result.push(xxx.slice(i, i + 4));
            }





            this.chart = echarts.init(this.$el, "macarons");


            this.chart.setOption({
                animation: false,

                legend: {
                    // // bottom: 10,
                    // left: 'center',
                    data: ['每一天的数据', '5日平均线', '10日平均线', '20日平均线', '30日平均线']
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    borderWidth: 1,
                    borderColor: '#ccc',
                    backgroundColor:'#FFFFFF',
                    padding: 10,
                
                    textStyle: {
                        color: '#000'
                    },

                    position: function (pos, params, el, elRect, size) {
                        const obj = {
                            top: 10
                        };
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        return obj;
                    },
                    formatter: function (params) {//修改鼠标划过显示为中文
                     
                        if (params[0].componentSubType == "bar") {
                            var ma5 = params[2].data;//ma5的值
                            var ma10 = params[3].data;//ma10的值
                            var ma20 = params[4].data;//ma20的值
                            var ma30 = params[5].data;//ma30的值
                            var TransactionDate = params[1].name
                           let params1 = params[1];//开盘收盘最低最高数据汇总
                            var currentItemData = params1.data;
                        }

                        if (params[0].componentSubType == "candlestick") {
                            var ma5 = params[1].data;//ma5的值
                            var ma10 = params[2].data;//ma10的值
                            var ma20 = params[3].data;//ma20的值
                            var ma30 = params[4].data;//ma30的值
                            var TransactionDate = params[5].name
                            let params2 = params[0];//开盘收盘最低最高数据汇总
                            var currentItemData = params2.data;
                        }

                        // let TransactionVolume = params[5].data;//成交额的值


                        return TransactionDate + '<br>' +
                            '成交额:' + currentItemData[4] + '<br>' +
                            '<br>'
                            +
                            TransactionDate
                            + '<br>' +
                            '易为集团产品销售价格分布图'
                            + '<br>' +
                            '平均销售单价:' + currentItemData[1] + '<br>' +
                            '最高销售单价:' + currentItemData[2] + '<br>' +
                            '最低销售单价:' + currentItemData[3] + '<br>' +
                            '5日均线:' + ma5 + '<br>' +
                            '10日均线:' + ma10 + '<br>' +
                            '20日均线:' + ma20 + '<br>' +
                            '30日均线:' + ma30
                    }
                    // extraCssText: 'width: 170px'
                },
                axisPointer: {
                    link: [
                        {
                            xAxisIndex: 'all'
                        }
                    ],
                    label: {
                        backgroundColor: '#777'
                    }
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: false
                        },
                        brush: {
                            type: ['lineX', 'clear']
                        }
                    }
                },
                brush: {
                    xAxisIndex: 'all',
                    brushLink: 'all',
                    outOfBrush: {
                        colorAlpha: 0.5
                    }
                },
                visualMap: {
                    show: false,
                    seriesIndex: 5,
                    dimension: 2,
                    pieces: [
                        {
                            value: 1,
                            color:upColor ,
                        },
                        {
                            value: -1,
                            color:downColor,
                        }
                    ]
                },
                grid: [
                    {
                        left: '10%',
                        right: '8%',
                        height: '60%'
                    },
                    {
                        left: '10%',
                        right: '8%',
                        top: '80%',
                        height: '16%'
                    }
                ],

                dataZoom: [
                    {
                        type: 'inside',
                        xAxisIndex: [0, 1],
                        start: 20,
                        end: 30,

                    },
                    {
                        show: true,
                        xAxisIndex: [0, 1],
                        type: 'slider',
                        start: 20,
                        end: 30,
                        y: '90%',

                    }
                ],
                animation: false,// 翻页动画
                xAxis: [
                    {
                        type: 'category',
                        data: data.categoryData,
                        boundaryGap: false,
                        axisLine: { onZero: false },
                        splitLine: { show: false },
                        min: 'dataMin',
                        max: 'dataMax',
                        axisPointer: {
                            z: 100
                        }
                    },
                    {
                        type: 'category',
                        gridIndex: 1,
                        data: data.categoryData,
                        boundaryGap: false,
                        axisLine: { onZero: false },
                        axisTick: { show: false },
                        splitLine: { show: false },
                        axisLabel: { show: false },
                        min: 'dataMin',
                        max: 'dataMax'
                    }

                ],
                yAxis: [
                    {
                        type: 'value',
                        scale: true,
                        splitArea: {
                            show: true
                        }
                    },
                    {
                        scale: true,
                        gridIndex: 1,
                        splitNumber: 2,
                        axisLabel: { show: false },
                        axisLine: { show: false },
                        axisTick: { show: false },
                        splitLine: { show: false }
                    }
                ],
                series: [
                    {
                        name: '每一天的数据',
                        type: 'candlestick',
                        data: result,

                        itemStyle: {
                            color:downColor ,
                            color0: upColor,
                            borderColor: undefined,
                            borderColor0: undefined
                        },

                    },
                    {
                        name: '5日平均线',
                        type: 'line',
                        showSymbol: true,
                        data: calculateMA(5, dataArr),
                        smooth: true,
                        symbolSize: 5,    //小圆点的大小

                    },
                    {
                        name: '10日平均线',
                        type: 'line',
                        showSymbol: true,
                        data: calculateMA(10, dataArr),
                        smooth: true,
                        symbolSize: 5,    //小圆点的大小

                    },
                    {
                        name: '20日平均线',
                        type: 'line',
                        showSymbol: true,
                        data: calculateMA(20, dataArr),
                        smooth: true,
                        symbolSize: 5,    //小圆点的大小

                    },
                    {
                        name: '30日平均线',
                        type: 'line',
                        showSymbol: true,
                        data: calculateMA(30, dataArr),
                        smooth: true,
                        symbolSize: 5,    //小圆点的大小

                    },
                    {
                        name: '成交额',
                        type: 'bar',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: data.volumes,
                        itemStyle: {
                            color:downColor ,
                            color0: upColor,
                            borderColor: undefined,
                            borderColor0: undefined
                        },
                    },

                ]
            });

            // this.chart.dispatchAction({
            //     type: 'brush',
            //     areas: [
            //         {
            //             brushType: 'lineX',
            //             coordRange:  [ this.dateTime.searchDate+'-01-01', this.dateTime.searchDate+'-02-20']  ,
            //             xAxisIndex: 0
            //         }
            //     ]
            // });
        },

        // 这是用来测试的假数据库
        setChart() {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));

            var rawData = [['3538.35', '3580.6', '176963664',],
            ['3538.11', '3573.68', '187889600',],
            ['3515.52', '3564.17', '182551920',],
            ['3533.78', '3641.59', '269983264'],
            ['3601.74', '3635.26', '198451120',],
            ['3572.28', '3640.22', '227785216',],
            ['3633.03', '3684.57', '298201792',],
            ['3652.63', '261178752', '36084604'],
            ['3651.06', '299849280', '39831696'],
            ['3568.16', '3614.7', '273707904',],
            ['3533.63', '3583.41', '283856480'],
            ['3506.29', '3538.69', '193482304'],
            ['3496.85', '3529.96', '200471344',],
            ['3399.28', '3521.78', '215374624'],
            ['3410.92', '3455.55', '182908880'],
            ['3446.27', '3503.65', '200427520'],
            ['3454.88', '3495.7', '195698848']]

            // 计算各种日线图
            function calculateMA(dayCount, data) {
                var result = [];
                for (var i = 0, len = data.length; i < len; i++) {
                    if (i < dayCount) {
                        result.push('-');
                        continue;
                    }
                    var sum = 0;
                    for (var j = 0; j < dayCount; j++) {
                        sum += data[i - j][1];
                    }
                    result.push(sum / dayCount);
                }
                return result;
            }


            var dates = rawData.map(function (item) {
                return item[0];
            });

            var data = rawData.map(function (item) {
                return [+item[1], +item[2], +item[5], +item[6]];
            });
            // 指定图表的配置项和数据
            var option = {
                backgroundColor: '#21202D',// 背景色
                legend: {// 要画的线
                    data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30'],
                    inactiveColor: '#777',//图例关闭时的颜色。
                    textStyle: {//图例的公用文本样式。
                        color: '#fff'
                    }
                },
                tooltip: {//提示框组件
                    trigger: 'axis',
                    axisPointer: {//坐标轴指示器配置项。
                        animation: false,// 过渡动画
                        type: 'cross',// 类型:'line' 直线指示器,'shadow' 阴影指示器,'none' 无指示器,'cross' 十字准星指示器。
                        lineStyle: {// 线的样式
                            color: '#376df4',// 鼠标放到图上会出来一个竖立的坐标线
                            width: 2,
                            opacity: 1
                        }
                    }
                },
                xAxis: {//x轴设置
                    type: 'category',// 坐标轴类型。'value' 数值轴，适用于连续数据。'category' 类目轴，适用于离散的类目数据.'time' 时间轴，适用于连续的时序数据.'log' 对数轴。适用于对数数据。
                    data: dates,// x轴数据循环方法返回结果
                    axisLine: { lineStyle: { color: '#8392A5' } }// 底部x轴颜色
                },
                yAxis: {// y轴设置
                    scale: true,//是否是脱离 0 值比例。设置成 true 后坐标刻度不会强制包含零刻度。在双数值轴的散点图中比较有用。
                    axisLine: { lineStyle: { color: '#8392A5' } },//y轴线的颜色
                    splitLine: { show: false }//是否显示分隔线。默认数值轴显示，类目轴不显示。
                },
                grid: {//直角坐标系内绘图网格，单个 grid 内最多可以放置上下两个 X 轴，左右两个 Y 轴。可以在网格上绘制折线图，柱状图，散点图（气泡图）。
                    bottom: 60//grid 组件离容器下侧的距离。单位像素
                },
                dataZoom: [{//组件 用于区域缩放，从而能自由关注细节的数据信息，或者概览数据整体，或者去除离群点的影响。就是滚轴上下滚的缩放
                    textStyle: {
                        color: '#8392A5'
                    },
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',// 鼠标放在柱上会出来的图标,默认小手
                    handleSize: '80%',//控制手柄的尺寸，可以是像素大小，也可以是相对于 dataZoom 组件宽度的百分比，默认跟 dataZoom 宽度相同。
                    dataBackground: {//数据阴影的样式。
                        areaStyle: {//阴影的填充样式
                            color: '#8392A5'
                        },
                        lineStyle: {//阴影的线条样式
                            opacity: 0.8,
                            color: '#8392A5'
                        }
                    },
                    handleStyle: {//手柄的样式配置
                        color: '#fff',
                        shadowBlur: 3,//图形阴影的模糊大小
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }, {
                    type: 'inside'
                }],
                animation: false,// 翻页动画
                // 这里开始设置日k线,如单日,5日,10日,20日,30日
                series: [//系列列表。每个系列通过 type 决定自己的图表类型
                    {
                        type: 'candlestick',// 显示种类,如线性等
                        name: '日K',
                        data: data,// 日k线每日的数据
                        itemStyle: {// 对象样式
                            normal: {
                                color: '#FD1050',
                                color0: '#0CF49B',
                                borderColor: '#FD1050',
                                borderColor0: '#0CF49B'
                            }
                        }
                    },
                    {
                        name: 'MA5',// 5日k线
                        type: 'line',
                        data: calculateMA(5, data),// 使用它返回数据方法(几天，数据)
                        smooth: true,//平滑曲线显示(好看丝滑)
                        showSymbol: true,//是否显示 symbol, 如果 false 则只有在 tooltip hover 的时候显示。
                        lineStyle: {
                            normal: {
                                width: 1// 5日k线粗细
                            }
                        }
                    },
                    {
                        name: 'MA10',
                        type: 'line',
                        data: calculateMA(10, data),
                        smooth: true,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 1
                            }
                        }
                    },
                    {
                        name: 'MA20',
                        type: 'line',
                        data: calculateMA(20, data),
                        smooth: true,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 1
                            }
                        }
                    },
                    {
                        name: 'MA30',
                        type: 'line',
                        data: calculateMA(30, data),
                        smooth: true,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 1
                            }
                        }
                    }
                ]
            };
            //option.title = {text:"new"}



        },

    },
};
</script>
  
<style scoped>
.k-line {
    margin-top: 20px;
    background-color: pink;
}
</style>