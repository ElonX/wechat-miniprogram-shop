const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router');
cloud.init()
let tb = cloud.database().collection("moon_tb_goods")

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  });

  //获取全部
  app.router('viewall', async (ctx) => {
    let adrs = await tb.where({
      status: 1,
    }).get()
    ctx.body = adrs.data;
  });

  //打开一个商品信息
  app.router('wievone', async (ctx) => {
    let goods = await tb.doc(event.id).get()
    ctx.body = goods.data;
  });

  //添加一个商品
  app.router('add', async (ctx) => {
    let cnt = await tb.count();
    let id=100001+cnt;

    ctx.body = await tb.add({
      data: {
        _id: id.toString(),
        datetimeAdd: db.serverDate(),
        datetimeUpdate: db.serverDate(),
        detailImgUrl: event.code.detailImgUrl,
        detailStr: event.code.detailStr,
        groupId: event.code.groupId,
        name: event.code.name,
        priceCurrent: event.code.priceCurrent,
        priceOriginal: event.code.priceOriginal,
        recommendStatus: event.code.recommendStatus,
        recommendStatusStr: event.code.recommendStatusStr,
        status: 1,
      }
    });
  });

  //修改信息
  app.router('set', async (ctx) => {
    ctx.body = await tb.doc(event.id).update({
      data: {
        datetimeUpdate: db.serverDate(),
        detailImgUrl: event.code.detailImgUrl,
        detailStr: event.code.detailStr,
        groupId: event.code.groupId,
        name: event.code.name,
        priceCurrent: event.code.priceCurrent,
        priceOriginal: event.code.priceOriginal,
        recommendStatus: event.code.recommendStatus,
        recommendStatusStr: event.code.recommendStatusStr,
      }
    });
  });

  //修改信息
  app.router('del', async (ctx) => {
    ctx.body = await tb.doc(event.id).update({
      data: {
        status: -1,
      }
    });
  });

  return app.serve();
}