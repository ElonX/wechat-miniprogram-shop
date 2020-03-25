// pages/goods-details/index.js
const app = getApp();

Page({
  data: {
    swiperCurrent: 0,

    goodsDetail: {},
    goodsPrice: 0,
    shopNum: 0, // 购物车中商品数量
    buyNumber: 1,
    buyNumMin: 1,
    buyNumMax: 99,

    propertyChildIds: "",
    propertyChildNames: "",
    //canSubmit: false, //  选中规格尺寸时候是否允许加入购物车
    shopCarInfo: {},
    currentPages: undefined
  },
  swiperchange: function (e) { // banner滚动事件
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  onLoad(e) {   
    //console.log("onLoad",e)
    this.data.goodsId = e.id
    this.getGoodsDetail(this.data.goodsId)
    const that = this
    // 获取购物车数据
    wx.getStorage({
      key: 'shopCarInfo',
      success: function (res) {
        that.setData({
          shopCarInfo: res.data,
          shopNum: res.data.shopNum,
          curuid: wx.getStorageSync('uid')
        });
      }
    })
  },
  onShow() {

  },
  getGoodsDetail(goodsId) {
    console.log("getGoodsDetail", goodsId)
    const that = this;
    let goodsDetailRes = {}
    wx.cloud.callFunction({
      name: "get_goods_details_viewdata",
      data:{
        id: goodsId
      },
      success(res) {
        console.log("get_goods_details_viewdata", res.result.goods)
        that.setData({
          goodsDetail: res.result.goods,
          goodsPrice: res.result.goods.priceCurrent,
        })
      }
    })


  },
  goShopCar: function () {
    wx.reLaunch({
      url: "/pages/shop-cart/index"
    });
  },
  numJianTap: function () {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  numJiaTap: function () {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  


  /**
   * 加入购物车
   */
  addShopCar: function () {
      
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    //组建购物车
    var shopCarInfo = this.bulidShopCarInfo();

    this.setData({
      shopCarInfo: shopCarInfo,
      shopNum: shopCarInfo.shopNum
    });

    // 写入本地存储
    wx.setStorage({
      key: 'shopCarInfo',
      data: shopCarInfo
    })
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success'
    })
  },
  /**
   * 组建购物车信息
   */
  bulidShopCarInfo: function () {
    // 加入购物车
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail._id;
    shopCarMap.pic = this.data.goodsDetail.detailImgUrl[0];
    shopCarMap.name = this.data.goodsDetail.name;
    shopCarMap.price = this.data.goodsPrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = '快递';
    shopCarMap.logistics = '快递';
    shopCarMap.weight = '_';

    var shopCarInfo = this.data.shopCarInfo;
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = [];
    }
    var hasSameGoodsIndex = -1;
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
      var tmpShopCarMap = shopCarInfo.shopList[i];
      if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
        hasSameGoodsIndex = i;
        shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
        break;
      }
    }

    shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
    if (hasSameGoodsIndex > -1) {
      shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
    } else {
      shopCarInfo.shopList.push(shopCarMap);
    }
    shopCarInfo.kjId = this.data.kjId;
    return shopCarInfo;
  },
  onShareAppMessage: function () {
    let _data = {
      title: this.data.goodsDetail.basicInfo.name,
      path: '/pages/goods-details/index?id=' + this.data.goodsDetail.basicInfo.id + '&inviter_id=' + wx.getStorageSync('uid'),
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
    return _data
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    });
  }
})