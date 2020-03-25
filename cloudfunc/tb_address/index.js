const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router');
cloud.init()
let tb = cloud.database().collection("moon_tb_address")

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  });

  //获取地址
  app.router('get', async (ctx) => {
    const wxContext = cloud.getWXContext()
    let adrs = await tb.where({
      openid: wxContext.OPENID
    }).get()
    ctx.body = adrs.data;
  });

  //修改地址
  app.router('set', async (ctx) => {
    const wxContext = cloud.getWXContext()
    
    let adr = await tb.where({
      openid: wxContext.OPENID,
    }).get()

    ctx.body = await tb.doc(adr.data[0]._id).update({
      data: {
        address: event.code.address,
        city: event.code.city,
        linkName: event.code.linkName,
        mobile: event.code.mobile,
        province: event.code.province,
      }
    });

  });

  //添加地址
  app.router('add', async (ctx) => {
    const wxContext = cloud.getWXContext()
    ctx.body = await tb.add({
      data:{
        openid: wxContext.OPENID,
        address: event.code.address,
        city: event.code.city,
        linkName: event.code.linkName,
        mobile: event.code.mobile,
        province: event.code.province,
        stu_default: "0"
      }
    });
  });
  return app.serve();
}