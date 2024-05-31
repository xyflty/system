
import { treeselect } from "@/api/system/dept";
import { systemUserListForSelect } from "@/api/system/user";
import { filterDepts } from "@/utils/common";
export default {
    data() {
        return {
            getTreeselectArr: [],
            getTreeselectArr1: [],
            tabData: [
            ],
            tabData1: [
            ],
            tabData2: [
            ],
            pickerType: "monthrange",
            valueFormat: "yyyy-MM",
            dateMonth: "",
            typeM: ['面谈', '电话', '微信', '短信', '邮件', 'QQ', '其他',],
            // 时间
            deptOptions: [],
            opportunityStatus: ['合同阶段', '', '发现需求', '确认需求', '提供解决方案', '促成及处理异议'],
            // 人
            userList: [],
            oruer: ['支付首款', '进度款', '收取尾款', '已办结', '已退单', '支付全款'],
            // 请求数据
            queryParams: {
                orderStatus: undefined,
                followUpMethod: undefined,
                dataSourceType: undefined,
                deptIds: undefined,
                userId: "",
                timeType: 1,
                timeValueBegin: "2023",
                timeValueEnd: "2023",
                pageNum: 1,
                pageSize: 10,
                setDatesType: '',
            },
            total: 0,
            showList: null,
        }
    },
    watch: {
        dateMonth: {
            handler(n) {
                this.queryParams.timeValueBegin = n != null ? n[0] : "";
                this.queryParams.timeValueEnd = n != null ? n[1] : "";
            },
        },
        "timeType": {
            handler(n) {
                this.queryParams.timeType = this.timeType == 4 ? 3 : this.timeType;

                if (n == 1) {
                    if (this.setStartYear !== undefined) {
                        this.queryParams.timeValueBegin = this.setStartYear,
                            this.queryParams.timeValueEnd = this.setEndYear;
                    } else {
                        this.dateMonth =

                            ["2023", "2023"]
                    }

                } else if (n == 3) {
                } else {
                    this.pickerType = n == 2 ? "monthrange" : "daterange";
                    this.valueFormat = n == 2 ? "yyyy-MM" : "yyyy-MM-dd";


                    if (n == 2) {

                        if (this.setStartMonth !== undefined) {
                            this.dateMonth =

                                [this.setStartMonth, this.setEndMonth]
                        } else {
                            this.dateMonth =

                                ["2023-01", "2023-01"]
                        }



                    } else {

                        if (this.setStartDay !== undefined) {
                            this.dateMonth =

                                [this.setStartDay, this.setEndDay]
                        } else {
                            this.dateMonth =

                                ["2023-01-01", "2023-01-01"]
                        }



                    }

                }
            },
            deep: true,
        },
    },
    methods: {
        treeselectinput(i) {

            if (i.length) {
                this.queryParams.deptIds = this.getTreeselectArr1.join(",");
                this.queryParams.userId = ""
            } else {
                if (!this.queryParams.userId) {
                    this.getTreeselectArr1 = [this.deptOptions[0].id]
                }
            }
        },
        selectInput(i) {
            this.queryParams.userId = i
            if (this.queryParams.userId) {
                this.queryParams.deptIds = undefined
                this.getTreeselectArr1 = []
            }
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
          
            // this.queryParams =this.$route.query
            this.queryParams.pageNum = 1;
            this.queryParams.pageSize = 10;

            this.timeType = this.$route.query.timeType
            this.timeType = Number(this.timeType)
           
            this.queryParams.timeType = this.$route.query.timeType
            this.queryParams.timeValueBegin = this.$route.query.timeValueBegin
            this.queryParams.timeValueEnd = this.$route.query.timeValueEnd
            if (this.$store.state.user.treeList) {
                this.queryParams.deptIds = this.$route.query.deptIds
            } else {
                this.queryParams.userId = this.$route.query.userId;
            }
            this.$nextTick(() => {
                if (this.queryParams.timeType == 3) {
                    this.$refs.Chooseweek.getMont(this.$route.query.timeValueBegin);
                }
            })
      
            if (this.queryParams.timeType == 1) {
                this.setStartYear = this.queryParams.timeValueBegin
                this.setEndYear = this.queryParams.timeValueEnd
           
            }
            if (this.queryParams.timeType == 2) {
                this.setStartMonth = this.queryParams.timeValueBegin
                this.setEndMonth = this.queryParams.timeValueEnd
            }
            if (this.queryParams.timeType == 4) {
                this.setStartDay = this.queryParams.timeValueBegin
                this.setEndDay = this.queryParams.timeValueEnd
            }
            // this.resetForm("queryForm");

            this.getList();
        },
        /** 查询部门下拉树结构 */
        getTreeselect() {

            if (this.$store.state.user.treeList) {
                const { children, deptIds } = filterDepts(this.$store.state.user.treeList, this.$store.state.user.defaultDeptId);
                this.deptOptions = children
                // 判断是否部门是否存在 存在显示部门 否则是个人账号对其限制展示
                this.showList = this.$store.state.user.treeList

                let treeList = this.$store.state.user.treeList

                // // 判断是否是最后一个部门 是的话获取其子类所有人员进行展示
                // if (!children[0].children) {
                //     this.queryParams.deptId = treeList[0].id
                // }
               

             
                if (this.$route.query.deptIds) {
                    this.queryParams.deptIds = this.$route.query.deptIds
                } else {
                    this.queryParams.deptIds = deptIds
                }

                this.getTreeselectArr1 = String(this.queryParams.deptIds).split(",").map((i) => {

                    // 对变量类型进行转换 不转换的话无法删除部门的第一项
                    if (i == 200 || i == 100) {

                        return Number(i);
                    } else {
                        return i;
                    }
                });
                this.getTreeselectList(this.deptOptions)
                this.getUserList(this.$store.state.user.defaultDeptId);
            } else {

                //获取当前登录的部门 
                this.queryParams.deptId = "";
                this.queryParams.deptIds = "";
                if (this.$route.userId) {
                    this.queryParams.userId = this.$route.query.userId;
                } else {
                    this.queryParams.userId = this.$store.state.user.userId;
                }

                this.getTreeselectArr1 = [];
                this.showDepartSelect = false

                this.userList = [
                    {
                        userId: '',
                        userName: '',
                    }
                ]
                this.userList[0].userId = this.$store.state.user.userId;
                this.userList[0].userName = this.$store.state.user.name;
                this.ableClear = false
            }
     
            if (this.queryParams.userId) {
                this.queryParams.deptId = undefined;
                this.queryParams.deptIds = undefined;
                this.getTreeselectArr1 = [];
                this.queryParams.userId = this.queryParams.userId;
            }
            // await treeselect().then((response) => {
            //     this.deptOptions = response.data;

            //  
            // this.getTreeselectList(this.deptOptions)

            // });
        },
        getTreeselectList(deptOptions) {
            var _this = this;
            deptOptions.forEach((element) => {
                if (element.children) {
                    _this.getTreeselectList(element.children);
                } else {
                    this.getTreeselectArr.push(element.id);
                }
            });
        },
        getTreeselectList1(children, dep) {

            var _this = this;

            if (this.getTreeselectArr1.length) {
                return;
            }

            if (children) {
                children.forEach((element) => {

                    if (dep == element.id) {

                        // if (element.children) {
                        this.getTreeselectArr1 = element.children.map((i) => {

                            return i.id;
                        });
                        // }

                        return
                    } else {
                        _this.getTreeselectList1(element.children, dep);
                    }
                });
            }

        },
        /** 查询用户列表 */
        getUserList(deptId, e, isFocus = true) {
            systemUserListForSelect({
                pageNum: 1,
                pageSize: 10,
                userName: isFocus ? "" : e,
                deptId: deptId,
            }).then((response) => {
                this.userList = response.rows;

            });
        },
        // 根据id进行存储
        getDataIds(id, paramsData) {

            treeselect().then((response) => {
                this.deptOptions = response.data;
                this.getDataListId(this.deptOptions, id, paramsData)


            });
        },
        getDataListId(deptOptions, id, paramsData) {

            var _this = this;
            let idArr2 = []
            let idArr3 = []
            let idArr4 = []
            let childrenArr = [], // 拿到对于元素的子数组
                idArr = [], // 拿到对于元素的子id
                sonData = '', // 存储第一遍id
                childData = ''; // 存储第一遍子数组


            id = String(id).split(",").map((i) => {
                if (i == 200) {
                    return Number(i);
                } else {
                    return i;
                }
            });

            let datas = deptOptions.map(t => {
                return t
            })

            let key
            let items

            for (let i = 0; i < datas.length; i++) {
                key = datas[i].id
                items = datas[i].children
            }

            // 遍历第一次
            for (let i = 0; i < items.length; i++) {
                sonData = items[i].id
                childData = items[i].children
                idArr.push(sonData)
                childrenArr.push(childData)
            }

            if (idArr !== []) {
                for (let i = 0; i < id.length; i++) {

                    for (let j = 0; j < idArr.length; j++) {

                        if (id[i] == idArr[j]) {

                            return sessionStorage.setItem('twoPage', JSON.stringify(paramsData))

                        } else {

                            let changeArr = []
                            childrenArr.forEach(item => {
                                if (item !== undefined) {
                                    return item.map(key => {

                                        childData = key.children
                                        sonData = key.id
                                        idArr2.push(sonData)
                                        changeArr.push(childData)


                                    })
                                }

                            })

                            childrenArr = changeArr

                        }
                    }

                }
            }



            // 遍历第二次


            if (idArr2 !== []) {

                for (let i = 0; i < id.length; i++) {

                    for (let j = 0; j < idArr2.length; j++) {

                        if (id[i] == idArr2[j]) {



                            return sessionStorage.setItem('threePage', JSON.stringify(paramsData))



                        } else {

                            let changeArr = []
                            childrenArr.forEach(item => {

                                if (item !== undefined) {
                                    for (let key = 0; key < item.length; key++) {
                                        childData = item[key].children
                                        sonData = item[key].id
                                        idArr3.push(sonData)
                                        changeArr.push(childData)

                                    }

                                }

                            })

                            childrenArr = changeArr

                        }
                    }

                }






            }

            // 遍历第三次
            if (idArr3 !== []) {

                for (let i = 0; i < id.length; i++) {

                    for (let j = 0; j < idArr3.length; j++) {

                        if (id[i] == idArr3[j]) {



                            return sessionStorage.setItem('forePage', JSON.stringify(paramsData))



                        } else {

                            let changeArr = []
                            childrenArr.forEach(item => {

                                if (item !== undefined) {
                                    for (let key = 0; key < item.length; key++) {
                                        childData = item[key].children
                                        sonData = item[key].id
                                        idArr4.push(sonData)
                                        changeArr.push(childData)

                                    }

                                }

                            })

                            childrenArr = changeArr

                        }
                    }

                }






            }

        },
        // getBackDatas(id,) {
        //     treeselect().then((response) => {
        //         this.deptOptions = response.data;
        //         this.getBackDataList(this.deptOptions, id)


        //     });

        // },
        // //  返回的时候判断获取哪个值
        // getBackDataList(deptOptions, id) {


        //     var _this = this
        //     let idArr2 = []
        //     let idArr3 = []
        //     let idArr4 = []
        //     let childrenArr = [], // 拿到对于元素的子数组
        //         idArr = [], // 拿到对于元素的子id
        //         sonData = '', // 存储第一遍id
        //         childData = ''; // 存储第一遍子数组

        //     id = String(id).split(",").map((i) => {
        //         if (i == 200) {
        //             return Number(i);
        //         } else {
        //             return i;
        //         }
        //     });

        //     let datas = deptOptions.map(t => {
        //         return t
        //     })

        //     let key
        //     let items

        //     for (let i = 0; i < datas.length; i++) {
        //         key = datas[i].id
        //         items = datas[i].children
        //     }

        //     // 遍历第一次
        //     for (let i = 0; i < items.length; i++) {
        //         sonData = items[i].id
        //         childData = items[i].children
        //         idArr.push(sonData)
        //         childrenArr.push(childData)
        //     }

        //     if (idArr !== []) {
        //         for (let i = 0; i < id.length; i++) {

        //             for (let j = 0; j < idArr.length; j++) {

        //                 if (id[i] == idArr[j]) {


        //                     return;
        //                 } else {

        //                     // let changeArr = []
        //                     // childrenArr.forEach(item => {
        //                     //     if (item !== undefined) {
        //                     //         return item.map(key => {

        //                     //             childData = key.children
        //                     //             sonData = key.id
        //                     //             idArr2.push(sonData)
        //                     //             changeArr.push(childData)


        //                     //         })
        //                     //     }

        //                     // })

        //                     // childrenArr = changeArr

        //                 }
        //             }

        //         }
        //     }



        //     // 遍历第二次


        //     if (idArr2 !== []) {

        //         for (let i = 0; i < id.length; i++) {

        //             for (let j = 0; j < idArr2.length; j++) {

        //                 if (id[i] == idArr2[j]) {



        //                     this.queryParams = JSON.parse(sessionStorage.getItem('onePage'))
        //                     this.getTreeselectArr1 = String(this.queryParams.deptIds).split(",").map((i) => {
        //                         if (i == 200) {
        //                             return Number(i);
        //                         } else {
        //                             return i;
        //                         }
        //                     });
        //                     this.getList();
        //                     this.getTreeselect();
        //                     this.getDetailTopData();
        //                     this.getIndexPieChar();
        //                     break


        //                 } else {

        //                     let changeArr = []
        //                     childrenArr.forEach(item => {

        //                         if (item !== undefined) {
        //                             for (let key = 0; key < item.length; key++) {
        //                                 childData = item[key].children
        //                                 sonData = item[key].id
        //                                 idArr3.push(sonData)
        //                                 changeArr.push(childData)

        //                             }

        //                         }

        //                     })

        //                     childrenArr = changeArr

        //                 }
        //             }

        //         }






        //     }





        // }
    },
}