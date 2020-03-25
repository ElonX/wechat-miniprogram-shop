const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router');
cloud.init()
let tb = cloud.database().collection("moon_tb_config")

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  });

  //获取adminidlist
  app.router('isadminid', async (ctx) => {
    const wxContext = cloud.getWXContext()
    let ids = await tb.doc('adminid').get()
    let re = false
    let data = ids.data.value
    //ctx.body = data;
    //return;
    for (let i = 0; i < data.length; i++){
      if (data[i] == wxContext.OPENID){
        re = true
        break;
      }
    }
    ctx.body = re;
  });

  return app.serve();
}