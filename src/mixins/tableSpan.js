// 处理表格数据公共方法
export const tableSpan = {
  data() {
    return {
      spanData: [],
      pos: 0,
    };
  },
  methods: {
    // 解构树结构
    deconstructionTree(tree, arr = []) {
      tree.map((item) => {
        if (item.zwOrderProjectVos && item.zwOrderProjectVos.length) {
          arr.push(...this.deconstructionTree(item.zwOrderProjectVos));
          delete item.zwOrderProjectVos;
        } else {
          arr.push(item);
        }
      });
      return arr;
    },
    // 根据订单id判断需要合并的行
    getSpanId(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (i === 0) {
          this.spanData.push(1);
          this.pos = 0;
        } else {
          if (arr[i].orderId === arr[i - 1].orderId) {
            // 判断上一行的订单id跟当前行是否一样
            this.spanData[this.pos] += 1;
            this.spanData.push(0);
          } else {
            this.spanData.push(1);
            this.pos = i;
          }
        }
      }
    },
    // 计算需要合并的单元格
    getSpanData(data) {
      this.spanData = [];
      this.pos = 0;
      data.forEach((item) => {
       
        if (item.zwOrderProjectVos.length) {
          item.zwOrderProjectVos = item.zwOrderProjectVos.map((ele) => {
            return {
              ...item,
              ...ele,
              zwOrderProjectVos: [],
            };
          });
        }
      });

      let arr = this.deconstructionTree(data);
      this.getSpanId(arr);
      return arr;
    },
  },
};
