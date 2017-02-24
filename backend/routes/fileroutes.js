var fs = require("fs");
var path = require('path');
var writePath = '/home/saurabh/Documents/react/cloudprint/filestobeprinted/';
var cmd = require('node-cmd');
var async = require('async');
var Promise = require('promise');
/*
Module:rmfr
rmfr is used to delete folders recursively
*/
const rmfr = require('rmfr');

exports.fileprint = function (req, res) {
  // console.log("req",req.files);
  var filesArray = req.files;
    async.each(filesArray,function(file,eachcallback){
      async.waterfall([
      function (callback) {
        fs.readFile(file.path, (err, data) => {
      if (err) {
        console.log("err ocurred", err);
        }
      else {
        callback(null,data);
      }
       });
      },
      function (data, callback) {
        fs.writeFile(writePath + file.originalname, data, (err) => {
        if (err) {
          console.log("error occured", err);
        }
        else {
        callback(null, 'three');  
        }
        });
      },
      function (arg1, callback) {
            console.log("username",global.username,file);
            cmd.get(
              'swift -A http://127.0.0.1:12345/auth/v1.0 -U test:tester -K testing upload --object-name '+file.originalname+' '+global.username+' '+ file.path,
              function(data){
                console.log('the responses is : ',data)
              }
            );
        callback(null, 'done');
      }
    ], function (err, result) {
      // result now equals 'done'
      console.log("waterfall result",file.originalname);
      eachcallback();
    });  
    },function(err){
      if(err){
          console.log("error ocurred in each",err);
      }
      else{
        console.log("finished prcessing");
        cmd.run('rm -rf ./fileprint/*');
      }
    })
}