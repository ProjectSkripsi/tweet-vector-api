const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  encode: (password) => {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    return hash;
  },

  decode: (inputPassword, hash) => {
    return bcrypt.compareSync(inputPassword, hash);
  },

  jwtEncode: (data) => {
    return jwt.sign(data, process.env.JWTSECRET);
  },
  jwtDecode: (token) => {
    const decode = jwt.verify(token, process.env.JWTSECRET);
    return decode;
  },
  usePasswordHashToMakeToken: ({
    password: passwordHash,
    _id: userId,
    createdAt,
  }) => {
    const secret = passwordHash + "-" + createdAt;
    const token = jwt.sign(
      {
        userId,
      },
      secret,
      {
        expiresIn: 3600, // 1 hour
      }
    );
    return token;
  },
};
