const UserModel = require("../models/user.model");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const { uploadErrors } = require("../utils/errors.utils");

module.exports.uploadProfil = async (req, res) => {
    console.log(req.file);
  try {
    if (
      req.file.mimetype != "image/jpg" &&
      req.file.mimetype != "image/png" &&
      req.file.mimetype != "image/jpeg"
    )
      throw Error("invalid file");

    if (req.file.size > 500000) throw Error("max size");
  } catch (err) {
    console.log(req)
    console.log(err);
    const errors = uploadErrors(err);
    return res.status(400).json({ errors });
  }
  

  try {
    await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $set : {picture: "client/public/uploads/" + req.file.filename}},
      { new: true, upsert: true, setDefaultsOnInsert: true}
    );
    res.status(204).send();
  } catch(err) {
    console.log(err)
  }

};