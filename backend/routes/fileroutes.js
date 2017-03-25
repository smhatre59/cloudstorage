var fs=require("fs");
var path = require('path');
var writePath='/home/saurabh/Documents/react/cloudprint/filestobeprinted/';
var cmd=require('node-cmd');
var async = require('async');
var jsonfile = require('jsonfile');
exports.fileretrieve = function(req,res){
  console.log("retrieve hit");
  // async.waterfall([
  //   function(callback){
      var filepath = './userdata/userid.json'
        jsonfile.readFile(filepath, function(err, obj) {
          if(err){
            res.send({
                "code":204,
                "result":"No files found"
              })
          }
          else{
            var userid = obj.userid;
          // console.log("user id in read file",userid);
          var swiftcommand= 'swift -A http://127.0.0.1:12345/auth/v1.0 -U test:tester -K testing list '+userid;
          // console.log("command",swiftcommand);
          cmd.get(
            swiftcommand,
            function(data){
              var filenames = data.split('\n');
              var resfiles=[];
              for(var i =0;i<filenames.length-1;i++){
                resfiles.push(
                  {name:filenames[i]}
                )
              }

              // console.log('the responses is :',resfiles)
              res.send({
                "code":200,
                "result":resfiles
              })
            }
          );
          }
          
        });
  //   }
  //   ], function (err, result) {
  //   // result now equals 'done'
  //   // console.log("waterfall result",file.originalname);
  // })
}
exports.fileprint = function(req,res){
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
          var filepath = './userdata/userid.json'
            jsonfile.readFile(filepath, function(err, obj) {
              var userid = obj.userid;
              // console.log("user id in read file",userid);
              var swiftcommand= 'swift -A http://127.0.0.1:12345/auth/v1.0 -U test:tester -K testing upload --object-name ' +file.originalname+ ' '+userid+' '+'../filestobeprinted/'+file.originalname;
              // console.log("command",swiftcommand);
              cmd.get(
                swiftcommand,
                function(data){
                  console.log('the responses is : ',data)
                  callback(null, 'done');
                }
              );
            })

        }
        ], function (err, result) {
          // result now equals 'done'
          // console.log("waterfall result",file.originalname);
          eachcallback();
        });
        },function(err){
          if(err){
              console.log("error ocurred in each",err);
          }
          else{
            console.log("finished prcessing");
            res.send({
                      "code":"200",
                      "success":"files printed successfully"
                      })
            cmd.run('rm -rf ./fileprint/*');
          }
          });

}