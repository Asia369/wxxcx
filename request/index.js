let ajaxTimes = 0;
export const request = (params) => {
    // 判断是否是私有路径-是-带上header token
    let header={};
    if(params.url.includes("/my/")){
        //拼接header带token
        header['Authorization']=wx.getStorageSync('token');
    }
    ajaxTimes++;
    wx.showLoading({
        title: '加载中',
        mask: true
    });
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes <= 0) {
                    wx.hideLoading();
                }
            }
        });
    })
}