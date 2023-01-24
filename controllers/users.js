const User = require("../models/users");

exports.createUser = (req, res, next) => {
  User.findOne({ firstName: req.body.firstName })
    .then((user) => {
      if (user === null) {
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          imageUrl: req.body.imageUrl,
          instagram: req.body.instagram,
          twitter: req.body.twitter,
          github: req.body.github,
        });
        user
          .save()
          .then((data) => {
            res.status(201).json({ data, message: "user saved" });
          })
          .catch((error) => {
            res.status(400).json({ error });
          });
      } else {
        res.status(201).json({ user });
      }
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

exports.getOneUser = (req, res, next) => {
  User.findOne({
    _id: req.params.id,
  })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
exports.getAllUser = (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.updateOneUser = (req, res, next) => {
  const user = new User({
    _id: req.params.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    imageUrl: req.body.imageUrl,
    instagram: req.body.instagram,
    twitter: req.body.twitter,
    github: req.body.github,
  });
  User.updateOne({ _id: req.params.id }, user)
    .then(() => {
      res.status(201).json({
        message: "User modifier avec succes!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
