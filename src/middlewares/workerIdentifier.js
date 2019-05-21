/**
 * Sets the Worker Identifier into the express response object.
 * @param {Express.Request} req Express Request Object
 * @param {Express.Response} res Express Response Object
 * @param {Express.Next} next Express Next callback for middlewares
 * @function requestIdentifier
 * @middleware
 */
function workerIdentifier(req, res, next) {
  res.header('WorkerId', process.env.WORKER_ID || 1);
  return next();
}

module.exports = exports = workerIdentifier;
