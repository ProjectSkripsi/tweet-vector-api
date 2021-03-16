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

  getClassification: (code) => {
    let temp = "";
    if (code === 1) {
      temp = "Sentimen Positif Penanganan COVID-19";
    } else if (code === 2) {
      temp = "Sentimen Negatif Penanganan COVID-19";
    } else if (code === 3) {
      temp = "Sentimen Positif Vaksinasi COVID-19";
    } else if (code === 4) {
      temp = "Sentimen Negatif Vaksinasi COVID-19";
    }
    return temp;
  },
};
