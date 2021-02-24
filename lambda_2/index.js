// 1. The bugets and key in a new video file import to event object
// 2. Anyone can change the read permission of any user's acl attribute to access the video file.
'use strict'

var AWS = require("aws-sdk")
var s3 = new AWS.S3()

exports.handler = function(event, context, callback){
  // イベントがAWSSNSから直接送られてきているのでバケットとキーの取得方法が若干異なっている
  var message = JSON.parse(event.Records[0].Sns.Message)

  var sourceBucket = message.Records[0].s3.bucket.name
  var sourceKey = decodeURIComponent(message.Records[0]s3.object.key.replace(/\+/g, " "))
  // ACLは決められた規則に乗っ取って記述するべし。public-readはファイルの読み出しアクセスが公開になる
  var params = {
    Bucket: sourceBucket,
    Key: sourceKey,
    ACL: 'public-read'
  }

  s3.putObjectAcl(params, function(err, data){
    if(err){
      callback(err)
    }
  })
}
