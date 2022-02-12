const { JwtUtils } = require('../../lib/jwt-utils');
const { getServerDebug } = require('../../lib/utils');

const debug = getServerDebug('auth:middleware');
// try to fill req.user based on jwt token inside cookie header
const authenticateRequest = (req, res, next) => {
  try {
    JwtUtils.verifyRequest(req);
  } catch (e) {
    // ignore error
  }
  return next();
};
module.exports.authMiddleware = authenticateRequest;

module.exports.authGuard = async (req, res, next) => {
  await new Promise((r) => {
    authenticateRequest(req, res, r);
  });
  if (!req.user) return res.status(401).send();
  return next();
};

module.exports.redirectUnAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  debug('redirecting to login');
  return res.redirect('/auth/login');
};

module.exports.redirectAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  debug('redirecting to admin');
  return res.redirect('/admin');
};
