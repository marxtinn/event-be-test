const route = require("express").Router();

const { userLogin } = require("../controllers/userController");

// Set url/route for accessing controller through API hit.

route.post("/auth", userLogin);

module.exports = route;
