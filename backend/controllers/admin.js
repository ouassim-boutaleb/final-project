const db = require("../db/models/index");
const {
  BadRequestError,
  UnauthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("../errors");
const asyncWrapper = require("../middlewares/async");

const { StatusCodes } = require("http-status-codes");
const getAllUsers = asyncWrapper(async (req, res) => {
    const users = await db.Users.findAll({ where: { userType: { [db.Sequelize.Op.ne]: 'admin' } } });

    const shops = users.filter(user => user.type === 'shop');
    const warehouses = users.filter(user => user.type === 'warehouse');

    res.status(StatusCodes.OK).json({ users });
});

const getUserDetails = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const user = await db.Users.findOne({ where: { id } });

    if (!user) {
        throw new NotFoundError("User not found");
    }

    res.status(StatusCodes.OK).json({ user });
});

const updateUserDetails = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, phoneNumber, type, category } = req.body;

    const user = await db.Users.findOne({ where: { id } });

    if (!user) {
        throw new NotFoundError("User not found");
    }

    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.category = category || user.category;
    user.type = type || user.type;

    await user.save();

    res.status(StatusCodes.OK).json({ message: "User updated successfully" });
});

const deleteUser = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const user = await db.Users.findOne({ where: { id } });

    if (!user) {
        throw new NotFoundError("User not found");
    }

    await user.destroy();

    res.status(StatusCodes.OK).json({ message: "User deleted successfully" });
});
// accept user request

const acceptUserRequest = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    

    const user = await db.Users.findOne({ where: { id } });

    if (!user) {
        throw new NotFoundError("User not found");
    }

    user.isPaperVerified = true;
    user.status = "accepted";

    await user.save();

    res.status(StatusCodes.OK).json({ message: `User ${user.status} successfully` });
}
);


module.exports = {
    getAllUsers,
    getUserDetails,
    updateUserDetails,
    deleteUser,
    acceptUserRequest
};
