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

var securityManager = require('./routes/security-home');
var roleRoute = require('./routes/role');

var UserAccountManager = require('./routes/lib/sec/UserAccountManager');
var RoleManager = require('./routes/lib/sec/RoleManager');
var ApiKeyManager = require('./routes/lib/sec/ApiKeyManager');
//var SavedGenericEntity = require('./lib/GenericEntityModel')

var mailer = require('express-mailer');

RoleManager.init();

RoleManager.buildCache();   // For future role optimizations

app = express();

mailer.extend(app, {
    from: 'no-reply@thunderlab.co.uk',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'manthan@thunderlab.co.uk',
        pass: process.env.REGISTER_EMAIL_PASS
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var userRoute = require('./routes/user-login');

/*app.mailer.send('email', {
    to: 'manthanhd@live.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.
    subject: 'Test Email1', // REQUIRED.
    otherProperty: 'Other Property1' // All additional properties are also passed to the template as local variables.
}, function (err) {
    if (err) {
        console.log(err);
        return;
    }
//    res.send('Email Sent');
});*/

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(session(
  {secret: uuid.v4(), resave: false, saveUninitialized: true} // Generate random secret.
));
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

function authenticate(req, res, next) {

    switch(req.path) {
        case "/":
        case "/index":
        case "/apidocs":
        case "/user/login":
        case "/user/reset":
        case "/user/register":
        case "/user/logout":
            return next();
    }

    function notAuthenticated(req, res) {
        return res.status(401).send({error: "AuthenticationRequired", errorCode: 401});
    }

    function forbidAccess(req, res) {
        return res.status(403).send({error: "AuthorisationRequired", errorCode: 403});
    }

    function filterWhiteListURLs(url) {
        if(url.indexOf("/user/key") == 0 || url.indexOf("/user/whoami") == 0) {
            return true;
        }
    }

    if(req.session.account) {

        var result = filterWhiteListURLs(req.path);

        if(result == true) {
            return next();
        }

        var foundCallback = function(user) {
            req.session.account = user;

            if(user.isAdmin == true) {
                return next();
            }

            var action = getActionFromHttpMethod(req.method);
            var realm = getRealmFromUrl(req.path);

            var hasRequiredPermissionsCallback = function(basePermission) {
                if(!basePermission) {
                    return forbidAccess(req, res);
                }

                return next();
            };

            UserAccountManager.hasBasePermission(user, {action: action, realm: realm}, hasRequiredPermissionsCallback);
        };

        var notFoundCallback = function() {
            return notAuthenticated(req, res);
        };

        return UserAccountManager.doesUserIdExist(req.session.account.accountId, req.session.account._id, foundCallback, notFoundCallback);
    }

    function getActionFromHttpMethod(method) {
        var action = undefined;
        switch(method) {
            case "GET": action = "read"; break;
            case "POST": action = "create"; break;
            case "PUT": action = "edit"; break;
            case "DELETE": action = "delete"; break;
            default: return undefined;
        }

        return action;
    }

    function getRealmFromUrl(url) {
        var realm = undefined;
        if(url.indexOf("/entity") == 0) {
            realm = "entity";
        } else if (url.indexOf("/instance") == 0) {
            realm = "instance";
        } else if (url.indexOf("/user") == 0) {
            if(url.indexOf("/user/key") == 0 || url.indexOf("/user/whoami") == 0) { // These two URLs need authentication but no authorisation and hence are open.
                realm = "open";
            } else {
                realm = "user";
            }
        }

        return realm;
    }

    var authenticateApiKey = function(req, res, next) {
        var apiKey = req.get("X-Api-Key");
        if(apiKey) {

            // First get the action
            var action = getActionFromHttpMethod(req.method);
            var realm = getRealmFromUrl(req.path);

            if(!action || !realm) {
                return res.status(401).send()
            }

           return ApiKeyManager.hasActionPermissionsInRealm(apiKey, action, realm, function (result, permission, apiKeyObject) {
                if (!result || result == false) {
                    return forbidAccess(req, res);
                }

                // granted
                req.permission = permission;

                return UserAccountManager.getAccountFromUserId(apiKeyObject.userId, function (user) {
                    if (!user) {
                        return forbidAccess(req, res);
                    }

                    req.account = user;
                    return next();
                });
            });

        } else {
            return notAuthenticated(req, res);
        }
    };

    if(req.path.indexOf('/entity') == 0 || req.path.indexOf('/instance') == 0 || req.path.indexOf('/user') == 0) {
        return authenticateApiKey(req, res, next);
    }
};

app.all("/*", authenticate);

/*app.all('/instance', function(req, res, next) { // Instance operations Replace /instance with /instance\/* *ignore backslash
    var account = req.session.account;
    if(!account) {
        res.status(403).send({error: "LoginRequired", errorCode: 403});
        return;
    }

    var userFoundCallback = function(user) {
        req.session.account = user; // Update session.
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
});*/

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
