/**
 * Sets the Worker Identifier into the express response object.
 * @param {Express.Request} req Express Request Object
 * @param {Express.Response} res Express Response Object
 * @param {Express.Next} next Express Next callback for middlewares
 * @function requestIdentifier
 * @middleware
 */
function workerIdentifier(req, res, next) {
    let workerId = 0;
    if (process.env.WORKER_ID === 0 || process.env.WORKER_ID)
        workerId = process.env.WORKER_ID;
    if (process.env.pm_id === 0 || process.env.pm_id)
        workerId = process.env.pm_id;
    res.header('WorkerId', workerId);
    return next();
}

module.exports = exports = workerIdentifier;
