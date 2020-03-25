const app = getApp()

// pages/my/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isadmin: false,

    userInfo: {},
    hasUserInfo: false,
    orderList:[],
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
    this.checklogin()
    this.adminEnable()
  },

  checklogin() {
    console.log("checklogin-app.navigateToLogin", app.navigateToLogin)
    let _userInfo = wx.getStorageSync('userInfo');
    if (!_userInfo) {
      app.goLoginPageTimeOut()
      return
    }else{
      wx.checkSession({
        fail() {
          app.goLoginPageTimeOut()
        }
      })

      _userInfo = wx.getStorageSync('userInfo');
    }

    if (_userInfo) {
      this.setData({
        userInfo: _userInfo,
        hasUserInfo: true
      })
    }

    this.orderList()
  },

  tochecklogin() {
    //app.navigateToLogin = false
    //this.checklogin()
    wx.navigateTo({
      url: "/pages/authorize/index"
    })
  },

  orderList() {
    var that = this;
    wx.cloud.callFunction({
      name: 'tb_order', // 对应云函数名
      data: {
        $url: "viewall", //云函数路由参数
      },
      success: res => {
        console.log("viewall", res.result);
        that.setData({
          orderList: res.result,
        })
      },
      fail: err => {
        console.error(err);
        wx.showToast({
          title: '获取失败,请重新获取',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  toPayTap: function (e) {
    const that = this;
    const orderId = e.currentTarget.dataset.id;
    that.setData({
      currentOrderId: orderId,
    })
    console.log("orderid", e.currentTarget.dataset)
    wx.cloud.callFunction({
      name: 'wxpay_order', // 对应云函数名
      data: {
        $url: "pay", //云函数路由参数
        code: orderId,
      },
      success: res => {
        //console.log("wxpay_order", res.result);
        that.pay(res.result)
      },
      fail: err => {
        console.error(err);
        wx.showToast({
          title: '获取失败,请重新获取',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  //实现小程序支付
  pay(payData) {
    let that = this;
    //官方标准的支付方法
    wx.requestPayment({
      timeStamp: payData.timeStamp,
      nonceStr: payData.nonceStr,
      package: payData.package, //统一下单接口返回的 prepay_id 格式如：prepay_id=***
      signType: 'MD5',
      paySign: payData.paySign, //签名
      success(res) {
        that.setStatus();
      },
    })
  },

  //修改卖家在售状态
  setStatus() {
    let that = this
    wx.showLoading({
      title: '正在处理',
    })
    // 利用云开发接口，调用云函数发起订单
    wx.cloud.callFunction({
      name: 'tb_order',
      data: {
        $url: "payok", //云函数路由参数
        orderid: that.data.currentOrderId,
      },
      success: res => {
        console.log('修改订单状态成功')
        wx.hideLoading();
        that.onShow();
      },
      fail(e) {
        wx.hideLoading();
        wx.showToast({
          title: '发生异常，请及时和管理人员联系处理',
          icon: 'none'
        })
      }
    })
  },

  adminEnable() {
    var that = this;
    wx.cloud.callFunction({
      name: 'tb_config', // 对应云函数名
      data: {
        $url: "isadminid", //云函数路由参数
      },
      success: res => {
        //console.log("admin", res.result);
        if (res.result){
          that.setData({
            isadmin: true,
          })
        }
      },
      fail: err => {
        console.error(err);
        wx.showToast({
          title: '获取失败,请重新获取',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  toadminpage() {
    wx.navigateTo({
      url: "/pages/admin/index"
    })
  },

  toDelOrderTap: function (e) {
    const that = this;
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定删除订单吗？',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'tb_order', // 对应云函数名
            data: {
              $url: "delorder", //云函数路由参数
              orderid: orderId,
            },
            success: res => {
              console.log("delorder", res)
              that.onShow()
            },
            fail: err => {
              console.error(err);
              wx.showToast({
                title: '获取失败,请重新获取',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      }
    })
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

  }
})