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

var UserAccountModel = require('./routes/lib/sec/UserAccountModel');
var UserAccountManager = require('./routes/lib/sec/UserAccountManager');
var RoleModel = require('./routes/lib/sec/RoleModel');
var RoleManager = require('./routes/lib/sec/RoleManager');
//var SavedGenericEntity = require('./lib/GenericEntityModel');
RoleManager.init();

RoleManager.buildCache();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(session(
  {secret: uuid.v4(), resave: false, saveUninitialized: true}
));  // Generate random secret.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(csrf());
// csurf error handler: https://github.com/expressjs/csurf
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  // handle CSRF token errors here
  res.status(403)
  res.send('Session has expired or form tampered with')
});

app.all('/EAG/access/*', function(req, res, next) { // Instance operations
    var account = req.session.account;
    if(!account) {
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }

    var userFoundCallback = function(user) {
        req.session.account = user; // Update session.
        var obj = {context: 'instance'};
        if(req.method == 'GET') {
            obj.allowsOperation = 'r';
        } else if(req.method == 'POST') {
            obj.allowsOperation = 'c';
        } else if(req.method == 'PUT') {
            obj.allowsOperation = 'u';
        } else if(req.method == "DELETE") {
            obj.allowsOperation = 'd';
        }

        RoleModel.findOne(obj, function(err, role) {
            if(err || !role) {
                res.status(500).send({error: "SecurityError", errorCode: 500});
                return;
            }
            console.log("Found role object.");
            var roleId = role._id;
            var hasRole = undefined;
            for(var i = 0; i < user.roles.length; i++) {
                var currentRole = user.roles[i];
                if(currentRole.roleId == roleId) {
                    hasRole = user.roles[i];
                    break;
                }
            }

            if(hasRole) {
                var regex = /\/EAG\/access\/([A-Za-z]+)\//i;
                var regex2 = /\/EAG\/access\/([A-Za-z]+)/i;
                var path = req.path;
                var matches = regex.exec(path) || regex2.exec(path);
                var entity = matches[1];
                console.log("Trying to match " + hasRole.affects + " with " + entity);
                if(RegExp(hasRole.affects).test(entity) == true) {
                    console.log("matches!");
                    next();
                } else {
                    console.log("cant match.");
                    res.status(401).send({error: "PermissionRequiredError", errorCode: 401});
                    return;
                }
            } else {
                res.status(401).send({error: "PermissionRequiredError", errorCode: 401});
                return;
            }
        })
    }

    var userNotFoundCallback = function() {
        res.status(404).send({error: "UserNotFoundError", errorCode: 404});
        return;
    }

    UserAccountManager.doesUserExist(account.username, userFoundCallback, userNotFoundCallback);
});

app.all('/createEntity*', function(req, res, next) { // Instance operations
    var account = req.session.account;
    if(!account) {
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }

    var userFoundCallback = function(user) {
        req.session.account = user; // Update session.
        var obj = {context: 'entity', allowsOperation: 'c'};

        RoleModel.findOne(obj, function(err, role) {
            if(err || !role) {
                res.status(500).send({error: "SecurityError", errorCode: 500});
                return;
            }
            console.log("Found role object.");
            var roleId = role._id;
            var hasRole = undefined;
            for(var i = 0; i < user.roles.length; i++) {
                var currentRole = user.roles[i];
                if(currentRole.roleId == roleId) {
                    hasRole = user.roles[i];
                    break;
                }
            }

            if(hasRole) {
                var entityName = req.body.entityName;
                if(RegExp(hasRole.affects).test(entityName) == true) {
                    console.log("matches!");
                    next();
                } else {
                    console.log("cant match.");
                    res.status(401).send({error: "PermissionRequiredError", errorCode: 401});
                    return;
                }
            } else {
                res.status(401).send({error: "PermissionRequiredError", errorCode: 401});
                return;
            }
        })
    }

    var userNotFoundCallback = function() {
        res.status(404).send({error: "UserNotFoundError", errorCode: 404});
        return;
    }

    UserAccountManager.doesUserExist(account.username, userFoundCallback, userNotFoundCallback);
});

// Read Entity auth is handled seperately.

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
