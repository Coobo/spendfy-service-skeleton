let uuid = require('uuid/v4');

/**
 * Tries to get the RequestID from the incoming request. If none is provided, create one from uuid v4.
 * @param {Express.Request} req Express Request Object
 * @param {string|null} req.headers.RequestID The Predefined Request Identifier
 * @param {Express.Response} res Express Response Object
 * @param {Function} next Express Next callback for middlewares
 * @function requestIdentifier
 * @middleware
 */
function requestIdentifier(req, res, next) {
    res.header('RequestId', req.get('RequestId') || uuid());
    req.identifier = res.get('RequestId');
    return next();
}

module.exports = exports = requestIdentifier;
