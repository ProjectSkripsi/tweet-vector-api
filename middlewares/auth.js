const hash = require("../helpers/hash");
const User = require("../models/user");

module.exports = {
  isLogin: (req, res, next) => {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];

      let verify = hash.jwtDecode(bearerToken);
      User.findOne({
        _id: verify.id,
      })
        .then((result) => {
          if (result) {
            req.decoded = verify;
            next();
          } else {
            res.status(401).json({
              message: `Your No Access`,
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: `Server Error`,
          });
        });
    } else {
      res.status(401).json({
        statusCode: 401,
        message: `No Authenticate`,
      });
    }
  },

  isAdmin: (req, res, next) => {
    if (req.decoded.role === "admin") {
      next();
    } else {
      res.status(403).json(`forbidden`);
    }
  },
};
