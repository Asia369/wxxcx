import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect: false
  },
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const { goods_id } = currentPage.options;
    this.getGoodsDetail(goods_id);
  },
  getGoodsDetail(goods_id) {
    request({ url: '/goods/detail', data: { goods_id } })
      .then(result => {
        this.GoodsInfo = result;

        // 商品收藏
        let collect = wx.getStorageSync("collect") || [];
        let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);

        this.setData({
          goodsObj: {
            goods_name: result.goods_name,
            goods_price: result.goods_price,
            goods_introduce: result.goods_introduce,
            pics: result.pics
          },
          isCollect
        });
      })
  },
  // 点击图片预览
  handlePreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    wx.previewImage({
      current: urls[index],
      urls: urls
    });
  },
  // 加入购物车
  handleCartAdd() {
    let cart = wx.getStorageSync('cart') || [];
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      // 第一次参加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      cart[index].num++;
    }
    // 重新添加进缓存
    wx.setStorageSync('cart', cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    })
  },
  // 收藏
  handleCollect() {
    let isCollect = false;
    let collect = wx.getStorageSync("collect") || [];
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index !== -1) {
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });
    } else {
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    wx.setStorageSync("collect", collect);
    this.setData({ isCollect });
  }
})