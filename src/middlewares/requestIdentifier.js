import uuid from 'uuid/v4';

/**
 * Tries to get the RequestID from the incoming request. If none is provided, create one from uuid v4.
 * @param {Express.Request} req Express Request Object
 * @param {string|null} req.headers.RequestID The Predefined Request Identifier
 * @param {Express.Response} res Express Response Object
 * @param {Express.Next} next Express Next callback for middlewares
 * @function requestIdentifier
 * @middleware
 */
function requestIdentifier(req, res, next) {
  res.header('RequestID', req.get('RequestID') || uuid());
  return next();
}

export default requestIdentifier;
