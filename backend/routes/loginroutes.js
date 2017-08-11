var mysql = require('mysql');
// var bcrypt = require('bcrypt');
var jsonfile = require('jsonfile');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'reactjs',
    password: 'reactjs',
    database: 'cloudprint',
    insecureAuth: false
});
connection.connect(function (err) {
    if (!err) {
        console.log('Database is connected ... nn');
    } else {
        console.log('Error connecting database ... nn', err);
    }
});
exports.register = function (req, res) {
    // console.log('req',req.body);
    // var today = new Date();
    // // bcrypt.hash(req.body.password, 5, function( err, bcryptedPassword) {
    // //save to db
    // var users = {
    //     'userid': req.body.userid,
    //     'password': req.body.password,
    //     'role': req.body.role,
    //     'created': today,
    //     'modified': today
    // }
    // connection.query('INSERT INTO users SET ?', users, function (error, results, fields) {
    //     if (error) {
    //         console.log('error ocurred', error);
    //         res.send({
    //             'code': 400,
    //             'failed': 'error ocurred'
    //         })
    //     } else {
    //         //    console.log('The solution is: ', results);
    //         res.send({
    //             'code': 200,
    //             'success': 'user registered sucessfully'
    //         });
    //     }
    // });
    // // });
}
exports.login = function (req, res) {
    if (req.body.userid === '' || req.body.password === '') {
        return false;
    }

    var userid = req.body.userid;
    var password = req.body.password;

    connection.query('SELECT * FROM users WHERE userid = ?', [userid], function (error, results, fields) {
        if (error) {
            console.log('error ocurred', error);
            res.send({
                'code': 400,
                'failed': 'error ocurred'
            })
        } else {
            // console.log('The solution is: ', results[0].password, req.body.password, req.body.role);
            if (results.length > 0) {
                if (results[0].password == req.body.password) {
                    var file = './userdata/userid.json'
                    var obj = {
                        userid: req.body.userid
                    }
                    jsonfile.writeFile(file, obj, function (err) {
                        if (err) {
                            console.log('Error ocurred in writing json during login at login handler in login routes', err);
                        }
                    })
                    res.send({
                        'code': 200,
                        'success': 'login sucessfull'
                    })
                } else {
                    res.send({
                        'code': 204,
                        'success': 'Email and password does not match'
                    })
                }
            } else {
                res.send({
                    'code': 204,
                    'success': 'Email does not exits'
                });
            }
        }
    });
}
