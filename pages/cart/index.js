// pages/cart/index.js
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    const address = wx.getStorageSync('address');
    const cart = wx.getStorageSync('cart') || [];
    this.setData({
      address
    });
    this.setCart(cart);
  },
  // 选择地址
  handleChooseAddress() {
    wx.getSetting({
      success: (result) => {
        const scopeAddress = result.authSetting["scope.address"];
        if (scopeAddress === true || scopeAddress === undefined) {
          this.fun_getAddressAndSave();
        } else {
          // 用户曾经拒绝过-现在进行引导
          wx.openSetting({
            success: () => {
              this.fun_getAddressAndSave();
            }
          })
        }
      }
    })

  },
  // 获取地址并保存
  fun_getAddressAndSave() {
    wx.chooseAddress({
      success: (result) => {
        let address = result;
        address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
        wx.setStorageSync('address', address);
      }
    })
  },
  // 商品选中或取消事件
  handleItemChange(e) {
    const goods_id = e.currentTarget.dataset.id;
    let { cart } = this.data;
    let index = cart.findIndex(v => v.goods_id === goods_id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  // 设置购物车
  setCart(cart) {
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    if (cart.length > 0) {
      cart.forEach((v) => {
        if (v.checked) {
          totalPrice += v.num * v.goods_price;
          totalNum += v.num;
        } else {
          allChecked = false;
        }
      })
    } else {
      allChecked = false;
    }
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync('cart', cart);
  },
  // 全选反选
  handleItemAllCheck(){
    let {cart,allChecked}=this.data;
    allChecked=!allChecked;
    cart.forEach(v=>v.checked=allChecked);
    this.setCart(cart);
  },
  // 商品数量的编辑功能
  handleItemNumEdit(e){
    let {id,operation}= e.currentTarget.dataset;
    let {cart}= this.data;
    let index= cart.findIndex(v=>v.goods_id===id);
    if(cart[index].num===1&&operation===-1){
      wx.showModal({
        title: '提示',
        content: '这是否要删除？',
        success :(res)=> {
          if (res.confirm) {
            cart.splice(index,1);
            this.setCart(cart);
          }
        }
      })
    }else{
      cart[index].num+=operation;
      this.setCart(cart);
    }
  },
  // 结算
  handlePay(){
    let {address,totalNum}= this.data;
    if(!address.userName){
      wx.showToast({
        title: '您还没有选择收货地址！',
        icon: 'none',
        mask: false,
      });
      return; 
    }
    if(totalNum===0){
      wx.showToast({
        title: '您还没有选购商品！',
        icon: 'none',
        mask: false,
      });
      return; 
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
})