// the aws lambda function have event handler
// event, context, callback
'use strict'

var AWS = require("aws-sdk")

// ElasticTranscoderのインスタンスを作成
var elasticTranscoder = new AWS.ElasticTranscoder({
  region: 'us-east-1'
})

exports.handler = function(event, context, callback){
  // keyはバケット内のオブジェクトを一意に識別する。元のファイル名と任意のキープレフィックスから構成される
  var key = event.Recodes[0].s3.object.key
  // キー名はURLでエンコードされるのでハイフンをデコードできるように設定してあげる
  var sourceKey = decodeURIComponent(key.replace(/\+/g, " "))
  // オリジナルのキーの拡張子はトランスコードされた新しいファイルでは不要。キーの本絵愛の名前は出力動画のタイトルとして利用する
  var outputKey = sourceKey.split('.')[0]

  console.log('key:', key, sourceKey, outputKey)

  var params = {
    PipelineId: "1614075071986-3trvkq",
    OutputPKeyPrefix: outputKey + "/",
    Input: {
      Key: sourceKey
    },
    // システムプリセットを利用した出力の指定。以下は汎用的なもの。下記URlがプリセット一覧になっている
    // https://docs.aws.amazon.com/elastictranscoder/latest/developerguide/system-presets.html
    Outputs: [
      {
        Key: outputKey + "-1080p" + ".mp4",
        PresetId: '1351620000001-000001'
      },
      {
        Key: outputKey + "-720p" + ".mp4",
        PresetId: "1351620000001-000010"
      },
      {
        Key: outputKey + "-web-720p" + ".mp4",
        PresetId: "1351620000001-100070"
      }
    ]
  }
  elasticTranscoder.createJob(params, function(error, data){
    // ジョブの作成に失敗した場合コールバック関数を通してCloudWatchにエラーを書き込む
    if(error){
      callback(error)
    }
  })
}
