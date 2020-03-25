// pages/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    goodsWrap: [],
    categorySelected: "",
    goodsToView: "",
    categoryToView: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
  },
  initData() {
    let that = this;
    wx.showNavigationBarLoading();
    wx.cloud.callFunction({
      name: 'tb_group', // 对应云函数名
      data: {
        $url: "grouplist", //云函数路由参数
      },
      success: res => {
        var categories = [];
        for (var i = 0; i < res.result.length; i++) {
          let item = res.result[i];
          item.scrollId = "s" + item.id;
          categories.push(item);
          if (i == 0) {
            that.setData({
              categorySelected: item.scrollId,
            })
          }
        }
        that.setData({
          categories: categories,
        });
        that.getGoodsList();
      },
      fail: err => {
        wx.hideNavigationBarLoading();
        console.error(err);
        wx.showToast({
          title: '获取失败,请重新获取',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  getGoodsList: function () {
    let that = this;
    wx.cloud.callFunction({
      name: 'tb_goods', // 对应云函数名
      data: {
        $url: "viewall", //云函数路由参数
      },
      success: res => {
        let goodsWrap = [];
        that.data.categories.forEach((o, index) => {
          let wrap = {};
          wrap.id = o.id;
          wrap.scrollId = "s" + o.id;
          wrap.name = o.name;
          let goods = [];

          wrap.goods = goods;
          res.result.forEach((item, i) => {
            if (item.groupId == wrap.id) {
              goods.push(item)
            }
          })
          goodsWrap.push(wrap);
        })
        that.setData({
          goodsWrap: goodsWrap,
        });
        wx.hideNavigationBarLoading();
        console.log("that.data",that.data)
      },
      fail: err => {
        wx.hideNavigationBarLoading();
        console.error(err);
        wx.showToast({
          title: '获取失败,请重新获取',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },

  onCategoryClick: function (e) {

    let id = e.currentTarget.dataset.id;
    this.categoryClick = true;
    this.setData({
      goodsToView: id,
      categorySelected: id,
    })

  },

  scroll: function (e) {

    if (this.categoryClick) {
      this.categoryClick = false;
      return;
    }

    let scrollTop = e.detail.scrollTop;

    let that = this;

    let offset = 0;
    let isBreak = false;
    for (let g = 0; g < this.data.goodsWrap.length; g++) {
      let goodWrap = this.data.goodsWrap[g];
      offset += 30;
      if (scrollTop <= offset) {
        if (this.data.categoryToView != goodWrap.scrollId) {
          this.setData({
            categorySelected: goodWrap.scrollId,
            categoryToView: goodWrap.scrollId,
          })
        }
        break;
      }


      for (let i = 0; i < goodWrap.goods.length; i++) {
        offset += 91;
        if (scrollTop <= offset) {
          if (this.data.categoryToView != goodWrap.scrollId) {
            this.setData({
              categorySelected: goodWrap.scrollId,
              categoryToView: goodWrap.scrollId,
            })
          }
          isBreak = true;
          break;
        }
      }
      if (isBreak) {
        break;
      }
    }
  }
})