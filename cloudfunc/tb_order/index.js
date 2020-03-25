const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router');

cloud.init()
let db = cloud.database()
let tb = db.collection("moon_tb_orders")

Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'S+': this.getMilliseconds()
  };
  //因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
  if (/(y+)/.test(fmt)) {
    //第一种：利用字符串连接符“+”给date.getFullYear()+''，加一个空字符串便可以将number类型转换成字符串。
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      //第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(String(o[k]).length)));
    }
  }
  return fmt;
};

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  });

  //获取全部
  app.router('viewall', async (ctx) => {
    const wxContext = cloud.getWXContext()
    let adrs = await tb.where({
      openid: wxContext.OPENID,
      stu_view: 1,
    }).get()
    ctx.body = adrs.data;
  });

  //获取一个
  app.router('viewone', async (ctx) => {
    let adr = await tb.doc(event.orderid).get()
    ctx.body = adr.data;
  });

  //添加订单
  app.router('add', async (ctx) => {
    const wxContext = cloud.getWXContext()

    var n = Date.now() + 8 * 3600000;
    var date = new Date(n);
    let orderID = "ff" + date.Format('yyyyMMddHHmmss') + Math.random().toString().substr(3, 6);
    let time = date.Format('yyyy-MM-dd HH:mm:ss');

    let ret = await tb.add({
      data:{
        _id: orderID,
        openid: wxContext.OPENID,
        dateAdd: time,
        datetimeAdd: db.serverDate(),
        addressData: event.code.addressData,
        goodsList: event.code.goodsList,
        remark: event.code.remark,
        totalPrice: event.code.totalPrice,
        status: 0,
        stu_view: 1,
      }
    })
    ctx.body = ret;
  });

  //订单支付成功
  app.router('payok', async (ctx) => {
    ctx.body = await tb.doc(event.orderid).update({
      data: {
        status: 1,
      }
    });
  });

  //删除订单
  app.router('delorder', async (ctx) => {
    ctx.body = await tb.doc(event.orderid).update({
      data: {
        stu_view: -1,
      }
    });
  });

  return app.serve();
}