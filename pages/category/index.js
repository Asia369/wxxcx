import { request } from "../../request/index.js";
Page({
  data: {
    leftMenuList: [],
    rightContent: [],
    currentIndex: 0,
    scrollTop:0
  },
  Cates: [],
  onLoad: function (options) {
    const cates = wx.getStorageSync('cates');
    if (!cates) {
      this.getCates();
    } else {
      if (Date.now() - cates.time > 1000 * 5) {
        this.getCates();
      } else {
        this.Cates = cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  getCates() {
    request({ url: '/categories' })
      .then(res => {
        this.Cates = res;
        wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      })
  },
  handleItemTap(e) {
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop:0
    })
  }
})