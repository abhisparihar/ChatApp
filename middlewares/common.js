const permission = require('../config/permission');

module.exports.mCommon = function (req, res, next) {
    const error = req.flash('error');
    const success = req.flash('success');
    if (success.length) {
        res.locals.flash = {
            type: 'success',
            message: success[0]
        };
    };

    if (error.length) {
        res.locals.flash = {
            type: 'error',
            message: error[0]
        };
    };
    if (req.user) {
        res.locals.userSession = req.user;
    };
    res.locals.currentUrl = unescape(req.url);
    next();
};

module.exports.roleAccess = function (flag) {
    return function (req, res, next) {
        let permissions = [];
        switch (req.user.role) {
            case 'superAdmin':
                permissions = [...permission.superAdmin, ...permission.user]
                break;
            default:
                permissions = [...permission.user]
                break;
        }

        if (permissions.includes(flag)) {
            next();
        } else {
            res.render('pages/error/error', {
                title: 'Page Not Found'
            });
        }
    }
}