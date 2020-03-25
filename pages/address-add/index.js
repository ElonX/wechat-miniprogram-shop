// pages/address-add/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  addAddress: function (e) {
    console.log("addAddress",e.detail.value)
    var that = this;
    wx.cloud.callFunction({
      name: 'tb_address', // 对应云函数名
      data: {
        $url: "add", //云函数路由参数
        code: e.detail.value
      },
      success: res => {
        //console.log("tb_address", res);
        wx.navigateBack();
      },
      fail: err => {
        console.error(err);
        wx.hideLoading()
        wx.showToast({
          title: '获取失败,请重新获取',
          icon: 'none',
          duration: 2000
        })
      }
    })

  }

})