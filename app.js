var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var csrf = require('csurf');
var uuid = require('node-uuid');

var routes = require('./routes/index');
var users = require('./routes/users');
var userRoute = require('./routes/user-login');
var securityManager = require('./routes/security-home');
var roleRoute = require('./routes/role');

var UserAccountManager = require('./routes/lib/sec/UserAccountManager');
var RoleManager = require('./routes/lib/sec/RoleManager');
var app = express();

var RedisStore = require('connect-redis')(session);

RoleManager.init();

RoleManager.buildCache();   // For future role optimizations

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

if(!process.env.SESSION_SECRET) {
    console.log("SESSION_SECRET environment variable not set.");
    process.exit(2);
}

if(process.env.HOST_REDIS) {
    var HOST_REDIS = process.env.HOST_REDIS || 'localhost';
    var PORT_REDIS = process.env.PORT_REDIS || 6379;
    var DB_REDIS = process.env.DB_REDIS || 1;
    var DB_REDIS_PASS = process.env.DB_REDIS_PASS || undefined;
    var SESSION_SECRET = process.env.SESSION_SECRET || 'hn84n4ybiubv2f9eb2ybc392';

    console.log("Redis option(s) defined in environment.");
    console.log("Redis host: " + HOST_REDIS);
    console.log("Redis port: " + PORT_REDIS);
    console.log("Redis DB: " + DB_REDIS);

    app.use(session(
        {
            store: new RedisStore({
                host: HOST_REDIS,
                port: PORT_REDIS,
                db: DB_REDIS,
                pass: DB_REDIS_PASS
            }),
            secret: SESSION_SECRET,
            resave: true,
            saveUninitialized: true
        }
    ));
} else {
    console.log("No Redis host defined. Using local session.");
    app.use(session(
        {secret: uuid.v4(), resave: false, saveUninitialized: true} // Generate random secret.
    ));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(csrf());
// csurf error handler: https://github.com/expressjs/csurf
// Disabled.
app.use(function (err, req, res, next) {
    next();
    return;
    if (err.code !== 'EBADCSRFTOKEN') return next(err)

    // handle CSRF token errors here
    res.status(403)
    res.send('Session has expired or form tampered with')
});

app.use('/apidocs', express.static(__dirname + '/public/documentation/apidoc'));

var basicAuth = require('basic-auth');
function authenticate(req, res, next) {
    if(req.path == "/apidocs" || req.path == "/" || req.path == "/user/login" || req.path == "/user/register" || req.path == "/user/logout") {   // Exclude these from authentication
        return next();
    }

    if(req.session.account) {
        return next();
    }

    var blockAccess = function(req, res) {
        return res.status(403).send({error: "LoginRequired", errorCode: 403});
    }

    var domainName = req.get('X-Authorization-Domain');
    if(!domainName || domainName == '') {
        return blockAccess(req, res);
    }

    var user = basicAuth(req);

    if(!user || !user.name || !user.pass) {
        return blockAccess(req, res);
    }

    var userFoundCallback = function(user) {
        req.session.account = user; // Update session.
        return next();
    }

    var userNotFoundCallback = function() {
        return blockAccess(req, res);
    }

    UserAccountManager.validate(domainName, user.name, user.pass, userFoundCallback, userNotFoundCallback);
};

app.all("/*", authenticate);

app.all('/instance/*', function(req, res, next) { // Instance operations
    var account = req.session.account;
    if(!account) {
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }

    var userFoundCallback = function(user) {
        req.session.account = user; // Update session.
        console.log(req.method);
        var allowsOperation = '';
        if(req.method == 'GET') {
            allowsOperation = 'r';
        } else if(req.method == 'POST') {
            allowsOperation = 'c';
        } else if(req.method == 'PUT') {
            allowsOperation = 'u';
        } else if(req.method == "DELETE") {
            allowsOperation = 'd';
        } else {
            res.status(403).send({error: "AccessDeniedError", errorCode: 403});
            return;
        }
        console.log(allowsOperation);
        var hasRoleCallback = function(user, userRole, role) {
            var regex = /\/instance\/([A-Za-z_0-9]+)\//i;
            var regex2 = /\/instance\/([A-Za-z_0-9]+)/i;
            var path = req.path;
            var matches = regex.exec(path) || regex2.exec(path);
            var entity = matches[1];
            //console.log("Trying to match " + userRole.affects + " with " + entity);
            if((userRole && RegExp(userRole.affects).test(entity) == true) || user.isAdmin == true) {
                next();
            } else {
                res.status(403).send({error: "AccessDeniedError", errorCode: 403});
                return;
            }
        }

        var doesNotHaveRoleCallback = function() {
            res.status(403).send({error: "AccessDeniedError", errorCode: 403});
            return;
        }

        RoleManager.hasRole(account.accountId, "instance", allowsOperation, account._id, hasRoleCallback, doesNotHaveRoleCallback);
    }

    var userNotFoundCallback = function() {
        res.status(404).send({error: "UserNotFoundError", errorCode: 404});
        return;
    }

    UserAccountManager.doesUserExist(account.accountId, account.username, userFoundCallback, userNotFoundCallback);
});

app.all('/createEntity*', function(req, res, next) { // Instance operations
    var account = req.session.account;
    if(!account) {
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }

    var userFoundCallback = function(user) {

        var hasRoleCallback = function(user, userRole, role) {
            if (userRole) {
                var entityName = req.body.entityName;
                if (RegExp(userRole.affects).test(entityName) == true || user.isAdmin == true) {
                    next();
                } else {
                    res.status(403).send({error: "AccessDeniedError", errorCode: 403});
                    return;
                }
            } else if(user && user.isAdmin == true) {
                next();
            } else {
                res.status(403).send({error: "AccessDeniedError", errorCode: 403});
                return;
            }
        }

        var doesNotHaveRoleCallback = function() {
            res.status(403).send({error: "AccessDeniedError", errorCode: 403});
            return;
        }

        RoleManager.hasRole(account.accountId, "entity", "c", account._id, hasRoleCallback, doesNotHaveRoleCallback);
    }

    var userNotFoundCallback = function() {
        res.status(404).send({error: "UserNotFoundError", errorCode: 404});
        return;
    }

    UserAccountManager.doesUserExist(account.accountId, account.username, userFoundCallback, userNotFoundCallback);
});

// Read Entity auth is handled separately.
app.use('/', routes);
app.use('/users', users);
app.use('/user', userRoute);
app.use('/security-manager', securityManager);
app.use('/role', roleRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
