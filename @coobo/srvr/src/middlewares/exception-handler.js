const Youch = require('youch');

/**
 * Middleware responsible for identifying incoming requests.
 *
 * @middleware
 * @function ExceptionHandlerMiddleware
 * @alias ExceptionHandlerMiddleware
 * @group Application
 * @async
 * @type {import('express').ErrorRequestHandler}
 *
 * @param {import('express').Errback} req
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 *
 * @returns {void}
 */
async function ExceptionHandlerMiddleware(err, req, res, next) {
  if (process.env.NODE_ENV === 'development') {
    const errors = await new Youch(err, req).toJSON();

    return res.status(500).json(errors);
  }

  return res.status(500).json({ error: 'Internal server error' });
}

module.exports = ExceptionHandlerMiddleware;
