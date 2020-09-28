import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]
  },
  queryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryParams.cid=options.cid||'';
    this.queryParams.query=options.query||'';
    this.getGoodsList();
  },
  getGoodsList(){
    request({ url: '/goods/search',data:this.queryParams })
      .then(result => {
        const total=result.total;
        this.totalPages=Math.ceil(total/this.queryParams.pagesize);
        this.setData({
          goodsList:[...this.data.goodsList,...result.goods]
        })
        wx.stopPullDownRefresh();
      })
  },
  handleTabsItemChange(e){
    const {index}=e.detail;
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    this.setData({
      tabs
    })
  },
  // 页面触底事件
  onReachBottom(){
    if(this.queryParams.pagenum>=this.totalPages){
      wx.showToast({
        title: '没有下一页数据',
      })
    }else{
      this.queryParams.pagenum++;
      this.getGoodsList();
      console.log(this.queryParams.pagenum)
    }
  },
  // 下拉刷新
  onPullDownRefresh(){
    this.setData({
      goodsList:[]
    })
    this.queryParams.pagenum=1;
    this.getGoodsList();
  }
})