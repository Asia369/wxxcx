// pages/feedback/index.js
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    chooseImgs: [],
    textVal: ''
  },
  UpLoadImgs: [],
  handleTabsItemChange(e) {
    const { index } = e.detail;
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  // 选择图片
  handleChooseImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        });
      }
    });
  },
  // 删除图片
  handleRemoveImg(e) {
    const { index } = e.currentTarget.dataset;
    let { chooseImgs } = this.data;
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    });
  },
  // 文本域变直
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    });
  },
  // 表单提交
  handleFormSubmit() {
    const { textVal, chooseImgs } = this.data;
    if (!textVal.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    wx.showLoading({
      title: '正在上传中',
      mask: true
    });
    if (chooseImgs.length > 0) {
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          filePath: v,
          name: 'file',
          formData: {},
          success: (result) => {
            let url = JSON.parse(result.data).url;
            this.UpLoadImgs.push(url);
            // 判断上传结束
            if (i === chooseImgs.length - 1) {
              wx.hideLoading();
              // =====提交相关资料到后台
              console.log("此处模拟提交图文");
              // 重置页面
              this.setData({
                textVal: '',
                chooseImgs: []
              });
              // 返回上一页面
              wx.navigateBack({
                delta: 1
              });

            }
          }
        });
      });
    } else {
      wx.hideLoading();
      console.log("此处模拟提交文本");
       // 返回上一页面
       wx.navigateBack({
        delta: 1
      });
    }
  }
})