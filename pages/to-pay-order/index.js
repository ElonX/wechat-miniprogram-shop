const app = getApp()

Page({
  data: {
    totalScoreToPay: 0,
    goodsList: [],
    isNeedLogistics: 1, // 是否需要物流信息
    allGoodsPrice: 0,
    yunPrice: 0,
    pingtuanOpenId: undefined, //拼团的话记录团号

    hasNoCoupons: true,
    coupons: [],
    youhuijine: 0, //优惠券金额
    curCoupon: null // 当前选择使用的优惠券
  },

  onShow: function () {
    var that = this;
    var shopList = [];

    //购物车下单
    var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
    if (shopCarInfoMem && shopCarInfoMem.shopList) {
      // shopList = shopCarInfoMem.shopList
      shopList = shopCarInfoMem.shopList.filter(entity => {
        return entity.active;
      });
    }
    console.log("shopList", shopList)
    that.setData({
      goodsList: shopList,
      allGoodsPrice: shopCarInfoMem.totalPrice,
    });
    that.initShippingAddress();
  },

  onLoad: function (e) {

  },

  createOrder: function (e) {
    var that = this;
    var loginToken = wx.getStorageSync('token') // 用户登录 token
    var totalPrice = that.data.allGoodsPrice;
    var remark = ""; // 备注信息
    if (e) {
      remark = e.detail.value.remark; // 备注信息
    }

    var postData = {
      token: loginToken,
      totalPrice: totalPrice,
      goodsList: that.data.goodsList,
      remark: remark
    };
    if (that.data.kjId) {
      postData.kjid = that.data.kjId
    }
    if (that.data.pingtuanOpenId) {
      postData.pingtuanOpenId = that.data.pingtuanOpenId
    }
    if (that.data.isNeedLogistics > 0) {
      if (!that.data.curAddressData) {
        wx.hideLoading();
        wx.showModal({
          title: '错误',
          content: '请先设置您的收货地址！',
          showCancel: false
        })
        return;
      }
      postData.addressData = that.data.curAddressData;
    }
    if (that.data.curCoupon) {
      postData.couponId = that.data.curCoupon.id;
    }
    if (!e) {
      postData.calculate = "true";
    }

    console.log("orderCreate", postData)
    wx.cloud.callFunction({
      name: 'tb_order', // 对应云函数名
      data: {
        $url: "add", //云函数路由参数
        code: postData
      },
      success: res => {
        wx.hideLoading()
        wx.removeStorageSync('shopCarInfo');
        // 下单成功，跳转到订单管理界面
        wx.switchTab({
          url: '/pages/my/index',
        });
      },
      fail: err => {
        console.error(err);
        wx.hideLoading()
        wx.showToast({
          title: '获取失败,请重新获取',
          icon: 'none',
          duration: 2000
        })
        wx.switchTab({
          url: '/pages/shop-cart/index',
        });
      }
    })

  },
  initShippingAddress: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'tb_address', // 对应云函数名
      data: {
        $url: "get", //云函数路由参数
      },
      success: res => {
        console.log("tb_address", res.result[0]);
        that.setData({
          curAddressData: res.result[0]
        });
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
  addAddress: function () {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/address-select/index"
    })
  }

})