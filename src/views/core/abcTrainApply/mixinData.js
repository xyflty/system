import { list } from "@/api/common.js";
export default {
    data() {
        return {
            columns: [
                {
                    key: 0,
                    label: `ID`,
                    width: "180",
                    prop: "id",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
                {
                    key: 1,
                    label: `学员名称`,
                    width: "100",
                    prop: "userName",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
                {
                    key: 2,
                    label: `销售人员`,
                    width: "180",
                    prop: "saleName",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
                {
                    key: 3,
                    label: `培训时间`,
                    width: "100",
                    prop: "trainTime",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
                {
                    key: 4,
                    label: `考试时间`,
                    width: "100",
                    prop: "examTime",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
                {
                    key: 5,
                    label: `培训类别`,
                    width: "100",
                    prop: "trainType",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
                {
                    key: 6,
                    label: `开通题库`,
                    width: "100",
                    prop: "openExam",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
                {
                    key: 15,
                    label: `是否企业用户`,
                    width: "100",
                    prop: "companyFocus",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
                {
                    key: 7,
                    label: `费用`,
                    width: "100",
                    prop: "price",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
                {
                    key: 8,
                    label: `班型`,
                    width: "100",
                    prop: "classType",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
                {
                    key: 9,
                    label: `招生老师`,
                    width: "100",
                    prop: "recruiter",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
                {
                    key: 10,
                    label: `考试形式`,
                    width: "100",
                    prop: "examType",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
                {
                    key: 15,
                    label: `收款方式`,
                    width: "100",
                    prop: "paymentType",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
                {
                    key: 16,
                    label: `收款主体`,
                    width: "100",
                    prop: "paymentMain",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
                {
                    key: 11,
                    label: `所属企业全称`,
                    width: "150",
                    prop: "companyName",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
                {
                    key: 12,
                    label: `身份证号码`,
                    width: "180",
                    prop: "idCardNumber",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
                {
                    key: 13,
                    label: `手机号`,
                    width: "180",
                    prop: "phoneNumber",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
                {
                    key: 14,
                    label: `备注`,
                    width: "180",
                    prop: "remark",
                    visible: true,
                    showOverflow: true,
                    sortable: "custom",
                },
            ],
        }
    },
    methods: {
        // 排序改变
        sortChange({ column, prop, order }) {
            this.queryParams.orderBy = prop;
            this.queryParams.orderType = order === "descending" ? "desc" : "asc";
            this.getList();
        },

        getCloumns() {
            let columns = JSON.parse(JSON.stringify(this.columns));

            list({ pageName: "abcTrainApply" }).then((res) => {
                if (res.rows && res.rows.length) {
                    let data = res.rows.map((item) => ({
                        key: item.tableColumnKey,
                        label: item.label,
                        width: item.width,
                        prop: item.prop,
                        visible: item.visible,
                        showOverflow: item.showOverFlow,
                        sortable: item.sortable,
                    }));

                    let arr = data.filter((item) => item.visible);

                    let result = columns.filter((item) => {
                        item.visible = false;
                        return !arr.find((obj) => {
                            return obj.key === item.key;
                        });
                    });

                    this.columns = [...arr, ...result];
                }
            });
        },
    }
}