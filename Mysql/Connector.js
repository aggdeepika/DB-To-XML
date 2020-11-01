const mysql = require("mysql");
let movie = require("../ContentType/Movie");
let Tvshow= require("../ContentType/TvShow");
let shorts=require("../ContentType/Shorts");
let brand=require("../ContentType/Brand");
let series=require("../ContentType/Series");
//let start= require("./xmlwriting")


let conn = mysql.createConnection({
  host: `localhost`,
  user: ``,
  password: ``,
  database: ``
});

module.exports = {
  Connect: () => {
    return new Promise((resolve, reject) => {
      conn.connect(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(conn);

        }
      });
    });
  },

 GenericQuery: (sql) => {
    return new Promise((resolve, reject) => {
      DB.query(sql ,function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  QueryUsingStreams: (sql) => {
    return new Promise((resolve, reject) => {
      let query = DB.query(sql);
      query
          .on("error", function (err) {
            // Handle error, an 'end' event will be emitted after this as well
            reject(err);
          })
          .on("fields", function (fields) {
            // the field packets for the rows to follow
          })
          .on("result", async function (row) {
            // Pausing the connnection is useful if your processing involves I/O
            try {
              DB.pause();
              await processRowData(row);
              DB.resume();
            } catch (error) {
              reject(error);
            }
          })
          .on("end", function () {
            // all rows have been received
            resolve(true);
          });
    });
  },
};
function processRowData(row) {
  return new Promise(async (resolve, reject) => {
    try {
        if (row) {
            switch (row.show_type) {
                case "MOVIES":
                await    movie(row);
                    break;
                case "TV_SHOWS":
                 await   Tvshow(row);
                    break;
                case "WEB_SHORTS":
                 await   shorts(row);
                    break;
            }
        }

      //console.log(row);
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
}