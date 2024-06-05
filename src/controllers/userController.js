// Imports
const sequelize = require("sequelize");
const { join } = require("path");
const model = require("../../models");
const { v4: uuidv4 } = require("uuid");
const uuid = uuidv4();
const { createToken } = require("../helpers/jwt");
const fs = require("fs");
const bcrypt = require("bcrypt");
let salt = bcrypt.genSaltSync(10);

module.exports = {
  userLogin: async (req, res, next) => {
    try {
      const checkIfUserExists = await model.users.findAll({
        where: { email: req.body.email },
      });

      if (checkIfUserExists.length === 0) {
        return res.status(404).send({
          success: false,
          message: "Account not found",
        });
      }

      const userData = checkIfUserExists[0].dataValues;

      if (userData.password !== "NULL") {
        const comparePasswords = bcrypt.compareSync(
          req.body.password,
          userData.password
        );
        if (comparePasswords) {
          const { id, uuid, name, role } = userData;
          const token = createToken({ id, uuid, role }, "12h");
          return res.status(200).send({
            success: true,
            message: "Login successful",
            token,
            id,
            name,
            role,
          });
        } else {
          return res.status(400).send({
            success: false,
            message: "Wrong credentials",
          });
        }
      } else {
        return res.status(400).send({
          success: false,
          message: "Wrong credentials.",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
