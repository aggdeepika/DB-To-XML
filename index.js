
let dbConnector = require("./Mysql/Connector");
//let start = require("./xmlwriting");
const moment = require("moment");
let jsonToXMLParser = require("./Parser/JSONtoXMLParser");
const fs = require("fs");
const path = require("path");
let folderPath=path.join(__dirname, `files`);
let file_name=`data_${Date.now()}.xml`;
let file = path.join(folderPath, file_name);
const utils = require("./Utility/Utils");
const aws= require("./Aws/S3Multipart");
let mConn= require("./Mongo/Mongo");
let dbquery=require("./Mysql/DBQuery");
let schedule=require("node-schedule");
global.config=require("./Config/Config.json");
global.log=require("./Utility/Logger");



 let mongoDB=   ``;
  let   jobDetailsCollection=   ``;


let startedAt,
    endedAt = 0;

var rule_incr = new schedule.RecurrenceRule();
//rule.minute = 6;


var incr_rule = schedule.scheduleJob(createIncrementRule(),async function() {
    await start();
    createIncrementRule();
    console.log('The answer to life, the universe, and everything!');
});

function createIncrementRule(){
    var d = new Date();
    //rule_incr.hour=d.getHours()==23?0:d.getHours()+1;
    rule_incr.minute=d.getMinutes()==59?0:d.getMinutes()+1;
    //rule_incr.minute=0;
    rule_incr.second=0;
    console.log(`${d.getHours()}:${rule_incr.minute}:${rule_incr.second}`)
    return rule_incr;
}
function createFullRule(){

}

function start() {

    return new  Promise((resolve, reject) => {
       // resolve(true);
        dbConnector
            .Connect()
            .then(async (conn) => {
                global.DB = conn;
                log.info("Database connection successful!!");
                await mConn.Connect().then(async (mongo) => {
                    log.info(" Mongo Database connected!");
                    global.mongo = mongo;
                    let obj = {
                        "jobStartTime": moment().toISOString(),
                        "jobEndTime": moment().toISOString(),
                        "jobState": "IN_PROGRESS",
                        "jobType": "FULL_VOD"
                    };

                    await mConn.GenericInsertQuery(mongoDB,jobDetailsCollection, obj).then((result) => {
                        log.info("Value inserted in Mongo");
                    });


                });
                await utils.removeFileRecursively(folderPath);
                global.writeStream = fs.createWriteStream(file, {
                    flags: "w",
                });
                startedAt = moment();
                log.info("Process started at: " + startedAt.toLocaleString());

                let rootNodeData = {
                    name: "catalogue",
                    attrs: {xmlns: "http://www.amazon.com/FireTv/2014-04-11/ingestion", version: "FireTv-v1.3"},
                };
                let partnerNodeData = [{
                    name: "Partner",
                    attrs: "",
                    text: "Everything Ever Made Filmworks"
                }];
                let worksNodeData = {
                    name: "Works",
                    attrs: ""
                }

                //Get xml header tag
                let hedaerTag = await jsonToXMLParser.PrepareHeaderTag();

                //Write header tag in file
                writeStream.write(hedaerTag);

                //Prepare root node
                let rootNodeTag = await jsonToXMLParser.PrepareRootNode(rootNodeData);

                //Write start of root node in file
                writeStream.write(rootNodeTag.start);
                //preapre partner Node data
                let partneNodeTag = await jsonToXMLParser.PrepareChildNode(partnerNodeData);
                //write parter Node

                writeStream.write(partneNodeTag);

                //Prepare Works node
                let worksNodeTag = await jsonToXMLParser.PrepareRootNode(worksNodeData);

                //Write start of works node in file
                writeStream.write(worksNodeTag.start);

                // prepare Child data and write in file


                //let sql=`SELECT vod.id,box_cover_image,languages,display_run_time,year_of_release,vod_extension.title_brief,vod_extension.summary_long,show_type  from vod left join vod_extension on vod.id= vod_extension.vod_id where is_deleted=0  and vod_extension.lang_code='ENG' LIMIT 10 `;
                let vodSql = dbquery.VodFullQuery() // full _vod
                let seriesSql = dbquery.SeriesFullQuery();
                let brandSql = dbquery.BrandFullQuery();


                let vod_incrSql = dbquery.VodIncrQuery(); // incremental

                dbConnector.QueryUsingStreams(vodSql).then((result) => {


                    endedAt = moment();
                    log.info("Process completed at: " + endedAt.toLocaleString());

                    let duration = endedAt.diff(startedAt, "seconds");
                    log.info(`Total duration - ${duration}s`);
                    DB.end();
                    //Write  end of works node   in file
                    writeStream.write(worksNodeTag.end);

                    //Write end of root node in file
                    writeStream.write(rootNodeTag.end);
                    // the finish event is emitted when all data has been flushed from the stream
                    writeStream.on("finish", async () => {

                        log.info("wrote all data to file");

                        //Log details
                        endedAt = moment();
                        log.info("Process completed at: " + endedAt.toLocaleString());

                        let duration = endedAt.diff(startedAt, "milliseconds");
                        log.info(`Total duration - ${duration}ms`);
                        log.info(`Upload file to AWS bucket`);
                        aws.multipartUpload(file).then((result) => {
                            var query = {
                                "jobState": "IN_PROGRESS",
                                "jobType": "FULL_VOD"
                            };
                            var newobj = {
                                $set: {
                                    "jobEndTime": moment().toISOString(),
                                    "jobState": "SUCCESS"
                                }
                            };

                            mConn.GenericUpdateQuery(mongoDB, jobDetailsCollection, query, newobj).then((result) => {
                                log.info("Value Updated As Success in Mongo");
                                return resolve(true);

                            });
                        });

                    });

                    // close the stream
                    writeStream.end();



                });


            }).catch((err) => {
            log.info(err.message);

            var query = {
                "jobState": "IN_PROGRESS",
                "jobType": "FULL_VOD"
            };
            var newobj = {
                $set: {
                    "jobEndTime": moment().toISOString(),
                    "jobState": "FAILED"
                }
            };

            mConn.GenericUpdateQuery(mongoDB, jobDetailsCollection, query, newobj).then((result) => {
                log.info("Value Updated As Failed in Mongo");

            });


        });

    });
}


//Global exception handling
process.on("uncaughtException", function (e) {
  log.error(e.message);
});

process.on("unhandledRejection", function (e) {
  log.error(e.message);
});

