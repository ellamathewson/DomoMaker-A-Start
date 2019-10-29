/*
    Middleware functions receive a request, response, and then the next
    middleware function to call.
    Allows application to make various decisions
    Request will not continue throguh the system UNLESS you cann next function at the end

    Must call the next function
    However, may not want your request to get the controllers if the request is not valid
    You may want to redirect them to a different page or stop request entirely
*/

// checks if we attached an account to their session and redirect to homepage if not
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

// checks if user is already logged in and redirects them to the app if so
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('maker');
  }
  return next();
};

// if user is trying to do something secure (like logging in), check if they are on HTTPS
// redirect them if not
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
