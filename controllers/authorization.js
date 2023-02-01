const redisClient = require("./redis").redisClient;

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json("Unauthorized");
  }

  redisClient
    .get(authorization)
    .then((id) => {
      if (!id) {
        return res.status(401).json("Unauthorized");
      } else {
        console.log('Auth OK');
        return next();
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json("Unauthorized");
    });
};

module.exports = {
  requireAuth: requireAuth,
};
