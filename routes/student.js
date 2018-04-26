var express = require('express')
var app = express()
var isEmail = require('email-validator')

//stored global variables
var userEmail = "aaa"
<<<<<<< HEAD
var userStudentID = -1;
=======
var userStudentID = -1
>>>>>>> 3b218e69f34e5a5b9a2e5b53d88eb6daf1f88092

const { Pool, Client } = require('pg')
// const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

const client = new Client({
  user: 'oxajqwvmxwcygq',
  host: 'ec2-54-221-192-231.compute-1.amazonaws.com',
  database: 'd30ja9oeokuudf',
  password: '88649658013b5e0cbdf162b20cc5c46160b147eb6837d4bcc36a79b3fe107cbd',
  port: 5432,
  ssl: true
})

client.connect();


app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        let results = [];
        const sqlQuery = "SELECT * FROM student";
        // Query to get all the entries.
        // conn object which will execute and return results

        // sqlQuery.on('row', (row) => {
        //   results.push(row);
        // });
        client.query(sqlQuery, function(err, rows, fields) {
            if (err) {
                // Display error message in case an error
                req.flash('error', err)
                res.render('student/list', {
                    title: 'Student listing',
                    data: ''
                })
            } else {
                // render to views/store/list.ejs template file
                res.render('student/list', {
                    title: 'Login',
                    data: rows.rows
                })
            }
        })
    })
})


app.get('/main_view', function(req, res, next) {
    req.getConnection(function(error, conn) {
        let results = [];
        const sqlQuery = "select * from studentschedule, class where studentID = '" + userEmail + "' and studentschedule.classid=class.classid";
        // Query to get all the entries.
        // conn object which will execute and return results

        // sqlQuery.on('row', (row) => {
        //   results.push(row);
        // });
        client.query(sqlQuery, function(err, rows, result) {
            if (err) {
                // Display error message in case an error
                req.flash('error', err)
                res.render('student/main_view', {
                    title: 'Student listing',
                    data: ''
                })
            } else {
                // render to views/store/list.ejs template file
                console.log(rows.rows)
                res.render('student/main_view', {

                    title: 'Login',
                    data: rows.rows
                })
            }
        })
    })
})

app.post('/register', function(req, res, next){

})

// app.get('/', function(req, res, next) {
//     req.getConnection(function(error, conn) {
//         var sqlQuery = "SELECT * FROM store";
//         // Query to get all the entries.
//         // conn object which will execute and return results
//         conn.query(sqlQuery, function(err, rows, fields) {
//             if (err) {
//                 // Display error message in case an error
//                 req.flash('error', err)
//                 res.render('store/list', {
//                     title: 'Store listing',
//                     data: ''
//                 })
//             } else {
//                 // render to views/store/list.ejs template file
//                 res.render('store/list', {
//                     title: 'Store listing',
//                     data: rows
//                 })
//             }
//         })
//     })
// })


// Display form to get values for store item for insertion
app.get('/register', function(req, res, next) {
    // render to views/store/register.ejs
    res.render('student/register', {
        title: '',
        studi: '',
        firstn: '',
        lastn: '',
        email: '',
        pass: ''
    })
})

// REGISTER NEW USER -- Used to insert values
// Notice that we are using post here
app.post('/register', function(req, res, next) {
    req.assert('studi', 'Student ID is required').notEmpty()
    //Validate sname
    req.assert('lastn', 'Last Name is required').notEmpty()
    //Validate qty
    req.assert('firstn', 'First Name is required').notEmpty()
    //Validate price
    req.assert('email', 'Email is required').notEmpty()

    req.assert('pass', 'Password is required').notEmpty()

    var errors = req.validationErrors()
    if (!errors) {
        //No errors were found. Passed Validation!
        var item = {
            studi: req.sanitize('studi').escape().trim(),
            lastn: req.sanitize('lastn').escape().trim(),
            firstn: req.sanitize('firstn').escape().trim(),
            pass: req.sanitize('pass').escape().trim(),
            email: req.sanitize('email').escape().trim()
        }
	if(isEmail.validate(item.email) == true){
		req.getConnection(function(error, conn) {
		    /* Below we are doing a template replacement. The ?
		    is replaced by entire item object*/
		    /* This is the way which is followed to substitute
		    values for SET*/
		    var values = '(' + item.studi + ',' + "'" + item.lastn + "'" + ',' + "'" + item.firstn + "'" + ',' + "'" + item.email + "'" + ',' + "'" + item.pass + "'" + ')'; 
		    client.query("INSERT INTO student (StudentID, LastName, FirstName, Email, Passwrd) VALUES " + values,
		        function(err, result) {
		            if (err) {
		                req.flash('error', err)
		                // render to views/store/register.ejs
		                res.render('student/register', {
		                    title: '',
		                    studi: item.studi,
		                    lastn: item.lastn,
		                    firstn: item.firstn,
		                    pass: item.pass,
		                    email: item.email
		                })
		            } else {
		                req.flash('success', 'Data added successfully!')
		                // render to views/store/register.ejs
		                res.render('student/register', {
		                    title: '',
		                    studi: '',
		                    lastn: '',
		                    firstn: '',
		                    email: '',
		                    pass: '',
		                })
		            }
		        })
		})
	//If email is not the correct format it will show error message and refresh page
        }else{
            req.flash('error', 'Invalid email')
            res.render('student/register', {
                title: '',
                studi: '',
                lastn: '',
                firstn: '',
                email: '',
                pass: '',
            })
        }
    } else {
        //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        /**
         * Using req.body.sname
         * because req.param('sname') is deprecated
         */
        // Sending back the entered values for user to verify
        res.render('student/register', {
            title: '',
            studi: req.body.studi,
            firstn: req.body.lastn,
            lastn: req.body.firstn,
            email: req.body.email,
            pass: req.body.pass
        })
    }
})

