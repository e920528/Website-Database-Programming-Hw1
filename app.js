process.on('unhandledRejection', error => {

});


//抓資料
var request = require("request");
var cheerio = require("cheerio");
var data;
request({
    url: "https://goo.gl/7V4EhT",
    method: "GET"
  },function(error,response,doc) { 
    if (!error) {
        data = doc;
        }
    else {
        console.log("擷取錯誤：" + error);
    }
    console.log(data)
      
    const MongoClient = require('mongodb').MongoClient

    // 設定要連接資料庫的ip或url
    const url = 'mongodb://140.112.28.194/'
    //資料庫的名稱
    const dbName = 'Movie'


    // 利用 MongoClient 連接到 MongoDB Server
    // 參數：
    //    url: MongoDB Server 的 URI 
    //    callback: 是一個function, 當連接完成時，
    //              將要做的事情寫在此 function內
    MongoClient.connect(url, (error, client) => {
        if (error) {
            console.log('資料庫連接失敗')
            return
        }
        console.log('資料庫連接成功')

        // use dbName
        const db = client.db(dbName)

        //create part
        db.collection('b04901157').insertOne(data).then((result) => {
            console.log(result)
        });
        
        db.collection('b04901157', (error, collection) => {
            if (error) {
                console.log('資料庫內無 b04901157 的 collection')
                return
            }

            // collection.find() 回傳的是 Cursor 資料型態
            collection.find().toArray((error, docs) => {
                if (error) {
                    console.log('查詢 b04901157 資料失敗')
                    return
                }
                // delete part
                let deleteIndex = [];
                for (let i = 0; i < docs.length; i++) {
                    let startHour = parseInt(docs[i].time[0] + docs[i].time[1])
                    let startMinute = parseInt(docs[i].time[3] + docs[i].time[4])
                    let endHour = parseInt(docs[i].time[6] + docs[i].time[7])
                    let endMinute = parseInt(docs[i].time[9] + docs[i].time[10])
                    if(endHour < startHour 
                        || (endHour == startHour && endMinute <= startMinute)  
                        || (endMinute > startMinute && (endHour - startHour) > 3)
                        || (endHour - startHour) > 4){
                        deleteIndex.push(i);
                    }
                }
                for (let i = 0; i < deleteIndex.length; i++) {
                    /*
                    db.collection.deleteOne(
                        {index: {$eq: i} }
                    ) */
                    console.log(deleteIndex[i])             
                }

                // 確定資料讀取完畢再關掉 client
                client.close()
            })
        });
    })





    //update part
  });




