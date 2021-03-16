const User = require("../models/user");
const { encode, jwtEncode } = require("../helpers/hash");
const bcrypt = require("bcryptjs");

module.exports = {
  register: (req, res) => {
    const { email, password } = req.body;
    const hashPassword = encode(password);
    User.find({
      email: email,
      deleteAt: null,
    })
      .then((result) => {
        if (result.length === 0) {
          User.create({
            email,
            password: hashPassword,
          })
            .then((newUser) => {
              res.status(201).json(newUser);
            })
            .catch((err) => {
              res.status(400).json({
                msg: `Invalid Input`,
                err: err,
              });
            });
        } else {
          res.status(400).json({
            msg: `email already register`,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          msg: `Error Server`,
        });
      });
  },

  login: (req, res) => {
    const { email, password } = req.body;
    User.findOne({
      email,
      deleteAt: null,
    })
      .then((result) => {
        bcrypt.compare(password, result.password).then((user) => {
          if (user) {
            if (result.isActive) {
              res.status(200).json({
                err: false,
                msg: `Succesfully Login`,
                name: result.name,
                email: result.email,
                role: result.role,
                avatarUrl: result.avatarUrl,
                bio: result.bio,
                _id: result._id,
                token: jwtEncode({
                  id: result._id,
                  email: result.email,
                  role: result.role,
                }),
              });
            } else {
              res.status(403).json({
                name: result.userName,
                type: "not-verified",
                msg: "Your account has not been verified.",
              });
            }
          } else {
            res.status(400).json({
              msg: `Hii ${result.userName} Wrong password! Please Try again!`,
            });
          }
        });
      })
      .catch((err) => {
        res.status(404).json({
          msg: `email not register`,
        });
      });
  },

  getUserById: async (req, res) => {
    const { id } = req.decoded;
    try {
      const response = await User.findById({
        _id: id,
      }).select("-password");

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  updateProfile: async (req, res) => {
    const { id } = req.decoded;
    const { email, name, bio, avatarUrl } = req.body.data;
    try {
      const response = await User.findOneAndUpdate(
        {
          _id: id,
        },
        {
          email,
          name,
          bio,
          avatarUrl,
        },
        {
          returnOriginal: false,
        }
      );
      res.status(200).json({
        name: response.name,
        email: response.email,
        role: response.role,
        avatarUrl: response.avatarUrl,
        bio: response.bio,
        _id: response._id,
        token: jwtEncode({
          id: response._id,
          email: response.email,
          role: response.role,
        }),
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  changePassword: (req, res) => {
    const { recentPassword, newPassword } = req.body;
    const { id } = req.decoded;

    User.findOne({
      _id: id,
    })
      .then((result) => {
        bcrypt
          .compare(recentPassword, result.password)
          .then((match) => {
            if (match) {
              User.findByIdAndUpdate(
                {
                  _id: id,
                },
                {
                  password: encode(newPassword),
                }
              )
                .then((response) => {
                  res.status(200).json({
                    msg: "Succesfully update password",
                  });
                })
                .catch((error) => {
                  res.status(500).json({
                    msg: "Server error",
                    error,
                  });
                });
            } else {
              res.status(400).json({
                name: result.name,
                message: "Password not match, Please try again",
              });
            }
          })
          .catch((err) => {
            res.status(500).json({
              msg: "Something-wrong",
              error,
            });
          });
      })
      .catch((err) => {
        res.status(500).json({
          msg: "User not-found",
          error,
        });
      });
  },
};
