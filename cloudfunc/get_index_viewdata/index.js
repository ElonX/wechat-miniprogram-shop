// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
let db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  let tb = db.collection("moon_tb_banners")
  let banners = await tb.get()
  let tb2 = db.collection("moon_tb_goods")//测试多表查询
  let recommend = await tb2.where({
    recommendStatus:"1",
    status: 1,
  }).get()

  return {
    banners: banners.data,
    recommend: recommend.data
  }
}