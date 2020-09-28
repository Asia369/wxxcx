import { request } from "../../request/index.js";
Page({

  data: {
    goods: [],
    isFocus:false,
    inputValue:''
  },
  TimeId: -1,
  // 输入窗改变
  handleInput(e) {
    const { value } = e.detail;
    if (!value.trim()) {
      this.setData({
        isFocus:false,
        goods:[]
      });
      return;
    }
    this.setData({
      isFocus:true
    });
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      request({ url: '/goods/qsearch', data: { query: value } })
        .then(result => {
          this.setData({ goods: result });
        })
    }, 1000);
  },
  // 取消按钮
  handleCancel(){
    this.setData({
      inputValue:'',
      isFocus:false,
      goods:[]
    });
  }
})