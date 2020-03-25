// pages/address-select/index.js
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'tb_address', // 对应云函数名
      data: {
        $url: "get", //云函数路由参数
      },
      success: res => {
        console.log("tb_address", res.result[0]);
        that.setData({
          addrinfo: res.result[0]
        });
        console.log("addrinfo", that.data.addrinfo);
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

  },

  updateAddress: function(e){
    var that = this;
    wx.cloud.callFunction({
      name: 'tb_address', // 对应云函数名
      data: {
        $url: "set", //云函数路由参数
        code: e.detail.value
      },
      success: res => {
        console.log("tb_address", res.result);
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