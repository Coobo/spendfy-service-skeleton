import uuid from 'uuid/v4';

/**
 * Sets the Worker Identifier into the express response object.
 * @param {Express.Request} req Express Request Object
 * @param {Express.Response} res Express Response Object
 * @param {Express.Next} next Express Next callback for middlewares
 * @function requestIdentifier
 * @middleware
 */
function requestIdentifier(req, res, next) {
  res.header('WorkerID', process.env.WORKER_ID || 1);
  return next();
}

module.exports = exports = requestIdentifier;
