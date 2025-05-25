const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserDetails,
  updateUserDetails,
  deleteUser,
  acceptUserRequest,
} = require("../controllers/admin");
const authentication = require("../middlewares/authentication");
const authorizeRoles = require("../middlewares/authorizeRoles");

const auths = [ authentication, authorizeRoles("admin") ];
router.route("/").get(...auths, getAllUsers);
router.route("/:id").get(...auths, getUserDetails).patch(...auths, acceptUserRequest).delete(...auths, deleteUser);

module.exports = router;