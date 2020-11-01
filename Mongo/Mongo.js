var MongoClient = require('mongodb').MongoClient;
let mongoUrl=''

module.exports = {
    Connect: () => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(mongoUrl, function(err, db) {
                if (err) {
                    reject(err);
                } else {
                    resolve(db);

                }
            });
        });
    },

    GenericInsertQuery: (dbName,collection,obj) => {
        return new Promise((resolve, reject) => {
          var dbo=  mongo.db(dbName);
          dbo.collection(collection).insertOne(obj,function(err,result)
          {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    GenericUpdateQuery: (dbName,collection,query,newobj) => {
        return new Promise((resolve, reject) => {
            var dbo=  mongo.db(dbName);
            dbo.collection(collection).updateOne(query,newobj,function(err,result)
            {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    GenericDeleteQuery: (dbName,collection,query) => {
        return new Promise((resolve, reject) => {
            var dbo=  mongo.db(dbName);
            dbo.collection(collection).deleteOne(query,function(err,result)
            {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },




};