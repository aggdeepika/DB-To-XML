
var AWS = require('aws-sdk');
var fs = require('fs');
const path = require("path");

let AWS_ACCESS_KEY='';
let AWS_SECRET_KEY='';
let AWS_REGION='';

var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();
var utils=require("../Utility/Utils");
AWS.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
AWS.config.region = AWS_REGION;
const s3 = new AWS.S3();
let buffer="";
let partNum=0;
let maxUploadTries = 3;
let numPartsLeft = 0;
let start=0;
let partSize=1024 * 1024 * 50;


let multipartMap = {
    Parts: []
};
let multipartParam={};
let startTime ;

let AwsS3={
    multipartUpload:(file)=>{
        return new Promise((resolve, reject) => {

            //var file = req.files.file;
            buffer = fs.readFileSync(file);
            numPartsLeft=Math.ceil(buffer.length / partSize);

            startTime=new Date();
             multipartParams = {
                Bucket: 'ta-voice-search',
                Key: path.basename(file),
                ContentType: "json"
            };

            console.log('Creating multipart upload for:', file);
                s3.createMultipartUpload(multipartParams, function (mpErr, multipart) {
                    if (mpErr) reject(mpErr);
                    else {
                        utils.syncLoop(
                            Math.ceil(buffer.length / partSize),
                            async (loop) => {
                                let i = loop.iteration();
                                partNum++;
                                var end = Math.min(start + partSize, buffer.length);
                                var partParams = {
                                    Body: buffer.slice(start, end),
                                    Bucket: multipartParams.Bucket,
                                    Key: multipartParams.Key,
                                    PartNumber: String(partNum),
                                    UploadId: multipart.UploadId
                                };
                                start = end;
                                end = end + partSize;
                                log.info('Uploading part: #', partParams.PartNumber, ', Start:', start);
                               await  AwsS3.uploadPart(s3, multipart, partParams);


                                loop.next();
                            },
                            function () {
                                resolve(true);
                            }
                        );
                    }
                });


        });

    },
    uploadPart:(s3, multipart, partParams, tryNum)=>{
        return new Promise((resolve, reject) => {
            var tryNum = tryNum || 1;
            s3.uploadPart(partParams,  function (multiErr, mData) {
                log.info('started');
                //retry function
                if (multiErr) {


                    if (tryNum < maxUploadTries) {
                        log.info('Retrying upload of part: #', partParams.PartNumber);
                        AwsS3.uploadPart(s3, multipart, partParams, tryNum + 1);
                    } else {
                        log.info('Failed uploading part: #', partParams.PartNumber);
                      return  reject(multiErr);
                    }
                    // return;
                }

                multipartMap.Parts[this.request.params.PartNumber - 1] = {
                    ETag: mData.ETag,
                    PartNumber: Number(this.request.params.PartNumber)
                };
                log.info('Completed part', this.request.params.PartNumber);
                log.info('mData', mData);
                if (--numPartsLeft > 0) {
                  return  resolve(true);
                } // complete only when all parts uploaded

                var doneParams = {
                    Bucket: multipartParams.Bucket,
                    Key: multipartParams.Key,
                    MultipartUpload: multipartMap,
                    UploadId: multipart.UploadId
                };

                log.info('Completing upload...');
                return resolve(AwsS3.completeMultipartUpload(s3, doneParams));
            }).on('httpUploadProgress', function (progress) {
                log.info(Math.round(progress.loaded / progress.total * 100) + '% done')
            });

        });

    },
    completeMultipartUpload:(s3, doneParams)=>{
        return new Promise((resolve,reject)=>{
            s3.completeMultipartUpload(doneParams, function (err, data) {
                if (err) reject(err);
                var delta = (new Date() - startTime) / 1000;
                log.info('Completed upload in', delta, 'seconds');
                log.info('Final upload data:', data);
                 return resolve (true);
            });

        });

    }
}

module.exports=AwsS3;




