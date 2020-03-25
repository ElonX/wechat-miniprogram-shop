// pages/authorize/index.js
var app = getApp();

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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindGetUserInfo: function (e) {
    if (!e.detail.userInfo) {
      return;
    }
    if (app.globalData.isConnected) {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      console.log("userInfo", e.detail.userInfo)
      //注册/登录
      wx.cloud.callFunction({
        name: "userinfo_login",
        data: e.detail.userInfo,
        success(res) {
          console.log("注册/登录记录完成", res)
        }
      })

      this.login();
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
  },
  login: function () {
    wx.removeStorageSync('token')
    wx.login({
      success: function (re) {

        wx.cloud.callFunction({
          name: 'getSessionOrOpenid', // 对应云函数名
          data: {
            $url: "session", //云函数路由参数
            code: re.code
          },
          success: res => {
            console.log("getSessionOrOpenid",res);
            wx.hideLoading();
            if (res.result == null) {
              wx.showToast({
                title: '获取失败,请重新获取',
                icon: 'none',
                duration: 2000
              })
              return false;
            }
            //获取成功
            wx.setStorageSync('token', res.result.data.session_key)
            wx.setStorageSync('uid', res.result.data.unionid)
            // 回到原来的地方放
            app.navigateToLogin = false
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
  }


})