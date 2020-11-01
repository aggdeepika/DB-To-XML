const fs = require("fs");
const path = require("path");

/**
 * @description :: Function to iterate loop synchronously
 * @param  {} iterations
 * @param  {} process
 * @param  {} exit
 */ module.exports = {
  syncLoop: (iterations, process, exit) => {
    return new Promise((resolve, reject) => {
      let index = 0,
        done = false,
        shouldExit = false;
      let loop = {
        next: function () {
          if (done) {
            if (shouldExit && exit) {
              return exit(); // Exit if we're done
            }
          }
          // If we're not finished
          if (index < iterations) {
            index++; // Increment our index
            process(loop); // Run our process, pass in the loop
            // Otherwise we're done
          } else {
            done = true; // Make sure we say we're done
            if (exit) exit(); // Call the callback on exit
          }
        },
        iteration: function () {
          return index - 1; // Return the loop number we're on
        },
        break: function (end) {
          done = true; // End the loop
          shouldExit = end; // Passing end as true means we still call the exit callback
        },
      };
      loop.next();
      resolve(loop);
    });
  },

  CalculateTimeDifference: (time) => {
    return time.endedAt - time.startedAt;
  },
  removeFileRecursively:(folderPath)=>{
   return new Promise((resolve,reject)=>{
     try{
      fs.readdir(folderPath, (err, files) => {
        if (err) reject(err.message);
      
        for (const file of files) {
          fs.unlink(path.join(folderPath, file), err => {
            if (err) reject(err.message);
          });
        }
        resolve(true);
      });

     }
     catch(err){
       reject(err.message);

     }

   })
  }
};
