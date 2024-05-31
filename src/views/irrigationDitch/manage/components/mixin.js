export default {
    data() {
        return {
            rules: {
                followUpMethod: [
                    { required: true, message: "跟进方式不能为空", trigger: "blur" },
                ],
                followUpTime: [
                    { required: true, message: "跟进时间不能为空", trigger: "change" },
                ],
                title: [
                    { required: true, message: "跟进事由不能为空", trigger: "change" },
                ],
                content: [
                    { required: true, message: "工作总结不能为空", trigger: "change" },
                ],
                status: [
                    {
                        required: true,
                        message: "商机状态不能为空",
                        trigger: "blur",
                    },
                ],
                companyName: [
                    { required: true, message: "企业名称不能为空", trigger: "change" },
                ],
                nextFollowUpTime: [
                    { required: true, message: "下次跟进时间不能为空", trigger: "change" },
                ],
            },
        }
    }
}