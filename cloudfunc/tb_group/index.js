const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router');
cloud.init()
let tb_group = cloud.database().collection("moon_tb_group")

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  });

  //获取tb_group
  app.router('grouplist', async (ctx) => {
    let re = await tb_group.get()
    ctx.body=re.data
  });

  return app.serve();
}