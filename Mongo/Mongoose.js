var mongoose = require('Mongo/Mongoose');
var Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');
const JobSchema = new Schema({
    jobStartTime: Date,
    jobEndTime: Date,
    jobState: String,
    jobType: String

}, {
    w: 'majority',
    wtimeout: 10000,
    collation: { locale: 'en', strength: 1 }

});

JobSchema.plugin(timestamps);
module.exports = mongoose.model('search_job_details', JobSchema);