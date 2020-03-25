// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
let db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  let tb = db.collection("moon_tb_goods")//测试多表查询
  let goods = await tb.doc(event.id).get()

  return {
    goods: goods.data
  }

}