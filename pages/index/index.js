import { request } from "../../request/index.js";
//Page Object
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList:[],
    // 楼层数组
    floorList:[]
  },
  onLoad: function () {
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },

  // 获取轮播图数组
  getSwiperList() {
    request({ url: '/home/swiperdata' })
      .then(result => {
        result.forEach(v=>v.navigator_url=v.navigator_url.replace('/main','/index'));
        this.setData({
          swiperList: result
        })
      })
  },

  // 获取分类导航数组
  getCatesList() {
    request({ url: '/home/catitems' })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },

  // 获取楼层数组
  getFloorList() {
    request({ url: '/home/floordata' })
      .then(result => {
        this.setData({
          floorList: result
        })
      })
  }
});
