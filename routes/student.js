var express = require('express')
var app = express()

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
            console.log("MehTest")
            console.log(JSON.stringify(rows.rows))

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
        studi: '',
        firstn: '',
        lastn: '',
        email: '',
        pass: ''
    })
})


app.get('/login', function(req, res, next) {
    // render to views/store/selection.ejs
    res.render('student/login', {
        title: '',
        studi: '',
        firstn: '',
        lastn: '',
        email: '',
        pass: ''
    })
})



// // SHOW EDIT ITEM FORM - Display form for update
// app.get('/edit/(:id)', function(req, res, next) {
//     /*
//     TODO : Update operation is similar to add operation.
//     Fill out the appropriate code below
//     Hints :
//     * req.params.id will give you the id which is passed in
//     /edit/(:id).Use
//     that in SQL update query and any other place where you need
//     id
//     * You are only displaying an item here for the customer.
//     * The actual update happens in the post action below this
//     module
//     */
//     req.getConnection(function(error, conn) {
//         conn.query('SELECT * FROM store where id = ?', req.params.id, function(err, rows, fields) {
//             // if item not found
//             if (rows.length <= 0) {
//                 req.flash('error', 'Item not found with id' + rows[0].id)
//                 res.redirect('/store')
//             } else { // if item found
//                 // render to views/store/edit.ejs template file
//                 res.render('../views/store/edit.ejs', {
//                     title: 'Edit Item',
//                     /* Place the code for sending values */
//                     /* Hint : rows[0] gets the entire tuple
//                     from database.
//                     Get the right values from rows[0]
//                     */
//                     id: rows[0].id,
//                     qty: rows[0].qty,
//                     price: rows[0].price /*price*/ ,
//                     sname: rows[0].sname /*Item name*/
//                 })
//             }
//         })
//     })
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