app.get('/selection', function(req, res, next) {
    // render to views/store/selection.ejs
    res.render('student/selection', {
        title: '',
    })
})

app.get('/main_view', function(req, res, next) {
    // render to views/store/selection.ejs
    res.render('student/main_view', {
        title: '',
        email:userEmail,
        studentid:userStudentID
    })
})


app.get('/login', function(req, res, next) {
    // render to views/store/register.ejs
    res.render('student/login', {
        title: '',
        email: '',
        pass: ''
    })
})

app.post('/login', function(req, res, next) {
    req.assert('email', 'Email is required').notEmpty()
    //Validate sname
    req.assert('pass', 'Password is required').notEmpty()
    //Validate qty

    var errors = req.validationErrors()
    if (!errors) {
        //No errors were found. Passed Validation!
        var item = {
            pass: req.sanitize('pass').escape().trim(),
            email: req.sanitize('email').escape().trim()
        }
        req.getConnection(function(error, conn) {
            /* Below we are doing a template replacement. The ?
            is replaced by entire item object*/
            /* This is the way which is followed to substitute
            values for SET*/
            client.query("SELECT * FROM student WHERE email = '" + item.email + "' and Passwrd = '" + item.pass + "'",
                
                function(err, result) {
                    if (err) {
                        req.flash('error', err)
                        // render to views/store/register.ejs
                        res.render('student/login', {
                            title: '',
                            pass: '',
                            email: ''
                        })
                    }
                    if (0 === result.rows.length)
                    {
                        req.flash('error', 'You are not in the database')
                        res.render('student/login',{
                            title: '',
                            pass: '',
                            email: ''
                        })
                    }
                       else {
<<<<<<< HEAD
                        req.flash('success', 'You are in the database!')
                        userEmail = item.email;
                        userStudentID = result.rows[0].studentid;      
                        res.render('student/main_view', {
                            title: '',
=======
                        req.flash('success', 'You are in the database!')                       
                        //store user information in global variable for future queries
                        //email:
                        userEmail = item.email;
                        //studentID:
            
						userStudentID = result.rows[0].studentid;                      
                        res.render('student/main_view', {
                            title: '',
                            email: userEmail,
                            studentid : userStudentID,
>>>>>>> 3b218e69f34e5a5b9a2e5b53d88eb6daf1f88092
                            pass: '',
                            data: ''
                        })
                    }
                })
        })
    } else {
        //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        /**
         * Using req.body.sname
         * because req.param('sname') is deprecated
         */
        // Sending back the entered values for user to verify
        res.render('student/login', {
            title: '',
            email: req.body.email,
            pass: req.body.pass
        })
    }
})

//used to parse selection page stuff, still needs a lot of work like updating sql query
var bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // to support JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

app.post('/selection', function(req, res) {
  //res.send(req.body.optradio);
  console.log(req.body);
  var classes = req.body.optradio;
  
  console.log(classes);
  
  
  for (var i = 0; i < classes.length; ++i) {
    console.log('value at index [' + i + '] is: [' + classes[i] + ']');
    //client.query("INSERT INTO student (Passwrd) VALUES " + classes[i])
    //client.query("INSERT INTO student ("StudentID", "LastName", "FirstName", "Email") VALUES" + classes[i])
    client.query("INSERT INTO student (StudentID, LastName, FirstName, Email, Passwrd) VALUES (" + (17+i) + ", 'LastName', 'FirstName', 'Email', " + classes[i]+");",
           function(err, result) {
                    if (err) {
                        req.flash('error', err)

                        // render to views/store/register.ejs
                    }
            });
    }

    res.render('student/main_view', {
                    title: 'Student listing',
                    data: '',
                    email: ''
                })
})
  


 


// // EDIT ITEM POST ACTION - Update the item, actual update happens here
// app.put('/edit/(:id)', function(req, res, next) {
//     req.assert('sname', 'Name is required').notEmpty()
//     //Validate name
//     req.assert('qty', 'Quantity is required').notEmpty()
//     //Validate qty
//     req.assert('price', 'Price is required').notEmpty()
//     //Validate price
//     var errors = req.validationErrors()
//     if (!errors) { //No errors were found. Passed Validation!
//         var item = {
//             sname: req.sanitize('sname').escape().trim(),
//             qty: req.sanitize('qty').escape().trim(),
//             price: req.sanitize('price').escape().trim()
//         }
//         req.getConnection(function(error, conn) {
//             conn.query('update store set sname = ?, qty = ?, price = ? WHERE id = ?', [item.sname, item.qty, item.price, req.params.id], function(err, result) {
//                 if (err) {
//                     req.flash('error', err)
//                     // render to views/store/edit.ejs
//                     res.render('../views/store/edit.ejs'), {
//                         title: 'Edit Item',
//                         id: req.params.id,
//                         /* Since this is update query part,
//                         no rows are returned
//                         You need to fetch below values from
//                         req.body
//                         I have already fetched the item id
//                         above for you.
//                         Beware I have used req.params but
//                         below you need to use req.body*/
//                         sname: req.body.sname,
//                         qty: req.body.qty,
//                         price: req.body.price
//                     }
//                 } else {
//                     req.flash('success', 'Data updated successfully!')
//                     // render to views/store/edit.ejs


//                     res.render('../views/store/edit.ejs', {
//                         title: 'Edit Item',
//                         id: req.params.id,
//                         /* Since this is update query part,
//                         no rows are returned
//                         You need to fetch below values from
//                         req.body
//                         I have already fetched the item id
//                         above for you.
//                         Beware I have used req.params but
//                         below you need to use req.body*/
//                         sname: req.body.sname,
//                         qty: req.body.qty,
//                         price: req.body.price /*Price*/
//                     })
//                 }
//             })
//         })
//     } else { //Display errors to user
//         var error_msg = ''
//         errors.forEach(function(error) {
//             error_msg += error.msg + '<br>'
//         })
//         req.flash('error', error_msg)
//         // render to views/store/edit.ejs
//         res.render('../views/store/edit.ejs'), {
//             title: 'Edit Item',
//             id: req.params.id,
//             /* Since this is update query part, no rows are
//             returned
//             You need to fetch below values from req.body
//             I have already fetched the item id above for you.
//             Beware I have used req.params but below you need to
//             use req.body*/
//             sname: req.body.sname,
//             qty: req.body.sname,
//             price: req.body.sname /*Price*/
//         }
//     }
// })

// // EDIT ITEM POST ACTION - Update the item, actual update happens here
// app.put('/edit/(:id)', function(req, res, next) {
//     req.assert('sname', 'Name is required').notEmpty()
//     //Validate name
//     req.assert('qty', 'Quantity is required').notEmpty()
//     //Validate qty
//     req.assert('price', 'Price is required').notEmpty()
//     //Validate price
//     var errors = req.validationErrors()
//     if (!errors) {
//         //No errors were found. Passed Validation!
//         var item = {
//             sname: req.sanitize('sname').escape().trim(),
//             qty: req.sanitize('qty').escape().trim(),
//             price: req.sanitize('price').escape().trim()
//         }
//         req.getConnection(function(error, conn) {
//             var editID = req.params.id;
//             var updateQ = "UPDATE store SET ? WHERE id= " + editID;
//             conn.query(updateQ, item, function(err, result) {
//                 if (err) {
//                     req.flash('error', err)
//                     // render to views/store/edit.ejs
//                     res.render('/store/edit', {
//                         title: 'Edit Item',
//                         id: req.params.id,
//                         /* Since this is update query part, no rows are returned. You need to fetch below values from
//                         req.body I have already fetched the item id above for you. Beware I have used req.params but
//                         below you need to use req.body*/
//                         sname: req.body.sname,
//                         qty: req.body.qty,
//                         price: req.body.price
//                     })
//                 } else {
//                     req.flash('success', 'Data updated successfully!')
//                     // render to views/store/edit.ejs
//                     res.render('/store/edit', {
//                         title: 'Edit Item',
//                         id: req.params.id,
//                         /* Since this is update query part, no rows are returned You need to fetch below values from
//                         req.body I have already fetched the item id above for you. Beware I have used req.params but
//                         below you need to use req.body*/
//                         sname: req.body.sname,
//                         qty: req.body.qty,
//                         price: req.body.price
//                     })
//                 }
//             })
//         })
//     } else {
//         //Display errors to user
//         var error_msg = ''
//         errors.forEach(function(error) {
//             error_msg += error.msg + '<br>'
//         })
//         req.flash('error', error_msg)
//         // render to views/store/edit.ejs
//         res.render('store/edit', {
//             title: 'Edit Item,',
//             id: req.params.id,
//             /* Since this is update query part, no rows are returned
//             You need to fetch below values from req.body
//             I have already fetched the item id above for you.
//             Beware I have used req.params but below you need to
//             use req.body*/
//             sname: req.body.sname,
//             qty: req.body.qty,
//             price: req.body.price
//         })
//     }
// })

module.exports = app
