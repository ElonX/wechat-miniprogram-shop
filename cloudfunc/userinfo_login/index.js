// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
let db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //let day = new Date().toLocaleString()
  let day = db.serverDate()

  let ex = await db.collection('moon_tb_userinfo').where({
    openid: wxContext.OPENID
  }).count();

  if(ex.total==1){
    return db.collection("moon_tb_userinfo").where({
      openid: wxContext.OPENID
    }).update({
      data: {
        login: day,
      }
    })
  }
  else{
    return db.collection("moon_tb_userinfo").add({
      data: {
        appid: wxContext.APPID,
        openid: wxContext.OPENID,
        avatarUrl: event.avatarUrl,
        country: event.country,
        city: event.city,
        nickName: event.nickName,
        gender: event.gender,
        language: event.language,
        province: event.province,
        registered: day,
        login: day,
      }
    })
  }
}