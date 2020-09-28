import { request } from "../../request/index.js";
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    const address = wx.getStorageSync('address');
    let cart = wx.getStorageSync('cart') || [];
    cart = cart.filter(v => v.checked);
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((v) => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },
  // 点击支付 
  handleOrderPay() {
    try {
      const token = wx.getStorageSync('token');
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }
      // 创建订单
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }));

      const orderParams = { order_price, consignee_addr, goods };
      // 创建订单
      request({ url: '/my/orders/create', method: 'post', data: orderParams })
        .then(result1 => {
          const { order_number } = result1;
          // 发起预支付
          request({ url: '/my/orders/req_unifiedorder', method: 'post', data: { order_number } })
            .then(result2 => {
              const { pay } = result2;
              // 发起微信支付
              wx.wx.requestPayment({
                ...pay,
                success: (result3) => {
                  // 查询支付状态
                  request({ url: '/my/orders/chkOrder', method: 'post', data: { order_number } })
                    .then(result4 => {
                      wx.showToast({
                        title: '支付成功',
                      });

                      let newCart=wx.getStorageSync("cart");
                      newCart=newCart.filter(v=>!v.checked);
                      wx.getStorageSync('cart',newCart);
                      wx.navigateTo({
                        url: '/pages/order/index'
                      });
                    })
                }
              });
            })
        })
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: '支付成功',
      });
    }
  }
})


