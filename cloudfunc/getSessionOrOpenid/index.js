const appid = 'wx-----------------------'; //你的小程序appid
const secret = '------------------------------'; //你的小程序secret


const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router'); //云函数路由
const rq = require('request');
const wxurl = 'https://api.weixin.qq.com';

cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  });
  //获取电话号码
  app.router('session', async (ctx) => {
    ctx.body = new Promise(resolve => {
      rq({
        url: wxurl + '/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + event.code + '&grant_type=authorization_code',
        method: "GET",
        json: true,
      }, function (error, response, body) {
        resolve({
          data: body
        })
      });
    });
  });
  //获取openid
  app.router('getid', async (ctx) => {
    const wxContext = cloud.getWXContext()
    ctx.body = wxContext.OPENID;
  });
  return app.serve();
}