//app.js
App({
  navigateToLogin: false,

  globalData: {
    isConnected: true,
    launchOption: undefined,

    userInfo: null
  },

  onLaunch: function () {
    
    //云开发初始化
    wx.cloud.init({
      traceUser: true,
      env: "---------------------"
    })

    const that = this;
    // 检测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showToast({
        title: '新版本升级中',
        icon: 'loading'
      })
      updateManager.applyUpdate()
    })
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    })
  },


  goLoginPageTimeOut: function () {
    if (this.navigateToLogin) {
      return
    }
    this.navigateToLogin = true
    setTimeout(function () {
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
    }, 1000)
  }

})