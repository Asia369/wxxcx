import { request } from "../../request/index.js";
Page({

  // 获取用户信息
  handleGetUserInfo(e) {
    // 获取用户信息
    const { encryptedData, rawData, iv, signature } = e.detail;

    // 获取小程序登录成功后的code
    wx.login({
      timeout: 10000,
      success: (result) => {
        const { code } = result;
        const loginParams = { encryptedData, rawData, iv, signature, code };
        request({ url: '/users/wxlogin', data: loginParams, method: 'post' })
          .then(result => {
           // let {token}=result;
           let token="aaaaaaaaaaaaaaa";//TODO
            wx.setStorageSync("token", token);
            wx.navigateBack({
              delta: 1
            });
          })
      }
    });
  }
})