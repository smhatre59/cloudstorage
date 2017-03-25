var mysql = require('mysql');
// var bcrypt = require('bcrypt');
var jsonfile = require('jsonfile');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root@123',
  database : 'cloudprint',
  insecureAuth: false
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn",err);
}
});

exports.register = function(req,res){
  // console.log("req",req.body);
  var today = new Date();
  // bcrypt.hash(req.body.password, 5, function( err, bcryptedPassword) {
   //save to db
   var users={
     "first_name":req.body.first_name,
     "last_name":req.body.last_name,
     "userid":req.body.userid,
     "password":req.body.password,
     "role":req.body.role,
     "created":today,
     "modified":today
   }
   connection.query('INSERT INTO collegeusers SET ?',users, function (error, results, fields) {
   if (error) {
     console.log("error ocurred",error);
     res.send({
       "code":400,
       "failed":"error ocurred"
     })
   }else{
    //  console.log('The solution is: ', results);
     res.send({
       "code":200,
       "success":"user registered sucessfully"
         });
   }
   });
  // });


}

exports.login = function(req,res){
  var userid= req.body.userid;
  var password = req.body.password;
  var role = req.body.role;
  connection.query('SELECT * FROM collegeusers WHERE userid = ?',[userid], function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    // console.log('The solution is: ', results[0].password,req.body.password,req.body.role);
    if(results.length >0){
      if(results[0].password == req.body.password){
        if(results[0].role == req.body.role){
          var file = './userdata/userid.json'
          var obj = {userid: req.body.userid}
          jsonfile.writeFile(file, obj, function (err) {
            if(err){
              console.log("Error ocurred in writing json during login at login handler in login routes",err);
            }
          })
          res.send({
            "code":200,
            "success":"login sucessfull"
          })
        }
        else{
          res.send({
            "code":204,
            "success":"You have logged in from wrong user role"
          })
        }

      }
      else{
        res.send({
             "code":204,
             "success":"Email and password does not match"
        })
      }

    }
    else{
      res.send({
        "code":204,
        "success":"Email does not exits"
          });
    }


  }
  });
}
