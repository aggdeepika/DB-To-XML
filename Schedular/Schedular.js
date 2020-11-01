// let counter = 1;
// let interval = 1000;
//
// let SchedularFunction = function () {
//     console.log("Running task counter #" + counter);
//     counter++;
//     if (counter == 5) {
//         counter = 1;
//     }
//     Schedular._repeat = ChangeExecutionInterval();
//     console.log(`Schedular task in ${Schedular._repeat} sec`);
// };
//
// let Schedular = setInterval(SchedularFunction, ChangeExecutionInterval());
//
// function ChangeExecutionInterval() {
//     return counter * interval;
//
// }
var schedule = require('node-schedule');

var rule_incr = new schedule.RecurrenceRule();
//rule.minute = 6;


var incr_rule = schedule.scheduleJob(createIncrementRule(),async function() {
     await print();
    createIncrementRule();
    log.info('The answer to life, the universe, and everything!');
});

function createIncrementRule(){
    var d = new Date();
    rule_incr.hour=d.getHours()==23?0:d.getHours()+1;
    rule_incr.minute=0;
    rule_incr.second=0;
    return rule_incr;
}
function createFullRule(){

}

function print(){
    return Promise((resolve,reject)=>{
        resolve(true);

    });
}