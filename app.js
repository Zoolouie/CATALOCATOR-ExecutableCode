/* Load the modules as js variables*/
var express = require('express')
var app = express() 
var mysql = require('mysql')
 
/**
 * This middleware provides a consistent API 
 * for MySQL connections during request/response life cycle
 */ 
var myConnection  = require('express-myconnection')

/**
 * Load the stored values for database connection.
 */ 
var config = require('./config')
var dbOptions = {
    host:      config.database.host,
    user:       config.database.user,
    password: config.database.password,
    port:       config.database.port, 
    database: config.database.db
}


/**
 * 3 strategies can be used for database connection
 * single: Creates single database connection which is never closed.
 * pool: Creates pool of connections. Connection is auto release when response ends.
 * request: Creates new connection per new request. Connection is auto close when response ends.
 * We will go with pool strategy. You're welcome to experiment others.
 */ 
app.use(myConnection(mysql, dbOptions, 'pool'))
 
/**
 * setting up the templating view engine
 */ 
app.set('view engine', 'ejs')
 
/**
 * import routes/index.js
 * import routes/store.js
 * Will explain in later steps
 */ 
var index = require('./routes/index')
var student = require('./routes/student')
 
 
/**
 * Express Validator Middleware for Form Validation
 */ 
var expressValidator = require('express-validator')
app.use(expressValidator())
 
 
/**
 * body-parser module is used to read HTTP POST data
 * it's an express middleware that reads form's input 
 * and store it as javascript object. Reduces our work 
 * of parsing values from POST responses.
 */ 
var bodyParser = require('body-parser')

/**
 * bodyParser.urlencoded() parses the text as URL encoded data 
 * (which is how browsers tend to send form data from regular forms set to POST) 
 * and exposes the resulting object (containing the keys and values) on req.body.
 */ 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
 
 
/**
 * This module let us use HTTP verbs such as PUT or DELETE 
 * in places where they are not supported
 */ 
var methodOverride = require('method-override')
 
/**
 * using custom logic to override method
 * 
 * there are other ways of overriding as well
 * like using header & using query value
 */ 
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))
 
/**
 * This module shows flash messages
 * generally used to show success or error messages
 * 
 * Flash messages are stored in session
 * So, we also have to install and use 
 * cookie-parser & session modules
 */ 
var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');
 
app.use(cookieParser('csci3308'))
app.use(session({ 
    secret: 'csci3308',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(flash())
 
 
app.use('/', index)
app.use('/student', student)

var hostName = config.server.host;
var serverPort = config.server.port;
app.listen(serverPort, function(){
    console.log('Server running at port ' + serverPort + ': http://' + hostName + ': ' + serverPort)
})
